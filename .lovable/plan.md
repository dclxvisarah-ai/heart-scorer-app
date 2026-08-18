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

## Dimension 4 — UNCERTAINTY / MISSING INFORMATION (FINALIZED wording)

Status: fourth of the 8 planned dimensions. Wording finalized in this pass and recorded verbatim for the permanent plan. Not yet implemented; no code changes.

Core distinction: clarity does not mean having an answer — sometimes the clearest conclusion is accurately recognizing what is not known yet.

The dimension tests whether the person can (a) identify what information is missing, (b) tell genuine uncertainty apart from certainty, and (c) recognize what information would actually resolve the uncertainty rather than merely feel reassuring. It also aims to distinguish *resolvable* uncertainty (a specific missing piece that would change the reading) from *irreducible* uncertainty (nothing obtainable would settle it).

Finalized questions (agreement scale 1–5; agreement = more clarity; no reverse items in this dimension):

- General: "How clearly can you name what you do not know yet about this situation?"
- Decision (focused): "How clearly can you name the information you are still missing before this choice can be made?"
- Direction (focused): "How clearly can you tell which of your open questions about where you are heading could be answered, and which cannot be answered yet?"
- Timing (focused): "How clearly can you name what would have to become known before the timing of this is settled?"

Notes on the finalized set:

- All four are phrased as "how clearly can you name / tell", so agreement points one way (more naming = more clarity) and no reverse scoring is needed. Comfort-with-closure wording ("I already know everything I need") was considered and rejected: it would have required reverse scoring and reads as a trap.
- The direction item is the one that carries the resolvable-vs-irreducible test; the decision and timing items carry identify-the-gap and what-would-resolve-it respectively. Together the three cover the dimension without any single item doing all the work.
- No item names the failure, and none tells the user that naming gaps is the goal.
- Separation from Dimensions 1–3 as recorded above still holds: nothing here asks about meaning-vs-occurrence (Dim 1), the know/assume source of a held claim (Dim 2), or reaction contaminating the account (Dim 3).

Existing `unknown`-tagged questions — call now that wording exists: replace `g5` with the new general item (same intent, plainer); retain the rewritten `d1` only if a second decision item is wanted later, otherwise drop it in favour of the new decision item; fold `t2`/`t3` ("what changes if I wait / act") into the new timing item, which asks the same thing without presupposing that waiting and acting are the only two moves.

Each item still gets the existing `note` (steadying line) and a `mismatchSource` when implemented.

## Dimension 5 — EMOTIONAL LOAD (LOCKED — Sarah approved)

Status: fifth of the 8 planned dimensions. Decisions locked in this pass and recorded verbatim for the permanent plan. Not yet implemented; no code changes.

Locked decisions:

- **Framing B — load awareness, forward-scored.** The dimension scores how clearly the person can see the emotional weight and its effect on their reading, not how heavy the situation is directly. This keeps it a clarity discrimination like every other dimension, needs no reverse scoring, and does not penalize someone for being in a hard situation — consistent with the non-diagnostic framing.
- **Name:** Emotional Load.

Core distinction: how much weight the situation is currently carrying, and whether the person can see that weight acting on their reading of it.

Why it belongs: every dimension so far tests a discrimination the person can make. Load is different — it is a *condition* under which those discriminations get harder. Without it, the instrument can report high clarity on a situation that is simply too heavy to be read accurately right now, and the Clarity Gap loses its most common explanation.

How it differs from 1–4: Dim 3 (observation vs reaction) asks whether the *account* is contaminated by reaction; Dim 5 asks how much *weight* is present at all. A person can be carrying a great deal and still describe the situation cleanly (high 3, high load), or be carrying little and still report reactively (low 3, low load). It is not Dim 2 or 4 — no epistemic or information content.

Locked questions (agreement scale 1–5; agreement = more clarity; forward-scored):

