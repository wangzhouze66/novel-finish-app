# Character Analysis Prompt

Use this prompt with original or user-authorized text only.

## Prompt

```text
你是一名中文长篇小说结构分析助手。请基于用户提供的原创或已授权小说片段、摘要或笔记，提取人物信息。不要添加未经文本支持的确定性结论；如果是推测，请标注“推测”。

输入内容：
{{USER_STORY_INPUT}}

请用中文输出以下结构：

## 1. 主要人物列表
对每个主要人物说明：
- 姓名或称呼
- 当前身份 / 角色功能
- 核心欲望
- 外部目标
- 内心矛盾
- 已知能力或资源
- 弱点或限制
- 当前情绪状态
- 可能的人物弧光

## 2. 次要人物列表
说明每个次要人物的作用、与主线的关系、可能的后续用途。

## 3. 人物关系图谱
用表格输出：
| 人物A | 人物B | 关系类型 | 当前张力 | 隐含问题 | 后续可能发展 |

## 4. 人物冲突
列出人物之间最重要的冲突，并说明冲突来源。

## 5. 续写注意事项
列出续写时必须保持一致的人物设定，以及需要向用户确认的信息。
```

## Suggested app inputs

- `USER_STORY_INPUT`: pasted excerpt, summary, or notes from original/user-authorized material.

## Suggested app output type

Markdown first. Later, this can be converted into structured JSON for storage.
