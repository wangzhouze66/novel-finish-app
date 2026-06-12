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
  startPosition: number;
  endPosition: number;
}

interface ChapterRecord extends ChapterChunk {
  sequence: number;
  fileName: string;
  sampleFileName: string;
  characterCount: number;
  isSampleFile: boolean;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const rawTargetDir = path.join(labRoot, 'raw_corpus', 'target_novel');
const outputDir = path.join(labRoot, 'parsed', 'target_chapters');
const samplesDir = path.join(outputDir, 'samples');
const indexPath = path.join(outputDir, 'chapters_index.md');
const supportedExtensions = new Set(['.txt']);
const fallbackTargetSize = 10_000;
const fallbackMinSize = 8_000;
const fallbackMaxSize = 12_000;
const sampleChapterCount = 3;
const shouldWriteFullChapterFiles = process.env.CORPUS_SPLIT_WRITE_FULL_CHAPTERS === '1';

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

function sampleFileName(sequence: number): string {
  return `${String(sequence).padStart(3, '0')}_sample.md`;
}

function normalizeGeneratedMarkdown(content: string): string {
  return `${content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trimEnd()}\n`;
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

function splitLinesWithOffsets(content: string): Array<{ line: string; start: number; end: number }> {
  const lineMatches = content.matchAll(/.*(?:\r?\n|$)/g);
  const lines: Array<{ line: string; start: number; end: number }> = [];

  for (const match of lineMatches) {
    const line = match[0];

    if (line.length === 0 && match.index === content.length) {
      continue;
    }

    const start = match.index ?? 0;
    lines.push({ line: line.replace(/\r?\n$/, ''), start, end: start + line.length });
  }

  return lines;
}

function trimChunkContent(lines: Array<{ line: string; start: number; end: number }>): {
  content: string;
  startPosition: number;
  endPosition: number;
} | null {
  const rawContent = lines.map((line) => line.line).join('\n');
  const leadingWhitespaceLength = rawContent.length - rawContent.trimStart().length;
  const trailingWhitespaceLength = rawContent.length - rawContent.trimEnd().length;
  const trimmedContent = rawContent.trim();

  if (trimmedContent.length === 0 || lines.length === 0) {
    return null;
  }

  return {
    content: `${trimmedContent}\n`,
    startPosition: lines[0].start + leadingWhitespaceLength,
    endPosition: lines[lines.length - 1].end - trailingWhitespaceLength,
  };
}

function splitByDetectedChapters(content: string, sourceFile: string): ChapterChunk[] {
  const lines = splitLinesWithOffsets(content);
  const chunks: ChapterChunk[] = [];
  let currentTitle = '';
  let currentLines: Array<{ line: string; start: number; end: number }> = [];
  let foundChapterTitle = false;

  function flushCurrent(): void {
    const chunk = trimChunkContent(currentLines);

    if (!chunk) {
      currentLines = [];
      return;
    }

    chunks.push({
      title: currentTitle || '前置内容',
      sourceFile,
      ...chunk,
    });

    currentLines = [];
  }

  for (const line of lines) {
    const titleMatch = detectChapterTitle(line.line);

    if (titleMatch) {
      if (foundChapterTitle || currentLines.map((currentLine) => currentLine.line).join('').trim().length > 0) {
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

  const leadingWhitespaceLength = content.length - content.trimStart().length;
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
        startPosition: leadingWhitespaceLength + start,
        endPosition: leadingWhitespaceLength + end,
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
  await mkdir(samplesDir, { recursive: true });
  const entries = await readdir(outputDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(outputDir, entry.name);

      if (entry.isDirectory() && entry.name === 'samples') {
        await rm(entryPath, { recursive: true, force: true });
        return;
      }

      if (entry.isFile() && (entry.name === 'chapters_index.md' || /^\d{3}_.+\.md$/.test(entry.name))) {
        await rm(entryPath);
      }
    }),
  );

  await mkdir(samplesDir, { recursive: true });
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
    '为避免把大量正文提交进仓库，默认只在 `samples/` 目录保留前 3 个小样例章节文件；如确需本地写出完整章节正文，可设置 `CORPUS_SPLIT_WRITE_FULL_CHAPTERS=1` 后重新运行脚本。',
    '',
    '| 章节序号 | 标题 | 来源文件 | 字符数 | 起始位置 | 结束位置 | 是否为样例文件 | 样例文件 | 完整章节文件 |',
    '| --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |',
  ];

  if (records.length === 0) {
    lines.push('| - | 未发现可拆分文本 | - | 0 | - | - | 否 | - | - |');
  } else {
    for (const record of records) {
      const sampleFile = record.isSampleFile ? `samples/${record.sampleFileName}` : '-';
      lines.push(
        `| ${String(record.sequence).padStart(3, '0')} | ${record.title.replace(/\|/g, '\\|')} | \`${record.sourceFile}\` | ${record.characterCount} | ${record.startPosition} | ${record.endPosition} | ${record.isSampleFile ? '是' : '否'} | \`${sampleFile}\` | \`${record.fileName}\` |`,
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
    const currentSampleFileName = sampleFileName(sequence);
    const isSampleFile = sequence <= sampleChapterCount;

    if (shouldWriteFullChapterFiles) {
      await writeFile(path.join(outputDir, fileName), normalizeGeneratedMarkdown(chunk.content), 'utf8');
    }

    if (isSampleFile) {
      await writeFile(path.join(samplesDir, currentSampleFileName), normalizeGeneratedMarkdown(chunk.content), 'utf8');
    }

    records.push({
      ...chunk,
      sequence,
      fileName,
      sampleFileName: currentSampleFileName,
      characterCount: countCharacters(chunk.content),
      isSampleFile,
    });
  }

  await writeFile(indexPath, buildIndex(records), 'utf8');

  console.log(`Chapter index written to ${toPosixPath(path.relative(process.cwd(), indexPath))}`);
  console.log(`Indexed ${records.length} chapter record(s) from ${sourceFiles.length} source file(s).`);
  console.log(`Wrote ${Math.min(records.length, sampleChapterCount)} sample chapter file(s) to ${toPosixPath(path.relative(process.cwd(), samplesDir))}.`);

  if (shouldWriteFullChapterFiles) {
    console.log('Full chapter body files were written because CORPUS_SPLIT_WRITE_FULL_CHAPTERS=1.');
  } else {
    console.log('Skipped full chapter body files; set CORPUS_SPLIT_WRITE_FULL_CHAPTERS=1 for local-only full output.');
  }
}

await main();