- General: "How clearly can you see how much this situation is weighing on you right now?"
- Relationship (focused): "How clearly can you see how much weight this relationship is carrying for you at the moment?"
- Timing (focused): "How clearly can you see whether the pressure you feel about timing is coming from the situation or from how much it matters to you?"
- Decision (focused): "How clearly can you see how much the weight of this decision is affecting how you are thinking about it?"

Overlap check against 1–4: no meaning/occurrence content (1), no know/assume content (2), no observe/react account content (3), no missing-information content (4). Clean.

## Dimension 6 — MENTAL MOVEMENT (LOCKED — Sarah approved)

Status: sixth of the 8 planned dimensions. Decisions locked in this pass and recorded verbatim for the permanent plan. Not yet implemented; no code changes.

Locked decisions:

- **Name: Mental Movement.** Retained over "thought pattern" / "mental noise" — "pattern" already names a branch in this app, and "noise" invites a state-vs-clarity problem.
- **Forward-scored wording.** Agreement = more clarity; no reverse scoring. The looping/circling concept stays in the underlying language of the items, but "looping" is not used as the scored state label — the scored state is movement vs. repetition, phrased forward.
- **Underlying concept:** movement vs. looping/repetition.

Core distinction: whether thinking about the situation is moving — going somewhere new — or circling the same ground.

Why it belongs: repetition can imitate clarity. Rehearsing a conclusion produces fluency and confidence without producing new information, which is exactly the failure mode that inflates the initial by-feel reading. Nothing in Dimensions 1–5 detects it.

How it differs: Dim 4 is about the information landscape; Dim 6 is about the motion of the thinking regardless of what information exists. Dim 5 is weight; Dim 6 is repetition — a light situation can loop and a heavy one can move. Dim 6 is also not the `pattern` branch, which is about recurrence in the world, not in the thinking.

Locked questions (agreement scale 1–5; agreement = more clarity; forward-scored):

- General: "How clearly can you tell whether your thinking about this is moving forward or going over the same ground?"
- Direction (focused): "How clearly can you tell whether your thinking about where you are heading is developing or repeating?"
- Pattern (focused): "How clearly can you tell the difference between noticing this pattern and going over it again?"
- Timing (focused): "How clearly can you tell whether returning to the question of timing is producing anything new?"

Overlap check against 1–5: no information-gap content (4); no weight content (5) — an item mentioning how tiring the looping is would leak into 5 and has been avoided; no account-contamination content (3). Clean.

## Dimension 7 — AVOIDANCE (LOCKED — Sarah approved)

Status: seventh of the 8 planned dimensions. Locked as proposed, forward-scored. Not yet implemented; no code changes.

Locked decisions:

- **Forward-scored.** Agreement = more clarity; no reverse scoring.
- **Name:** Avoidance (working label; user-facing wording never uses the word).

Core distinction: whether there is a part of the situation being steered around, and whether the person can see themselves steering.

Why it belongs: this is the only dimension that addresses *coverage* — whether the reading includes the whole situation. All of Dimensions 1–6 can be answered well about a partial picture. A clarity instrument with no coverage dimension can be passed by looking clearly at the easy half.

How it differs: Dim 4 is about information that is not available; Dim 7 is about information that is available but not being looked at. That distinction is the sharpest boundary in the set and must be protected in wording — "I don't have it" (4) vs "I have it and am going around it" (7). Dim 5 is the weight itself; Dim 7 is the movement away from the weight.

Locked questions (agreement scale 1–5; agreement = more clarity):

- General: "How clearly can you tell whether there is a part of this you are staying away from?"
- Relationship (focused): "How clearly can you tell whether there is something about this relationship you are not letting yourself look at directly?"
- Decision (focused): "How clearly can you tell whether one of your options is one you are avoiding considering?"
- Timing (focused): "How clearly can you tell whether waiting is a considered choice or a way of not facing this yet?"

Overlap check against 1–6: distinct from 4 (unavailable vs unexamined), from 5 (weight vs movement away from it), from 6 (repetition vs omission). Clean. Note that a person high on 6 and low on 7 — looping precisely to avoid something — is a real and interesting combination the profile will now capture.

