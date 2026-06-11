# Dragon Raja / Long Zu Sample Scene Drafting Prompt v1

This document creates a reusable prompt template for drafting **one controlled sample scene** from `14_scene_level_outline_v1.md` for the hybrid ending route `雨后王座无人 / The Empty Throne After Rain`.

It is a **prompt-control document**, not a scene draft. It does **not** contain final prose, does **not** draft a full chapter, and does **not** change the app UI.

---

## 1. Prompt purpose

Use this prompt when the project is ready to test one selected scene from the scene-level outline as a controlled **Draft v0** sample.

The purpose is to make a future drafting agent:

- write only **one scene**, not a full chapter;
- treat the scene as a test of route logic, character voice, style consistency, and emotional aftertaste;
- preserve the outline-first workflow established by the route, volume, chapter, scene, checklist, and revision-loop documents;
- produce a rough but reviewable v0 sample that can be passed to v1 polish, revised with a rewrite brief, or rejected and replanned.

Why this exists: the ending experiment should not jump from outline directly into finished continuation prose. A small sample scene lets the project test tone, restraint, continuity, and character pressure before any larger drafting commitment.

---

## 2. Required input packet

Before drafting, the user or agent must provide the following packet.

| Field | Required content | Why it matters |
| --- | --- | --- |
| **Selected chapter id** | The chapter id from `13_chapter_level_outline_v1.md`. | Keeps the scene inside the approved chapter structure. |
| **Selected scene id** | The scene id from `14_scene_level_outline_v1.md`. | Prevents uncontrolled scene invention. |
| **Scene purpose** | The single job this scene must perform. | Keeps Draft v0 from becoming summary, filler, or full-chapter expansion. |
| **Characters present** | All speaking and meaningfully present characters or symbolic presences. | Enables character-card and voice checks before writing. |
| **Target emotional beat** | The emotional turn, wound, pressure, or aftertaste the scene should land. | Gives the draft a precise inner direction. |
| **Unresolved thread addressed** | The relevant unresolved thread id or description from `05_unresolved_threads.md`. | Keeps mystery and continuity handling intentional. |
| **Symbolic image** | The image, object, weather, sound, place, or ordinary detail that should carry the scene's aftertaste. | Prevents theme from becoming mechanical explanation. |
| **Style focus** | The dominant style control for this sample, such as academy contrast, tragic density, reflective maturity, restrained dialogue, or aftermath silence. | Ensures the draft tests a specific style requirement. |
| **Desired length** | Short, medium, or extended sample mode. | Controls scope. |
| **Draft version** | Must be `v0`. | Confirms this is not final prose. |

Do not draft if any required field is missing. Ask for the missing fields or infer only with an explicit note that the inference must be confirmed before prose generation.

---

## 3. Required context files

Before drafting, the agent must check these files:

1. `experiments/longzu/02_character_cards.md`
2. `experiments/longzu/07_author_style_bible.md`
3. `experiments/longzu/14_scene_level_outline_v1.md`
4. `experiments/longzu/15_style_story_consistency_checklist_v1.md`
5. `experiments/longzu/16_revision_loop_v1.md`

Recommended supporting context when route or chapter logic is unclear:

- `experiments/longzu/05_unresolved_threads.md`
- `experiments/longzu/11_hybrid_route_v1.md`
- `experiments/longzu/12_final_volume_outline_v1.md`
- `experiments/longzu/13_chapter_level_outline_v1.md`

Why this exists: the required files control voice, style, scene function, review standards, and revision procedure. The supporting files help resolve larger route or continuity questions without expanding the task into a full-route rewrite.

---

## 4. Pre-draft alignment checklist

Before writing Draft v0, the agent must summarize the alignment in plain Markdown.

The summary must answer:

1. **What this scene must accomplish**
   - Identify the scene's unique function.
   - State the character movement or story pressure it must create.
   - Name the unresolved thread or emotional thread it touches.

2. **What this scene must avoid**
   - State the major drift risks, such as full-chapter expansion, infodump, cheap tragedy, power fantasy escalation, romantic simplification, or premature mystery closure.

