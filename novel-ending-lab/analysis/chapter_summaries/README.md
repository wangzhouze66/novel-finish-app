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

## 模型供应商选择

脚本通过 `MODEL_PROVIDER` 选择模型供应商：

```bash
MODEL_PROVIDER=openai
# 或
MODEL_PROVIDER=deepseek
```

支持的环境变量：

- `MODEL_PROVIDER`：可选值为 `openai` 或 `deepseek`。
- `OPENAI_API_KEY`：OpenAI API key。
- `OPENAI_MODEL`：OpenAI 模型名，默认 `gpt-4o-mini`。
- `DEEPSEEK_API_KEY`：DeepSeek API key。
- `DEEPSEEK_MODEL`：DeepSeek 模型名，默认 `deepseek-v4-flash`。
- `DEEPSEEK_BASE_URL`：DeepSeek OpenAI SDK 兼容接口地址，默认 `https://api.deepseek.com`。

脚本不会输出 API key，也不会把 API key 写入摘要或错误日志。

## OpenAI 配置

使用 OpenAI 时：

```bash
export MODEL_PROVIDER=openai
export OPENAI_API_KEY="你的 OpenAI API Key"
export OPENAI_MODEL="gpt-4o-mini" # 可选
npm run chapters:summarize
```

规则：

- 当 `MODEL_PROVIDER=openai` 时，必须设置 `OPENAI_API_KEY`。
- 如果显式设置了 `MODEL_PROVIDER=openai` 但缺少 `OPENAI_API_KEY`，脚本会明确报错，不会静默进入 mock 模式。
- 如果没有设置 `MODEL_PROVIDER`，但设置了 `OPENAI_API_KEY`，脚本会默认使用 OpenAI。

## DeepSeek 配置

DeepSeek 使用 OpenAI SDK 兼容格式调用：

```bash
export MODEL_PROVIDER=deepseek
export DEEPSEEK_API_KEY="你的 DeepSeek API Key"
export DEEPSEEK_MODEL="deepseek-v4-flash" # 可选，默认 deepseek-v4-flash
export DEEPSEEK_BASE_URL="https://api.deepseek.com" # 可选，默认 https://api.deepseek.com
npm run chapters:summarize
```

规则：

- 当 `MODEL_PROVIDER=deepseek` 时，必须设置 `DEEPSEEK_API_KEY`。
- 如果显式设置了 `MODEL_PROVIDER=deepseek` 但缺少 `DEEPSEEK_API_KEY`，脚本会明确报错，不会静默进入 mock 模式。
- 如果没有设置 `MODEL_PROVIDER`，没有 `OPENAI_API_KEY`，但设置了 `DEEPSEEK_API_KEY`，脚本会默认使用 DeepSeek。
- DeepSeek 默认接口地址为 `https://api.deepseek.com`，请求路径为 `/v1/chat/completions`。

## Mock 模式

只有在没有配置任何模型供应商 key 时，脚本才允许 mock 模式：

```bash
unset MODEL_PROVIDER
unset OPENAI_API_KEY
unset DEEPSEEK_API_KEY
npm run chapters:summarize
```

mock 模式只生成用于验证路径、断点续跑和 JSON 字段的占位摘要，不会真实调用 API。

## 输出规则

- 默认只处理前 10 章，避免一次性输出过大或产生过高成本。
- 每章输出一个 JSON 文件，文件名格式为 `001_summary.json`。
- 真实模型模式下，已存在的 JSON 文件会被跳过，支持断点续跑，也能避免重复调用 API。
- mock 模式下，脚本会生成或更新 mock JSON，用于验证流程、路径和文件格式。
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
