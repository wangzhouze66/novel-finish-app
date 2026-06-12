# 语料索引

> 生成时间：2026-06-12T12:09:03.809Z

本文件由 `npm run corpus:index` 自动生成，用于记录 `novel-ending-lab/raw_corpus/` 下的本地语料文件清单。

## 扫描范围

- `raw_corpus/target_novel/`：当前目标小说。
- `raw_corpus/author_corpus/`：同作者作品或作者相关参考文本。
- `raw_corpus/literary_references/`：文学参考文本。

## 第一版处理边界

- 只识别 `.txt`、`.md`、`.pdf`、`.epub`、`.docx` 文件。
- 忽略目录说明用的 `README.md`，避免把占位说明当作小说语料。
- 只统计文件名、文件路径、扩展名、文件大小、所属目录分类。
- 仅对 `.txt` 和 `.md` 统计字符数。
- 不分析正文。
- 不生成小说正文。

## 扫描结果

未发现可索引语料文件。请将 `.txt`、`.md`、`.pdf`、`.epub` 或 `.docx` 文件放入 `raw_corpus/target_novel/`、`raw_corpus/author_corpus/` 或 `raw_corpus/literary_references/` 后重新运行。
