# Generate Hybrid Ending Route Prompt

Use this prompt when two or more ending routes have complementary strengths.

## Prompt

```text
你是一名中文长篇小说混合结局设计助手。请把两个或多个候选结局路线合并成一个更强的混合路线。目标不是简单拼接情节，而是保留各路线最强的主题、情绪和结构功能，同时消除冲突与重复。

重要边界：
- 当前任务只生成混合路线和大纲，不写完整章节。
- 只能使用用户原创、用户授权或高层概括信息。
- 不要复制未授权作品的具体段落或台词。

## 故事圣经
{{STORY_BIBLE}}

## 目标混合风格
{{TARGET_MIXED_STYLE}}

## 待混合路线
{{SOURCE_ROUTES}}

## 用户指定混合方向
{{HYBRID_GOAL}}

支持的常见混合类型包括：
- A + B：完整闭合 + 宿命悲剧
- B + D：宿命悲剧 + 开放余韵
- A + C：完整闭合 + 史诗决战
- D + E：开放余韵 + 情感补偿
- 用户自定义混合路线

请输出：

## 1. 混合策略
说明每条来源路线保留什么、舍弃什么、改写什么。

## 2. 新混合路线 schema
按以下字段完整输出：
- route_id
- route_name
- ending_type: hybrid
- mixed_types
- core_theme
- emotional_tone
- protagonist_arc
- major_character_endings
- main_conflict_resolution
- worldbuilding_resolution
- unresolved_threads_resolved
- unresolved_threads_left_open
- foreshadowing_recovered
- final_volume_outline
- chapter_outline
- key_scenes
- style_notes
- consistency_risks
- reader_impact_score
- style_consistency_score
- expansion_potential

## 3. 冲突消解说明
列出混合后解决了哪些原路线问题，以及新增了哪些风险。

## 4. 改写建议
给出 5-10 条具体修改建议，使混合路线更适合扩展为最终卷。
```

## Suggested app inputs

- `STORY_BIBLE`: approved story memory.
- `TARGET_MIXED_STYLE`: mixed style constraints.
- `SOURCE_ROUTES`: two or more ending routes.
- `HYBRID_GOAL`: desired blend, such as closure with tragic cost.

## Suggested app output type

Markdown hybrid route design.
