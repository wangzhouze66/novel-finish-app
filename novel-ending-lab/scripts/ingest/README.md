# ingest 语料读取脚本

本目录存放第一版语料读取与索引脚本。

## 当前脚本

```bash
npm run corpus:index
```

该命令会扫描：

- `novel-ending-lab/raw_corpus/target_novel/`
- `novel-ending-lab/raw_corpus/author_corpus/`
- `novel-ending-lab/raw_corpus/literary_references/`

并生成：

- `novel-ending-lab/analysis/corpus_index.md`

## 第一版边界

- 支持识别 `.txt`、`.md`、`.pdf`、`.epub`、`.docx`。
- 忽略目录说明用的 `README.md`，避免把占位说明当作小说语料。
- 只统计文件名、路径、扩展名、文件大小、所属目录分类。
- 仅对 `.txt` 和 `.md` 统计字符数。
- 不分析正文。
- 不生成小说正文。
- `raw_corpus/` 为空时也会正常生成索引提示。
