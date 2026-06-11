# Generate Multiple Ending Routes Prompt

Use this prompt after preparing a corpus map, author style bible, story bible, unresolved thread list, foreshadowing list, and target mixed style.

## Prompt

```text
你是一名中文长篇小说多结局策划助手。请基于用户提供的故事圣经、未解决剧情线列表、伏笔列表和目标风格，生成五个彼此明显不同、但都符合故事逻辑的结局路线。

重要边界：
- 当前任务只生成结局路线和大纲，不写完整章节。
- 必须同时维护故事连续性、人物弧线、世界观规则、风格一致性与情感核心。
- 不要提前认定唯一正确结局；每条路线都要有独立的主题价值。

## 故事圣经
{{STORY_BIBLE}}

## 未解决剧情线
{{UNRESOLVED_THREADS}}

## 伏笔与主题承诺
{{FORESHADOWING_AND_PROMISES}}

## 目标混合风格
{{TARGET_MIXED_STYLE}}

## 用户偏好与禁区
{{USER_PREFERENCES_AND_LIMITS}}

请至少生成以下五种路线：
A. complete closure ending（完整闭合结局）
B. tragic fate ending（宿命悲剧结局）
C. epic battle ending（史诗决战结局）
D. open resonance ending（开放余韵结局）
E. emotional compensation ending（情感补偿结局）

每条路线必须包含：
1. route_id
2. route_name
3. ending_type
4. mixed_types
5. core_theme
6. emotional_tone
7. protagonist_arc
8. major_character_endings
9. main_conflict_resolution
10. worldbuilding_resolution
11. unresolved_threads_resolved
12. unresolved_threads_left_open
13. foreshadowing_recovered
14. final_volume_outline
15. chapter_outline
16. key_scenes
17. style_notes
18. consistency_risks
19. reader_impact_score（1-10，并说明理由）
20. style_consistency_score（1-10，并说明理由）
21. expansion_potential

输出要求：
- 用中文输出。
- 先给五条路线总览表。
- 再逐条展开。
- 每条路线都要说明“为什么它不是唯一正确答案”。
- 最后列出最适合进一步混合的两组组合。
```

## Suggested app inputs

- `STORY_BIBLE`: approved story memory.
- `UNRESOLVED_THREADS`: plotlines that require resolution or intentional openness.
- `FORESHADOWING_AND_PROMISES`: prior clues, motifs, promises, and symbolic details.
- `TARGET_MIXED_STYLE`: the mixed style model.
- `USER_PREFERENCES_AND_LIMITS`: desired themes, disliked tropes, character priorities, route preferences, and emotional boundaries.

## Suggested app output type

Markdown route package.
