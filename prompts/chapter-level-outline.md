# Chapter-Level Outline Prompt

Use this prompt to convert a final volume outline into detailed chapter-by-chapter planning.

## Prompt

```text
你是一名中文长篇小说章节大纲助手。请把最终卷大纲拆分为详细章节大纲。当前任务不写完整章节，只规划每章的结构、情绪节奏和连续性功能。

重要边界：
- 不要写完整章节正文。
- 不要复制未授权作品的具体表达。
- 每章都必须服务于已选结局路线和最终卷结构。

## 故事圣经
{{STORY_BIBLE}}

## 已选结局路线
{{SELECTED_ENDING_ROUTE}}

## 最终卷大纲
{{FINAL_VOLUME_OUTLINE}}

## 目标混合风格
{{TARGET_MIXED_STYLE}}

请输出：

## 1. 章节列表总览
用表格列出：
| 章数 | 章节暂名 | 主要功能 | POV/焦点人物 | 核心冲突 | 情绪基调 | 结尾钩子 |

## 2. 逐章详细大纲
每章包含：
- 章节暂名
- 章节目的
- 开场状态
- 主要事件
- 角色选择
- 情绪转折
- 世界观信息或伏笔回收
- 与前后章节的连接
- 本章不能写偏的地方
- 结尾钩子

## 3. 情绪节奏检查
说明幽默、青春感、悲剧密度、史诗规模、反思性和情感克制如何分布。

## 4. 连续性检查
列出每章需要遵守的人物、时间线、世界规则和未解决剧情线约束。

## 5. 下一步建议
指出哪些章节适合先做 scene outline，哪些章节需要回到路线层修正。
```

## Suggested app inputs

- `STORY_BIBLE`: approved story memory.
- `SELECTED_ENDING_ROUTE`: selected route.
- `FINAL_VOLUME_OUTLINE`: final volume outline.
- `TARGET_MIXED_STYLE`: mixed style constraints.

## Suggested app output type

Markdown chapter outline package.