## Dimension 8 — REVISABILITY (LOCKED — Sarah approved)

Status: eighth of the 8 planned dimensions. Locked as proposed, forward-scored. Not yet implemented; no code changes.

Locked decisions:

- **Forward-scored.** Agreement = more clarity; no reverse scoring.
- **Name:** Revisability.

Core distinction: whether the current reading can be updated when something new arrives.

Why it belongs: it is the difference between clarity and conviction. A fixed reading and an accurate one look identical from the inside; only revisability separates them. It is also the dimension that makes repeat runs meaningful.

How it differs: every other dimension asks about the reading as it stands now. Dim 8 asks about the reading's relationship to future information. It is not Dim 4 — naming what you are missing (4) is compatible with refusing to update when you get it (8).

Locked questions (agreement scale 1–5; agreement = more clarity):

- General: "How openly could your current read on this change if you learned something new?"
- Direction (focused): "How openly could your sense of where you are heading change if something unexpected arrived?"
- Pattern (focused): "How openly could your explanation of this pattern change if it did not repeat next time?"
- Decision (focused): "How openly could your leaning on this decision change between now and when you have to choose?"

Behavioural second reading (carried from section 4 above, unchanged and still recommended): after the reveal, re-ask the initial by-feel 1–5 — "Having answered these, where does it sit now?" The movement between reading one and reading two is the behavioural revisability measure, and it is more trustworthy than the self-report. Both are kept: the statement scores the dimension, the movement validates it.

Overlap check against 1–7: no information-inventory content (4), no weight (5), no repetition (6), no coverage (7). Clean.

## Locked order for Dimensions 5–8

Order: **5 Emotional Load → 6 Mental Movement → 7 Avoidance → 8 Revisability.** Locked by Sarah in this pass. Rationale: 5–7 are all *conditions on* the discriminations in 1–4, ordered from most passive (weight is present) through repetition to active steering-away. 8 is last because it is the only forward-looking dimension and the only one with a post-reveal behavioural component, so it naturally sits at the end of the run.

## Eight-dimension question architecture — status and next phase

All eight dimensions are now designed and locked in this plan (1–4 finalized wording, 5–8 locked decisions). No app code, questions, scoring formula, UI, or number system has been changed. The future non-scored "I genuinely don't know" playful option remains a design note only (see below).

The eight-dimension question architecture is now ready for the next phase:

1. **Review the complete instrument for overlap.** Walk all eight dimensions together and confirm the boundaries between every pair still hold now that the full set exists — especially the 4-vs-7 (unavailable vs unexamined) and 5-vs-7 (weight vs movement away) edges, and any drift introduced by the 5–8 wording. Revise wording only if a real leak is found; do not redesign dimensions.
2. **Design how the 1–9 number system should be integrated before implementation.** Per the rules in section 5, the number must be *derived from the answers* (a stated rule over the eight-value clarity profile), with no meaning attached to any digit and no mapping to Tree of Life or angel numbers. Settle the derivation rule before any code changes.

Implementation of the eight-dimension instrument and the number system does not begin until both of the above are agreed. No code is changed in this task.


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

## NUMBER ARCHITECTURE DESIGN — proposal (§4 formula REJECTED / DEFERRED — see Phase 2C below)

> **Status update (Sarah, stress test):** the arithmetic derivation in §4 below — mean of Dims 1–4, bounded 6–7 modifier, banding to 1–9 — is **REJECTED as the production method and DEFERRED**. It was never implemented and will not be. The rejection is specific: averaging eight self-rated 1–5 dimensions cannot produce the number, because the number must emerge from the overall response pattern and from dimension *configurations*, not from a central tendency. §1–§3 (roles, unequal weight, the non-judgment rules for uncertainty / load / avoidance / revisability) and §5 (Clarity Gap intent) remain valid as reasoning and carry forward. §4 and §6 are retained only as a record of a rejected route. Superseded by **Phase 2C — Pattern-to-Number Discovery**.