3. **What each character is hiding or refusing to say**
   - For every relevant character, identify the withheld truth, avoided feeling, hidden fear, or private desire shaping their behavior.
   - If a character is a symbolic presence rather than a speaking person, identify what pressure or absence that presence represents.

4. **What emotional subtext should drive the scene**
   - Name the feeling beneath the visible action.
   - Prefer subtext over direct confession.
   - Use silence, hesitation, ordinary detail, memory, or misdirection when appropriate.

5. **What symbolic image should carry the aftertaste**
   - Identify the central image.
   - Explain how it should change or echo by the end of the scene.
   - Confirm that the image is not decorative; it should hold emotional residue.

Do not begin Draft v0 until this alignment summary is complete.

---

## 5. Drafting rules

Draft v0 must follow these rules:

- Stay limited to **one scene**.
- Avoid full-chapter expansion.
- Preserve character voice according to `02_character_cards.md`.
- Use emotional restraint; do not make characters explain every feeling.
- Avoid mechanical exposition.
- Avoid over-explaining mysteries, bargains, bloodline rules, Odin logic, or succession mechanics.
- Avoid power fantasy drift; power should reveal cost, loneliness, choice, or consequence.
- Avoid cheap tragedy; loss must be earned, specific, and morally legible.
- Use atmosphere, silence, memory, or ordinary detail when appropriate.
- Let large conflict appear through personal choice rather than abstract lore summary.
- Keep the scene's ending open enough to create aftertaste, not so open that the scene has no function.
- Do not introduce new major route logic unless the selected outline already requires it.
- Do not resolve unrelated unresolved threads merely because they are mentioned.

Why this exists: Draft v0 should test whether the chosen outline can become living scene material without breaking continuity or collapsing into explanation.

---

## 6. Style control rules

Use the mixed target style established for the hybrid ending route:

- **Youthful academy tone when memory or contrast is needed**
  - Use lightness, cafeteria texture, school habits, teasing, exams, uniforms, vending machines, campus weather, or old student rhythms only where they sharpen the ache.

- **Tragic emotional density**
  - Let loss press underneath the visible action.
  - Avoid melodramatic declarations; allow the reader to feel what the characters do not say.

- **Epic world-ending pressure through personal stakes**
  - Express apocalypse, succession, dragon order, and institutional collapse through a character's choice, refusal, fatigue, memory, or small physical action.

- **Reflective essay-like maturity**
  - Use concise reflective lines where appropriate, but do not turn the scene into commentary.
  - Reflection should arrive after an image or action earns it.

- **Humor before heaviness where appropriate**
  - Use humor as contrast, avoidance, or old habit.
  - Do not use meme-like banter or jokes that erase grief.

- **Loneliness / fate / youth / sacrifice / lost time motifs**
  - Weave motifs through image and behavior rather than slogans.

- **Action followed by emotional emptiness**
  - If action occurs, include the silence, fatigue, rain-washed aftermath, or emotional vacuum after it.

- **Grand conflicts expressed through individual choices**
  - The scene should make large-scale stakes intimate: someone chooses, refuses, remembers, witnesses, releases, or bears a cost.

Chinese-language drafting reminder for future use: `样章可以使用中文正文，但必须先完成对齐摘要；正文只写一个场景，不写整章，不写最终稿。`

---

## 7. Character voice control

For each relevant character, the agent must fill the following control card before drafting.

| Character | Emotional base | Speech tendency | Hidden fear or desire | What they avoid saying directly | OOC risk | Required restraint |
| --- | --- | --- | --- | --- | --- | --- |
| `[character name]` | `[core wound, pressure, mood, or desire in this scene]` | `[plain, evasive, teasing, ceremonial, sharp, quiet, reflective, etc.]` | `[private fear/desire]` | `[truth they will not state directly]` | `[how this character could drift out of character]` | `[what the draft must hold back]` |

Minimum requirements:

