# Chinese Novel Multi-Ending Lab

A beginner-friendly planning repository for a private long-form novel ending lab.

This project is a multi-ending outline system, author-style consistency system, and story continuity / emotional core preservation system. It does not assume there is only one correct ending. Instead, it should generate, compare, hybridize, revise, and eventually expand multiple coherent ending routes for the same long novel.

The first private experiment target is *Dragon Raja / Long Zu*. The current priority is to prove creative reasoning, style control, long-form story planning, continuity tracking, and emotional core preservation through structured ending outlines.

## Current project direction

The project identity is:

1. Private long-form novel ending lab
2. First experiment target: *Dragon Raja / Long Zu*
3. Multi-ending outline system
4. Author-style consistency system
5. Story continuity and emotional core preservation system
6. Creative research workflow for comparing, hybridizing, revising, and expanding routes
7. UI-secondary planning system

The current priority is:

1. Building corpus maps
2. Building an author style bible
3. Building a story bible
4. Multi-ending architecture
5. Ending route schema design
6. Route comparison and evaluation
7. Hybrid route generation
8. Final volume outline generation
9. Chapter-level outline generation
10. Style-sensitive outline expansion
11. Consistency review before drafting

The UI is secondary. Do not expand the app UI for the current milestone. The core is multi-ending planning, style consistency, story continuity, and emotional core preservation.

## First milestone

The first milestone is not full continuation prose.

The first deliverable should be multiple high-quality ending outlines for the same long novel. Each route should be structured enough to compare, revise, hybridize, and later expand into a final volume.

Each ending route should include:

1. Route name
2. Core theme
3. Emotional tone
4. Main conflict resolution
5. Protagonist final arc
6. Major character endings
7. Worldbuilding resolution
8. Unresolved plotline recovery
9. Foreshadowing recovery
10. Final volume structure
11. Chapter-by-chapter outline
12. Key emotional scenes
13. Style consistency notes
14. Risk assessment
15. Rewrite suggestions

## Supported ending route types

The system should support at least five base route types:

| Code | Route type | Purpose |
| --- | --- | --- |
| A | Complete closure ending | Resolve major conflicts and create strong finality. |
| B | Tragic fate ending | Emphasize destiny, sacrifice, loss, and irreversible cost. |
| C | Epic battle ending | Resolve large-scale conflict through decisive confrontation. |
| D | Open resonance ending | Leave selected questions open while preserving thematic afterglow. |
| E | Emotional compensation ending | Repair emotional wounds and give intimate character payoff. |

The system should also support hybrid routes:

- A + B: complete closure with tragic cost
- B + D: tragic fate with open resonance
- A + C: complete closure through epic confrontation
- D + E: open resonance with emotional compensation
- User-custom mixed route

## How the system proves creative reasoning

The system should not simply output one polished answer. It should prove reasoning ability through:

- Comparing multiple plausible endings against the same story bible.
- Explaining tradeoffs between closure, tragedy, scale, ambiguity, and emotional compensation.
- Recovering unresolved plotlines and foreshadowing in different ways.
- Preserving the emotional core while allowing different route-level choices.
- Maintaining character, worldbuilding, and style consistency across alternate routes.
- Hybridizing strong routes into better mixed routes.
- Revising weak routes before any full chapter drafting begins.

## Outline-first workflow

```text
Corpus map + author style bible + story bible + unresolved thread list
        ↓
Generate multiple ending routes
        ↓
Compare ending routes
        ↓
Generate or revise hybrid route
        ↓
Create final volume outline
        ↓
Create chapter-by-chapter outline
        ↓
Create scene-level and style-sensitive expansion
        ↓
Draft full prose only after approval
```

## Current repository scope

This repository currently contains planning documents and reusable prompt templates only. It intentionally does not include a runnable web application yet.

## Proposed file structure

```text
.
├── README.md
├── AGENTS.md
├── docs/
│   ├── project-brief.md
│   ├── novel-continuation-workflow.md
│   ├── corpus-map-template.md
│   ├── author-style-bible-template.md
│   ├── story-bible-template.md
│   ├── multi-ending-system.md
│   ├── ending-route-schema.md
│   ├── ending-comparison-matrix.md
│   ├── mixed-style-model.md
│   └── outline-before-drafting-workflow.md
└── prompts/
    ├── character-analysis-prompt.md
    ├── worldbuilding-analysis-prompt.md
    ├── plotline-analysis-prompt.md
    ├── chapter-continuation-prompt.md
    ├── ending-options-prompt.md
    ├── generate-multiple-ending-routes.md
    ├── compare-ending-routes.md
    ├── generate-hybrid-ending-route.md
    ├── final-volume-outline.md
    ├── chapter-level-outline.md
    ├── style-sensitive-outline-expansion.md
    └── ending-route-consistency-review.md
```

## Suggested beginner roadmap

1. Build a corpus map that captures long-form structure, unresolved threads, motifs, and emotional rhythm.
2. Build an author style bible that defines voice, pacing, humor, restraint, imagery, and recurring motifs.
3. Build a story bible that tracks characters, relationships, worldbuilding rules, promises, and continuity constraints.
4. Read `docs/multi-ending-system.md` to understand why the project generates multiple endings.
5. Use `docs/ending-route-schema.md` to structure each route.
6. Use `docs/ending-comparison-matrix.md` to compare routes before selecting one.
7. Use `docs/mixed-style-model.md` to maintain tone and emotional texture.
8. Follow `docs/outline-before-drafting-workflow.md` before drafting any full prose.
9. Add application code and UI only after the planning workflow is useful.