Architecture/reasoning pass only. No implementation, no question edits, no scoring change, no UI change. Digits stay meaningless: this section decides only how a 1–9 figure is *derived*, never what a digit *means*. Tree of Life / angel-number mapping stays deferred.

### Principles this architecture must not violate

- Strong emotional load is not automatically low clarity.
- "I don't know" is not automatically low clarity.
- Reconsidering is not automatically low clarity.
- The number emerges from the *pattern* of responses, not from their average.
- Initial (by-feel) number vs evaluated number stays the centrepiece.

### 1. What each dimension contributes

Three roles. The distinction is the core of the whole design: only some dimensions are evidence *of* clarity; others describe the *conditions under which* the reading was taken.

| Dim | Name | Role |
| --- | --- | --- |
| 1 | Fact vs Interpretation | **Signal** — core discrimination |
| 2 | Known vs Felt/Assumed | **Signal** — core discrimination |
| 3 | Observation vs Reaction | **Signal** — core discrimination |
| 4 | Uncertainty / Missing Information | **Signal (inverted-U, not linear)** — see §3 |
| 5 | Emotional Load (awareness) | **Context** — never raises or lowers the number by itself |
| 6 | Mental Movement | **Modifier** — bounded adjustment |
| 7 | Avoidance | **Modifier (coverage penalty)** — bounded |
| 8 | Revisability | **Confidence / stability qualifier** — bounds the number, does not push it |

Signal dimensions (1–4) answer "how well is this seen?" Modifiers (6–7) answer "was the seeing complete and moving?" Context (5) answers "under what weight was this seen?" — reported, displayed, never scored. Dim 8 answers "how provisional is this figure?" — it sets how wide the reading's stated range is.

### 2. Should all dimensions have equal mathematical weight?

No — and equal weighting is exactly the failure mode to avoid. Reasons:

- The eight dimensions are not eight measurements of the same thing. Averaging them silently asserts that being aware of emotional weight is the same kind of evidence as being able to separate fact from interpretation. It is not.
- Equal weighting makes the principles above impossible: any dimension with weight has to move the number, so a heavy-load or high-uncertainty answer must drag the figure down. The only way to honour "load is not low clarity" is to give load zero mathematical weight and full narrative visibility.
- The four core discriminations (1–4) carry the clarity claim, so they carry the weight — equally *among themselves*, because no case has been made that any one discrimination is more fundamental than another. Say it plainly rather than tuning coefficients we cannot justify.

Proposed weight: Dims 1–4 equal, together 100% of the base figure. Dims 6–7 adjust the base within a hard cap (see §4). Dim 5 = 0 weight. Dim 8 = 0 weight, sets the band width.

### 3. Uncertainty, load, avoidance, revisability without false judgments

- **Uncertainty (4)** is scored on *accuracy of locating the edge of certainty*, not on how much is known. High Dim 4 = "I can name what I don't know and what would resolve it" — that is clarity and scores as clarity. Nothing in the number reads "has fewer unknowns = clearer". The future non-scored "I genuinely don't know" off-ramp is entirely outside the number.
- **Emotional load (5)** never enters the arithmetic. It appears in the read-out as a stated condition: "this reading was taken under significant weight, and you could see the weight." High load with high awareness is a *strong* result and should be said so in words. A dimension that cannot be gamed downward cannot be used to judge.
- **Avoidance (7)** is a *coverage* note, capped. Low Dim 7 does not mean "you are avoiding, therefore unclear"; it means part of the situation has not been looked at, so the figure covers less ground than it appears to. Implemented as a small bounded reduction plus an explicit sentence naming the uncovered part — the sentence carries most of the meaning, the arithmetic carries little.
- **Revisability (8)** never lowers the number. High revisability *narrows* nothing and low revisability *widens* nothing about the digit itself; instead low Dim 8 widens the stated range around the figure ("this reading is likely to move" / "this reading is holding still"), and the behavioural second by-feel reading is reported as movement, not as error. Reconsidering therefore never costs a point.

