# Question / Scenario Architecture — Proposal (no code changes yet)

## Where things stand

Confirmed by reading `src/lib/evaluator.ts`, `src/routes/index.tsx`, `src/lib/history.ts`:

- 5 general questions (`g1`–`g5`) asked on every run, plus 4 focused questions per branch across 5 branches (decision, relationship, direction, pattern, timing) — 9 answers per run.
- Every question is a 1–5 agreement statement with a `note` and a `mismatchSource` string.
- Score: `general mean × 0.5 + focused mean × 0.5`, rounded to one decimal. Clarity Gap = evaluated − initial. Mismatch sources = up to 3 lowest answers scoring ≤ 3.
- History stores the full `answers` map per entry, so a dimension model added later can be recomputed over past runs.

The current set already covers several dimensions by accident, but nothing is tagged, so two questions can measure the same thing and one dimension can be missing entirely on a given branch. That is the actual problem to fix.

## Proposed architecture

### 1. Tag every question with exactly one dimension

Add a `dimension` field to `Question`. Eight dimensions, matching the ones you named:

| Key | Dimension | What it measures |
|---|---|---|
| `fact` | Observable facts vs interpretation | Can the person separate what happened from what it means |
| `known` | Known vs felt/assumed | Can they mark the boundary of their own information |
| `observe` | Observation vs reaction | Is the account of the situation independent of their response to it |
| `unknown` | Uncertainty / missing information | Can they name what is missing and what would resolve it |
| `load` | Emotional load | How much weight the situation is carrying right now |
| `pattern` | Cognitive / thought pattern | Is the thinking looping, rehearsing, or moving |
| `avoid` | Discomfort / avoidance | Is there a part being steered around |
| `revise` | Revisability | Can the initial reading be updated after reflection |

Rule: one dimension per question, and each dimension gets at least one question per run. This is the whole point of the redesign — it makes the instrument's coverage checkable instead of assumed.

### 2. Split the question set by role

- **General block — 8 questions, one per dimension.** These are situation-agnostic and identical on every run. They form the comparable spine: because every run answers all eight, cross-run and cross-branch comparison is valid.
- **Focused block — 5 questions per branch, drawn from the 5 dimensions where that branch is most likely to distort.** Same dimension keys, but the statement is written in the branch's own terms. Focused questions do not add new dimensions; they re-test existing ones under situational pressure. The difference between a dimension's general and focused answer is itself a signal (a person can separate fact from interpretation in the abstract and not in the live situation).

Per-branch focused dimensions:

- decision: `unknown`, `fact`, `avoid`, `revise`, `load`
- relationship: `fact`, `observe`, `avoid`, `load`, `known`
- direction: `known`, `unknown`, `pattern`, `revise`, `observe`
- pattern: `fact`, `observe`, `pattern`, `known`, `revise`
- timing: `load`, `observe`, `unknown`, `avoid`, `pattern`

Run length: 13 rated questions (8 + 5), up from 9. Enough for eight dimensions to each have real support; still short enough to finish in one sitting.

### 3. Reverse-scored items

`load`, `avoid`, and `pattern` are dimensions where *more* is *worse* for clarity. Writing them as "I keep going over this in my head" and then scoring 5 as high clarity would be wrong. Add `reverse: true` on those questions; a helper converts the raw 1–5 answer to a clarity contribution of `6 − raw`. Raw answers stay in history unchanged, so nothing already saved is misread.

This is a correction to the current design, where every item is worded so agreement means clarity — that wording pressure is why the existing set has no genuine emotional-load or avoidance item.

### 4. Revisability needs a second reading, not a self-report

Dimension 8 is the one that cannot honestly be measured by a statement asked before the reveal. Proposal: keep one general `revise` statement in the block, and additionally re-ask the initial by-feel 1–5 *after* the reveal ("Having answered these, where does it sit now?"). The movement between reading one and reading two is the behavioural revisability measure. It slots into the existing flow as a step between `sources` and `reflection` — no UI redesign, one more card of the same shape.

### 5. How this feeds a number later — without assigning meanings

Keep the current calculation exactly as it is for now. The tagging makes a future number derivable rather than invented:

