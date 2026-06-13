# Chapter Summaries

本目录存放由 `npm run chapters:summarize` 生成的章节结构化摘要。

## 数据来源

摘要脚本读取：

1. `novel-ending-lab/parsed/target_chapters/chapters_index.md` 中的章节索引、来源文件、起始位置和结束位置。
2. `novel-ending-lab/raw_corpus/target_novel/` 中的原始小说文本。
3. `novel-ending-lab/prompts/01_summarize_chapter.md` 中的结构化摘要提示词。

`parsed/target_chapters/` 默认只保存少量样例章节，不保存完整正文；因此摘要脚本会根据索引回到原始文本中截取对应章节内容。

## 运行方式

默认命令：

```bash
npm run chapters:summarize
```

默认只处理前 10 章，避免一次性消耗过多 API 成本。如需本地调整数量，可以设置：

```bash
CHAPTER_SUMMARY_LIMIT=3 npm run chapters:summarize
```

## OpenAI API 设置

脚本使用环境变量 `OPENAI_API_KEY`：

```bash
export OPENAI_API_KEY="你的 OpenAI API Key"
npm run chapters:summarize
```

可选环境变量：

```bash
OPENAI_MODEL=gpt-4o-mini npm run chapters:summarize
```

- 如果 `OPENAI_API_KEY` 存在，脚本会调用 OpenAI API 生成真实结构化摘要。
- 如果 `OPENAI_API_KEY` 不存在，脚本会保留 mock 模式，只生成用于验证路径、断点续跑和 JSON 字段的 mock 摘要。
- 已存在的摘要 JSON 会被跳过，因此可以断点续跑，也能避免重复调用 API。

## 输出规则

- 默认只处理前 10 章，避免一次性输出过大或产生过高成本。
- 每章输出一个 JSON 文件，文件名格式为 `001_summary.json`。
- 已存在的 JSON 文件会被跳过，支持断点续跑。
- 没有 `OPENAI_API_KEY` 时，脚本会生成 mock JSON，用于验证流程、路径和文件格式。
- 有 `OPENAI_API_KEY` 时，脚本读取章节索引和原始文本，调用 OpenAI API 生成真实摘要。
- 摘要文件只保存结构化分析，不保存大段原文，也不生成小说正文。
- 如果 API 请求失败、返回空内容、或返回内容无法解析为 JSON，脚本会在 `errors/` 目录保存错误日志；错误日志不会写入 `chapter_text`。

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
