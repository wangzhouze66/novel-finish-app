import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface ChapterIndexRecord {
  sequence: number;
  title: string;
  sourceFile: string;
  characterCount: number;
  startOffset: number;
  endOffset: number;
}

interface ChapterSummary {
  chapter_title: string;
  chapter_summary: string;
  important_events: string[];
  characters_appeared: string[];
  character_changes: string[];
  worldbuilding_info: string[];
  new_clues: string[];
  unresolved_threads: string[];
  foreshadowing: string[];
  emotional_tone: string;
  style_notes: string[];
  ending_hook: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(labRoot, '..');
const chaptersIndexPath = path.join(labRoot, 'parsed', 'target_chapters', 'chapters_index.md');
const promptPath = path.join(labRoot, 'prompts', '01_summarize_chapter.md');
const outputDir = path.join(labRoot, 'analysis', 'chapter_summaries');
const errorDir = path.join(outputDir, 'errors');
const defaultChapterLimit = 10;
const openAiModel = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function getChapterLimit(): number {
  const parsedLimit = Number.parseInt(process.env.CHAPTER_SUMMARY_LIMIT ?? String(defaultChapterLimit), 10);

  if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
    console.warn(`Invalid CHAPTER_SUMMARY_LIMIT value; falling back to ${defaultChapterLimit}.`);
    return defaultChapterLimit;
  }

  return parsedLimit;
}

function stripMarkdownCell(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '`-`' || trimmed === '-') {
    return '';
  }
  return trimmed.replace(/^`|`$/g, '').replace(/\\\|/g, '|');
}

function parseChapterIndex(markdown: string): ChapterIndexRecord[] {
  const records: ChapterIndexRecord[] = [];

  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|')) {
      continue;
    }

    const cells = line
      .slice(1, -1)
      .split(/(?<!\\)\|/)
      .map((cell) => stripMarkdownCell(cell));

    if (cells.length < 6 || cells[0] === '章节序号' || cells[0].startsWith('---') || cells[0] === '-') {
      continue;
    }

    const sequence = Number.parseInt(cells[0], 10);
    const characterCount = Number.parseInt(cells[3], 10);
    const startOffset = Number.parseInt(cells[4], 10);
    const endOffset = Number.parseInt(cells[5], 10);

    if ([sequence, characterCount, startOffset, endOffset].some((value) => Number.isNaN(value))) {
      continue;
    }

    records.push({
      sequence,
      title: cells[1],
      sourceFile: cells[2],
      characterCount,
      startOffset,
      endOffset,
    });
  }

  return records;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function summaryFileName(sequence: number): string {
  return `${String(sequence).padStart(3, '0')}_summary.json`;
}

function errorFileName(sequence: number): string {
  return `${String(sequence).padStart(3, '0')}_error.json`;
}

function sliceChapterText(sourceContent: string, record: ChapterIndexRecord): string {
  const characters = Array.from(sourceContent);
  return characters.slice(record.startOffset, record.endOffset).join('').trim();
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);
}

function normalizeSummary(candidate: Partial<ChapterSummary>, fallbackTitle: string): ChapterSummary {
  return {
    chapter_title: typeof candidate.chapter_title === 'string' && candidate.chapter_title.trim().length > 0 ? candidate.chapter_title.trim() : fallbackTitle,
    chapter_summary: typeof candidate.chapter_summary === 'string' ? candidate.chapter_summary.trim() : '',
    important_events: normalizeStringArray(candidate.important_events),
    characters_appeared: normalizeStringArray(candidate.characters_appeared),
    character_changes: normalizeStringArray(candidate.character_changes),
    worldbuilding_info: normalizeStringArray(candidate.worldbuilding_info),
    new_clues: normalizeStringArray(candidate.new_clues),
    unresolved_threads: normalizeStringArray(candidate.unresolved_threads),
    foreshadowing: normalizeStringArray(candidate.foreshadowing),
    emotional_tone: typeof candidate.emotional_tone === 'string' ? candidate.emotional_tone.trim() : '',
    style_notes: normalizeStringArray(candidate.style_notes),
    ending_hook: typeof candidate.ending_hook === 'string' ? candidate.ending_hook.trim() : '',
  };
}

