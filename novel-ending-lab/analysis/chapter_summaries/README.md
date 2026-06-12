# Chapter Summaries

本目录存放由 `npm run chapters:summarize` 生成的章节结构化摘要。

## 数据来源

摘要脚本读取：

1. `novel-ending-lab/parsed/target_chapters/chapters_index.md` 中的章节索引、来源文件、起始位置和结束位置。
2. `novel-ending-lab/raw_corpus/target_novel/` 中的原始小说文本。

`parsed/target_chapters/` 默认只保存少量样例章节，不保存完整正文；因此摘要脚本会根据索引回到原始文本中截取对应章节内容。

## 输出规则

- 第一版默认只处理前 10 章，避免一次性输出过大。
- 每章输出一个 JSON 文件，文件名格式为 `001_summary.json`。
- 已存在的 JSON 文件会被跳过，支持断点续跑。
- 没有 `OPENAI_API_KEY` 时，脚本会生成 mock JSON，用于验证流程、路径和文件格式。
- 摘要文件只保存结构化分析，不保存大段原文，也不生成小说正文。

## JSON 字段

每个摘要文件包含以下字段：

1. `chapter_title`
2. `chapter_summary`
3. `important_events`
4. `characters_appeared`
5. `character_changes`
6. `worldbuilding_info`
7. `new_clues`
8. `unresolved_threads`
9. `foreshadowing`
10. `emotional_tone`
11. `style_notes`
12. `ending_hook`
