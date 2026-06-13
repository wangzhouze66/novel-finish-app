import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface CorpusRecord {
  category: 'target_novel' | 'author_corpus' | 'literary_references';
  filePath: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
  characterCount: number | null;
  sample: string;
}

interface ModelConfig {
  provider: 'openai' | 'deepseek' | 'mock';
  apiKey?: string;
  baseURL?: string;
  model?: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(labRoot, '..');
const rawCorpusRoot = path.join(labRoot, 'raw_corpus');
const analysisDir = path.join(labRoot, 'analysis');
const endingDir = path.join(labRoot, 'output/dragon_ending');
const generatedChaptersDir = path.join(endingDir, 'generated_chapters');
const outputPath = path.join(generatedChaptersDir, 'chapter_001_real_test.md');

const categories = ['target_novel', 'author_corpus', 'literary_references'] as const;
const requiredBasisFiles = [
  path.join(analysisDir, 'dragon_story_bible.md'),
  path.join(analysisDir, 'dragon_unresolved_threads.md'),
  path.join(analysisDir, 'dragon_foreshadowing.md'),
  path.join(analysisDir, 'dragon_ending_rules.md'),
  path.join(analysisDir, 'author_style_profile.md'),
  path.join(endingDir, 'ending_outline.md'),
];

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function relativePath(filePath: string): string {
  return toPosixPath(path.relative(repoRoot, filePath));
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function truncateByChars(value: string, maxChars: number): string {
  return Array.from(value).slice(0, maxChars).join('');
}

function isPlainText(extension: string): boolean {
  return ['.txt', '.md'].includes(extension);
}

async function collectFiles(directoryPath: string): Promise<string[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) return collectFiles(entryPath);
    if (entry.isFile()) return [entryPath];
    return [];
  }));
  return nested.flat();
}

async function scanRawCorpus(): Promise<CorpusRecord[]> {
  const allRecords: CorpusRecord[] = [];
  for (const category of categories) {
    const categoryDir = path.join(rawCorpusRoot, category);
    const files = await collectFiles(categoryDir);
    for (const filePath of files) {
      const extension = path.extname(filePath).toLowerCase();
      const stats = await stat(filePath);
      let characterCount: number | null = null;
      let sample = '';
      if (isPlainText(extension)) {
        const content = await readFile(filePath, 'utf8');
        characterCount = Array.from(content).length;
        sample = truncateByChars(normalizeText(content), 900);
      }
      allRecords.push({
        category,
        filePath,
        relativePath: relativePath(filePath),
        extension,
        sizeBytes: stats.size,
        characterCount,
        sample,
      });
    }
  }
  return allRecords.sort((a, b) => a.category.localeCompare(b.category) || a.relativePath.localeCompare(b.relativePath));
}

function getModelConfig(): ModelConfig {
  const provider = process.env.MODEL_PROVIDER?.toLowerCase();
  if (provider === 'deepseek') {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    return apiKey
      ? { provider: 'deepseek', apiKey, baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com', model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash' }
      : { provider: 'mock' };
  }
  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    return apiKey
      ? { provider: 'openai', apiKey, baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1', model: process.env.OPENAI_MODEL || 'gpt-4.1-mini' }
      : { provider: 'mock' };
  }
  return { provider: 'mock' };
}

