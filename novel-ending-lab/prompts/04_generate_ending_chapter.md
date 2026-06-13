# 04 生成《龙族》结尾第 1 章样章 Prompt

## 使用目的

读取以下五类文件后，只生成结尾章节正文系统的第 1 章样章：

1. `novel-ending-lab/output/dragon_ending/ending_outline.md`
2. `novel-ending-lab/analysis/dragon_story_bible.md`
3. `novel-ending-lab/analysis/dragon_unresolved_threads.md`
4. `novel-ending-lab/analysis/dragon_foreshadowing.md`
5. `novel-ending-lab/analysis/dragon_ending_rules.md`

输出文件：`novel-ending-lab/output/dragon_ending/generated_chapters/chapter_001_draft.md`

## 工作流边界

- 第一版只生成第 1 章样章，不生成第 2-12 章。
- 本阶段用于验证“章纲 → 生成依据 → 样章正文”的流程，不追求最终文学质量。
- 不输出或复刻原文；正文必须是基于章纲和分析文件的 mock 草稿。
- 如输入分析仍包含 mock 标记，必须在输出顶部写明：
  > 当前为 mock 分析基础上的样章，仅用于流程验证，不代表最终内容。

## 章节正文前必须写“生成依据”

生成依据必须包含：

- 使用的结尾方案
- 使用的大纲章节
- 关键人物
- 本章目标
- 必须推进的剧情线

## 第 1 章样章要求

- 使用 `ending_outline.md` 中“第 01 章”的章节标题、目标、人物、剧情线、情绪基调与结尾钩子。
- 正文可以短小、清晰、占位感明确；重点是验证章节生成系统结构。
- 保持中文 Markdown 输出。
- 避免一次性解释所有谜底；只推进第 1 章应承担的方向。
- 不写成长篇最终章节，不扩展为 12 章正文。