### 4. Candidate method — banded profile projection (recommended)

Four steps, all statable in one paragraph to a user.

1. **Base** = mean of Dims 1–4, each on 1–5. Range 1.0–5.0.
2. **Coverage adjustment** = bounded contribution from Dims 6–7: `adj = ((mean(6,7) − 3) / 2) × 0.35`, i.e. at most ±0.35 on the 1–5 scale. Deliberately too small to overturn the signal, large enough to separate two otherwise identical profiles.
3. **Adjusted clarity** = clamp(Base + adj, 1.0, 5.0).
4. **Project to 1–9** by fixed banding, not by rescaling arithmetic: eight cut points across 1.0–5.0 map to digits 1–9. Banding is used on purpose — it keeps the digit a *category the pattern fell into* rather than a computed quantity, which is what "the number should emerge from the response pattern" requires, and it prevents the digit being reverse-engineered into a percentage.

**Pattern override (the part that makes it a profile, not a score):** before banding, check profile shape. If the four signal dimensions disagree sharply (spread ≥ 2.0 between highest and lowest), the profile is *uneven*, and an uneven profile must not be reported as a mid number. In that case the digit is taken from the **lowest signal dimension's** band, not the mean, and the read-out says which dimension set it. Rationale: clarity is limited by its weakest discrimination, and averaging is precisely what hides that.

**Dim 8 sets the band width, not the digit:** high revisability → "this figure is held lightly"; low revisability → "this figure is held firmly, which is worth testing." Same digit either way.

Dim 5 is printed alongside as context. Never in the formula.

### 5. Clarity Gap

- Keep the current definition's spirit but move it onto the digit scale: **Gap = evaluated digit (1–9) − initial by-feel digit**, where the initial 1–5 by-feel reading is projected onto 1–9 with the *same* band table so the two numbers are commensurable. Comparing a 1–5 feel against a 1–9 evaluation without a shared projection is the one arithmetic error that would make the whole instrument look arbitrary.
- Interpretation stays non-diagnostic and gains a third term from the second by-feel reading: **gap** (feel vs evaluated) and **movement** (first feel vs post-reveal feel). Small gap + some movement = the healthiest pattern, and the copy should say so. Large negative gap = a part of the situation less examined than the rest, not a wrong person. Large positive gap = knows more than it feels like from inside.
- Gap is never called accuracy, and never accumulated into a score across runs. History keeps both numbers and the movement, so repeat runs show a trajectory rather than a grade.

### 6. Alternatives considered

**A. Weighted mean of all eight, projected to 1–9.** Pros: simplest to build and explain; one formula. Cons: forces load, uncertainty and revisability to move the number, breaking three stated principles; hides uneven profiles behind a mid digit; invites coefficient-fiddling with no justification. Rejected.

**B. Signal-only digit with everything else narrative.** Digit from Dims 1–4 alone; 5–8 appear only as sentences. Pros: cleanest principle compliance; nothing can create a false judgment. Cons: half the instrument does no work in the figure, so two clearly different profiles can return the same digit; avoidance in particular deserves *some* arithmetic presence. Strong fallback if Sarah wants maximum caution.

**C. Banded profile projection (§4) — recommended.** Signal-weighted base, bounded modifier, fixed banding, lowest-dimension override for uneven profiles, load excluded, revisability as band width. Pros: honours every stated principle; the digit reflects pattern shape, not an average; the weakest discrimination cannot be averaged away; explainable in plain language. Cons: more moving parts than A or B; the cut points and the 0.35 cap and the 2.0 spread threshold are chosen judgements that need one calibration pass against real runs before they are trusted.

**Recommendation: C**, with B as the fallback if the override rule proves confusing in practice.

### Open decisions for Sarah before implementation