- **Lu Mingfei** should not become a clean heroic power fantasy. His awkwardness, loneliness, decency, fear, and self-chosen agency must remain visible.
- **Lu Mingze** should not become a simple exposition device. His tenderness, manipulation, mystery, cost, and brother-shadow ambiguity must remain controlled.
- **Chu Zihang** should not over-confess. His witness role, restraint, erased-history wound, and disciplined care should guide him.
- **Caesar** should not become empty swagger. His performance of greatness must reveal mature honor and chosen loyalty.
- **Nono** should not become a romantic reward or plot key. Her agency, perception, refusal of simplification, and emotional honesty must remain intact.
- **Erii's emotional legacy** should not be used as cheap grief. Her absence should remain specific, tender, and irreparable.
- **Principal Anjou** should not become only vengeance or institution. His old-war logic and legacy cost must be weighed.
- **Odin** should not become a simple final boss unless the selected scene demands that mask. Preserve fate, erasure, system pressure, and memory logic.
- **Black King / White King symbolic presences** should not be reduced to lore dumps. Use myth as personal pressure, inheritance, temptation, or absence.
- **Kassel College / Secret Party / Gattuso institutional forces** should act through policy, habit, pressure, secrecy, witnesses, and consequences rather than speeches.

If a selected scene includes only some of these characters, fill cards only for the relevant characters or presences.

---

## 8. Output format for future sample scene drafting

A future drafting response using this template must output the following sections in order:

### A. Scene alignment summary

Include:

- selected chapter id;
- selected scene id;
- scene purpose;
- characters present;
- target emotional beat;
- unresolved thread addressed;
- symbolic image;
- style focus;
- desired length mode;
- what the scene must accomplish;
- what the scene must avoid;
- character voice control cards;
- emotional subtext;
- symbolic-image aftertaste plan.

### B. Draft v0

Write the controlled sample scene only.

Rules:

- Label it clearly as `Draft v0`.
- Use Chinese prose if the user requests Chinese scene output or if the experiment context requires Chinese-language sample prose.
- Do not include a full chapter.
- Do not call the draft final.

### C. Self-review using the checklist

Immediately review Draft v0 against:

- style consistency;
- story continuity;
- character voice;
- emotional restraint;
- emotional power;
- symbolic imagery;
- pacing;
- scene function;
- aftertaste;
- readiness for next stage.

Use concise bullets or a score table.

### D. Main risks found

Identify the most important risks, such as:

- OOC drift;
- over-explanation;
- weak emotional aftertaste;
- cheap tragedy;
- power fantasy drift;
- unresolved thread closure that feels too mechanical;
- symbolic image that feels decorative;
- scene ending that lands too cleanly or too vaguely.

### E. Suggested revision brief for v1

State:

- what to keep;
- what to cut;
- what to deepen;
- what to make more restrained;
- what to make more concrete;
- what emotional subtext to add;
- what dialogue to reduce;
- what symbolic image to strengthen;
- what character logic to repair.

Do not generate Draft v1 unless the user explicitly asks for it after reviewing the v0 output and revision brief.

---

## 9. Draft v0 length control

Choose one length mode before drafting:

| Mode | Chinese character target | Use case |
| --- | ---: | --- |
| **Short sample** | 600–900 Chinese characters | First tone test, dialogue test, symbolic-image test, or fragile emotional beat. |
| **Medium sample** | 1200–1800 Chinese characters | Standard sample scene with setup, turn, and aftertaste. |
| **Extended sample** | 2500–3500 Chinese characters | Complex scene with multiple characters, action plus aftermath, or major revelation pressure. |

Length control rules:

- Do not exceed the chosen mode without asking.
- Prefer short mode for the first experiment sample.
- If the scene cannot fit the selected mode, state the compression risk before drafting.
- Do not use extended mode to smuggle in a full chapter.

---

## 10. Built-in review trigger

After Draft v0, the agent must immediately run all four reviews below before offering next steps:

1. **Style review**
   - Check mixed target style, restraint, humor placement, imagery, reflective maturity, and avoidance of generic genre tone.

2. **Story continuity review**
   - Check route alignment, scene-level outline alignment, unresolved-thread handling, worldbuilding restraint, and timeline consistency.

3. **Character voice review**
   - Check every relevant character against their control card and `02_character_cards.md`.

4. **Emotional aftertaste review**
   - Check whether the scene leaves an image, silence, changed relationship, ordinary detail, or ache instead of a clean explanation or cheap cliffhanger.

