# 本地原始语料目录说明

## 目的

`local_raw_corpus/` 用于在本机私有保存受版权保护的原始小说文本、作者相关文本与参考材料。这个目录只作为后续分析流程的本地读取来源，**不要提交到 GitHub，也不要把受版权保护的全文复制到仓库中的其他文件里**。

本项目提交到 GitHub 的内容应当是：摘要、结构化笔记、原创分析、提示词、模板、流程文档与不含受版权保护全文的研究成果。

## 推荐目录结构

> 注意：这里只记录推荐结构，**不要为了提交而创建 `local_raw_corpus/` 目录本身**。

```text
local_raw_corpus/
├── dragon/
│   ├── dragon_1.txt
│   ├── dragon_2.txt
│   ├── dragon_3.txt
│   ├── dragon_4.txt
│   ├── dragon_5.txt
│   └── dragon_restart.txt
├── jiangnan/
│   ├── ci_jian_de_shao_nian.txt
│   ├── shanghai_fortress.txt
│   ├── jiu_zhou_piao_miao_lu.txt
│   ├── tian_zhi_chi.txt
│   └── dragon_and_youth_essays.txt
└── literary_references/
```

## 每类文本放在哪里

### `local_raw_corpus/dragon/`

放置《龙族 / Dragon Raja / Long Zu》实验所需的本地原文材料，每个文件对应一部或一个主要版本：

- `dragon_1.txt`：第一部本地原文。
- `dragon_2.txt`：第二部本地原文。
- `dragon_3.txt`：第三部本地原文。
- `dragon_4.txt`：第四部本地原文。
- `dragon_5.txt`：第五部本地原文。
- `dragon_restart.txt`：重启、修订、番外或其他与主线延续强相关的本地原文材料。

### `local_raw_corpus/jiangnan/`

放置江南其他作品、访谈、随笔或风格参考材料，用于建立作者风格、主题母题、叙事节奏和情感表达的对照样本：

- `ci_jian_de_shao_nian.txt`：《此间的少年》本地原文或合法自备文本。
- `shanghai_fortress.txt`：《上海堡垒》本地原文或合法自备文本。
- `jiu_zhou_piao_miao_lu.txt`：《九州缥缈录》本地原文或合法自备文本。
- `tian_zhi_chi.txt`：《天之炽》本地原文或合法自备文本。
- `dragon_and_youth_essays.txt`：与《龙族》、青春书写、作者创作谈、随笔、访谈相关的本地整理文本。

### `local_raw_corpus/literary_references/`

放置其他合法自备的文学参照材料，例如主题、结构、人物弧线、战争叙事、青春叙事、悲剧机制或奇幻史诗结构的参考文本。后续分析时，应只提取摘要、结构化观察和原创分析，不应输出或提交受版权保护全文。

## GitHub 提交边界

`local_raw_corpus/` 中的文件是本地私有语料，**不会进入 GitHub**。它们的用途是供本机脚本或人工分析读取，以便生成不侵权的中间产物。

请确保：

- 不提交 `local_raw_corpus/` 目录。
- 不提交 `.txt` 原文文件。
- 不把小说正文、长段落原文或可替代原作阅读体验的内容复制到仓库文档中。
- 不在 `README`、`analysis/`、`output/`、`prompts/` 或其他目录中粘贴受版权保护全文。

## 后续分析输出规则

后续分析流程可以从 `local_raw_corpus/` 本地读取原文，但写入仓库的结果应输出到 `analysis/` 等分析目录，并且只包含：

- 剧情摘要与章节概括。
- 人物卡、关系图、阵营与世界观规则。
- 未解线索、伏笔记录、主题母题和情绪节奏笔记。
- 作者风格观察、叙事结构分析和原创评论。
- 面向结局路线设计的原创提纲、比较矩阵和一致性检查。

这些输出应当是**摘要、结构化笔记和原创分析**，而不是原文搬运。

## 版权提醒

再次提醒：**不要提交受版权保护的小说全文或大段原文**。`local_raw_corpus/` 只用于本地私有研究与分析输入；GitHub 仓库只保存可公开共享的流程、模板、摘要、结构化笔记和原创分析。
