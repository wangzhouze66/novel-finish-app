# 03 生成《龙族》结尾章节大纲 Prompt

## 使用目的

读取以下五类文件后，默认选择 A 方案“圆满但有代价”，生成 12 章结尾章节大纲：

1. `novel-ending-lab/output/dragon_ending/ending_options.md`
2. `novel-ending-lab/analysis/dragon_story_bible.md`
3. `novel-ending-lab/analysis/dragon_unresolved_threads.md`
4. `novel-ending-lab/analysis/dragon_foreshadowing.md`
5. `novel-ending-lab/analysis/dragon_ending_rules.md`

输出文件：`novel-ending-lab/output/dragon_ending/ending_outline.md`

## 工作流边界

- 本阶段只生成章节级大纲，不生成章节正文。
- 本阶段不输出大段原文。
- 默认选择 A 方案：圆满但有代价。
- 必须生成 12 章结尾大纲。
- 如输入分析仍包含 mock 标记，必须在输出顶部写明：
  > 当前为 mock 分析基础上的结尾大纲，仅用于流程验证，不代表最终内容。

## 每章必须包含

- 章节编号
- 章节标题
- 本章目标
- 主要冲突
- 出场人物
- 必须推进的剧情线
- 必须回收或埋下的伏笔
- 情绪基调
- 结尾钩子
- 风险提示

## 结构建议

12 章应遵循“确认代价 → 汇合线索 → 揭示机制 → 中段失败 → 选择牺牲 → 终局执行 → 带伤圆满”的递进：

1. 确认 A 方案的情感承诺与终局代价。
2. 重新聚拢主角团，明确每个人在终局中的职责。
3. 逐步收束奥丁、路鸣泽契约、龙王/黑王/白王结构、学院与混血种秩序等核心线。
4. 在高潮前安排一次失败或反转，避免圆满显得廉价。
5. 以路明非主动选择代价完成世界拯救，而不是被动献祭。
6. 结尾保留余韵：世界获救，人物获得迟来的生活可能，但青春、记忆、力量或关系必须付出不可逆成本。

## 中文输出要求

请使用清晰 Markdown 结构输出中文章纲。每章保持大纲级、清单级表达，避免扩写成小说场景、对白或完整段落正文。
