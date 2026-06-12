import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

interface LoadedSummary {
  fileName: string;
  chapterId: string;
  summary: ChapterSummary;
  isMock: boolean;
}

interface AggregateItem {
  text: string;
  chapters: Set<string>;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(labRoot, '..');
const analysisDir = path.join(labRoot, 'analysis');
const summariesDir = path.join(analysisDir, 'chapter_summaries');

const outputPaths = {
  storyBible: path.join(analysisDir, 'dragon_story_bible.md'),
  unresolvedThreads: path.join(analysisDir, 'dragon_unresolved_threads.md'),
  foreshadowing: path.join(analysisDir, 'dragon_foreshadowing.md'),
  endingRules: path.join(analysisDir, 'dragon_ending_rules.md'),
};

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function chapterNumberFromFileName(fileName: string): string {
  return fileName.match(/^(\d+)/)?.[1] ?? fileName.replace(/\.json$/i, '');
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => normalizeString(item)).filter((item) => item.length > 0);
}

function normalizeSummary(candidate: Partial<ChapterSummary>): ChapterSummary {
  return {
    chapter_title: normalizeString(candidate.chapter_title),
    chapter_summary: normalizeString(candidate.chapter_summary),
    important_events: normalizeStringArray(candidate.important_events),
    characters_appeared: normalizeStringArray(candidate.characters_appeared),
    character_changes: normalizeStringArray(candidate.character_changes),
    worldbuilding_info: normalizeStringArray(candidate.worldbuilding_info),
    new_clues: normalizeStringArray(candidate.new_clues),
    unresolved_threads: normalizeStringArray(candidate.unresolved_threads),
    foreshadowing: normalizeStringArray(candidate.foreshadowing),
    emotional_tone: normalizeString(candidate.emotional_tone),
    style_notes: normalizeStringArray(candidate.style_notes),
    ending_hook: normalizeString(candidate.ending_hook),
  };
}

function allSummaryText(summary: ChapterSummary): string {
  return [
    summary.chapter_title,
    summary.chapter_summary,
    ...summary.important_events,
    ...summary.characters_appeared,
    ...summary.character_changes,
    ...summary.worldbuilding_info,
    ...summary.new_clues,
    ...summary.unresolved_threads,
    ...summary.foreshadowing,
    summary.emotional_tone,
    ...summary.style_notes,
    summary.ending_hook,
  ].join(' ');
}

function isMockSummary(summary: ChapterSummary): boolean {
  return /\bmock\b|Mock|当前为 mock 分析|待模型分析|等待接入 OpenAI API/i.test(allSummaryText(summary));
}

function escapeMarkdownTableCell(value: string): string {
  return value.replace(/\|/g, '\\|');
}

function compactText(value: string, maxLength = 140): string {
  const normalized = normalizeString(value);
  const characters = Array.from(normalized);
  if (characters.length <= maxLength) {
    return escapeMarkdownTableCell(normalized);
  }
  return escapeMarkdownTableCell(`${characters.slice(0, maxLength - 1).join('')}…`);
}

function sourceLabel(item: LoadedSummary): string {
  const title = item.summary.chapter_title ? `：${item.summary.chapter_title}` : '';
  return `第 ${item.chapterId} 章${title}`;
}

function addAggregate(map: Map<string, AggregateItem>, text: string, chapter: string): void {
  const normalized = normalizeString(text);
  if (!normalized) {
    return;
  }

  const key = normalized.toLocaleLowerCase('zh-CN');
  const existing = map.get(key);
  if (existing) {
    existing.chapters.add(chapter);
    return;
  }

  map.set(key, { text: normalized, chapters: new Set([chapter]) });
}

function aggregateByField(summaries: LoadedSummary[], field: keyof ChapterSummary): AggregateItem[] {
  const map = new Map<string, AggregateItem>();

  for (const item of summaries) {
    const value = item.summary[field];
    const label = sourceLabel(item);
    if (Array.isArray(value)) {
      for (const entry of value) {
        addAggregate(map, entry, label);
      }
    } else if (typeof value === 'string') {
      addAggregate(map, value, label);
    }
  }

  return Array.from(map.values()).sort((left, right) => left.text.localeCompare(right.text, 'zh-CN'));
}

