# Agent Instructions

These instructions apply to the entire repository.

## Project intent

This repository is for a private long-form novel ending lab and author-style consistency system. The first experiment target is *Dragon Raja / Long Zu*, with the current milestone focused on multi-ending outlines rather than UI expansion or full final chapters.

## Creative research boundaries

- Build corpus maps that capture the long-form structure, major arcs, unresolved threads, foreshadowing, motifs, and emotional rhythm needed for ending design.
- Build an author style bible that describes voice, tonal range, pacing, imagery, humor placement, emotional restraint, and recurring motifs.
- Build a story bible that tracks characters, relationships, factions, worldbuilding rules, promises, contradictions, and continuity constraints.
- Generate multiple coherent ending routes before selecting or drafting any one route.
- Compare and hybridize endings so the strongest route can emerge through tradeoff analysis, revision, and recombination.
- Preserve style consistency across route generation, outline expansion, review, and eventual drafting.
- Preserve story continuity by checking character arcs, worldbuilding logic, unresolved threads, and foreshadowing recovery.
- Use an outline-first workflow: corpus map, style bible, story bible, route generation, route comparison, route hybridization, final volume outline, chapter outline, scene outline, review, and only then drafting.

## Development approach

- Keep early changes beginner-friendly and well documented.
- Prefer small, clear documents and templates before adding application code.
- Keep prompts reusable and explicit about the required input artifacts: corpus map, author style bible, story bible, unresolved thread list, and route goals.
- If code is added later, separate app code, prompt assets, generated user data, and tests.

## Multi-ending planning rules

- Always propose multiple ending options before drafting.
- Do not assume there is only one correct ending.
- Prefer an outline-first workflow: route generation, route comparison, route hybridization, final volume outline, chapter outline, scene outline, drafting, and review.
- Maintain mixed style consistency: youthful academy tone, tragic emotional density, epic world-ending scale, reflective maturity, restrained emotion, humor before heaviness, loneliness, fate, youth, sacrifice, and lost time motifs.
- Separate route generation, route comparison, route hybridization, outline expansion, drafting, and review as distinct workflow stages.
- When the user asks for a final ending, first ask whether they want closure, tragedy, epic scale, open resonance, emotional compensation, or a hybrid.
- For the current milestone, prioritize high-quality ending outlines over full final chapters.
- Do not expand the UI unless the user explicitly asks for UI work.

## Writing style

- Use clear Markdown headings.
- Explain why each step exists.
- Include Chinese-language prompt outputs where the app is expected to generate Chinese prose.
