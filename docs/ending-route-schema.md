# Ending Route Schema

## Purpose

This document defines the structured fields for one ending route. The schema is designed for outline-first planning and should be usable as Markdown, JSON, or a future database model.

Use this schema to keep each route comparable across creative intent, emotional effect, story continuity, style consistency, and expansion readiness.

## Route object

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `route_id` | string | Yes | Stable identifier, such as `A-closure-01` or `hybrid-bd-01`. |
| `route_name` | string | Yes | Human-readable title for the ending route. |
| `ending_type` | enum | Yes | Primary type: `complete_closure`, `tragic_fate`, `epic_battle`, `open_resonance`, `emotional_compensation`, or `hybrid`. |
| `mixed_types` | array | Required for hybrids | Route types blended into this ending, such as `["tragic_fate", "open_resonance"]`. Empty for non-hybrid routes. |
| `core_theme` | string | Yes | The central idea the ending proves, such as fate, sacrifice, youth, loneliness, freedom, or lost time. |
| `emotional_tone` | string | Yes | Target feeling, such as restrained grief, catharsis, quiet hope, devastation, warmth, or unresolved longing. |
| `protagonist_arc` | object or Markdown section | Yes | The protagonist's final internal movement: wound, choice, cost, transformation, and final state. |
| `major_character_endings` | array or table | Yes | End-state for major characters, including emotional payoff and relationship consequences. |
| `main_conflict_resolution` | string | Yes | How the central conflict is resolved and what price is paid. |
| `worldbuilding_resolution` | string | Yes | How factions, supernatural rules, historical secrets, institutions, or large-scale threats settle. |
| `unresolved_threads_resolved` | array | Yes | Plotlines that receive concrete answers. |
| `unresolved_threads_left_open` | array | Yes | Plotlines intentionally left open, with a reason for leaving them open. |
| `foreshadowing_recovered` | array | Yes | Earlier clues, motifs, promises, or symbolic details that the ending pays off. |
| `final_volume_outline` | array | Yes | High-level final volume structure, usually 4-8 large movements. |
| `chapter_outline` | array | Yes | Chapter-by-chapter plan with conflict, emotional beat, character movement, and ending hook. |
| `key_scenes` | array | Yes | Must-have emotional, action, revelation, farewell, or aftermath scenes. |
| `style_notes` | array | Yes | Notes for maintaining the target mixed style and Chinese long-form tone. |
| `consistency_risks` | array | Yes | Risks involving story logic, character behavior, world rules, pacing, tone, route distinctiveness, or emotional payoff. |
| `reader_impact_score` | number | Yes | 1-10 estimate of emotional and thematic impact. Include a short justification. |
| `style_consistency_score` | number | Yes | 1-10 estimate of how well the route fits the target mixed style. Include a short justification. |
| `expansion_potential` | string | Yes | How well the route can expand into a final volume and later full chapters. |

## Recommended Markdown template

```markdown
# Ending Route: {{route_name}}

- route_id: {{route_id}}
- ending_type: {{ending_type}}
- mixed_types: {{mixed_types}}

## 1. Core theme

{{core_theme}}

## 2. Emotional tone

{{emotional_tone}}

## 3. Protagonist final arc

- Starting wound:
- Final choice:
- Cost:
- Transformation:
- Final state:

## 4. Major character endings

| Character | Final state | Relationship payoff | Cost | Open question |
| --- | --- | --- | --- | --- |

## 5. Main conflict resolution

{{main_conflict_resolution}}

## 6. Worldbuilding resolution

{{worldbuilding_resolution}}

## 7. Unresolved threads resolved

- {{thread}} → {{resolution}}

## 8. Unresolved threads left open

- {{thread}} → {{reason_for_openness}}

## 9. Foreshadowing recovered

- {{foreshadowing}} → {{payoff}}

## 10. Final volume outline

1. {{volume_movement}}

## 11. Chapter outline

| Chapter | Plot function | Emotional beat | Character movement | Hook |
| --- | --- | --- | --- | --- |

## 12. Key scenes

- {{scene_name}}: {{purpose}}

## 13. Style notes

- {{style_note}}

## 14. Consistency risks

- {{risk}} → Suggested fix: {{fix}}

## 15. Scores

- reader_impact_score: {{score}} / 10 — {{reason}}
- style_consistency_score: {{score}} / 10 — {{reason}}
- expansion_potential: {{assessment}}
```