function aggregateCharacters(summaries: LoadedSummary[]): AggregateItem[] {
  return aggregateByField(summaries, 'characters_appeared');
}

function chaptersList(chapters: Set<string>, limit = 6): string {
  const values = Array.from(chapters);
  const shown = values.slice(0, limit).join('；');
  return values.length > limit ? `${shown}；等 ${values.length} 处` : shown;
}

function makeMockNotice(hasMock: boolean): string {
  if (!hasMock) {
    return '';
  }

  return [
    '> **当前为 mock 分析，不代表真实内容。**',
    '> 本文件由章节摘要 JSON 自动汇总而成；只适合作为流程验证和结构占位，不能作为《龙族》真实剧情依据。',
    '',
  ].join('\n');
}

function makeSourceStatus(summaries: LoadedSummary[]): string {
  const mockCount = summaries.filter((item) => item.isMock).length;
  const realCount = summaries.length - mockCount;

  return [
    '## 来源与可信度',
    '',
    `- 输入目录：\`${toPosixPath(path.relative(repoRoot, summariesDir))}/\``,
    `- 已读取章节摘要：${summaries.length} 个。`,
    `- mock 摘要：${mockCount} 个；非 mock 摘要：${realCount} 个。`,
    '- 生成原则：只汇总结构化摘要字段，不生成小说正文，不输出大段原文。',
    '',
  ].join('\n');
}

function makeAggregateTable(items: AggregateItem[], headers: [string, string], emptyText: string): string {
  if (items.length === 0) {
    return `- ${emptyText}\n`;
  }

  const lines = [`| ${headers[0]} | ${headers[1]} |`, '| --- | --- |'];
  for (const item of items) {
    lines.push(`| ${compactText(item.text)} | ${compactText(chaptersList(item.chapters), 180)} |`);
  }
  return `${lines.join('\n')}\n`;
}

function makeChapterDigest(summaries: LoadedSummary[]): string {
  const lines = ['| 章节 | 摘要要点 | 结尾钩子 |', '| --- | --- | --- |'];
  for (const item of summaries) {
    lines.push(
      `| ${compactText(sourceLabel(item), 80)} | ${compactText(item.summary.chapter_summary || '暂无摘要。')} | ${compactText(item.summary.ending_hook || '暂无终局钩子。')} |`,
    );
  }
  return `${lines.join('\n')}\n`;
}

function buildStoryBible(summaries: LoadedSummary[]): string {
  const hasMock = summaries.some((item) => item.isMock);
  const characters = aggregateCharacters(summaries);
  const events = aggregateByField(summaries, 'important_events');
  const characterChanges = aggregateByField(summaries, 'character_changes');
  const worldbuilding = aggregateByField(summaries, 'worldbuilding_info');
  const clues = aggregateByField(summaries, 'new_clues');
  const tones = aggregateByField(summaries, 'emotional_tone');
  const styleNotes = aggregateByField(summaries, 'style_notes');

  return [
    '# 《龙族》故事圣经 v0 自动汇总',
    '',
    makeMockNotice(hasMock),
    makeSourceStatus(summaries),
    '## 章节摘要索引',
    '',
    makeChapterDigest(summaries),
    '## 人物出现汇总',
    '',
    makeAggregateTable(characters, ['人物/人物占位', '出现章节'], '暂无人物信息。'),
    '## 重要事件汇总',
    '',
    makeAggregateTable(events, ['事件', '来源章节'], '暂无重要事件。'),
    '## 人物变化汇总',
    '',
    makeAggregateTable(characterChanges, ['人物变化', '来源章节'], '暂无人物变化。'),
    '## 世界观信息汇总',
    '',
    makeAggregateTable(worldbuilding, ['世界观信息', '来源章节'], '暂无世界观信息。'),
    '## 新线索汇总',
    '',
    makeAggregateTable(clues, ['线索', '来源章节'], '暂无新线索。'),
    '## 情绪基调汇总',
    '',
    makeAggregateTable(tones, ['情绪基调', '来源章节'], '暂无情绪基调。'),
    '## 风格提示汇总',
    '',
    makeAggregateTable(styleNotes, ['风格提示', '来源章节'], '暂无风格提示。'),
    '## 下一步用途',
    '',
    '- 作为后续故事圣经人工校订底稿。',
    '- 与未解线索、伏笔和结尾规则文件交叉检查。',
    '- 在正式语料摘要完成前，不用于生成最终章节正文。',
    '',
  ].join('\n');
}

