import { readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { CorpusCategory, CorpusFileRecord } from './types.ts';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const rawCorpusRoot = path.join(labRoot, 'raw_corpus');
const analysisDir = path.join(labRoot, 'analysis');
const outputPath = path.join(analysisDir, 'corpus_index.md');

const categories: CorpusCategory[] = ['target_novel', 'author_corpus', 'literary_references'];

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 2)} ${units[exponent]}`;
}

async function fileExists(directoryPath: string): Promise<boolean> {
  try {
    const stats = await stat(directoryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function collectFiles(directoryPath: string): Promise<string[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(entryPath);
      }

      if (entry.isFile()) {
        return [entryPath];
      }

      return [];
    }),
  );

  return nestedFiles.flat();
}

async function countCharactersIfPlainText(filePath: string, extension: string): Promise<number | null> {
  if (extension !== '.txt' && extension !== '.md') {
    return null;
  }

  const content = await readFile(filePath, 'utf8');
  return Array.from(content).length;
}

async function scanCategory(category: CorpusCategory): Promise<CorpusFileRecord[]> {
  const categoryDir = path.join(rawCorpusRoot, category);

  if (!(await fileExists(categoryDir))) {
    return [];
  }

  const files = await collectFiles(categoryDir);
  const records = await Promise.all(
    files.map(async (filePath) => {
      const extension = path.extname(filePath).toLowerCase();

      const stats = await stat(filePath);
      const relativePath = toPosixPath(path.relative(labRoot, filePath));

      return {
        category,
        fileName: path.basename(filePath),
        relativePath,
        extension,
        sizeBytes: stats.size,
        characterCount: await countCharactersIfPlainText(filePath, extension),
      } satisfies CorpusFileRecord;
    }),
  );

  return records.filter((record): record is CorpusFileRecord => record !== null);
}

function buildMarkdown(records: CorpusFileRecord[]): string {
  const now = new Date().toISOString();
  const lines: string[] = [
    '# 语料索引',
    '',
    `> 生成时间：${now}`,
    '',
    '本文件由 `npm run corpus:index` 自动生成，用于记录 `novel-ending-lab/raw_corpus/` 下的本地语料文件清单。',
    '',
    '## 扫描范围',
    '',
    '- `raw_corpus/target_novel/`：当前目标小说。',
    '- `raw_corpus/author_corpus/`：同作者作品或作者相关参考文本。',
    '- `raw_corpus/literary_references/`：文学参考文本。',
    '',
    '## 第一版处理边界',
    '',
    '- 递归列出三个分类目录中的所有普通文件。',
    '- 统计文件名、文件路径、扩展名、文件大小、所属目录分类。',
    '- 仅读取 `.txt` 和 `.md` 用于字符数统计；其他格式字符数标记为不适用。',
    '- 不分析正文。',
    '- 不生成小说正文。',
    '',
  ];

  if (records.length === 0) {
    lines.push(
      '## 扫描结果',
      '',
      '未发现可索引语料文件。请将文件放入 `raw_corpus/target_novel/`、`raw_corpus/author_corpus/` 或 `raw_corpus/literary_references/` 后重新运行。',
      '',
    );
    return `${lines.join('\n').trimEnd()}\n`;
  }

  lines.push(
    '## 扫描结果',
    '',
    `共发现 ${records.length} 个文件。`,
    '',
    '| 分类 | 文件名 | 路径 | 扩展名 | 文件大小 | 字符数 |',
    '| --- | --- | --- | --- | --- | --- |',
  );

  for (const record of records) {
    lines.push(
      `| ${record.category} | ${record.fileName} | \`${record.relativePath}\` | ${record.extension} | ${formatBytes(record.sizeBytes)} | ${record.characterCount ?? '不适用'} |`,
    );
  }

  lines.push('');
  return `${lines.join('\n').trimEnd()}\n`;
}

async function main(): Promise<void> {
  const recordsByCategory = await Promise.all(categories.map(scanCategory));
  const records = recordsByCategory
    .flat()
    .sort((left, right) => left.category.localeCompare(right.category) || left.relativePath.localeCompare(right.relativePath));

  await mkdir(analysisDir, { recursive: true });
  await writeFile(outputPath, buildMarkdown(records), 'utf8');

  console.log(`Corpus index written to ${toPosixPath(path.relative(process.cwd(), outputPath))}`);
  console.log(`Indexed ${records.length} file(s).`);
}

await main();
