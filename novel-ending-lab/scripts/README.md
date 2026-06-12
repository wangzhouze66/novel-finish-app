# scripts 脚本目录

本目录用于存放小说完结实验 App 的本地读取、拆分、索引和分析脚本。

## 当前脚本

| 目录 | 用途 |
| --- | --- |
| `ingest/` | 第一版语料读取与索引脚本。 |

## 运行语料索引

```bash
npm run corpus:index
```

该命令扫描 `novel-ending-lab/raw_corpus/` 下的三个语料分类目录，并生成 `novel-ending-lab/analysis/corpus_index.md`。

## 脚本边界

- 第一版只建立文件索引。
- 不分析正文。
- 不生成小说正文。
- 后续脚本应继续保持“读取、拆章、索引、分析、结尾方案、正文生成”分阶段执行。