function buildUnresolvedThreads(summaries: LoadedSummary[]): string {
  const hasMock = summaries.some((item) => item.isMock);
  const threads = aggregateByField(summaries, 'unresolved_threads');
  const hooks = aggregateByField(summaries, 'ending_hook');

  return [
    '# 《龙族》未解决剧情线 v0 自动汇总',
    '',
    makeMockNotice(hasMock),
    makeSourceStatus(summaries),
    '## 未解决剧情线表',
    '',
    threads.length === 0
      ? '- 暂无未解决剧情线。\n'
      : [
          '| 编号 | 未解决剧情线 | 来源章节 | 当前处理建议 |',
          '| --- | --- | --- | --- |',
          ...threads.map((item, index) =>
            `| T-${String(index + 1).padStart(3, '0')} | ${compactText(item.text)} | ${compactText(chaptersList(item.chapters), 180)} | 进入人工复核；确认是否必须闭合或可保留开放余韵。 |`,
          ),
          '',
        ].join('\n'),
    '## 终局钩子汇总',
    '',
    makeAggregateTable(hooks, ['终局钩子', '来源章节'], '暂无终局钩子。'),
    '## 复核规则',
    '',
    '- 先确认每条线索是否来自真实摘要，mock 条目只能作为占位。',
    '- 每条线索需补充首次出现位置、当前状态、重要性和不回收风险。',
    '- 不直接扩写为小说正文，只进入路线生成与比较阶段。',
    '',
  ].join('\n');
}

function buildForeshadowing(summaries: LoadedSummary[]): string {
  const hasMock = summaries.some((item) => item.isMock);
  const foreshadowing = aggregateByField(summaries, 'foreshadowing');
  const clues = aggregateByField(summaries, 'new_clues');

  return [
    '# 《龙族》伏笔表 v0 自动汇总',
    '',
    makeMockNotice(hasMock),
    makeSourceStatus(summaries),
    '## 伏笔/信号表',
    '',
    foreshadowing.length === 0
      ? '- 暂无伏笔信息。\n'
      : [
          '| 编号 | 伏笔/信号 | 出现章节 | 回收状态 | 建议动作 |',
          '| --- | --- | --- | --- | --- |',
          ...foreshadowing.map((item, index) =>
            `| F-${String(index + 1).padStart(3, '0')} | ${compactText(item.text)} | ${compactText(chaptersList(item.chapters), 180)} | 待人工确认 | 检查是否需要在结尾路线中回收、变奏或保留开放。 |`,
          ),
          '',
        ].join('\n'),
    '## 新线索交叉参照',
    '',
    makeAggregateTable(clues, ['线索', '来源章节'], '暂无新线索。'),
    '## 回收注意事项',
    '',
    '- 伏笔回收应服务人物弧线、世界观规则和情感余韵。',
    '- 避免过度解释；优先记录应回收的问题，而不是直接生成答案。',
    '- mock 伏笔不代表真实文本信号，必须等正式摘要完成后替换。',
    '',
  ].join('\n');
}