function makeMockSummary(record: ChapterIndexRecord, chapterText: string): ChapterSummary {
  const previewLength = Math.min(Array.from(chapterText).length, 40);
  return {
    chapter_title: record.title,
    chapter_summary: `Mock 摘要：已从 ${record.sourceFile} 的 ${record.startOffset}-${record.endOffset} 位置读取本章内容，等待设置 OPENAI_API_KEY 后生成正式 OpenAI API 分析。`,
    important_events: ['Mock：本章关键事件待模型分析。'],
    characters_appeared: ['Mock：人物列表待模型分析。'],
    character_changes: ['Mock：人物变化待模型分析。'],
    worldbuilding_info: ['Mock：世界观信息待模型分析。'],
    new_clues: ['Mock：新线索待模型分析。'],
    unresolved_threads: ['Mock：未解问题待模型分析。'],
    foreshadowing: ['Mock：伏笔待模型分析。'],
    emotional_tone: 'Mock：情绪基调待模型分析。',
    style_notes: [`Mock：已验证章节文本可读取，文本开头约 ${previewLength} 个字符未写入摘要文件。`],
    ending_hook: 'Mock：终局钩子待模型分析。',
  };
}

function extractJsonObject(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error('OpenAI response did not contain a JSON object.');
}

function parseOpenAiSummary(content: string, fallbackTitle: string): ChapterSummary {
  try {
    const jsonText = extractJsonObject(content);
    return normalizeSummary(JSON.parse(jsonText) as Partial<ChapterSummary>, fallbackTitle);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`OpenAI response could not be parsed as JSON: ${message}. Response excerpt: ${content.slice(0, 1000)}`);
  }
}

function makeUserPayload(record: ChapterIndexRecord, chapterText: string): Record<string, unknown> {
  return {
    chapter_number: String(record.sequence).padStart(3, '0'),
    chapter_title: record.title,
    source_file: record.sourceFile,
    start_offset: record.startOffset,
    end_offset: record.endOffset,
    chapter_text: chapterText,
  };
}

async function createOpenAiSummary(record: ChapterIndexRecord, chapterText: string, prompt: string): Promise<ChapterSummary> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return makeMockSummary(record, chapterText);
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openAiModel,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: JSON.stringify(makeUserPayload(record, chapterText)) },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed with ${response.status}: ${errorText.slice(0, 2000)}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI response did not include message content.');
  }

  return parseOpenAiSummary(content, record.title);
}

async function writeErrorLog(record: ChapterIndexRecord, error: unknown): Promise<void> {
  await mkdir(errorDir, { recursive: true });

  const errorPath = path.join(errorDir, errorFileName(record.sequence));
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const errorLog = {
    chapter_number: String(record.sequence).padStart(3, '0'),
    chapter_title: record.title,
    source_file: record.sourceFile,
    start_offset: record.startOffset,
    end_offset: record.endOffset,
    error_message: message,
    error_stack: stack,
    note: 'No chapter_text is written to this error log; inspect the source corpus locally if needed.',
  };

  await writeFile(errorPath, `${JSON.stringify(errorLog, null, 2)}\n`, 'utf8');
}

async function main(): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  const [indexMarkdown, prompt] = await Promise.all([
    readFile(chaptersIndexPath, 'utf8'),
    readFile(promptPath, 'utf8'),
  ]);
  const records = parseChapterIndex(indexMarkdown).slice(0, getChapterLimit());

  if (records.length === 0) {
    console.log('No chapter records found in chapters_index.md.');
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY is not set; generating mock chapter summary JSON files.');
  } else {
    console.log(`OPENAI_API_KEY is set; generating real summaries with OpenAI model ${openAiModel}.`);
  }

  const sourceCache = new Map<string, string>();
  let createdCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const record of records) {
    const outputPath = path.join(outputDir, summaryFileName(record.sequence));
    const relativeOutputPath = toPosixPath(path.relative(repoRoot, outputPath));

    if (await fileExists(outputPath)) {
      skippedCount += 1;
      console.log(`Skipped existing summary: ${relativeOutputPath}`);
      continue;
    }

    try {
      const sourcePath = path.join(labRoot, record.sourceFile);
      let sourceContent = sourceCache.get(sourcePath);
      if (!sourceContent) {
        sourceContent = await readFile(sourcePath, 'utf8');
        sourceCache.set(sourcePath, sourceContent);
      }

      const chapterText = sliceChapterText(sourceContent, record);
      const summary = await createOpenAiSummary(record, chapterText, prompt);

      await writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
      createdCount += 1;
      console.log(`Wrote summary: ${relativeOutputPath}`);
    } catch (error) {
      failedCount += 1;
      await writeErrorLog(record, error);
      console.error(`Failed summary ${String(record.sequence).padStart(3, '0')}; wrote error log.`);
    }
  }

  console.log(`Chapter summary run complete. Created ${createdCount}, skipped ${skippedCount}, failed ${failedCount}, limit ${records.length}.`);

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

await main();
