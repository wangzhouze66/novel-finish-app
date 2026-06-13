import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface OutlineInput {
  label: string;
  path: string;
  content: string;
}

interface ChapterOutline {
  number: number;
  title: string;
  goal: string;
  conflict: string;
  characters: string[];
  plotLines: string[];
  foreshadowing: string[];
  emotionalTone: string;
  hook: string;
  risk: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(labRoot, '..');
const analysisDir = path.join(labRoot, 'analysis');
const outputDir = path.join(labRoot, 'output/dragon_ending');
const outputPath = path.join(outputDir, 'ending_outline.md');

const inputFiles = [
  { label: '结尾方案', path: path.join(outputDir, 'ending_options.md') },
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
    if (!active || !line.trim().startsWith('|') || /^\|\s*-+/.test(line) || /编号|伏笔|未解决剧情线|候选内容|线索/.test(line)) {
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

function getAPlanSummary(optionsContent: string): string {
  const match = optionsContent.match(/### 方案 A：圆满但有代价[\s\S]*?(?=\n### 方案 [B-Z]：|\n## 下一步建议|$)/);
  if (!match) {
    return '默认采用 A 方案：圆满但有代价。';
  }

  const lines = match[0].split('\n');
  const result: string[] = [];
  let includeRiskBullets = false;

  for (const line of lines) {
    if (/^- \*\*(核心主题|路明非结局|路鸣泽线处理|情绪基调|风险点)/.test(line)) {
      result.push(line);
      includeRiskBullets = /风险点/.test(line);
      continue;
    }

    if (includeRiskBullets && /^  - /.test(line)) {
      result.push(line);
      continue;
    }

    if (includeRiskBullets && line.trim() !== '') {
      includeRiskBullets = false;
    }
  }

  return result.join('\n');
}

function pick(items: string[], index: number): string {
  return items[index % items.length];
}

function buildChapters(inputs: OutlineInput[], hasMock: boolean): ChapterOutline[] {
  const unresolved = extractTableItems(
    inputs.find((input) => input.label === '未解线索')?.content ?? '',
    /未解决剧情线表|待闭合内容候选/,
    hasMock ? 'mock 未解线索待正式分析后替换；本章只标注“必须确认闭合或保留开放”。' : '逐条回收高优先级未解剧情线。',
  );
  const foreshadowing = extractTableItems(
    inputs.find((input) => input.label === '伏笔表')?.content ?? '',
    /伏笔\/信号表|伏笔回收约束候选/,
    hasMock ? 'mock 伏笔待正式分析后替换；本章只标注“必须回收、变奏或明确开放”。' : '回收已确认伏笔，避免过度解释。',
  );

  return [
    {
      number: 1,
      title: '雨后的临时同盟',
      goal: '确认选择 A 方案“圆满但有代价”，让主角团重新聚合并明确终局不是胜利游行。',
      conflict: '学院、混血种家族与幸存者都想要立即答案，但路明非仍无法说明自己和路鸣泽契约的最终价格。',
      characters: ['路明非', '路鸣泽', '楚子航', '诺诺', '恺撒'],
      plotLines: ['确立路明非主动选择而非被动献祭的终局方向', pick(unresolved, 0)],
      foreshadowing: [pick(foreshadowing, 0), '埋下“力量或记忆必须被交还”的代价信号'],
      emotionalTone: '雨后清冷、短暂轻松、笑声下面压着不安。',
      hook: '路鸣泽告诉路明非：这次交易不是四分之一生命，而是某个“能证明你是你”的东西。',
      risk: '不要把圆满承诺写成无代价爽文；本章只给方向，不解释全部谜底。',
    },
    {
      number: 2,
      title: '旧学院的缺席名单',
      goal: '清点幸存者、失踪者与必须闭合的线索，把章纲从情绪重逢推向任务结构。',
      conflict: '每个阵营都想优先保护自身利益，主角团必须决定哪些线索必须在终局前回收。',
      characters: ['路明非', '楚子航', '恺撒', '学院代表', '执行部成员'],
      plotLines: ['建立未解线索优先级清单', pick(unresolved, 1)],
      foreshadowing: [pick(foreshadowing, 1), '把“缺席名单”与尼伯龙根残留入口关联起来'],
      emotionalTone: '调查感、克制悲伤、旧日校园余温。',
      hook: '名单上出现一个按理不该存在的名字，指向奥丁曾经改写过的记忆。',
      risk: '避免用信息表格替代戏剧推进；每条线索都要服务后续选择。',
    },
    {
      number: 3,
      title: '奥丁留下的门',
      goal: '把奥丁线从单纯敌人推进为旧秩序机制，说明必须进入残留尼伯龙根。',
      conflict: '楚子航想直接复仇，路明非想保存所有人，二者在行动速度与风险承担上产生分歧。',
      characters: ['楚子航', '路明非', '诺诺', '芬格尔'],
      plotLines: ['推进奥丁/尼伯龙根机制线', pick(unresolved, 2)],
      foreshadowing: [pick(foreshadowing, 2), '回收或变奏奥丁面具、雨夜、被抹除之人的信号'],
      emotionalTone: '冷硬、压迫、复仇冲动与友情牵制并存。',
      hook: '楚子航在门后看见另一个版本的自己，像是已经接受了奥丁的命运。',
      risk: '不要把奥丁解释成单薄反派；必须保留神秘感与终局规则感。',
    },
    {
      number: 4,
      title: '契约的反面',
      goal: '揭开路鸣泽契约的最低逻辑：他不是单纯索取者，而是被旧王权困住的钥匙。',
      conflict: '路明非必须判断路鸣泽是在求救、操控，还是二者皆有。',
      characters: ['路明非', '路鸣泽', '诺诺'],
      plotLines: ['推进路鸣泽身份与契约代价线', pick(unresolved, 3)],
      foreshadowing: [pick(foreshadowing, 3), '埋下“互相偿还”而非“单向牺牲”的终局伏笔'],
      emotionalTone: '亲密又危险、童话感与残酷规则并置。',
      hook: '路鸣泽第一次承认：如果路明非赢了，他自己可能会从世界上消失。',
      risk: '解释要足够支撑结尾，但不能一次性掏空路鸣泽的神秘性。',
    },
    {
      number: 5,
      title: '诺诺的红发坐标',
      goal: '让诺诺线承担情感确认功能：她不只是奖赏或遗憾，而是路明非选择人间的坐标。',
      conflict: '诺诺拒绝被放在“被保护者”位置，要求知道路明非即将付出的真实代价。',
      characters: ['诺诺', '路明非', '恺撒'],
      plotLines: ['推进诺诺与路明非的情感确认/体面告别线', '维护恺撒的尊严与行动者位置'],
      foreshadowing: [pick(foreshadowing, 4), '以日常物件或旧日玩笑承接青春感，不扩写为正文'],
      emotionalTone: '温柔、别扭、带一点轻喜剧，随后迅速沉下去。',
      hook: '诺诺发现路明非正在忘记某个与她有关的细节。',
      risk: '不要把情感补偿处理成简单恋爱胜利；三人关系必须克制且有尊严。',
    },
    {
      number: 6,
      title: '白王的空位',
      goal: '把黑王/白王/龙王体系推进到终局结构：问题不是杀死某个王，而是终止单一王座。',
      conflict: '各方都想占据或利用空位，路明非必须拒绝成为新的绝对权力中心。',
      characters: ['路明非', '路鸣泽', '学院代表', '龙族残余势力'],
      plotLines: ['推进龙族王权重置线', pick(unresolved, 4)],
      foreshadowing: [pick(foreshadowing, 5), '埋下“王座必须空置或被拆解”的终局规则'],
      emotionalTone: '史诗感、规则揭示、冷静的恐惧。',
      hook: '众人发现所谓圆满结局要求路明非亲手放弃最能保护大家的力量。',
      risk: '世界观规则不能只靠口头说明；每个设定必须转化为后续选择压力。',
    },
    {
      number: 7,
      title: '第一次失败',
      goal: '安排中段失败，让 A 方案的圆满代价变得可信。',
      conflict: '主角团试图关闭残留尼伯龙根，却触发奥丁留下的反制，导致记忆、坐标或同伴状态受损。',
      characters: ['路明非', '楚子航', '诺诺', '恺撒', '路鸣泽'],
      plotLines: ['证明旧秩序不能被低成本修复', pick(unresolved, 0)],
      foreshadowing: [pick(foreshadowing, 0), '回收前文“能证明你是你”的代价信号'],
      emotionalTone: '急转直下、失败、沉默的自责。',
      hook: '路明非救回所有人，却短暂忘记自己为什么一定要救他们。',
      risk: '失败不能只是拖延篇幅，必须直接抬高终局代价。',
    },
    {
      number: 8,
      title: '被归还的青春',
      goal: '在终局前给主角团一次短暂日常，强化“要守护的普通生活”并准备最终选择。',
      conflict: '越接近日常，路明非越意识到自己可能无法完整拥有它。',
      characters: ['路明非', '诺诺', '楚子航', '恺撒', '芬格尔'],
      plotLines: ['推进迟来的普通生活主题', '让每个核心人物确认自己的终局职责'],
      foreshadowing: [pick(foreshadowing, 1), '用轻松段落反衬最终代价，避免直接写成正文场景'],
      emotionalTone: '青春喜剧余温、怀旧、笑完以后空下来。',
      hook: '路明非在最像普通人的一晚后，决定独自去见路鸣泽。',
      risk: '日常章不能停滞；必须为终局选择提供情感证据。',
    },
    {
      number: 9,
      title: '最后一次交易',
      goal: '明确最终代价：路明非以失去部分龙血力量、关键记忆或与路鸣泽的连接为价格，换取世界重置机会。',
      conflict: '路鸣泽试图承担全部代价，路明非拒绝再次让别人替他决定。',
      characters: ['路明非', '路鸣泽'],
      plotLines: ['闭合路鸣泽契约线', '确立路明非主动选择的英雄弧线'],
      foreshadowing: [pick(foreshadowing, 2), '回收“互相偿还”的伏笔，把交易改写为共同选择'],
      emotionalTone: '安静、悲伤、像兄弟告别又像自我和解。',
      hook: '交易完成后，路鸣泽把唯一的退路留给路明非，自己走向王座废墟。',
      risk: '不要写成完整告别正文；保持大纲级描述。',
    },
    {
      number: 10,
      title: '王座废墟上的守门人',
      goal: '进入终局行动，拆解旧王权结构并击破奥丁/尼伯龙根残余机制。',
      conflict: '每个人都必须承担不可替代的岗位，一旦有人试图救路明非，整体重置就会失败。',
      characters: ['路明非', '楚子航', '诺诺', '恺撒', '路鸣泽', '奥丁残影'],
      plotLines: ['完成奥丁线与王权重置线的高潮推进', pick(unresolved, 1)],
      foreshadowing: [pick(foreshadowing, 3), '回收奥丁门、缺席名单、王座空位等终局信号'],
      emotionalTone: '史诗、紧绷、牺牲前的清醒。',
      hook: '旧王权被拆开的一瞬间，路明非发现自己必须选择留下哪一部分自我。',
      risk: '高潮不能只堆设定名词；要把世界规则落到人物选择上。',
    },
    {
      number: 11,
      title: '圆满的缺口',
      goal: '完成代价兑现：世界获救，人物幸存，但路明非失去一部分力量、记忆或与路鸣泽的确定连接。',
      conflict: '所有人都想证明可以无损找回路明非缺失的部分，但新秩序要求承认不可逆代价。',
      characters: ['路明非', '诺诺', '楚子航', '恺撒', '学院幸存者'],
      plotLines: ['兑现 A 方案“圆满但有代价”', pick(unresolved, 2)],
      foreshadowing: [pick(foreshadowing, 4), '回收“迟来的普通生活”与“无法完整归还”的主题伏笔'],
      emotionalTone: '温柔、失落、克制的松一口气。',
      hook: '路明非醒来后记得所有人的名字，却想不起某个曾经一直叫他哥哥的人。',
      risk: '不要为了催泪而过度剥夺角色成果；圆满与缺口必须同时存在。',
    },
    {
      number: 12,
      title: '世界重启后的早晨',
      goal: '给出带伤圆满的尾声：世界进入新平衡，主角团获得生活可能，仍保留少量开放余韵。',
      conflict: '新秩序尚未永久稳定，人物必须带着缺失继续生活，而不是等一个彻底无痛的答案。',
      characters: ['路明非', '诺诺', '楚子航', '恺撒', '幸存者群像'],
      plotLines: ['收束主角团去向', '保留新平衡是否稳定的开放问题'],
      foreshadowing: [pick(foreshadowing, 5), '埋下未来余韵：某个微小信号暗示路鸣泽或旧神话仍有回声'],
      emotionalTone: '清晨感、克制希望、青春结束后的成熟。',
      hook: '最后留下一个轻微但不破坏闭合度的回声，提示世界仍有神秘但本轮结尾已完成。',
      risk: '尾声不能开启新主线；开放只做余韵，不逃避核心闭合。',
    },
  ];
}

function bulletList(items: string[]): string {
  return items.map((item) => `  - ${item}`).join('\n');
}

function renderChapter(chapter: ChapterOutline): string {
  return [
    `### 第 ${chapter.number.toString().padStart(2, '0')} 章：${chapter.title}`,
    '',
    `- **章节编号**：第 ${chapter.number.toString().padStart(2, '0')} 章`,
    `- **章节标题**：${chapter.title}`,
    `- **本章目标**：${chapter.goal}`,
    `- **主要冲突**：${chapter.conflict}`,
    `- **出场人物**：${chapter.characters.join('、')}`,
    '- **必须推进的剧情线**：',
    bulletList(chapter.plotLines),
    '- **必须回收或埋下的伏笔**：',
    bulletList(chapter.foreshadowing),
    `- **情绪基调**：${chapter.emotionalTone}`,
    `- **结尾钩子**：${chapter.hook}`,
    `- **风险提示**：${chapter.risk}`,
  ].join('\n');
}

function renderMarkdown(inputs: OutlineInput[], hasMock: boolean): string {
  const chapters = buildChapters(inputs, hasMock);
  const optionsContent = inputs.find((input) => input.label === '结尾方案')?.content ?? '';
  const mockNotice = hasMock
    ? '> **当前为 mock 分析基础上的结尾大纲，仅用于流程验证，不代表最终内容。**\n\n'
    : '';

  return [
    '# 《龙族》结尾章节大纲 v0',
    '',
    mockNotice.trimEnd(),
    '## 生成边界',
    '',
    '- 默认选择 A 方案：圆满但有代价。',
    '- 本文件只生成 12 章结尾大纲，不生成章节正文。',
    '- 本文件不输出大段原文。',
    '- 后续仍需进行故事一致性、伏笔回收和风格一致性复核，再进入场景纲或正文阶段。',
    '',
    '## 输入依据',
    '',
    ...inputs.map((input) => `- ${input.label}：\`${relativePath(input.path)}\``),
    '',
    '## 选用方案摘要',
    '',
    getAPlanSummary(optionsContent),
    '',
    '## 12 章结构总览',
    '',
    '| 章节 | 标题 | 本章目标 | 情绪基调 | 结尾钩子 |',
    '| --- | --- | --- | --- | --- |',
    ...chapters.map((chapter) => `| 第 ${chapter.number.toString().padStart(2, '0')} 章 | ${chapter.title} | ${chapter.goal} | ${chapter.emotionalTone} | ${chapter.hook} |`),
    '',
    '## 章节级大纲',
    '',
    ...chapters.map(renderChapter).join('\n\n').split('\n'),
    '',
    '## 检查清单',
    '',
    '- [ ] 已确认本文件只包含章纲，不包含章节正文。',
    '- [ ] 已逐章标注主要冲突、推进线、伏笔、情绪和风险。',
    '- [ ] 已确认 A 方案的圆满需要付出不可逆代价。',
    '- [ ] 已在正式分析替换 mock 内容前，将本章纲视为流程验证版本。',
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
