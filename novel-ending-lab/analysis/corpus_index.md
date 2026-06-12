# 语料索引

> 生成时间：2026-06-12T15:06:46.014Z

本文件由 `npm run corpus:index` 自动生成，用于记录 `novel-ending-lab/raw_corpus/` 下的本地语料文件清单。

## 扫描范围

- `raw_corpus/target_novel/`：当前目标小说。
- `raw_corpus/author_corpus/`：同作者作品或作者相关参考文本。
- `raw_corpus/literary_references/`：文学参考文本。

## 第一版处理边界

- 递归列出三个分类目录中的所有普通文件。
- 统计文件名、文件路径、扩展名、文件大小、所属目录分类。
- 仅读取 `.txt` 和 `.md` 用于字符数统计；其他格式字符数标记为不适用。
- 不分析正文。
- 不生成小说正文。

## 扫描结果

共发现 12 个文件。

| 分类 | 文件名 | 路径 | 扩展名 | 文件大小 | 字符数 |
| --- | --- | --- | --- | --- | --- |
| author_corpus | 《九州·缥缈录》(6卷全)_qinkan.net.txt | `raw_corpus/author_corpus/《九州·缥缈录》(6卷全)_qinkan.net.txt` | .txt | 2.30 MB | 1942994 |
| author_corpus | 1464.epub.zip | `raw_corpus/author_corpus/1464.epub.zip` | .zip | 272.33 KB | 不适用 |
| author_corpus | 542817.zip | `raw_corpus/author_corpus/542817.zip` | .zip | 739.03 KB | 不适用 |
| author_corpus | README.md | `raw_corpus/author_corpus/README.md` | .md | 203 B | 81 |
| author_corpus | 上海堡垒.txt | `raw_corpus/author_corpus/上海堡垒.txt` | .txt | 232.07 KB | 195022 |
| author_corpus | 此间的少年Ⅰ.txt | `raw_corpus/author_corpus/此间的少年Ⅰ.txt` | .txt | 302.06 KB | 248424 |
| literary_references | README.md | `raw_corpus/literary_references/README.md` | .md | 200 B | 86 |
| target_novel | pack.zip | `raw_corpus/target_novel/pack.zip` | .zip | 4.54 MB | 不适用 |
| target_novel | README.md | `raw_corpus/target_novel/README.md` | .md | 268 B | 124 |
| target_novel | txt80.com龙族5悼亡者归来.txt | `raw_corpus/target_novel/txt80.com龙族5悼亡者归来.txt` | .txt | 1.51 MB | 1285118 |
| target_novel | 龙族全套[共七册][江南].mobi | `raw_corpus/target_novel/龙族全套[共七册][江南].mobi` | .mobi | 0 B | 不适用 |
| target_novel | 龙王：世界的重启.txt | `raw_corpus/target_novel/龙王：世界的重启.txt` | .txt | 856.16 KB | 701257 |