async function callChat(config: ModelConfig, messages: Array<{ role: 'system' | 'user'; content: string }>): Promise<string | null> {
  if (config.provider === 'mock' || !config.apiKey || !config.baseURL || !config.model) return null;
  const response = await fetch(`${config.baseURL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({ model: config.model, messages, temperature: 0.6 }),
  });
  if (!response.ok) throw new Error(`Model request failed: ${response.status} ${await response.text()}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() || null;
}

function buildCorpusIndex(records: CorpusRecord[]): string {
  return [
    '# 真实样章测试语料扫描', '',
    '> 本节由 `npm run sample:chapter` 扫描 `raw_corpus/` 自动生成。只记录文件级信息和短样本摘要，不输出原文大段内容。', '',
    '## 扫描范围', '',
    '- `raw_corpus/target_novel/`', '- `raw_corpus/author_corpus/`', '- `raw_corpus/literary_references/`', '',
    '## 文件清单', '',
    '| 分类 | 路径 | 扩展名 | 字节数 | 字符数 |', '| --- | --- | --- | --- | --- |',
    ...records.map((r) => `| ${r.category} | \`${r.relativePath}\` | ${r.extension || '无'} | ${r.sizeBytes} | ${r.characterCount ?? '不适用'} |`), '',
  ].join('\n');
}

function buildMockStyleProfile(records: CorpusRecord[]): string {
  const authorFiles = records.filter((r) => r.category === 'author_corpus');
  return [
    '# 作者风格轮廓：真实样章测试版', '',
    '> **当前为轻量结构分析，不直接模仿原句。** 本文件只提取叙事结构、情绪功能和文本机制，用于生成测试样章；禁止复刻语料中的具体句子、段落和可识别表达。', '',
    '## 来源概况', '',
    `- 已扫描作者参考文件：${authorFiles.length} 个。`,
    ...authorFiles.map((r) => `- \`${r.relativePath}\`：${r.characterCount ?? '非纯文本'} 字符。`), '',
    '## 主题母题', '',
    '- 青春被宏大历史突然征召，普通愿望与世界级灾难并置。',
    '- 个体常在迟到、错过、失去之后才理解自己真正想守护什么。',
    '- “家园/学院/城市/战场”可作为失乐园结构：先制造可爱日常，再让日常承担代价。', '',
    '## 人物类型', '',
    '- 自嘲型少年主角：表面低姿态，关键时刻承担超出自我认知的责任。',
    '- 光芒型同伴：骄傲、优秀、带行动力，为群像提供速度与体面。',
    '- 沉默型战友：以纪律、伤痕和未说出口的执念推动悲剧线。',
    '- 远方型女性角色：既是情感坐标，也是主角选择人间的理由，不宜写成奖励。', '',
    '## 青春叙事机制', '',
    '- 用玩笑、校园细节、队友互损降低入口门槛，再让轻松场景被危机反向照亮。',
    '- 青春不是纯甜味，而是“还没来得及正式长大就被迫告别”。', '',
    '## 悲剧机制', '',
    '- 悲剧来自选择成本：拯救并不取消失去，只把失去转换为记忆、关系、力量或身份的缺口。',
    '- 情绪表达应克制，避免长篇哭诉，用沉默、错位玩笑和行动后的空白制造余震。', '',
    '## 英雄模型', '',
    '- 英雄不是天然王者，而是在知道自己会失去什么后仍选择承担的人。',
    '- 终局英雄感应绑定“拒绝绝对王座”，强调选择权而非血统爽感。', '',
    '## 群像关系', '',
    '- 群像需要分工：有人推进情报，有人承担行动，有人提供情感坐标，有人守住玩笑和日常。',
    '- 重要关系应通过任务协作和小动作呈现，而不是解释性独白。', '',
    '## 战争/世界危机叙事', '',
    '- 世界危机要落到具体空间：雨后的指挥室、名单、坐标、伤亡、沉默的幸存者。',
    '- 战争场面服务“普通生活是否还能回来”的问题，不只追求场面升级。', '',
    '## 感情线处理方式', '',
    '- 感情线以克制、错过、别扭关心为主，避免直接兑现成圆满奖励。',
    '- 角色间的亲密可藏在短句、停顿、递水、替对方遮掩脆弱等功能动作里。', '',
    '## 语言节奏特征', '',
    '- 节奏宜在轻快对白、短促行动句和带余味的抒情段之间切换。',
    '- 意象可围绕雨、灯、名单、旧校园、城市天光、废墟和少年时代的残响展开。', '',
    '## 禁止项', '',
    '- 不允许直接模仿或搬运语料原句。',
    '- 不输出原文大段内容。',
    '- 不声称测试样章是官方结局。', '',
  ].join('\n');
}

async function writeAnalysisFiles(records: CorpusRecord[], config: ModelConfig): Promise<void> {
  await mkdir(analysisDir, { recursive: true });
  const profilePrompt = `请基于以下作者参考语料清单和短样本，生成中文作者风格轮廓。只提取结构和功能，禁止模仿原句。必须包含：主题母题、人物类型、青春叙事机制、悲剧机制、英雄模型、群像关系、战争/世界危机叙事、感情线处理方式、语言节奏特征、不允许直接模仿原句。\n\n${JSON.stringify(records.filter(r => r.category === 'author_corpus').map(r => ({ path: r.relativePath, chars: r.characterCount, sample: r.sample })), null, 2)}`;
  const modelProfile = await callChat(config, [
    { role: 'system', content: '你是私人小说结尾实验的结构分析助手。不要输出原文句子，不要模仿具体表达，只总结结构、功能和约束。' },
    { role: 'user', content: profilePrompt },
  ]);
  await writeFile(path.join(analysisDir, 'author_style_profile.md'), modelProfile || buildMockStyleProfile(records), 'utf8');

  const integrationBlock = [
    '', '## 真实样章测试整合记录', '',
    '- 已由 `npm run sample:chapter` 扫描 `raw_corpus/target_novel/`、`raw_corpus/author_corpus/`、`raw_corpus/literary_references/`。',
    '- 本轮只支持测试样章，不生成完整结局或 12 章正文。',
    '- 若未配置模型 API，本节为 mock 流程标记；正式分析仍需人工复核目标小说摘要、未解线索、伏笔和结尾规则。',
    '- 样章生成必须同时读取故事圣经、未解线索、伏笔、结尾规则、作者风格轮廓和结尾大纲。', '',
  ].join('\n');

  for (const filePath of requiredBasisFiles.slice(0, 4)) {
    let existing = await readFile(filePath, 'utf8').catch(() => `# ${path.basename(filePath, '.md')}\n`);
    existing = existing.replace(/\n## 真实样章测试整合记录[\s\S]*?(?=\n## |$)/, '');
    await writeFile(filePath, `${existing.trimEnd()}${integrationBlock}`, 'utf8');
  }
  await writeFile(path.join(analysisDir, 'corpus_index.md'), buildCorpusIndex(records), 'utf8');
}

async function loadBasis(): Promise<string> {
  const parts = await Promise.all(requiredBasisFiles.map(async (filePath) => `## ${relativePath(filePath)}\n\n${await readFile(filePath, 'utf8')}`));
  return parts.join('\n\n---\n\n');
}

function buildMockChapter(basisPaths: string[]): string {
  return [
    '# 第 001 章真实样章测试：雨后的临时同盟', '',
    '> **当前为 mock 样章。** 因未配置可用 API key，本文件由本地脚本生成，仅用于验证真实样章测试流程；不是官方结局，不代表最终创作方案。', '',
    '## 生成依据', '',
    ...basisPaths.map((p) => `- \`${p}\``), '',
    '## 样章正文（1 节测试稿）', '',
    '雨停在凌晨四点十七分。', '',
    '临时指挥室的窗玻璃上全是水痕，像有人用透明的刀把夜色一条一条划开。路明非坐在最靠门的位置，手里捧着一杯早就不烫的速溶咖啡。他本来想说点什么缓和气氛，比如这咖啡味道像装备部拿机油勾兑的失败样品，可会议桌两侧的人都太安静，安静得像一排刚从战场上撤下来的石像。于是他把笑话咽了回去，只低头看纸杯边缘被自己捏出的褶皱。', '',
    '恺撒站在投影幕前，金发被应急灯照得有点暗。他没有穿那套像广告海报一样拉风的礼服，袖口卷到小臂，手背上贴着临时止血贴，看起来仍然像一个会在废墟里要求侍者把红酒醒够时间的人。楚子航坐在他左侧，面前摊着三份名单：确认生还、确认失踪、确认无法确认。最后一份名单最长，长到没人愿意念出声。', '',
    '诺诺靠着窗，红发还没完全干。她看了路明非一眼，忽然说：“别把纸杯捏爆了，主席团现在穷得只剩纸杯和坏消息了。”', '',
    '路明非愣了一下，条件反射地松手：“师姐，这种时候你还关心后勤预算啊？”', '',
    '“不然关心你吗？”诺诺挑眉，“你看起来像马上要发表遗言，我怕你开头第一句是‘大家吃好喝好’。”', '',
    '有人很轻地笑了一声。笑声只持续了半秒，像火柴在雨后的空气里亮了一下，又立刻熄灭。路明非也想笑，可他的喉咙被什么东西堵住了。他知道诺诺是在帮他，把所有人的目光从审判台上拉下来，拉回到他们还像学生、像队友、像一群可以互相吐槽的倒霉蛋的时候。', '',
    '投影幕亮起，世界地图上布满红点。那些红点不再只是任务坐标，而像一颗颗没能闭上的眼睛。学院、家族、执行部、幸存的混血种据点都在等待答案：龙王体系是否真的进入终局？尼伯龙根残留会不会继续扩散？奥丁留下的门是否已经关闭？还有，路明非到底在最后一次交易里答应了什么？', '',
    '“我们需要确定一件事。”恺撒说，“这不是胜利游行。各方都想把你推到台前，让你给出一个足够漂亮的结论。但如果结论是假的，下一次世界危机就会从这句假话里长出来。”', '',
    '路明非点点头。他以前最怕别人让他做选择，因为选择听起来像考试最后一道大题，而他永远没复习。可现在他忽然明白，不选择也是一种选择，是把方向盘交给命运、交给血统、交给那些藏在黑暗里的旧王座。', '',
    '“我不会当新的王。”他说。声音不大，却让会议室里所有键盘声都停了下来，“也不会让谁替我付账。如果世界要活下去，就不能靠另一个怪物坐上去压住所有怪物。”', '',
    '楚子航抬眼看他。那眼神仍然冷静，却不像从前那样只是一把刀。刀背上也会留下雨水。', '',
    '“代价呢？”楚子航问。', '',
    '路明非沉默了几秒。他想说自己已经习惯赔本买卖，想说反正他这种人从小到大也没攒下多少值得拿走的东西。但诺诺还站在窗边，恺撒还在等他的答案，楚子航的名单上还有那么多名字。于是他没有开玩笑。', '',
    '“我还不知道。”他说，“但这次我想先把规则问清楚。以前我总觉得只要能救人，签什么都行。现在不行了。我要救世界，也要尽量把你们带回来。要是有人非要收走什么，至少得让我知道他拿走的是哪一部分的我。”', '',
    '窗外传来很轻的脚步声。明明门没有开，雨水也已经停了，房间里却忽然多了一点潮湿的冷意。路明非不用回头也知道是谁来了。', '',
    '少年模样的路鸣泽坐在窗台上，黑色小西装一尘不染，像刚从某个不会下雨的童话里逃出来。他晃了晃腿，笑容礼貌得过分。', '',
    '“哥哥，你终于学会先看合同了。”', '',
    '恺撒的手已经按在枪套上，楚子航的目光落向村雨。诺诺没有动，只是看着路明非，好像把决定权完整地还给了他。', '',
    '路明非站起来。他发现自己没有发抖，这件事让他有点意外。', '',
    '“那你说吧。”他说，“这次又要四分之一生命？还是更贵？”', '',
    '路鸣泽笑了笑。那笑里没有胜利者的得意，反倒像一个终于等到散场铃声的孩子。他望向投影幕上那些红点，声音轻得几乎要被清晨前最后一点风吹散。', '',
    '“这次不是生命。”他说，“生命太便宜了，哥哥。你已经用它付过很多次账。”', '',
    '路明非忽然觉得房间更冷。', '',
    '“这次要交还的，”路鸣泽说，“是某个能证明你还是你的东西。”', '',
    '天边隐约发白，可太阳还没有升起来。所有人都看着路明非，像看着一扇还没决定通向早晨还是废墟的门。', '',
  ].join('\n');
}

async function generateChapter(config: ModelConfig, basis: string): Promise<string> {
  const prompt = `请基于以下输入生成一个中文真实样章测试稿。要求：只生成1节，1500-2500中文字符；不直接复制原文句子；不输出原文大段内容；不要声称是官方结局；保持青春幻想、宿命感、群像感、悲剧感和世界危机感；可读。必须明确这是私人测试样章。\n\n${truncateByChars(basis, 18000)}`;
  const result = await callChat(config, [
    { role: 'system', content: '你是小说结尾实验助手。遵守版权边界：不得复刻原文句子、不得输出大段原文、不得声称官方结局。' },
    { role: 'user', content: prompt },
  ]);
  return result || buildMockChapter(requiredBasisFiles.map(relativePath));
}

async function main(): Promise<void> {
  const config = getModelConfig();
  const records = await scanRawCorpus();
  await writeAnalysisFiles(records, config);
  const basis = await loadBasis();
  await mkdir(generatedChaptersDir, { recursive: true });
  const chapter = await generateChapter(config, basis);
  await writeFile(outputPath, chapter, 'utf8');
  console.log(`MODEL_PROVIDER=${config.provider}`);
  console.log(`Scanned ${records.length} raw corpus file(s).`);
  console.log(`Generated ${relativePath(outputPath)}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
