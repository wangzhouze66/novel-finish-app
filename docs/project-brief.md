# Project Brief: Chinese Novel Continuation Web App

## One-sentence summary

Build an MVP web app that helps a user turn an original or user-authorized novel excerpt or summary into structured story analysis, continuation outlines, Chinese chapter drafts, ending comparisons, saved chapters, and exportable final text.

## Learning target

The user wants to practice a private fan-drafting workflow inspired by *Dragon Raja / Long Zu*. This is for learning prompt design and story-continuation workflows.

The repository and final app design should remain focused on original or user-authorized novels only.

## Target users

- Beginner writers who want help organizing a continuation plan.
- Chinese-language fiction writers who want draft assistance.
- Learners practicing prompt workflows for long-form narrative generation.
- Users with their own original drafts, summaries, lore notes, or authorized source material.

## Core problem

Long-form continuation writing is difficult because the writer must track characters, relationships, timeline, world rules, emotional tone, unresolved conflicts, and future endings at the same time.

The app should break that process into smaller steps:

1. Understand the existing story context.
2. Extract reusable story memory.
3. Generate several continuation directions.
4. Draft chapters in Chinese.
5. Compare endings before committing to one path.
6. Save and export the result.

## MVP feature list

### 1. Input source material

The user can paste text or upload a file containing an excerpt, summary, outline, or notes from an original or user-authorized work.

### 2. Analyze story context

The app extracts:

- Main characters
- Relationships
- Worldbuilding
- Unresolved plotlines
- Emotional tone
- Timeline

### 3. Generate continuation outlines

The app proposes several possible next-story paths, including short-term chapter direction and longer ending direction.

### 4. Generate Chinese chapter drafts

The app creates chapter drafts in Chinese based on the user-approved context, outline, tone, constraints, and desired direction.

### 5. Compare ending directions

The app compares multiple endings by theme, emotional effect, character payoff, risk, and required setup.

### 6. Save generated chapters

The user can save generated chapters and later return to them.

### 7. Export final text

The user can export selected chapters or a complete draft.

## Non-goals for the first step

- Do not build the full app yet.
- Do not add authentication yet.
- Do not add a production database yet.
- Do not add copyrighted novel text.
- Do not implement complex file upload or export logic yet.

## Success criteria for this planning phase

- The repo has a clear README.
- The repo has explicit copyright safety guidance.
- The repo has a beginner-friendly workflow document.
- The repo has prompt templates for the key story-analysis and generation steps.
- The repo remains free of copyrighted full novel content.

## Later technical direction

A future implementation could use:

- A simple frontend for paste/upload and prompt results.
- A backend API for prompt orchestration.
- A document store or database for saved chapters.
- Export options such as Markdown, TXT, DOCX, or PDF.
- A project-level story memory object that is updated as the user drafts.
