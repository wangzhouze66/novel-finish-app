# Chinese Novel Continuation MVP

A beginner-friendly planning repository for a Chinese novel continuation web app.

The MVP will help users analyze an excerpt or summary from an original or user-authorized novel, plan possible continuation directions, draft Chinese chapters, compare endings, save generated chapters, and export final text.

## Copyright boundary

This repository must not contain copyrighted full novel text.

Allowed repository content:

- Project structure and planning notes
- Prompt templates
- Placeholder sample text
- User-created original examples
- User-authorized examples
- Private-practice templates that require the user to paste their own notes locally

Not allowed repository content:

- Full copyrighted novel chapters
- Long copied excerpts from published novels
- Scraped novel datasets
- Character-by-character reconstructions of protected works

For the learning target, you may privately practice with your own notes about the Chinese novel *Dragon Raja / Long Zu*, but those notes should stay outside the repository unless they are short, high-level, and non-substitutive.

## MVP goals

The first app version should support:

1. Paste or upload a novel excerpt or summary.
2. Extract and summarize main characters, relationships, worldbuilding, unresolved plotlines, emotional tone, and timeline.
3. Generate continuation outlines.
4. Generate chapter drafts in Chinese.
5. Compare different ending directions.
6. Save generated chapters.
7. Export the final text.

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
│   ├── copyright-boundary.md
│   └── dragon-raja-private-practice-template.md
└── prompts/
    ├── character-analysis-prompt.md
    ├── worldbuilding-analysis-prompt.md
    ├── plotline-analysis-prompt.md
    ├── chapter-continuation-prompt.md
    └── ending-options-prompt.md
```

## Suggested beginner roadmap

1. Read `docs/project-brief.md` to understand the product goal.
2. Read `docs/copyright-boundary.md` before adding examples or test data.
3. Use `docs/novel-continuation-workflow.md` to map each app screen.
4. Test prompt templates manually with placeholder or authorized text.
5. Later, build a small web UI around the workflow.
6. Add storage and export only after the prompt workflow feels useful.
