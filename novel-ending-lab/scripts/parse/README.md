# parse scripts

本目录存放目标小说语料的拆分脚本。

## `split_chapters.ts`

运行：

```bash
npm run corpus:split
```

脚本行为：

1. 递归读取 `novel-ending-lab/raw_corpus/target_novel/` 下的 `.txt` 和 `.md` 文件。
2. 按章节标题拆分文本，支持示例：`第1章`、`第01章`、`第一章`、`第1幕`、`序章`、`楔子`、`尾声`、`后记`、`正文`、`Chapter 1`。
3. 将拆分后的章节写入 `novel-ending-lab/parsed/target_chapters/`。
4. 生成 `chapters_index.md`，记录章节序号、标题、来源文件、字符数和输出文件。
5. 如果某个源文件没有识别到章节标题，则按约 8000-12000 字进行固定长度分块。

边界：脚本只做机械拆分与索引，不分析正文，也不生成小说正文。
