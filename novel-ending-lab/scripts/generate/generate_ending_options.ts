import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface AnalysisInput {
  label: string;
  path: string;
  content: string;
}

interface EndingOption {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  coreTheme: string;
  luMingfei: string;
  luMingze: string;
  chuZihang: string;
  nono: string;
  caesar: string;
  odin: string;
  dragonWorld: string;
  foreshadowing: string[];
  openQuestions: string[];
  emotionalTone: string;
  risks: string[];
  recommendation: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(labRoot, '..');
const analysisDir = path.join(labRoot, 'analysis');
const outputPath = path.join(labRoot, 'output/dragon_ending/ending_options.md');

const inputFiles = [
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
  return /当前为 mock 分析|\bmock\b|Mock|待模型分析|流程验证/i.test(content);
}

function extractTableItems(content: string, marker: RegExp, fallback: string): string[] {
  const lines = content.split('\n');
  const result: string[] = [];
  let active = false;

  for (const line of lines) {
    if (marker.test(line)) {
      active = true;
      continue;
    }
    if (active && /^##\s+/.test(line)) {
      break;
    }
    if (!active || !line.trim().startsWith('|') || /^\|\s*-+/.test(line) || /编号|伏笔|未解决剧情线|候选内容/.test(line)) {
      continue;
    }

    const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
    const candidate = cells.find((cell) => !/^T-\d+|F-\d+|C-\d+/.test(cell) && !/第 \d+ 章/.test(cell));
    if (candidate && !/Mock|mock|待模型分析/.test(candidate)) {
      result.push(candidate);
    }
  }

  return result.length > 0 ? Array.from(new Set(result)).slice(0, 6) : [fallback];
}

function buildOptions(inputs: AnalysisInput[], hasMock: boolean): EndingOption[] {
  const unresolved = extractTableItems(
    inputs.find((input) => input.label === '未解线索')?.content ?? '',
    /未解决剧情线表|待闭合内容候选/,
    hasMock ? 'mock 未解线索待正式分析后替换；此处只保留“必须逐条复核并决定闭合/开放”的流程占位。' : '逐条回收未解剧情线，并标注可开放项。',
  );
  const foreshadowing = extractTableItems(
    inputs.find((input) => input.label === '伏笔表')?.content ?? '',
    /伏笔\/信号表|伏笔回收约束候选/,
    hasMock ? 'mock 伏笔待正式分析后替换；此处只保留“必须回收、变奏或明确开放”的流程占位。' : '回收已确认伏笔，并避免过度解释。',
  );

  return [
    {
      id: 'A',
      name: '圆满但有代价',
      coreTheme: '在世界被拯救之后，少年获得迟来的普通生活，但必须承认青春、血统与旧日关系无法完整归还。',
      luMingfei: '主动拒绝成为新的绝对王座，以失去部分龙血力量或关键记忆为代价，换取人类世界的延续与自我选择权。',
      luMingze: '从交易者变成被救赎者：其真实身份与契约逻辑被解释到路线级，最终与路明非完成一次互相偿还，而非继续无限索取。',
      chuZihang: '从奥丁阴影中被完整拉回，保留伤痕与责任；他不再只是失踪者或复仇者，而成为新秩序的守门人。',
      nono: '与路明非完成情感确认或体面告别；重点不是即时恋爱补偿，而是承认她对路明非成长的不可替代影响。',
      caesar: '接受骄傲的边界，主动让位于更大的共同目标；与诺诺线保持尊严，不以简单失败者处理。',
      odin: '奥丁作为旧秩序、尼伯龙根与命运操盘的象征被击败，其机制被揭示到足以支撑终局。',
      dragonWorld: '黑王/白王/龙王体系被重置为不可再由单一王权统治的平衡结构，龙族威胁下降但神秘性保留。',
      foreshadowing,
      openQuestions: ['新平衡是否永久稳定。', '路明非失去的部分能否被找回。', ...unresolved.slice(0, 2)],
      emotionalTone: '温柔、克制、带伤的圆满；先给青春喜剧余温，再落到失而复得的安静痛感。',
      risks: ['过度圆满会削弱《龙族》的悲剧密度。', '情感补偿若处理过满，可能显得像愿望清单。'],
      recommendation: '★★★★☆：适合作为读者情感补偿与商业闭合度最高的主路线。',
    },
    {
      id: 'B',
      name: '宿命悲剧版',
      coreTheme: '所有反抗都真实发生，但命运的价格不可取消；少年赢得世界，却输掉自己最想保留的时间。',
      luMingfei: '完成最终选择后消失、沉睡或被历史抹除，只留下少数人记得他的存在。',
      luMingze: '揭示为宿命循环的核心钥匙，与路明非共同承担终局代价；兄弟/镜像关系以悲剧闭合。',
      chuZihang: '彻底斩断奥丁线，却必须继承记忆与孤独，成为“记得路明非的人”之一。',
      nono: '保留最强情绪余震：她理解路明非的选择，但无法追回他；以克制留白替代哭喊式煽情。',
      caesar: '在失去与失败中完成成熟，保护幸存者与新秩序，承担贵族式责任。',
      odin: '奥丁被击败但证明命运并非单一敌人，而是一套由龙族历史、人类欲望和契约共同维系的结构。',
      dragonWorld: '黑王/白王/龙王终局以“王权终结但神话残响仍在”为收束，人类暂时获胜。',
      foreshadowing,
      openQuestions: ['路明非是否可能在未来某个时代归来。', '命运循环是否真的终止。', ...unresolved.slice(0, 2)],
      emotionalTone: '冷、重、史诗悲怆；强调孤独、命运、青春不可追回。',
      risks: ['悲剧强度过高，可能让长期情感投入缺少回报。', '若解释不足，读者会认为牺牲只是强行催泪。'],
      recommendation: '★★★★☆：主题纯度最高，但需要非常扎实的伏笔回收。',
    },
    {
      id: 'C',
      name: '开放式终局版',
      coreTheme: '终局不是答案，而是少年终于有资格走向未被书写的人生；世界获救，但神秘仍在远处发光。',
      luMingfei: '不登王座也不彻底退场，而是在终战后离开中心舞台，带着未说尽的情感进入开放旅程。',
      luMingze: '保留部分谜面，只明确其与路明非契约的情感真相和最低世界观逻辑，不完全剥夺神秘感。',
      chuZihang: '解决奥丁造成的身份断裂，但未来去向开放；他可继续追查残余尼伯龙根。',
      nono: '与路明非有一次清楚但不封死的对话，承认彼此改变；关系保留余韵而非确定归属。',
      caesar: '保持行动者位置，与诺诺、学院和新世界秩序之间留有张力。',
      odin: '奥丁主线被阶段性击破，残留机制成为开放式世界观尾声。',
      dragonWorld: '黑王/白王/龙王结构被解释为仍有未知层级；当前危机结束，下一时代由人类和混血种共同面对。',
      foreshadowing,
      openQuestions: ['路明非下一站去向。', '龙族神话是否存在更深层源头。', ...unresolved],
      emotionalTone: '清晨感、怅然、轻微希望；重在余韵，不在答案密度。',
      risks: ['开放过多会被认为逃避填坑。', '必须区分“有意留白”和“没有解释”。'],
      recommendation: '★★★☆☆：文学余韵强，适合与其他路线混合，不宜单独承担全部收束。',
    },
    {
      id: 'D',
      name: '黑暗牺牲版',
      coreTheme: '为了终结龙族王权，主角必须亲手成为最接近黑暗的东西，并把自己从普通幸福中永久放逐。',
      luMingfei: '以自我污染、自我封印或继承黑王权柄的方式终止灾厄，成为无法回家的守门人。',
      luMingze: '作为代价机制的执行者或共同牺牲者，与路明非完成最残酷的契约闭环。',
      chuZihang: '成为少数能阻止路明非失控的人，承担“如果他越界就杀死他”的终局职责。',
      nono: '成为路明非仍然想保护的人间锚点，但不能把他带回日常；情感以痛苦守望收束。',
      caesar: '放下个人胜负，承认路明非的牺牲，同时保留必要的警惕与制衡。',
      odin: '奥丁线被纳入黑暗终局：其权能、面具或命运系统成为封印黑王/龙王体系的反向工具。',
      dragonWorld: '黑王/白王/龙王体系被压入新的封印或由路明非承担的禁区，世界获救但代价长期存在。',
      foreshadowing,
      openQuestions: ['路明非是否仍保有人性。', '守门人的封印能持续多久。', ...unresolved.slice(0, 2)],
      emotionalTone: '黑暗、压抑、庄严；青春感只作为最后的人性余光出现。',
      risks: ['过暗会背离青春校园底色。', '若缺少阶段性温情，会让牺牲显得机械。'],
      recommendation: '★★★☆☆：冲击力强，适合作为高悲剧备选或混合路线的终局代价来源。',
    },
  ];
}

function bulletList(items: string[]): string {
  return items.map((item) => `  - ${item}`).join('\n');
}

function renderOption(option: EndingOption): string {
  return [
    `### 方案 ${option.id}：${option.name}`,
    '',
    `- **核心主题**：${option.coreTheme}`,
    `- **路明非结局**：${option.luMingfei}`,
    `- **路鸣泽线处理**：${option.luMingze}`,
    `- **楚子航线处理**：${option.chuZihang}`,
    `- **诺诺线处理**：${option.nono}`,
    `- **恺撒线处理**：${option.caesar}`,
    `- **奥丁线处理**：${option.odin}`,
    `- **黑王/白王/龙王世界观终局**：${option.dragonWorld}`,
    '- **必须回收的伏笔**：',
    bulletList(option.foreshadowing),
    '- **保留开放的问题**：',
    bulletList(option.openQuestions),
    `- **情绪基调**：${option.emotionalTone}`,
    '- **风险点**：',
    bulletList(option.risks),
    `- **推荐指数**：${option.recommendation}`,
  ].join('\n');
}

function renderMarkdown(inputs: AnalysisInput[], hasMock: boolean): string {
  const options = buildOptions(inputs, hasMock);
  const mockNotice = hasMock
    ? '> **当前为 mock 分析基础上的结局方案，仅用于流程验证，不代表最终内容。**\n\n'
    : '';

  return [
    '# 《龙族》多结尾方案 v0',
    '',
    mockNotice.trimEnd(),
    '## 生成边界',
    '',
    '- 本文件只生成结局方案，不生成章节正文。',
    '- 本文件不输出大段原文。',
    '- 后续应先做方案比较与混合，再进入卷纲、章纲、场景纲和正文阶段。',
    '',
    '## 输入依据',
    '',
    ...inputs.map((input) => `- ${input.label}：\`${relativePath(input.path)}\``),
    '',
    '## 方案总览',
    '',
    '| 方案编号 | 方案名 | 核心主题 | 情绪基调 | 推荐指数 | 主要风险 |',
    '| --- | --- | --- | --- | --- | --- |',
    ...options.map((option) => `| ${option.id} | ${option.name} | ${option.coreTheme} | ${option.emotionalTone} | ${option.recommendation} | ${option.risks.join('；')} |`),
    '',
    '## 单方案详情',
    '',
    ...options.map(renderOption).join('\n\n').split('\n'),
    '',
    '## 下一步建议',
    '',
    '- 使用结局比较模板评估四个方案的主题完成度、人物弧线、世界观逻辑、伏笔回收和读者风险。',
    '- 优先从 A 的情感补偿、B 的主题纯度、C 的余韵、D 的终局代价中提取可混合部件。',
    '- 在正式分析替换 mock 内容前，不要把任何方案扩写为最终章节正文。',
    '',
  ].filter((line, index, lines) => !(line === '' && lines[index - 1] === '')).join('\n');
}

async function main(): Promise<void> {
  const inputs = await Promise.all(
    inputFiles.map(async (input) => ({ ...input, content: await readFile(input.path, 'utf8') })),
  );
  const hasMock = inputs.some((input) => isMockContent(input.content));

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderMarkdown(inputs, hasMock), 'utf8');

  console.log(`Generated ${relativePath(outputPath)}`);
  if (hasMock) {
    console.log('Mock analysis detected; output includes required mock notice.');
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
