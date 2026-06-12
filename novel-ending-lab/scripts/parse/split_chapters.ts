import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { detectChapterTitle } from './chapter_patterns.ts';

interface SourceFile {
  absolutePath: string;
  relativePath: string;
}

interface ChapterChunk {
  title: string;
  sourceFile: string;
  content: string;
}

interface ChapterRecord extends ChapterChunk {
  sequence: number;
  fileName: string;
  characterCount: number;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const rawTargetDir = path.join(labRoot, 'raw_corpus', 'target_novel');
const outputDir = path.join(labRoot, 'parsed', 'target_chapters');
const indexPath = path.join(outputDir, 'chapters_index.md');
const supportedExtensions = new Set(['.txt', '.md']);
const fallbackTargetSize = 10_000;
const fallbackMinSize = 8_000;
const fallbackMaxSize = 12_000;

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function countCharacters(value: string): number {
  return Array.from(value).length;
}

function sanitizeFileName(value: string): string {
  const sanitized = value
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);

  return sanitized.length > 0 ? sanitized : '未命名章节';
}

function numberedFileName(sequence: number, title: string): string {
  return `${String(sequence).padStart(3, '0')}_${sanitizeFileName(title)}.md`;
}

async function collectSourceFiles(directoryPath: string): Promise<SourceFile[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectSourceFiles(entryPath);
      }

      if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
        return [
          {
            absolutePath: entryPath,
            relativePath: toPosixPath(path.relative(labRoot, entryPath)),
          },
        ];
      }

      return [];
    }),
  );

  return files.flat().sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function splitByDetectedChapters(content: string, sourceFile: string): ChapterChunk[] {
  const lines = content.split(/\r?\n/);
  const chunks: ChapterChunk[] = [];
  let currentTitle = '';
  let currentLines: string[] = [];
  let foundChapterTitle = false;

  function flushCurrent(): void {
    const chapterContent = currentLines.join('\n').trim();

    if (chapterContent.length === 0) {
      currentLines = [];
      return;
    }

    chunks.push({
      title: currentTitle || '前置内容',
      sourceFile,
      content: `${chapterContent}\n`,
    });

    currentLines = [];
  }

  for (const line of lines) {
    const titleMatch = detectChapterTitle(line);

    if (titleMatch) {
      if (foundChapterTitle || currentLines.join('').trim().length > 0) {
        flushCurrent();
      }

      foundChapterTitle = true;
      currentTitle = titleMatch.title;
      currentLines = [line];
      continue;
    }

    currentLines.push(line);
  }

  if (foundChapterTitle) {
    flushCurrent();
  }

  return foundChapterTitle ? chunks : [];
}

function findFallbackBreak(characters: string[], start: number): number {
  const hardEnd = Math.min(start + fallbackMaxSize, characters.length);

  if (hardEnd === characters.length) {
    return hardEnd;
  }

  for (let index = Math.min(start + fallbackTargetSize, hardEnd); index >= start + fallbackMinSize; index -= 1) {
    const previous = characters[index - 1];
    const current = characters[index];

    if ((previous === '\n' && current === '\n') || previous === '。' || previous === '！' || previous === '？') {
      return index;
    }
  }

  return Math.min(start + fallbackTargetSize, characters.length);
}

function splitByFixedLength(content: string, sourceFile: string): ChapterChunk[] {
  const normalizedContent = content.trim();

  if (normalizedContent.length === 0) {
    return [];
  }

  const characters = Array.from(normalizedContent);
  const chunks: ChapterChunk[] = [];
  let start = 0;
  let fallbackIndex = 1;

  while (start < characters.length) {
    const end = findFallbackBreak(characters, start);
    const chunkContent = characters.slice(start, end).join('').trim();

    if (chunkContent.length > 0) {
      chunks.push({
        title: `固定分块 ${String(fallbackIndex).padStart(2, '0')}`,
        sourceFile,
        content: `${chunkContent}\n`,
      });
      fallbackIndex += 1;
    }

    start = end;
  }

  return chunks;
}

function splitSourceContent(content: string, sourceFile: string): ChapterChunk[] {
  const detectedChapters = splitByDetectedChapters(content, sourceFile);

  if (detectedChapters.length > 0) {
    return detectedChapters;
  }

  return splitByFixedLength(content, sourceFile);
}

async function clearGeneratedFiles(): Promise<void> {
  await mkdir(outputDir, { recursive: true });
  const entries = await readdir(outputDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isFile()) {
        return;
      }

      if (entry.name === 'chapters_index.md' || /^\d{3}_.+\.md$/.test(entry.name)) {
        await rm(path.join(outputDir, entry.name));
      }
    }),
  );
}

function buildIndex(records: ChapterRecord[]): string {
  const now = new Date().toISOString();
  const lines: string[] = [
    '# 目标小说章节索引',
    '',
    `> 生成时间：${now}`,
    '',
    '本文件由 `npm run corpus:split` 自动生成，只记录章节拆分结果；脚本不分析正文，也不生成小说正文。',
    '',
    '| 章节序号 | 标题 | 来源文件 | 字符数 | 输出文件 |',
    '| --- | --- | --- | ---: | --- |',
  ];

  if (records.length === 0) {
    lines.push('| - | 未发现可拆分文本 | - | 0 | - |');
  } else {
    for (const record of records) {
      lines.push(
        `| ${String(record.sequence).padStart(3, '0')} | ${record.title.replace(/\|/g, '\\|')} | \`${record.sourceFile}\` | ${record.characterCount} | \`${record.fileName}\` |`,
      );
    }
  }

  lines.push('');
  return lines.join('\n');
}

async function main(): Promise<void> {
  const sourceFiles = await collectSourceFiles(rawTargetDir);
  const chapterChunks: ChapterChunk[] = [];

  for (const sourceFile of sourceFiles) {
    const content = await readFile(sourceFile.absolutePath, 'utf8');
    chapterChunks.push(...splitSourceContent(content, sourceFile.relativePath));
  }

  await clearGeneratedFiles();

  const records: ChapterRecord[] = [];

  for (const [index, chunk] of chapterChunks.entries()) {
    const sequence = index + 1;
    const fileName = numberedFileName(sequence, chunk.title);

    await writeFile(path.join(outputDir, fileName), chunk.content, 'utf8');

    records.push({
      ...chunk,
      sequence,
      fileName,
      characterCount: countCharacters(chunk.content),
    });
  }

  await writeFile(indexPath, buildIndex(records), 'utf8');

  console.log(`Chapter index written to ${toPosixPath(path.relative(process.cwd(), indexPath))}`);
  console.log(`Split ${records.length} chapter file(s) from ${sourceFiles.length} source file(s).`);
}

await main();