This review is mandatory even if Draft v0 seems strong.

---

## 11. Pass / revise / reject rule

Draft v0 is never final.

After review, assign exactly one decision:

| Decision | Meaning | Allowed next step |
| --- | --- | --- |
| **Pass to v1 polish** | The scene is structurally stable and only needs controlled polish. | Prepare a v1 polish brief; draft v1 only if requested. |
| **Revise with rewrite brief** | The scene premise works, but style, voice, pacing, continuity, or aftertaste needs repair. | Produce a targeted rewrite brief before any v1 draft. |
| **Reject and replan scene** | The scene breaks route logic, character voice, story continuity, or the required emotional function. | Return to scene alignment and adjust the scene plan before drafting again. |

Minimum approval rule: do not pass a scene if character voice, story continuity, emotional restraint, or emotional aftertaste is weak.

---

## 12. Sample Scene Drafting Prompt Template

Copy and reuse the block below when requesting a future controlled sample scene.

```markdown
# Sample Scene Drafting Prompt Template

Use the Dragon Raja / Long Zu ending experiment documents to draft one controlled sample scene only.

Do not draft a full chapter.
Do not create final prose.
Do not skip the pre-draft alignment summary.
Do not generate Draft v1 unless I ask after reviewing Draft v0.

## Required input packet

- selected chapter id: [chapter_id]
- selected scene id: [scene_id]
- scene purpose: [scene purpose]
- characters present: [characters]
- target emotional beat: [target emotional beat]
- unresolved thread addressed: [unresolved thread addressed]
- symbolic image: [symbolic image]
- style focus: [style focus]
- desired length: [desired length]
- draft version: v0

## Required context files to check first

- `experiments/longzu/02_character_cards.md`
- `experiments/longzu/07_author_style_bible.md`
- `experiments/longzu/14_scene_level_outline_v1.md`
- `experiments/longzu/15_style_story_consistency_checklist_v1.md`
- `experiments/longzu/16_revision_loop_v1.md`

If route, chapter, or thread logic is unclear, also check:

- `experiments/longzu/05_unresolved_threads.md`
- `experiments/longzu/11_hybrid_route_v1.md`
- `experiments/longzu/12_final_volume_outline_v1.md`
- `experiments/longzu/13_chapter_level_outline_v1.md`

## Required output

### A. Scene alignment summary

Before drafting, summarize:

- what this scene must accomplish;
- what this scene must avoid;
- what each relevant character is hiding or refusing to say;
- what emotional subtext should drive the scene;
- what symbolic image should carry the aftertaste;
- character voice control cards for each relevant character.

### B. Draft v0

Write only the selected scene in the requested length mode.
Use Chinese prose unless I specify otherwise.
Keep the scene as Draft v0, not final prose.

### C. Self-review using the checklist

Immediately run:

- style review;
- story continuity review;
- character voice review;
- emotional aftertaste review.

Also check pacing, scene function, symbolic imagery, emotional restraint, and readiness for the next stage.

### D. Main risks found

List the main risks discovered in Draft v0.

### E. Suggested revision brief for v1

Provide a rewrite brief that states:

- what to keep;
- what to cut;
- what to deepen;
- what to make more restrained;
- what to make more concrete;
- what emotional subtext to add;
- what dialogue to reduce;
- what symbolic image to strengthen;
- what character logic to repair.

## Decision rule

End with exactly one decision:

- pass to v1 polish;
- revise with rewrite brief;
- reject and replan scene.

Draft v0 cannot be treated as final.
```

---

## 13. Next-step recommendation

After this file is merged, select one scene from `14_scene_level_outline_v1.md` and draft a **short v0 sample scene** using this template.

Recommended first test: choose a scene that stresses one narrow craft problem, such as humor-before-heaviness, Nono's agency, Lu Mingze's mystery-without-exposition, or the empty-throne refusal through personal choice.

Chinese next-step prompt seed: `请从场景级大纲中选择一个场景，使用《Sample Scene Drafting Prompt Template》只写短样章v0；写完后必须立刻做风格、故事连续性、人物声音和情绪余味复盘，并给出v1改写简报。`
