# 小说完结实验 App（novel-ending-lab）

> 当前第一阶段只跑通《龙族》一本测试小说的本地语料读取、章节拆分准备、结构化分析容器和结尾实验输出目录。暂不考虑公开发布、版权、商业化、登录、付费，也不生成小说正文。

## 项目目标

用户后续可以把 TXT / PDF / EPUB / DOCX 小说文件放入本地语料目录，系统逐步完成：

1. 读取原始语料文件。
2. 拆分章节与参考文本块。
3. 分析人物、世界观、伏笔和未解剧情线。
4. 生成多个结尾方案。
5. 生成结尾大纲。
6. 在明确进入正文阶段后，再生成逐章正文。

当前版本只完成目录结构和第一版语料索引脚本，不分析正文、不生成小说。

## 当前目录结构

```text
novel-ending-lab/
├── raw_corpus/
│   ├── target_novel/
│   ├── author_corpus/
│   └── literary_references/
├── parsed/
│   ├── target_chapters/
│   └── reference_chunks/
├── analysis/
│   ├── corpus_index.md
│   ├── dragon_story_bible.md
│   ├── dragon_unresolved_threads.md
│   ├── dragon_foreshadowing.md
│   ├── author_style_profile.md
│   └── dragon_ending_rules.md
├── output/
│   └── dragon_ending/
│       ├── ending_options.md
│       ├── ending_outline.md
│       └── generated_chapters/
├── prompts/
├── scripts/
└── app/
```

## 目录说明

| 目录 | 用途 | 当前阶段 |
| --- | --- | --- |
| `raw_corpus/` | 存放原始小说和参考文本。 | 用户本地放入 TXT / PDF / EPUB / DOCX 等文件；仓库只保留 README。 |
| `parsed/` | 存放拆分后的章节和文本块。 | 只创建目录，后续再做拆章脚本。 |
| `analysis/` | 存放结构化分析结果。 | 第一版会生成 `corpus_index.md`；其他文件作为《龙族》分析容器。 |
| `output/` | 存放生成的结局方案、大纲和章节。 | 当前只保留方案和大纲模板，不生成正文。 |
| `prompts/` | 存放 AI 提示词。 | 后续按读取、拆章、分析、结尾方案、大纲、正文分阶段维护。 |
| `scripts/` | 存放读取、拆分、索引、分析脚本。 | 已新增第一版语料索引脚本。 |
| `app/` | 后续网页界面。 | 当前不开发 UI。 |

## 第一版语料索引

运行：

```bash
npm run corpus:index
```

脚本会扫描：

- `raw_corpus/target_novel/`
- `raw_corpus/author_corpus/`
- `raw_corpus/literary_references/`

并输出：

- `analysis/corpus_index.md`

第一版只统计：

- 文件名
- 文件路径
- 文件扩展名
- 文件大小
- `.txt` / `.md` 文件字符数
- 所属目录分类

如果 `raw_corpus/` 为空，也会正常生成提示。

## 工作边界

- 不分析正文。
- 不生成小说。
- 不跳过多结尾方案与大纲阶段。
- 不把原始语料文件提交到仓库。
- 当前目标只跑通《龙族》测试流程。