1. Compute a 0–1 score per dimension from its questions (reverse items flipped).
2. That gives an eight-value **clarity profile** per run. Store it alongside the existing fields in history.
3. When you are ready, a single number can be produced from the profile by a stated rule — lowest dimension, count of dimensions below threshold, or weighted mean. That is a number *derived from the answers*, with no meaning attached to any digit.
4. No mapping to 1–9, Tree of Life, or angel numbers in this phase, and nothing in the data model presupposes one.

### 6. Current questions — retain, rewrite, move, remove

Retain as-is (each already isolates one dimension cleanly):

- `g2` (know vs assuming) → `known`
- `g5` (what I'd need to be more certain) → `unknown`
- `r1` (their position in their own terms) → relationship `fact`
- `r4` (what happened vs what I concluded) → relationship `fact`/`observe`
- `n2`, `n3` (multiple occasions; the exceptions) → pattern `fact`, pattern `known`
- `t1` (ready vs impatient) → timing `load`
- `t2`, `t3` (what changes if I wait / act) → timing `unknown`

Rewrite:

- `g1` (one plain sentence) — currently mixes "can I state it" with "is it one situation". Narrow to `fact`.
- `g3` (steady rather than shifting with mood) — good instinct, but asked as a memory test. Rewrite as a present-state `load` item, reverse-scored.
- `g4` (describe without defending) — rewrite as the general `avoid` item; the defending framing is closer to avoidance than to observation.
- `d1` (name the actual options) — rewrite toward `unknown` (what is unnamed) rather than option-counting.
- `p1` (direction without an outcome) — rewrite as `known` in direction terms.
- `p3` (holds up if it takes longer) — rewrite as direction `revise`.

Move:

- `d3` (is this mine to make) → belongs to `known`, and generalises well; consider promoting to the general block if you would rather keep the general set at 8 without writing a new ownership item.
- `n4` (my own part in the pattern) → this is the strongest `avoid` item in the current set; keep it in the pattern branch as `avoid`.

Remove or fold in:

- `d4` (know the deadline) — factual admin, not a clarity dimension. Fold the useful part into the rewritten `d1`.
- `r3` (said it out loud) — measures action taken, not clarity. Better placed in reflection prompts than in scoring.
- `p2` (next concrete step) — overlaps `d1`/`unknown`; drop from scoring.
- `r2` (what I want, stated plainly) — near-duplicate of the rewritten `g1`; drop the branch copy.

New questions needed: one general item each for `observe`, `pattern`, `revise`, plus branch-specific `load`/`avoid`/`pattern` items where the table above has no existing question to draw on. Roughly 12–14 new statements total, written in the existing plain, non-diagnostic register.

## Where I'd push back

- **Eight dimensions on nine questions is the real bug**, not the wording. Do the tagging and the count increase together or the coverage guarantee is fiction.
- **Emotional load and avoidance cannot be measured with agreement-means-clarity phrasing.** Reverse scoring is not optional here.
- **Self-reported revisability is close to worthless.** Measure it as movement between two readings; that is why the second by-feel reading is in this proposal.
- I would **not** change the 50/50 weighting in this phase. Once profiles exist over a few runs you will have grounds for a weighting decision instead of a guess.

## Technical notes

- `src/lib/evaluator.ts`: add `Dimension` union, `dimension` and `reverse?` on `Question`, a `clarityValue(question, raw)` helper, `DIMENSIONS` metadata (key, label, short description), and `dimensionScores()` returning the profile. `evaluate()` keeps its current formula and gains a `profile` field.
- `src/lib/history.ts`: add optional `profile` and `secondReading` to `HistoryEntry`; guard reads so existing v1 entries stay valid without a migration.
- `src/routes/index.tsx`: general block loops 8 instead of 5, focused 5 instead of 4 — the existing per-question card handles both. One new stage card for the second by-feel reading.
- Mismatch-source selection switches from "3 lowest answers" to "lowest-scoring dimensions", which stops the list from showing three near-duplicate questions.
- No changes to design tokens, components, footer, or the non-diagnostic framing.

## Dimension 1 — FACT vs INTERPRETATION (question-writing session)

Status: design task, first of the 8 planned dimensions. Not yet implemented — we write the questions together before any code changes. The remaining 7 dimensions are developed later, one at a time, in the same way. The app and all current functionality stay untouched until the question set is agreed.

Purpose of this dimension: test whether the user can distinguish observable information — what happened, what was said, what is there — from the meaning, explanation, motive, or conclusion they have assigned to it. The instrument should surface whether a person is holding an interpretation as if it were a fact, without telling them which is which.

Design constraints for the questions (to be drafted in the session):

- Plain, non-diagnostic language. No clinical terminology, no correct-answer cues.
- Each item isolates the fact/interpretation distinction and does not also pull in known-vs-assumed, emotional load, or reaction — those are separate dimensions.
- Agreement scale 1–5 stays as-is. An item is written so that agreement consistently points one way on the dimension (no mixed-direction wording); reverse scoring only applies if the statement is phrased so that agreement means *less* clarity.
- Wording must not hand the user the "right" reading. The question should make the distinction doable, not announce it. Avoid items like "I am confusing my interpretation with the facts" (that names the failure); prefer items that ask the person to hold the two apart in their own terms.
- Need a small set: one general (situation-agnostic) item plus branch-specific focused items for the branches where this dimension distorts most (relationship, pattern, and decision per the table in section 2). Exact count to settle in the session — target ~1 general + 3 focused for this dimension.
- Each item gets the existing `note` (steadying line) and a `mismatchSource` (what a low score may point at, never a diagnosis).

Drafting checklist for the session:

1. Agree the exact observable-vs-assigned distinction in one sentence.
2. Write candidate general item; check it does not leak into other dimensions.
3. Write 3 focused items (relationship, pattern, decision); check each is the same dimension in branch language, not a new one.
4. Check direction of scoring and mark `reverse` where needed.
5. Decide whether any existing `fact`-tagged question from section 6 is retained verbatim, rewritten, or replaced — defer the call until the new wording exists to compare against.

No code is changed in this task. When the wording is settled, implementation follows the Technical notes above, scoped to dimension 1 only.

## Dimension 2 — KNOWN vs FELT / ASSUMED (approved wording)

Status: design task, second of the 8 planned dimensions. Wording approved — recorded here verbatim for the permanent plan. Not yet implemented; no code changes until the full question set is agreed.

Core distinction: What I actually know vs. what I feel, suspect, assume, or believe. The dimension tests whether a person can mark the boundary inside their own information — tell apart what they hold because they have it, from what they hold because it feels right, fits a suspicion, or follows a belief. It is an internal-state check: where does knowing stop and assuming begin, as the person sits with the situation.

Approved questions (agreement scale 1–5; agreement = more clarity unless an item is later marked `reverse`):

- General: "How clearly can you distinguish what you actually know from what you feel, assume, or believe?"
- Relationship (focused): "How clearly can you distinguish what you actually know about the other person from what you feel or assume about them?"
- Pattern (focused): "How clearly can you distinguish what you actually know about a recurring situation from what you suspect or believe is causing it?"
- Decision (focused): "How clearly can you distinguish what you actually know about your situation from what you think might happen next?"

Separation from adjacent dimensions (guard against leakage during implementation):

- From Dimension 1 (fact vs interpretation): Dim 1 separates what happened from the meaning assigned to it. Dim 2 is not about occurrence-vs-meaning; it is about the source of a held claim — know vs feel/assume — regardless of whether the claim is a fact or an interpretation. "Is this what took place or my reading of it" is Dim 1; "is this something I know or something I assume" is Dim 2.
- From Dimension 3 (observation vs reaction): Dim 3 asks whether the account is independent of the person's response to it. Dim 2 is agnostic to reaction; it concerns the epistemic status of what is held, not whether feeling has shaped the telling. Do not write Dim 2 items that collapse into "am I reacting or observing."
- From Dimension 4 (uncertainty / missing information): Dim 2 marks where one's knowledge ends (an internal boundary). Dim 4 goes further to inventory the gap, distinguish resolvable from irreducible uncertainty, and name what would close it. Dim 2 is "do I know where my knowing stops"; Dim 4 is "can I say what is missing and what would change it." Keep the boundary-check items in Dim 2 and the gap-resolution items in Dim 4.

Design constraints (carried from the shared rules; apply when these items are wired in):

- Plain, non-diagnostic register; no correct-answer cues.
- One dimension per item; no leakage into fact-vs-interpretation, observation-vs-reaction, or uncertainty.
- Each item keeps the existing `note` (steadying line) and a `mismatchSource` (what a low score may point at, never a diagnosis).
- Focused branches for this dimension per the table in section 2: **relationship**, **pattern**, and **decision** (`known` appears as a focused dimension for those three).

## Dimension 3 — OBSERVATION vs REACTION (approved wording)

Status: design task, third of the 8 planned dimensions. Wording approved — recorded here verbatim for the permanent plan. Not yet implemented; no code changes until the full question set is agreed.

Core distinction: What I can observe vs. how I am responding to what I observe. The dimension tests whether a person's account of the situation stands independent of their response to it — whether they can hold "this is happening" separate from "this is how I am responding to what is happening." A clear reading can describe the situation without the description being shaped by the reaction to it.

Preserved principle for this dimension: "This is happening" vs. "This is how I am responding to what is happening."

Approved questions (agreement scale 1–5; agreement = more clarity unless an item is later marked `reverse`):

- General: "How clearly can you separate what you are observing from how you are reacting to it?"
- Relationship (focused): "How clearly can you separate what you are observing in the other person from how their behavior is making you react?"
- Pattern (focused): "How clearly can you separate what you are observing in a recurring situation from your immediate reaction to the pattern?"
- Decision (focused): "How clearly can you separate what you are observing about your choices from your reaction to having to make a decision?"

Separation from adjacent dimensions (guard against leakage during implementation):

- From Dimension 1 (fact vs interpretation): Dim 1 separates occurrence from assigned meaning. Dim 3 is not about meaning; it is about whether the telling is contaminated by the teller's response. "Is this what happened or my conclusion" is Dim 1; "is this what I see or what my reaction is doing with what I see" is Dim 3.
- From Dimension 2 (known vs felt/assumed): Dim 2 concerns the source of a held claim (know vs assume). Dim 3 concerns whether the account is shaped by reaction, regardless of whether the held content is known or assumed. Keep the two distinct: a person can know something and still let reaction distort how they report it.
- From Dimension 4 (uncertainty / missing information): Dim 3 is about reaction contaminating observation; Dim 4 is about the information landscape and what is missing. Do not conflate "I'm reacting" with "I don't know."

Design constraints (carried from the shared rules; apply when these items are wired in):

- Plain, non-diagnostic register; no correct-answer cues.
- One dimension per item; no leakage into fact-vs-interpretation, known-vs-felt, or uncertainty.
- Each item keeps the existing `note` (steadying line) and a `mismatchSource` (what a low score may point at, never a diagnosis).
- Focused branches for this dimension per the table in section 2: **relationship**, **pattern**, and **decision** (`observe` appears as a focused dimension for those three).

## Dimension 4 — UNCERTAINTY / MISSING INFORMATION (question-writing session)

Status: design task, fourth of the 8 planned dimensions, following the already approved Dimensions 1–3. Not yet implemented — we write the questions together before any code changes. The app and all current functionality stay untouched until the question set is agreed.

Core distinction for this dimension: clarity does not mean having an answer. Sometimes the clearest conclusion is recognizing what is not known yet. A person can be clear *because* they have accurately located the edge of their certainty, not because they have filled it in.

Purpose of this dimension: test whether the person can (a) identify what information is missing in the situation, (b) distinguish genuine uncertainty from certainty — tell apart what they do not know from what they do, and (c) recognize what additional information would actually resolve the uncertainty, as opposed to information that would merely feel reassuring. The instrument should surface whether someone treats an open question as a flaw to close, or as a fact about the situation to hold accurately.

Separation from the adjacent dimensions (guard against leakage while drafting):

- From Dimension 1 (fact vs interpretation): Dim 1 asks whether a person can separate what happened from the meaning they assigned to it. Dim 4 is not about meaning-vs-occurrence; it is about the presence or absence of information itself — what is simply not there yet. An item that asks "is this my reading or what actually happened?" belongs to Dim 1; an item that asks "can I name what I still don't have" belongs to Dim 4.
- From Dimension 2 (known vs felt/assumed): Dim 2 marks the boundary of one's own information — where knowing stops and feeling/assuming begins, held as an internal state. Dim 4 goes one step further: it asks the person to actively inventory the gap, distinguish its kind (resolvable vs not), and name what would close it. Dim 2 is "do I know where my knowledge ends"; Dim 4 is "can I say what is missing and what would change it." Avoid writing Dim 4 items that collapse back into a felt-vs-known self-check.
- From Dimension 3 (observation vs reaction): Dim 3 tests whether the account of the situation is independent of the person's response to it. Dim 4 is agnostic to the emotional reaction; it concerns the information landscape, not whether the telling is contaminated by feeling. Do not write items that conflate "I don't know" with "I'm upset about not knowing."

Design constraints for the questions (to be drafted in the session):

- Plain, non-diagnostic language. No clinical terminology, no correct-answer cues. "Uncertainty" and "missing information" are working labels for the design — the user-facing wording stays in the existing plain register.
- Each item isolates the identify-the-gap / certainty-vs-uncertainty / what-would-resolve-it distinction and does not pull in fact-vs-interpretation, known-vs-felt, or observation-vs-reaction.
- Agreement scale 1–5 stays as-is. An item is written so that agreement consistently points one way on the dimension (no mixed-direction wording); reverse scoring only applies if the statement is phrased so that agreement means *less* clarity (e.g. an item worded as "I already know everything I need" would be reverse-scored, because comfort-with-closure can be the opposite of accurately held uncertainty). Direction to settle per item in the session.
- Wording must not hand the user the "right" reading. The question should make the gap-nameable, not announce that naming gaps is the goal. Avoid items like "I cannot identify what I don't know" (that names the failure); prefer items that ask the person to locate the open edge in their own terms.
- A genuine Dim 4 item should distinguish *resolvable* uncertainty (a specific missing piece that, if known, would change the reading) from *irreducible* uncertainty (no obtainable information would settle it). The strongest items touch whether the person can tell which kind they are sitting in. Keep this as a drafting aim, not a rigid rule on every item.
- Need a small set: one general (situation-agnostic) item plus branch-specific focused items for the branches where this dimension distorts most. Per the table in section 2, `unknown` is a focused dimension for **decision**, **direction**, and **timing** — target ~1 general + 3 focused. Exact count to settle in the session.
- Each item gets the existing `note` (steadying line) and a `mismatchSource` (what a low score may point at, never a diagnosis).

Drafting checklist for the session:

1. Agree the exact certainty-vs-uncertainty and resolvable-vs-irreducible distinctions, each in one sentence.
2. Write candidate general item; check it does not leak into Dim 1, 2, or 3.
3. Write 3 focused items (decision, direction, timing); check each is the same dimension in branch language, not a new one.
4. Check direction of scoring and mark `reverse` where needed — watch especially for comfort-with-closure wording.
5. Decide whether any existing `unknown`-tagged question from section 6 is retained verbatim, rewritten, or replaced — `g5` ("what I'd need to be more certain"), the rewritten `d1` (toward what is unnamed), and `t2`/`t3` (what changes if I wait / act) are the candidates to compare against. Defer the call until the new wording exists.

No code is changed in this task. When the wording is settled, implementation follows the Technical notes above, scoped to dimension 4 only.

## Design note — optional non-scored "I genuinely don't know" response (future, not yet implemented)

This is a recorded design intention only. Do not implement it yet. No code changes.

Proposal: add an optional, end-of-test, **non-scored** lighthearted response that lets a person mark "I genuinely don't know" without it being a failure. Candidate playful wording: "I don't know. I'm just a baby." with a funny baby visual. The tone is deliberately warm and deflating — it gives permission rather than evaluating.

Hard constraints:

- It must **never affect scoring**. It is not a 1–5 value, not a reverse item, and not part of the evaluated figure, the Clarity Gap, mismatch sources, or the clarity profile. It is orthogonal to all of that.
- It is **optional and end-of-test** — an off-ramp, not a substitute for any rated question. It cannot be used to skip the instrument.
- It must not be diagnostically loaded or used to infer anything about the person. It is a gesture, not a signal.
- Visual treatment stays inside the existing design language (warm off-white, cream, olive text, teal/terracotta/gold accents); the baby visual is playful but restrained, not a separate art direction.

Underlying principle to preserve in any future implementation: **"You are allowed to not know."** This pairs with Dimension 4 (uncertainty / missing information): accurately locating the edge of certainty is a form of clarity, and the non-scored response is the human-facing expression of the same stance — not knowing is permitted, not penalized.

No code is changed in this task.