function buildEndingRules(summaries: LoadedSummary[]): string {
  const hasMock = summaries.some((item) => item.isMock);
  const threads = aggregateByField(summaries, 'unresolved_threads');
  const foreshadowing = aggregateByField(summaries, 'foreshadowing');
  const worldbuilding = aggregateByField(summaries, 'worldbuilding_info');
  const tones = aggregateByField(summaries, 'emotional_tone');
  const styleNotes = aggregateByField(summaries, 'style_notes');

  return [
    '# 《龙族》结尾规则 v0 自动汇总',
    '',
    makeMockNotice(hasMock),
    makeSourceStatus(summaries),
    '## 必须先满足的工作流规则',
    '',
    '- 先完成人工复核后的故事圣经、未解线索表和伏笔表。',
    '- 先生成多个结尾路线，再比较、混合和扩展大纲。',
    '- 不从当前自动汇总直接跳到最终章节正文。',
    '- 不输出大段原文；只保留摘要级、规则级、清单级信息。',
    '',
    '## 待闭合内容候选',
    '',
    threads.length === 0
      ? '- 暂无待闭合内容候选。\n'
      : [
          '| 编号 | 候选内容 | 来源章节 | 最低闭合标准 |',
          '| --- | --- | --- | --- |',
          ...threads.map((item, index) =>
            `| C-${String(index + 1).padStart(3, '0')} | ${compactText(item.text)} | ${compactText(chaptersList(item.chapters), 180)} | 说明其命运、代价、情感后果；人工判断可否开放。 |`,
          ),
          '',
        ].join('\n'),
    '## 伏笔回收约束候选',
    '',
    makeAggregateTable(foreshadowing, ['伏笔/信号', '来源章节'], '暂无伏笔回收约束。'),
    '## 世界观约束候选',
    '',
    makeAggregateTable(worldbuilding, ['世界观信息', '来源章节'], '暂无世界观约束。'),
    '## 情绪与风格约束候选',
    '',
    '### 情绪基调',
    '',
    makeAggregateTable(tones, ['情绪基调', '来源章节'], '暂无情绪基调。'),
    '### 风格提示',
    '',
    makeAggregateTable(styleNotes, ['风格提示', '来源章节'], '暂无风格提示。'),
    '## 结尾路线生成前检查清单',
    '',
    '- [ ] 已确认输入摘要不是 mock，或已接受仅做流程演示。',
    '- [ ] 已人工校订人物、世界观、未解线索和伏笔。',
    '- [ ] 已选择结尾偏好：闭合、悲剧、史诗规模、开放余韵、情感补偿或混合路线。',
    '- [ ] 已准备至少 2-3 条路线进行比较，而非直接生成唯一结尾。',
    '',
  ].join('\n');
}

async function loadSummaries(): Promise<LoadedSummary[]> {
  const fileNames = (await readdir(summariesDir))
    .filter((fileName) => fileName.endsWith('.json'))
    .sort((left, right) => left.localeCompare(right, 'zh-CN'));

  const summaries: LoadedSummary[] = [];
  for (const fileName of fileNames) {
    const filePath = path.join(summariesDir, fileName);
    const raw = await readFile(filePath, 'utf8');
    const summary = normalizeSummary(JSON.parse(raw) as Partial<ChapterSummary>);
    summaries.push({
      fileName,
      chapterId: chapterNumberFromFileName(fileName),
      summary,
      isMock: isMockSummary(summary),
    });
  }

  return summaries;
}

async function main(): Promise<void> {
  await mkdir(analysisDir, { recursive: true });

  const summaries = await loadSummaries();
  if (summaries.length === 0) {
    console.log(`No chapter summary JSON files found in ${toPosixPath(path.relative(repoRoot, summariesDir))}.`);
    return;
  }

  const outputs = [
    [outputPaths.storyBible, buildStoryBible(summaries)],
    [outputPaths.unresolvedThreads, buildUnresolvedThreads(summaries)],
    [outputPaths.foreshadowing, buildForeshadowing(summaries)],
    [outputPaths.endingRules, buildEndingRules(summaries)],
  ] as const;

  for (const [outputPath, content] of outputs) {
    await writeFile(outputPath, content, 'utf8');
    console.log(`Wrote ${toPosixPath(path.relative(repoRoot, outputPath))}`);
  }

  const mockCount = summaries.filter((item) => item.isMock).length;
  console.log(`Dragon analysis build complete. Read ${summaries.length} summaries; mock summaries: ${mockCount}.`);
}

await main();