1. Confirm Dim 5 carries **zero** mathematical weight (context only).
2. Approve or adjust the uneven-profile override (spread ≥ 2.0 → digit from lowest signal dimension).
3. Approve the ±0.35 cap on the Dims 6–7 modifier.
4. Confirm the initial by-feel reading is projected onto 1–9 for the Gap.
5. Decide whether the nine bands are evenly spaced across 1.0–5.0 or slightly widened at the extremes so digits 1 and 9 stay rare.

No code, questions, scoring, or UI changed in this task.

## Phase 2C — PATTERN-TO-NUMBER DISCOVERY (new phase, design/research only)

Recorded as the architecture phase that supersedes the rejected arithmetic route. No code changes in this phase either.

### Decision being recorded

The final 1–9 Gabriel's Number is **not** an average of eight self-rated 1–5 dimensions. The eight dimensions remain the conceptual lenses, but the number is the **emergent classification of the overall response pattern** — which dimensions are strong, which are weak, and crucially *in what combination*. Two people with the same mean can fall on different numbers, and that is correct behaviour, not an inconsistency.

### Demonstrated reasoning vs self-perception

Two distinct data types, both kept, never merged:

- **Demonstrated** — what the person's response *structure* shows when given a task. Evaluated on structure, not on confidence.
- **Self-perceived** — the person's own 1–5 rating of the same territory. Still valuable: the distance between demonstrated and self-perceived is one of the most informative things the instrument can capture (confident-but-assumption-heavy is exactly this gap).

At least some dimensions must move from self-report to scenario-based task/classification. Dimensions 1–3 are the strongest candidates (they are discriminations, so they can be *shown*); 4 and 7 are plausible; 5 and 8 stay largely self-report plus behavioural movement.

Worked example — **Dimension 1, Fact vs Interpretation.** Present a concrete scenario: *a friend reads a message and does not respond for six hours.* The person is then asked to sort or write what is observable fact versus what is interpretation. The system evaluates the **structure** of that response — whether motive, explanation, and conclusion are correctly placed on the interpretation side — rather than trusting a confidence rating. The same scenario also yields a self-perceived rating for comparison. Scenario content stays plain and non-diagnostic; the person is never told which sorting is "correct" before answering.

### Goal of Phase 2C

Construct and stress-test candidate **response patterns** for Numbers 1–9, with no meanings assigned. For each candidate number, the question to answer is: *what configuration across Dimensions 1–8 would plausibly characterize it?* Numbers are defined by pattern shape only — no ordering claim, no "9 is best", no meaning.

### Edge cases the pattern set must handle correctly

Each of these must land on a distinct, defensible pattern — and none may be pushed toward a low number by the principles already locked:

1. High emotional load + high clarity.
2. Calm + poor clarity.
3. Honest uncertainty + strong clarity.
4. Confident but assumption-heavy (self-perception high, demonstrated low).
5. Looping vs genuine iterative reasoning (both revisit; only one develops).
6. Avoidance with otherwise strong reasoning.
7. High revisability (must never read as instability or weakness).

An architecture that collapses any two of these onto the same number for the same reason is not yet defensible.

### Output shape

The final result is **the number plus a concise reflection** describing the observed pattern and the dimensions that characterize it — e.g. which discriminations held, which did not, what condition the reading was taken under. The reflection is non-diagnostic, describes the pattern rather than the person, and carries the interpretive weight so the digit does not have to.

### Still deferred

- Tree of Life / angel-number meanings — only after the 1–9 pattern architecture is defensible.
- Any implementation: questions, scenarios, scoring, number, and UI all stay as they are until Phase 2C is agreed.

### Next steps in Phase 2C

1. Decide which dimensions become scenario/task-based and which stay self-report.
2. Write the first scenario set (starting from the Dimension 1 message-read example) and the structural rules that evaluate a response.
3. Draft candidate patterns for Numbers 1–9 as dimension configurations, meaning-free.
4. Run the seven edge cases against those patterns and revise until each lands distinctly.

No code, questions, scoring, or UI changed in this task.
