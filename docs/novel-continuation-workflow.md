# Novel Continuation Workflow

This document describes the intended user flow for the MVP. It can later become the basis for app screens, API routes, and data models.

## Workflow overview

```text
Input excerpt or summary
        ↓
Analyze story context
        ↓
Review and edit extracted story memory
        ↓
Generate continuation outlines
        ↓
Compare ending directions
        ↓
Draft Chinese chapters
        ↓
Revise and save chapters
        ↓
Export final text
```

## Step 1: Input excerpt or summary

The user provides one of the following:

- A short excerpt from an original or user-authorized novel
- A self-written summary
- Character notes
- Timeline notes
- Worldbuilding notes
- Previous generated chapters owned by the user

The app should remind the user not to upload copyrighted full novel text unless they own or are authorized to use it.

## Step 2: Extract story memory

The app uses analysis prompts to build a structured story memory.

Suggested story memory fields:

- `title`
- `source_type`
- `main_characters`
- `relationships`
- `worldbuilding`
- `unresolved_plotlines`
- `emotional_tone`
- `timeline`
- `style_notes`
- `user_constraints`

## Step 3: Let the user review and edit

The extracted analysis should not be treated as final. The user should be able to correct names, remove wrong assumptions, add missing details, and choose what matters for future drafts.

This matters because novel continuation quality depends on consistent memory.

## Step 4: Generate continuation outlines

The app proposes multiple outline options, such as:

- Safe continuation: follows the current tone closely.
- Dramatic escalation: increases conflict and stakes.
- Character-focused continuation: emphasizes emotional choices.
- Mystery-resolution continuation: answers unresolved questions.
- Tragic, bittersweet, hopeful, or open-ended paths.

Each outline should include:

- Premise
- Key emotional promise
- Main conflict
- Character development
- Chapter-by-chapter beats
- Risks or continuity concerns

## Step 5: Compare ending directions

Before drafting too much text, the app compares possible endings.

Comparison criteria:

- Theme
- Emotional impact
- Character payoff
- Required setup
- Continuity risk
- Reader satisfaction
- Suitability for the chosen tone

## Step 6: Generate Chinese chapter drafts

The user chooses an outline and asks the app to draft one chapter at a time in Chinese.

Draft inputs should include:

- Approved story memory
- Chosen continuation outline
- Chapter goal
- Desired point of view
- Emotional tone
- Pacing preference
- Must-include details
- Must-avoid details

## Step 7: Revise and save chapters

The user reviews the draft and can ask for revisions, such as:

- More restrained prose
- Stronger emotional tension
- More dialogue
- Less exposition
- Better continuity
- More literary Chinese style
- Clearer action sequence

Saved chapters should be treated as user-generated project content.

## Step 8: Export final text

The user selects chapters and exports the final draft.

Possible future formats:

- Markdown
- Plain text
- DOCX
- PDF

## Beginner implementation path

1. Start with a static page and manual prompt testing.
2. Add a paste box and buttons for each analysis prompt.
3. Display structured JSON or Markdown results.
4. Add local save using browser storage.
5. Add backend storage later.
6. Add export after saving works reliably.
