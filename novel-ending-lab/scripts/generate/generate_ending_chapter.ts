import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface ChapterBasis {
  number: string;
  title: string;
  goal: string;
  characters: string[];
  plotLines: string[];
  tone: string;
  hook: string;
}

interface InputFile {
  label: string;
  path: string;
  content: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(labRoot, '..');
const analysisDir = path.join(labRoot, 'analysis');
const endingDir = path.join(labRoot, 'output/dragon_ending');
const generatedChaptersDir = path.join(endingDir, 'generated_chapters');
const outputPath = path.join(generatedChaptersDir, 'chapter_001_draft.md');

const inputFiles = [
  { label: '结尾大纲', path: path.join(endingDir, 'ending_outline.md') },
  { label: '故事圣经', path: path.join(analysisDir, 'dragon_story_bible.md') },
  { label: '未解线索', path: path.join(analysisDir, 'dragon_unresolved_threads.md') },
  { label: '伏笔表', path: path.join(analysisDir, 'dragon_foreshadowing.md') },
  { label: '结尾规则', path: path.join(analysisDir, 'dragon_ending_rules.md') },
];

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function relativePath(filePath: string): string {
  return toPosixPath(path.relative(repoRoot, filePath));
}

function isMockContent(content: string): boolean {
  return /当前为 mock 分析|mock 分析基础|\bmock\b|Mock|待模型分析|流程验证/i.test(content);
}

function extractField(section: string, label: string, fallback: string): string {
  const match = section.match(new RegExp(`- \\*\\*${label}\\*\\*：([^\n]+)`));
  return match?.[1]?.trim() || fallback;
}

function extractList(section: string, label: string, fallback: string[]): string[] {
  const start = section.match(new RegExp(`- \\*\\*${label}\\*\\*：\\n([\\s\\S]*?)(?=\\n- \\*\\*|\\n### |$)`));
  if (!start) {
    return fallback;
  }

  const items = start[1]
    .split('\n')
    .map((line) => line.replace(/^\s*-\s*/, '').trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function extractSelectedPlan(outline: string): string {
  const match = outline.match(/## 选用方案摘要\n([\s\S]*?)(?=\n## |$)/);
  if (!match) {
    return 'A 方案：圆满但有代价。';
  }

  const theme = match[1].match(/- \*\*核心主题\*\*：([^\n]+)/)?.[1]?.trim();
  const ending = match[1].match(/- \*\*路明非结局\*\*：([^\n]+)/)?.[1]?.trim();
  return ['A 方案：圆满但有代价', theme, ending].filter(Boolean).join('；');
}

function extractChapterOne(outline: string): ChapterBasis {
  const section = outline.match(/### 第 01 章：([^\n]+)\n([\s\S]*?)(?=\n### 第 02 章：|$)/);
  const body = section?.[2] ?? '';

  return {
    number: '第 01 章',
    title: section?.[1]?.trim() || '雨后的临时同盟',
    goal: extractField(body, '本章目标', '确认结尾方向，并让主角团重新聚合。'),
    characters: extractField(body, '出场人物', '路明非、路鸣泽、楚子航、诺诺、恺撒')
      .split('、')
      .map((item) => item.trim())
      .filter(Boolean),
    plotLines: extractList(body, '必须推进的剧情线', [
      '确立路明非主动选择而非被动献祭的终局方向',
      '确认高优先级未解线索后续必须闭合或保留开放',
    ]),
    tone: extractField(body, '情绪基调', '雨后清冷、短暂轻松、笑声下面压着不安。'),
    hook: extractField(body, '结尾钩子', '路鸣泽提示最终交易会索取某个能证明路明非是自己的东西。'),
  };
}

function buildMockDraft(chapter: ChapterBasis): string {
  const characterText = chapter.characters.join('、');

  return [
    `雨停以后，临时指挥室的窗玻璃还挂着水痕。${chapter.characters[0] ?? '路明非'}坐在最靠门的位置，像一个随时准备逃课又被班主任逮住的学生。桌对面的人都在等他说话，可他只盯着纸杯里的热水，看白汽一点点散掉。`,
    '',
    `楚子航先打破沉默。他没有催促，只把整理出的伤亡名单和异常坐标推到桌中央。诺诺靠在窗边，红发被冷光照得很亮，语气仍然像平时那样轻快，却没有真的开玩笑。恺撒负责把争吵压回会议桌内，提醒所有人：现在不是庆功，也不是审判。`,
    '',
    `路明非终于承认，所谓圆满不会是免费赠品。他可以选择继续往前走，但每一步都要确认自己不是被命运推着走，也不是被某个交易拖着走。他要救下世界，也要尽量救下还站在这里的人。至于自己会被收走什么，他还不知道。`,
    '',
    `短暂的安静里，少年模样的路鸣泽像从雨声背后走出来。他看着${characterText}，笑得很轻，像是在宣布一条早已写好的规则。`,
    '',
    `“哥哥，”他说，“这次不是四分之一生命。”`,
    '',
    `路明非抬起头。窗外的雨云正在散开，可天色没有变亮。`,
    '',
    `路鸣泽继续说：“这次要交还的，是某个能证明你还是你的东西。”`,
  ].join('\n');
}

function buildOutput(inputs: InputFile[]): string {
  const outline = inputs.find((input) => input.label === '结尾大纲')?.content ?? '';
  const hasMock = inputs.some((input) => isMockContent(input.content));
  const chapter = extractChapterOne(outline);
  const selectedPlan = extractSelectedPlan(outline);

  const lines = [
    '# 第 001 章样章：' + chapter.title,
    '',
  ];

  if (hasMock) {
    lines.push('> **当前为 mock 分析基础上的样章，仅用于流程验证，不代表最终内容。**', '');
  }

  lines.push(
    '## 生成边界',
    '',
    '- 第一版只生成第 1 章样章，不生成后续 11 章。',
    '- 本文件是流程验证用 mock 草稿，不追求最终文学质量。',
    '- 不输出原文，不复刻原作段落。',
    '',
    '## 输入依据',
    '',
    ...inputs.map((input) => `- ${input.label}：\`${relativePath(input.path)}\``),
    '',
    '## 生成依据',
    '',
    `- **使用的结尾方案**：${selectedPlan}`,
    `- **使用的大纲章节**：${chapter.number}：${chapter.title}`,
    `- **关键人物**：${chapter.characters.join('、')}`,
    `- **本章目标**：${chapter.goal}`,
    '- **必须推进的剧情线**：',
    ...chapter.plotLines.map((line) => `  - ${line}`),
    `- **情绪基调参考**：${chapter.tone}`,
    `- **结尾钩子参考**：${chapter.hook}`,
    '',
    '## 章节正文（mock 草稿）',
    '',
    buildMockDraft(chapter),
    '',
  );

  return lines.join('\n');
}

async function main(): Promise<void> {
  const inputs = await Promise.all(
    inputFiles.map(async (input) => ({
      ...input,
      content: await readFile(input.path, 'utf8'),
    })),
  );

  await mkdir(generatedChaptersDir, { recursive: true });
  await writeFile(outputPath, buildOutput(inputs), 'utf8');
  console.log(`Generated ${relativePath(outputPath)}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
