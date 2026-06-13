# 02 生成《龙族》多结局方案 Prompt

## 使用目的

读取以下四类分析文件后，只生成结局路线方案，不生成章节正文：

1. `novel-ending-lab/analysis/dragon_story_bible.md`
2. `novel-ending-lab/analysis/dragon_unresolved_threads.md`
3. `novel-ending-lab/analysis/dragon_foreshadowing.md`
4. `novel-ending-lab/analysis/dragon_ending_rules.md`

输出文件：`novel-ending-lab/output/dragon_ending/ending_options.md`

## 工作流边界

- 必须先生成多个结尾方案，再进入比较、混合、卷纲、章纲、场景纲和正文阶段。
- 本阶段不生成章节正文。
- 本阶段不输出大段原文。
- 如输入分析仍包含 mock 标记，必须在输出顶部写明：
  > 当前为 mock 分析基础上的结局方案，仅用于流程验证，不代表最终内容。

## 必须生成的方案

至少生成 4 个方案：

- A：圆满但有代价
- B：宿命悲剧版
- C：开放式终局版
- D：黑暗牺牲版

## 每个方案必须包含

- 核心主题
- 路明非结局
- 路鸣泽线处理
- 楚子航线处理
- 诺诺线处理
- 恺撒线处理
- 奥丁线处理
- 黑王/白王/龙王世界观终局
- 必须回收的伏笔
- 保留开放的问题
- 情绪基调
- 风险点
- 推荐指数

## 中文输出要求

请使用清晰 Markdown 结构输出中文方案。每个方案应保持大纲级、清单级表达，避免扩写成小说场景或对白。
