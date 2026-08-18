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
- ~~Initial (by-feel) number vs evaluated number stays the centrepiece.~~ **Revised (see Phase 2D):** the opening self-selected numeric reading is removed. The opening is now a brief *word-based* "where am I starting from?" baseline — context only, never scored, never a 1–5 or 1–9 number. The number emerges only after the response pattern is evaluated. The comparison that stays central is **word-based starting state → emergent evaluated number**, not two self-selected numbers.

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

## Phase 2D — WORD-BASED PRE-READING & END-TO-END FLOW (new phase, design only)

Recorded as the next design decision. No code changes.

### Origin decision being recorded

The app is **not a personality quiz**, and the instrument's real-life origin was a trauma-informed daily self-reflection process: the person completed exercises, wrote honest summaries, received insight/feedback, and only *after* the full process asked "what is my number today?" In the original case the number 9 emerged from the evaluated pattern, not from a self-selected score.

Consequence: the opening self-selected **numeric** Clarity Tracker does not survive. It must not remain as a 1–5 or 1–9 self-selection. It is replaced by a brief **word-based** "where am I starting from?" self-description that captures the person's starting state *before* answering — context/baseline only, never a scored input, never another personality/state scale.

### The word-based opening — what it captures, what it must not become

It is a *baseline*, not a *measurement*. It records how the person describes where they are starting from, in their own words, so the emergent number can later be read against that starting point. It must not collapse into a Likert state scale.

What it should capture (short, optional, free or lightly-structured text — a few prompts, not a grid):

- **What the situation is** — one plain line about what this run is about (a decision, a conversation, a pattern, a direction, timing).
- **Where I am starting from** — the person's own short description of their current state in their own words (e.g. "tight and sure", "foggy and tired", "I've been over this a hundred times"). Plain language, no number.
- **What I'd point to if asked why** — one line, optional, naming the thing that is driving the current reading. This is context, not evidence.

What it must **not** do:

- Produce or imply a number. No 1–5, no 1–9, no slider, no band.
- Be scored, weighted, or fed into the 1–9 derivation in any way. It is printed alongside the result as the starting point the number is read against.
- Become a second instrument. It is a few words of context, not a parallel state inventory. If it grows past a short baseline it has failed.
- Diagnose. The starting-state words are the person's; the system paraphrases nothing clinical from them.

The opening words are reported back at the end ("You started here: …") so the emergent number is always read in context — this is the descendant of the old Clarity Gap's intent (compare where you started to where the pattern lands), but without a self-selected number on the starting side.

### End-to-end flow (locked as the target flow; not yet implemented)

1. **Word-based "where am I starting from?"** — the short baseline above. No number.
2. **Honest responses to the instrument** — Dimensions 1–8, including scenario/task-based demonstrations where appropriate *plus* self-perception ratings for the same territory. Demonstrated structure and self-perception are both kept and never merged (per Phase 2C).
3. **System identifies the overall response pattern** across Dimensions 1–8 — pattern shape, not average.
4. **System returns the emergent 1–9 number** — classification of the pattern, meaning-free until Phase 2E.
5. **System gives a concise pattern reflection** — which dimensions characterized the pattern, the conditions the reading was taken under (including load, drawn from the opening baseline where relevant), and the non-diagnostic reading of the gap between starting state and emergent number. The reflection carries the interpretation so the digit does not have to.
6. **Map established 1–9 meanings to the result** — *only after* the number architecture is defensible (Phase 2E). Tree of Life / angel-number mapping stays deferred and is explicitly out of scope until then.

### What this changes in earlier plan text (reconciliation, no code)

- The "initial by-feel 1–5 reading" referenced in §4 (Revisability), §5 (Clarity Gap), and the principle list is **superseded**. Where earlier text treats two self-selected numbers being compared, read it now as **starting-state-words ↔ emergent number**. The behavioural *second* reading for Revisability is preserved in spirit: instead of re-asking a by-feel *number* post-reveal, the person is re-shown their opening words and asked "having answered, where does it sit now?" — movement is still behavioural, still not a self-report, but expressed against the word baseline rather than a number. This is the one place the opening words are re-engaged; they are still not scored.
- The Clarity Gap's arithmetic form (§5) was already rejected with §4. Its *intent* — read the result against where the person started — survives in plain language via the opening-baseline report and the pattern reflection.

### Still deferred / out of scope

- Tree of Life / angel-number meanings — Phase 2E only, after number architecture is defensible.
- Any implementation: questions, scenarios, opening-baseline UI, scoring, number, reflection UI all stay as they are until the flow above is agreed.

No code, questions, scoring, or UI changed in this task.

## Phase 2C — CANDIDATE PATTERN ARCHITECTURE FOR NUMBERS 1–9 (DRAFT — not final)

Research/design draft to stress-test before implementation, and before the 1–9 meanings from Sarah's Pythagorean / Tree-of-Life source are restored. No code, UI, question, or scoring change. **No meanings are assigned to any digit here** — this section defines only what each *response pattern* looks like.

### Reading conventions

Levels are **relative configurations**, never totals: `strong` / `mixed` / `weak` / `uneven` (sharp disagreement inside a group). Two further axes carry real weight:

- **D–S alignment** — distance between **demonstrated** structure (task/scenario evidence) and **self-perception** (the person's own rating of the same territory). `aligned` / `over` (self above demonstrated) / `under` (self below demonstrated).
- **Load condition** — Dim 5 is read as *load present* × *load seen*, never as "how heavy, therefore how unclear".

Dimension groups used throughout: **core discriminations** = 1, 2, 3. **Uncertainty handling** = 4. **Conditions** = 5, 6, 7. **Stance** = 8.

Crucially, the nine patterns are **not a ranked ladder from bad to good**. Some are low-information patterns, some are high-coverage patterns, and several are *sideways* from each other — same amount of clarity, different shape. Ordering is a labelling convention only, chosen so neighbours differ on exactly one defining axis; it is not a quality ranking and must never be presented as one.

### 1) Candidate pattern profiles

**Pattern 1 — Unformed, and unclaimed**
Core 1–3 weak · 4 weak (unknowns not yet nameable) · load low-to-mixed · 6 weak (little movement yet) · 7 mixed · 8 mixed · **D–S aligned or under**.
The reading has not formed and the person is not claiming it has. Nothing is being defended.

**Pattern 2 — Formed early, held firmly**
Core 1–3 weak-to-mixed (especially 2 weak) · 4 weak (no named unknowns) · 8 **weak** · **D–S over** (self-perception clearly above demonstrated).
A conclusion is in place and being held. The distinguishing feature is not weakness but *confidence that outruns structure*.

**Pattern 3 — Reaction carrying the account**
3 **weak** while 1 and 2 mixed-to-strong · load present and **not seen** (low load-awareness) · 6 mixed · 8 mixed.
The account of the situation is fused with the response to it. Dim 3 is the defining weak point, not overall weakness.

**Pattern 4 — Circling**
Core 1–3 mixed-to-strong · 6 **weak** (repetition without development) · 4 weak *on resolution criteria specifically* (can name unknowns, cannot say what would settle them) · 7 **strong** (nothing being avoided) · 8 mixed.
Considerable material has been examined, repeatedly, without moving. Coverage is fine; movement is not.

**Pattern 5 — Steering around something**
Core 1–3 mixed-to-strong · 7 **weak** · 6 **strong** (thinking is moving) · 4 mixed.
Sound reasoning with a hole in its coverage. The exact inverse of Pattern 4 on the 6/7 pair.

**Pattern 6 — Uneven**
Core 1–4 **uneven** — sharp disagreement, one discrimination clearly strong and another clearly weak · conditions mixed · 8 mixed.
Parts of the situation are seen well and parts are barely seen. Reporting this as a middling result is exactly the failure the whole architecture exists to prevent; the reflection must name which discrimination is carrying and which is missing.

**Pattern 7 — Grounded in what is not known**
Core 1–3 strong · 4 **strong** (unknowns named *and* resolution criteria named) · 6 strong · 7 mixed-to-strong · load mixed and **seen** · 8 **strong** · **D–S aligned**.
The clearest available conclusion is an accurate account of the edge of certainty. Honest uncertainty is the *defining strength* of this pattern, never a deduction.

**Pattern 8 — Held under weight**
Core 1–4 strong · load **high and clearly seen** · 6 mixed-to-strong · 7 mixed-to-strong · 8 strong · **D–S aligned**.
The discriminations hold while significant weight is present and visible. This is a strong pattern *because* of the load condition, not despite it.

**Pattern 9 — Integrated**
Core 1–4 strong · conditions 5–7 all strong (load seen, thinking moving, coverage complete) · 8 strong · **D–S aligned**.
Everything the instrument can see is accounted for, including the stance toward being wrong. The distinguishing feature versus 7 and 8 is *conditions strong across the board*, not higher core scores.

### 2) Defining combinations (what separates each from its neighbours)

| Pattern | Defining combination |
| --- | --- |
| 1 | Weak core **with** D–S aligned/under — unformed and unclaimed |
| 2 | Weak core **with** D–S over **and** 8 weak — claimed without structure |
| 3 | 3 weak **while** 1–2 hold, **and** load unseen — a Dim-3-specific failure |
| 4 | 6 weak **with** 7 strong — movement problem, coverage intact |
| 5 | 7 weak **with** 6 strong — coverage problem, movement intact |
| 6 | Spread inside 1–4 is the signal itself, regardless of level |
| 7 | 4 strong (unknowns + criteria) **with** core strong and 8 strong |
| 8 | Core strong **with** high-and-seen load |
| 9 | Core strong **with** all of 5, 6, 7 strong |

Neighbour separations are single-axis by design: 1↔2 = D–S alignment. 4↔5 = the 6/7 inversion. 6↔any = spread vs level. 7↔8 = load condition. 8↔9 = conditions partial vs complete. 2↔6 = confidence gap vs internal disagreement. 3↔2 = which dimension fails, and whether load is seen.

### 3) What must NOT push a pattern lower

- **High emotional load.** Load never subtracts. High load *with* load-awareness is a distinguishing strength (Pattern 8). Load is a condition the reading was taken under, reported in words.
- **Honest uncertainty.** Naming unknowns accurately is Dim 4 *strength*. Pattern 7 is built on it. "Fewer unknowns" is never read as "clearer".
- **Reconsidering / high revisability.** Dim 8 strength never costs anything and never marks instability. Movement between the opening words and the post-reveal re-read is reported as movement, not error.
- **The future non-scored "I genuinely don't know" response.** Entirely outside the pattern classification.
- **The opening word-based baseline.** Context only. It is displayed with the result and never used as evidence for the number.
- **Low self-perception.** A person underrating themselves (D–S under) is not penalized; it is reported as the gap it is.

### 4) The seven locked edge cases, tested

| Edge case | Lands on | Why it is correct |
| --- | --- | --- |
| High emotional load + high clarity | **8** | Load high and seen, core holds. Load raises nothing artificially and subtracts nothing; it defines the pattern. |
| Calm + poor clarity | **1** (if D–S aligned) or **2** (if D–S over) | Low load cannot substitute for discrimination. Calm is not evidence. The split by D–S alignment is what makes these two honest rather than one blurred verdict. |
| Honest uncertainty + strong clarity | **7** | Dim 4 strength plus strong core. This case exists to prove uncertainty is not a deduction. |
| Confident but assumption-heavy | **2** | Caught by D–S over plus 2 weak plus 8 weak — the case that self-report alone cannot detect, which is why demonstrated tasks are required. |
| Looping vs genuine iterative reasoning | **4** vs **7/9** | Both revisit. Looping = 6 weak with 4 weak on resolution criteria. Genuine iteration = 6 strong, each pass changing the account. This pair is the single strongest argument for demonstrating Dim 6 rather than self-rating it. |
| Avoidance with otherwise strong reasoning | **5** | 7 weak in isolation, core intact. Reported as reduced *coverage*, never as "you are avoiding, therefore unclear". |
| High revisability | Raises nothing artificially; supports **7/8/9** and separates **2** | Dim 8 strength never lowers a pattern and never reads as instability. |

### 5) Pairs that were too similar, and the revisions made

- **4 vs 5** (originally both "sound reasoning with a problem"). Revised: the 6/7 pair is now *inverted* between them — 4 requires 7 strong, 5 requires 6 strong. Neither can absorb the other.
- **7 vs 9** (originally both "strong core + strong 8"). Revised: 7 is defined by Dim 4 specifically with conditions only mixed; 9 requires all three conditions strong. 7 is not a lesser 9 — it is the pattern where the edge of certainty is the finding.
- **8 vs 9** (originally both "strong everything"). Revised: 8's defining feature is the load condition; 9's is complete conditions. A 9-shaped profile under low load is 9; the same core under high seen load with partial conditions is 8.
- **1 vs 2** (originally one "low clarity" pattern). Revised: split on D–S alignment. This is the split that keeps the instrument from calling honest not-knowing the same thing as unearned confidence.
- **2 vs 6** (both show internal inconsistency). Revised: 2's inconsistency is *between* demonstrated and self-perceived; 6's is *within* the demonstrated core. Different axes, different patterns.
- **3 vs 6** (a single weak dimension could read as uneven). Revised: 3 is claimed only when the weak dimension is specifically 3 *and* load is present-but-unseen; otherwise a lone weak discrimination with sharp spread is 6.

Remaining risk to test with real runs: 6 is the widest pattern and could over-absorb 3, 4, and 5 cases. Rule of precedence to try — a **named single-dimension** pattern (3, 4, 5) takes precedence over 6 when the weakness is isolated to that dimension; 6 is claimed only when *two or more* of the core 1–4 disagree sharply.

### 6) Output shape

The result is **the emergent number plus a concise non-diagnostic reflection**, in this order:

1. **The number** — 1–9, meaning-free at this stage, presented as a classification of the pattern, never as a score, percentage, or grade, and never framed as a rank.
2. **The reflection** — a few plain sentences describing the *observed pattern*: which discriminations held, which did not, the condition the reading was taken under (load present/seen, thinking moving/repeating, coverage complete/partial), and the stance toward updating. It describes the pattern, not the person, and contains no diagnosis, advice, or prediction.
3. **The opening words, shown as context** — "You started here: …", displayed alongside the result so the number is read against the starting point. Explicitly context, never evidence, never scored.
4. **Where a D–S gap exists**, it is named plainly and neutrally (e.g. "your own read of this sat above what the responses showed") without judgment language.

### Status

**DRAFT — explicitly not final.** These nine patterns are a stress-test artefact. Next steps before any implementation: run real and constructed profiles against the nine definitions, confirm the 6-precedence rule holds, decide which dimensions become demonstrated tasks (Phase 2C step 1), and only then move to Phase 2E for restoring the 1–9 meanings from the uploaded Pythagorean / Tree-of-Life source.

No code, questions, scoring, or UI changed in this task.

## Phase 2C — STRESS TEST OF THE NINE-PATTERN ARCHITECTURE (research only)

Design/research exercise. No code, UI, question, scoring, or behaviour change. No symbolic system is used anywhere below to rescue a definition; the digits remain provisional labels.

Notation: `1–4` = core discriminations + uncertainty handling. `5L` = load present, `5S` = load seen. `6` movement, `7` coverage, `8` stance. `D–S` = demonstrated vs self-perceived (aligned / over / under).

### TEST SET A — Constructed profiles

**A1. Very low clarity, genuinely unsure, not overclaiming.** 1–3 weak, 4 weak (cannot yet name unknowns), 5L low, 6 weak, 7 mixed, 8 mixed, D–S aligned.
→ **1**. Drivers: weak core + D–S aligned. Competing: 2 (weak core), 7 (unsureness). Resolver: D–S alignment separates 1 from 2; 7 requires Dim 4 *strong* (unknowns **and** criteria named) which is absent. **Succeeds.**

**A2. Very low clarity, extremely confident, assumption-heavy.** 1–2 weak, 3 mixed, 4 weak, 8 weak, D–S over (large).
→ **2**. Drivers: D–S over + 2 weak + 8 weak. Competing: 1, 6. Resolver: D–S over rules out 1; the inconsistency is across the D–S axis, not inside the core, so not 6. **Succeeds — and this is the case self-report alone cannot catch.**

**A3. High emotional load, excellent discrimination.** 1–4 strong, 5L high + 5S high, 6 mixed, 7 mixed, 8 strong, D–S aligned.
→ **8**. Drivers: strong core under high-and-seen load. Competing: 9 (strong core), 7. Resolver: 9 requires 5/6/7 all strong; here 6 and 7 are mixed. **Succeeds.**

**A4. Calm, low load, poor discrimination.** 1–3 weak, 4 weak, 5L low, 6 mixed, 7 mixed, 8 mixed, D–S aligned.
→ **1**. Drivers: weak core, low load contributes nothing. Competing: 2. Resolver: D–S aligned. **Succeeds — confirms calm is not evidence.**

**A5. Honest uncertainty + excellent resolution criteria.** 1–3 strong, 4 strong (unknowns + what would settle them), 6 strong, 7 strong, 5L mixed + seen, 8 strong, D–S aligned.
→ **7**. Drivers: Dim 4 strong with strong core and strong 8. Competing: 9 (conditions look strong). Resolver: 9 needs 5/6/7 all strong *including* load seen at full strength; here load is mixed and Dim 4 is the defining finding. **Ambiguous at the margin** — see Set C, 6-vs-7 and 7-vs-9 notes; needs a stated precedence rule (proposed below).

**A6. High-confidence reasoning, weak fact/interpretation separation.** 1 weak, 2 mixed, 3 mixed-strong, 4 mixed, 8 weak, D–S over.
→ **2**. Drivers: D–S over + 8 weak. Competing: 6 (single weak core dimension), 3. Resolver: precedence — D–S over with 8 weak claims 2 before spread claims 6; 3 requires the weak dimension to be 3 with load unseen. **Succeeds, but only because the D–S rule fires first — precedence must be written down explicitly.**

**A7. Strong reasoning, repetitive looping.** 1–3 strong, 4 weak on criteria only, 6 weak, 7 strong, 8 mixed.
→ **4**. Drivers: 6 weak + 7 strong. Competing: 5 (inverse), 6. Resolver: the 6/7 inversion. **Succeeds.**

**A8. Strong reasoning, one emotionally avoided area.** 1–3 strong, 4 mixed, 6 strong, 7 weak, 5L present, 8 mixed.
→ **5**. Drivers: 7 weak + 6 strong. Competing: 4, 8. Resolver: inversion rules out 4; 8 requires load high *and seen* plus core 1–4 strong. **Succeeds.**

**A9. Strong reasoning with genuine iterative updating.** 1–4 strong, 6 strong (each pass changes the account), 7 strong, 5L mixed + seen, 8 strong.
→ **9** if 5S counts as strong, **7** if load reads as only mixed. Competing: 7, 8. **Ambiguous** — the 7/8/9 triangle is decided by a load judgement that is currently underspecified.

**A10. Highly revisable, keeps correcting accurately.** 1–4 strong, 8 strong, 6 strong, 7 mixed, D–S aligned or under.
→ **7** or **9**. Drivers: 8 strong never lowers. Competing: 4 (revisits!). Resolver: 6 strong + accurate correction distinguishes iteration from looping. **Succeeds on the 4 boundary, ambiguous on 7/9.**

**A11. Excellent almost everywhere, large D–S mismatch.** 1–4 strong demonstrated, 6–7 strong, 8 strong, D–S over (large).
→ **currently 9 or 2, and neither is right.** 2's definition requires a weak core; 9's requires D–S aligned. **FAILS — architecture gap.** A strong-demonstrated profile with a large self-perception gap has no home. See Set E.

**A12. Highly integrated, ordinary/low load.** 1–4 strong, 5L low (nothing to see), 6 strong, 7 strong, 8 strong, D–S aligned.
→ **9**. Competing: 8. Resolver: 8 requires load high-and-seen. **Succeeds — but exposes that 5S cannot be "strong" when there is no load to see.** Load must be scored as *coherence between 5L and 5S*, not as a level.

### TEST SET B — Adversarial profiles

**B1. Polished language, weak reasoning.** Fluency inflates nothing if Dims 1–3 are demonstrated; if self-rated, polish drives D–S over → **2**. **Succeeds only with demonstrated 1–3.** Self-report-only implementation fails this case.

**B2. Anxious language, strong reasoning.** High 5L, hedged wording, demonstrated 1–4 strong. → **8**. Risk: a language-sensitive evaluator misreads hedging as weak discrimination. **Succeeds if and only if scoring reads response structure, not tone.** Recorded as a hard implementation constraint.

**B3. Uncertainty that is actually avoidance.** "I don't know" everywhere, no resolution criteria, one specific area consistently unaddressed. → should be **5**, competes with **7**. Resolver: 7 requires named resolution criteria; avoidance produces unknowns without criteria *and* a coverage hole. **Succeeds — this is exactly why Dim 4 was defined as unknowns + criteria.**

**B4. Apparent revisability that is indecision.** Reading changes repeatedly, no new information driving change, 6 weak. → **4**. Competing: 8-strong reading. Resolver: revisability requires change *in response to something*; without 6 strong it is churn. **Succeeds, but requires Dim 8 to be demonstrated (movement against the opening words), not self-rated.**

**B5. Apparent iteration that is looping.** Same conclusion re-narrated with new vocabulary. → **4**. Resolver: demonstrated Dim 6 must test whether the *account changed*, not whether the person revisited. **Succeeds only with demonstrated 6.**

**B6. High load recognized vs high load distorting.** Recognized → **8**. Distorting (load present, unseen, contaminating Dim 3) → **3**. Resolver: 5L/5S coherence plus Dim 3. **Succeeds — clean separation.**

**B7. Self-ratings dramatically higher than demonstrated.** → **2** if core weak; **no home** if core strong (see A11). **Partial fail.**

**B8. Self-ratings dramatically lower than demonstrated.** D–S under, core strong. → **7** or **9**, unpenalized. **Succeeds** — but the reflection must name the gap, and nothing currently guarantees it.

### TEST SET C — Boundary tests (smallest meaningful change)

- **1 vs 2:** self-perception rises above demonstrated while the core stays weak — one axis, clean. **Clean boundary.**
- **2 vs 3:** load becomes present-and-unseen and the weakness localizes to Dim 3 while 1–2 recover to mixed. **Clean, but 2 must take precedence when D–S over is large — needs writing down.**
- **3 vs 6:** a second core dimension diverges sharply, or load becomes seen. **Clean under the proposed precedence rule (named single-dimension beats 6); undefined without it.**
- **4 vs 5:** flip which of 6/7 is weak. **Cleanest boundary in the set.**
- **5 vs 6:** the coverage hole is accompanied by a second sharply divergent core dimension. **Clean with precedence; ambiguous without.**
- **6 vs 7:** the spread inside 1–4 closes and Dim 4 becomes strong on criteria. **Clean.**
- **7 vs 8:** load moves from mixed to high-and-seen. **Boundary depends entirely on a load threshold that does not yet exist. Not clean.**
- **8 vs 9:** conditions 5/6/7 move from partial to complete. **Not clean while 5S is unscoreable at low load (A12).**
- **2 vs 6:** the inconsistency relocates from the D–S axis to inside the core. **Conceptually clean; operationally needs the precedence rule.**

Conclusion for Set C: five boundaries are clean, four (3/6, 5/6, 7/8, 8/9) depend on rules that are currently implicit.

### TEST SET D — Fundamental logic check

- **Nine distinct configurations, or a nine-step hierarchy?** Mostly distinct — 4/5 and 7/8 are genuinely sideways from each other. But 1 → 2 → 3 → 6 → 7 → 9 reads as ascending, and A5/A9/A10/A12 all drifted toward the high end, which is what a hierarchy does. **Partial failure: the ordering is doing quiet ranking work.** Fix: state the meaning-free labels as an unordered set, and stop implying neighbours differ by degree.
- **Any dimension treated as inherently better?** Dims 1–4 carry all the classification weight; 5–8 only condition it. That is defensible and was decided deliberately — but Dim 4 has become unusually powerful (it alone gates Pattern 7). Worth watching, not a fault.
- **Unfairly rewards low emotional load?** No, and A4/A12 confirm it — low load lands on 1 when discrimination is weak. But A12 exposes the reverse problem: low load makes Pattern 9 *easier* to reach than Pattern 8, because 5S is trivially satisfiable when there is nothing to see. **Must fix: score load as 5L/5S coherence.**
- **Rewards certainty over honest uncertainty?** No. A5/B3 show Dim 4 strength is a defining strength and unknowns-without-criteria is caught elsewhere. **Passes.**
- **Penalizes reconsideration?** No. A10/B4 land correctly and Dim 8 never subtracts. **Passes.**
- **Gameable?** Yes, substantially, if any of 1, 2, 3, 6, 8 stay self-report — B1/B4/B5 are all won by knowing what to say. Gaming demonstrated tasks is much harder because the sorting structure, not the confidence, is evaluated. **Conditional pass, dependent on demonstration.**
- **Which dimensions absolutely require demonstrated evidence?** **1, 2, 3, 6** — mandatory (B1, B5). **8** — mandatory as behavioural movement against the opening words (B4). **4** — strongly recommended (criteria can be shown). **5, 7** — self-report acceptable; 7 can be partly inferred from what the responses never touch.
- **Is D–S alignment a hidden scoring mechanism?** It is drifting that way: it is currently the sole separator for 1/2 and the tiebreak in A6, yet it has no definition, threshold, or bound. **Risk flagged.** It should stay a *qualifier* that selects between patterns and appears in the reflection — never a magnitude that pushes a result up or down.
- **Is Pattern 6 an overly broad catch-all?** Yes, as written. A6, A7, A8 and every single-weak-dimension case could all be argued into 6. The proposed precedence rule (named single-dimension patterns 3/4/5 beat 6; 6 requires two or more of 1–4 sharply disagreeing) fixes it, and must be promoted from a note to a rule.

### TEST SET E — Verdicts and required outcome

**1) Verdict per pattern**

| Pattern | Verdict | Note |
| --- | --- | --- |
| 1 | **PASS** | A1, A4 clean |
| 2 | **REVISE** | Must cover strong-core + large D–S over (A11), or a new pattern must |
| 3 | **PASS** | B6 separation is clean |
| 4 | **PASS** | Strongest definition in the set |
| 5 | **PASS** | B3 handled |
| 6 | **REVISE** | Precedence rule must become explicit |
| 7 | **REVISE** | Needs a stated load threshold to separate from 8, and criteria-precedence vs 9 |
| 8 | **REVISE** | Load must be defined as 5L/5S coherence, with a threshold |
| 9 | **REVISE** | Cannot be reachable more easily at low load than 8 |

**2) Definitions that must change**

1. **Load definition.** Dim 5 becomes *coherence between load present (5L) and load seen (5S)*, not a level. "Load seen" is undefined when no load is present, so Pattern 9 must not treat absent load as a satisfied condition.
2. **Pattern 6 precedence.** Written as a rule: a named single-dimension pattern (3, 4, 5) claims the profile when the weakness is isolated to that dimension; 6 requires two or more of Dims 1–4 in sharp disagreement.
3. **D–S bounds.** D–S is a qualifier, not a magnitude. Define what "over" and "under" mean operationally, cap its role at *pattern selection plus a named sentence in the reflection*, and forbid it from moving a result up or down.
4. **7 vs 8 vs 9 precedence.** Explicit order of tests: is load high-and-seen (→8) → are all conditions coherent (→9) → is Dim 4 the defining finding (→7). Written as a decision order, not three overlapping descriptions.
5. **Drop the ascending presentation.** Labels are an unordered set; neighbour language in the draft implies degree and must go.

**3) Missing pattern**

Yes — **a strong-demonstrated profile with a large self-perception mismatch** (A11, B7). Two options: (a) widen Pattern 2 to "confidence outruns structure *or* self-read diverges sharply from demonstrated, at any core level", or (b) add it as its own configuration and retire the weakest of the current nine. Option (a) is cheaper and keeps nine slots; option (b) is cleaner conceptually. **Recommendation: (a) for now**, since the mismatch is the same phenomenon at a different level, and revisit if real runs show the two levels behave differently.

**4) Proposed revision**

Revision is necessary but **not** a rewrite: the nine configurations survive. Required changes are the five definitional fixes above plus the Pattern 2 widening. A full replacement architecture is not warranted by this stress test, and is not proposed.

**5) Unresolved questions before Phase 2E**

1. What operationally counts as "high load" for the 7/8 boundary?
2. How is 5L/5S coherence measured — self-report pair, or inferred from response structure?
3. What magnitude of D–S divergence counts as "over"/"under", and who decides — fixed thresholds or relative to the rest of the profile?
4. Does the widened Pattern 2 stay one pattern across all core levels, or split?
5. Which of Dims 1, 2, 3, 6, 8 get demonstrated tasks in the first implementation, and what is the fallback for the rest?
6. How is demonstrated Dim 6 tested — does the evaluator need two passes over the same scenario to see whether the account changed?
7. Are the nine labels genuinely unordered in presentation, and how is that shown to a person without implying rank?
8. What happens when a profile matches no pattern, or two equally? Is there an explicit "no clean pattern" outcome, and what does the reflection say then?

**Status: REVISE — architecture survives the stress test with six required definitional fixes and one gap to close.** No code, questions, scoring, or UI changed in this task.

## Milestone 3 — PRODUCT DIRECTION LOCKED + FIRST ADAPTIVE FLOW SPEC (design only)

No production code, UI, questions, or scoring changed in this task. This is the design to review before coding.

### Locked product direction

Gabriel's Number is a **psychologically grounded, reality-based reflection / decision lens**. It is not a personality quiz, not a correctness test, and not a conventional score.

- Any real-life question is welcome, casual or heavy: "I don't know what to do today", "Should I text them?", "I'm feeling lucky — should I gamble?", "Should I make this big decision?" The system **does not judge the premise** and never advises for or against it.
- There are **no right or wrong answers and no good or bad numbers.** No number is better than another; the app never pushes anyone toward 9.
- The result is an **emergent 1–9 number** from the person's actual response pattern, or **Undetermined**.
- **Undetermined is not failure.** It means the available input does not support a defensible pattern yet. It is offered warmly, with what would make a reading possible — never as an error state.
- The same starting question can produce different numbers for different people, because the number comes from the response pattern, not the topic.
- The final result presents the **established psychological meaning** of that number as a reflection lens — not a diagnosis, verdict, prediction, or a claim the person "has" that number permanently. Today's number is today's.
- **Sarah's established 1–9 meanings and the Tree of Life / Pythagorean framework are preserved as the symbolic/psychological interpretive layer.** They are not invented, replaced, or paraphrased by this project. (Open item: those source files have not yet been received in a readable form — see Open items.)
- Tone: playful, intriguing, human. The reasoning underneath stays rigorous. It must not look like a clinical examination.

### Interaction constraints (hard)

- **Taps and choices first.** No required paragraphs, no psychological essays. Optional brief text only where it genuinely adds signal — and never as a gate to the result.
- **Short.** Target 8–12 interactions after the opening, most of them a single tap.
- **The eight dimensions are never displayed as a checklist.** No dimension names, no progress bar labelled with clinical terms, no per-dimension scores shown.
- **Reveal, don't interrogate.** At least some items make the person *do* something whose structure is informative, rather than rate themselves.

### Stress-test findings carried into this spec

Emotional load is context, never a penalty. Honest uncertainty can be highly clear. Reconsideration and revisability are never weaknesses. Looping and genuine iteration must be distinguished by whether the account *changed*, not by whether the person revisited. Pattern 6 may not act as a catch-all (named single-dimension patterns take precedence). Self-reported confidence never overrides demonstrated response structure — where the two disagree, the demonstrated structure classifies and the gap is named neutrally in the reflection.

### The adaptive flow — shape

```text
Opening (words, context only, not scored)
        │
        ├─ intent capture: what is this about, in your words / a tap
        └─ starting-state words: where you're starting from
        │
Core reveal block  (fixed, 4 interactions — every run gets these)
        │  sort task        → reveals 1 Fact vs Interpretation
        │  split task       → reveals 2 Known vs Felt/Assumed
        │  account task     → reveals 3 Observation vs Reaction
        │  gap task         → reveals 4 Uncertainty (unknowns + what would settle)
        │
Adaptive condition block  (3–5 interactions, selected by what the core showed)
        │  chosen from: 5 load  ·  6 movement  ·  7 coverage
        │
Stance close  (2 interactions)
        │  re-show opening words → "where does it sit now?"  → reveals 8
        │
Pattern classification  →  1–9  or  Undetermined
        │
Result: number + plain reflection + opening words shown as context
        │
        └─ established meaning of that number as a reflection lens
```

**Adaptivity rule (the part that must not predetermine the number):** branching selects *which condition dimensions get probed and with which scenario framing*, never which number is available. Every one of the nine patterns must remain reachable from every branch. Concretely: the branch is chosen by the *shape* of the core block (e.g. core strong → probe 6 and 7 harder, because movement and coverage are what would differentiate; core uneven → probe the specific weak discrimination again in a different framing to check it wasn't a wording artefact; load visibly present in the opening words → probe 5 coherence). Branching changes resolution, not destination.

**Undetermined triggers:** fewer than the required core interactions completed; core tasks answered in a way that carries no structure (all-same taps, contradictory sorts); or two or more patterns tie with no resolving evidence. The copy names what would help — "one more pass on the part about X would make this readable" — and offers a re-run.

### How the eight dimensions are revealed rather than asked

| Dim | Reveal mechanic (tap-based) |
| --- | --- |
| 1 Fact vs Interpretation | Sort 5–6 short lines about the person's own situation (auto-generated from their intent, or picked from a scenario) into "this happened" / "this is what I make of it". Structure of the sort is the evidence. |
| 2 Known vs Felt/Assumed | Same lines, second pass with a different cut: "I could show this to someone" / "this is my read". Disagreement between pass one and pass two is itself signal. |
| 3 Observation vs Reaction | Present two versions of the same event, one stripped of response language, one with it. Ask which is closer to how they'd tell it. |
| 4 Uncertainty | Tap the pieces they don't have yet from a short list, then tap which one would actually change their mind. Naming a resolver is the strength; naming none is the finding. |
| 5 Emotional Load | Two taps: how much this is weighing (load present) and how much of that weight they can see acting on their thinking (load seen). Scored as *coherence*, never as level. |
| 6 Mental Movement | Ask for their read early, then again later after the sorts. Whether the *content* changed — not whether they revisited — separates iteration from looping. |
| 7 Avoidance | Offer the parts of the situation as taps and note which are consistently not chosen when they had the chance. Coverage is inferred from what is never touched. |
| 8 Revisability | Re-show their own opening words and ask where it sits now. Movement against their own baseline, behavioural, not self-rated. |

### Three example starting intents

**Example A — "Should I text them?" (light, relational)**

- Opening: intent tap "a conversation"; starting words: *"restless, keep picking up my phone."*
- 1: sort lines like "they read it and haven't replied" / "they're annoyed with me" / "it's been six hours" → fact vs interpretation.
- 2: second cut on the same lines — which could be shown to someone else.
- 3: two tellings of the six-hour silence, one with response language, one without.
- 4: tap what's missing (whether they've been busy / what they actually felt about the last message), then tap which one would change the decision.
- Adaptive: opening words showed restlessness → probe **5** coherence and **6** (has the read moved since the first tap, or just been re-said).
- 8: re-show *"restless, keep picking up my phone"* → where does it sit now.
- Outcome space: a person who sorts cleanly, names a resolver and moves → one pattern. A person who sorts interpretation as fact and holds firm → a different one. **Same opening question, different numbers.**

**Example B — "I'm feeling lucky, should I gamble?" (casual, no premise judgment)**

- The app does not advise on gambling and does not moralize. The lens is the reasoning, not the activity.
- 1: sort "I've won the last two times" / "I'm on a run" / "I have £X spare" → fact vs interpretation. The "on a run" line is where the structure shows.
- 2: which of these could be shown to someone.
- 3: telling it with the feeling in vs out.
- 4: what's unknown (odds, what they'd do if it went the other way) and what would change the decision.
- Adaptive: if the core shows strong structure → probe **7** (is the losing case ever tapped?) and **6**. If core shows fusion → re-probe **1** in a second framing before concluding.
- 8: re-show *"feeling lucky"* → where does it sit now.
- Outcome space: "feeling lucky" is not automatically low clarity. Someone who cleanly separates the feeling from the facts, names the unknowns, and can still say "and I want to anyway" is a *high-coverage* pattern. Someone who can't tell the run from the odds is a different pattern. Neither is judged for gambling.

**Example C — "Should I make this big decision?" (weighty, high load)**

- Opening words likely carry load: *"heavy, and I've been going round it for weeks."*
- 1–4 as above, framed on their own decision.
- Adaptive: "going round it for weeks" is a movement flag → probe **6** hard (did the account change across passes, or is it the same conclusion in new words) and **5** coherence (is the weight visible to them). Then **7** if a part of the decision is never tapped.
- 8: re-show their words → movement.
- Outcome space: high load with the load clearly seen and discriminations holding is a *strong* pattern, not a penalized one. Weeks of circling with intact coverage is the movement pattern, not a low-clarity verdict.

Across all three: identical eight dimensions, identical classification, entirely different surface language — and no branch that can only produce one number.

### Open items before coding

1. **Sarah's 1–9 meanings source is still needed.** The Pythagorean / Tree-of-Life file has not been received in readable form in this project; nothing can map digits to meanings until it is supplied. Until then the app must ship the number meaning-free or not ship the meaning layer.
2. The six definitional fixes from the stress test (load coherence, Pattern 6 precedence, D–S bounds, 7/8/9 decision order, unordered labels, widened Pattern 2) are prerequisites for classification.
3. Where do the sortable lines come from for a free-text intent — generated, or drawn from a small library of situation templates keyed to the intent tap?
4. Exact Undetermined thresholds.
5. Whether optional brief text is stored in local history alongside the pattern.

No code, questions, scoring, or UI changed in this task.

---

## Milestone 4 — CONTEXT DOORWAYS (design only, no production code)

Revision to the Milestone 3 opening. The opening is no longer a bare words box: it is a short chain of small, natural context branches that act as **a doorway into the deeper framework**. Two taps and, optionally, a handful of the person's own words — then the reveal block begins.

### Locked design principles for the doorway layer

- The opening context branch is **not scored** and does **not predetermine a number**.
- It is a doorway into a deeper framework for clarity — nothing more.
- Branches are short, natural, human, sometimes playful. Never a clinical exam.
- **"I don't know" is always a legitimate answer** and is never treated as poor clarity. Every branch list ends with an honest-unknown option and a "none of these — let me explain" escape.
- The same starting prompt can lead to **any of the nine numbers**, depending on the responses underneath it.
- The deeper questions reveal the eight dimensions **indirectly**. The user never sees a dimension checklist, dimension names, or per-dimension scores.
- **No required long-form writing.** Mostly taps; optional short text only where it genuinely adds signal, never as a gate to the result.
- No right/wrong answer, no good/bad number, no pressure toward 9.
- Final result is an emergent **1–9** or **Undetermined**.
- Established number meanings are interpretive lenses — not diagnoses, predictions, or permanent labels.

### Shape of the doorway

```text
Level 0  opening intent          (tap a card, or type your own line)
Level 1  human follow-up         "Okay. What's underneath that?"  → 6–9 concise taps
Level 2  one level deeper        branch-specific taps, still topic/context language
   ↓     (optional: a few of your own words — skippable)
Core reveal block  →  adaptive condition block  →  stance close  →  1–9 / Undetermined
```

Rules for the chain:
- Level 1 and Level 2 are **topic and context only**. They ask *what this is about*, never *how well you are thinking about it*.
- The transition happens at the first reveal task, where the person begins **doing** something (sorting, splitting, choosing a telling) instead of describing a topic.
- Level 2 output feeds only the **framing** of the reveal tasks — which situation lines get sorted, which unknowns are offered. It never selects, weights, or excludes a number.
- Max two levels. If Level 2 is "I don't know", the app proceeds anyway with generic-but-honest framing; unknown is a legitimate doorway.

### Context Doorways — six entry points

**1. "I don't know what the hell to do today."**

Follow-up: *"Okay. What's underneath that?"*
- I'm trying not to drink/use
- I'm avoiding something I need to deal with
- I have a conversation I don't want to have
- I don't know what I want anymore
- I have a decision hanging over me
- I feel restless and need something to do
- Something happened and I can't stop thinking about it
- Honestly, I have no idea
- None of these — let me explain

Level 2, if "I'm avoiding something": *"Any sense what kind of thing?"* — a heavy conversation · a responsibility · a decision · a feeling · a person · something I know I need to change · I don't actually know what I'm avoiding.

Transition into the dimensions: the named thing supplies the lines for the sort task (1 and 2), the two tellings (3), and the unknown list (4). Restlessness or "can't stop thinking" flags 5 and 6 for the adaptive block. "I don't actually know what I'm avoiding" is treated as *usable information*, and the coverage probe (7) simply offers the parts of the day and notes what never gets touched.

**2. "Should I text them?"**

Follow-up: *"What's the pull here?"*
- I want to know where I stand
- I said something I regret
- They went quiet and I don't know why
- I miss them
- I want to fix it now, before I lose my nerve
- I'm bored and they're the person I reach for
- I don't want to text, I want to stop wanting to
- No idea, honestly
- None of these — let me explain

Level 2, if "They went quiet": *"How long are we talking?"* — hours · a day or two · longer than usual for us · they've never gone quiet before · I've lost track.

Transition: the silence supplies sortable lines ("it's been six hours" / "they're annoyed with me"), the two tellings for 3, and the unknowns for 4 (whether they've been busy; what the last message actually said). Then 6 (has the read moved or just been re-said) and 8 (re-show their own words).

**3. "I'm feeling lucky — should I gamble?"**

Follow-up: *"Where's the luck coming from?"* — no judgment on the premise; the lens is the reasoning, not the activity.
- I've been winning
- I'm due a win
- Something good happened today
- I want the rush
- I want to get something back
- I have spare money and nothing on
- It's a mate's thing, not really my idea
- Couldn't tell you
- None of these — let me explain

Level 2, if "I'm due a win": *"What's the run been like?"* — losing lately · up and down · I've stopped counting · I'd rather not look · I know exactly, to the penny.

Transition: "I'm on a run" versus "I've won twice" is the sort task's live edge (1, 2). The unknown list (4) offers odds and the losing case; whether the losing case ever gets tapped feeds 7. "I want the rush" routes load coherence (5). Cleanly separating the feeling from the facts and still choosing to play is a high-coverage pattern, not a low one.

**4. "Should I make this big decision?"**

Follow-up: *"What makes it big?"*
- It's hard to undo
- Other people are affected
- Money
- It changes where I live or work
- It's been hanging over me for ages
- Everyone has an opinion about it
- It's not big to anyone else, only me
- I'm not sure why it feels big
- None of these — let me explain

Level 2, if "It's been hanging over me for ages": *"What's happened in that time?"* — nothing's changed · I keep changing my mind · I've decided and un-decided · I've been gathering information · I've been not looking at it · I couldn't say.

Transition: the stakes supply the lines. "Hanging over me for ages" is a movement flag → probe 6 hard (did the account change across passes, or is it the same conclusion in new words) and 5 coherence (is the weight visible to them). Coverage (7) checks whether one side of the decision is ever tapped.

**5. "Something's off and I can't name it."**

Follow-up: *"Where do you notice it?"*
- With one particular person
- At work
- In my body
- When I'm on my own
- When I'm around family
- First thing in the morning
- It follows me everywhere
- I only notice it afterwards
- None of these — let me explain

Level 2, if "In my body": *"What does it do?"* — tight chest · can't settle · tired but wired · nothing I can point to · comes and goes · don't want to look at it too closely.

Transition: an unnamed thing is fertile ground for 4 (naming what is missing and what would settle it) and for 1 and 2 (which parts are observable and which are the read). Uncertainty here is not a deficit — a person who accurately locates the edge of what they know can land on a strong pattern. "I only notice it afterwards" routes 3 and 6.

**6. "I keep doing the same thing again and again."**

Follow-up: *"What's the loop?"*
- Same argument
- Same choice, different situation
- Same person, different version
- I start things and stop
- I promise myself and don't follow through
- I go quiet on people
- I overexplain
- It's a pattern but I can't see the shape of it
- None of these — let me explain

Level 2, if "Same choice, different situation": *"What usually happens right before?"* — I get a feeling · someone says something · I get tired · I get bored · I don't know, it's just there · I've never looked at that part.

Transition: this doorway is deliberately *not* wired to a repetition number. Recognising a loop is often the strongest thing in the room. 6 is measured by whether the account changes across passes, not by whether the person calls themselves repetitive; 7 checks whether the moment-before is ever examined; 8 re-shows their own words.

**7. "Someone said something and I can't let it go."** *(bonus entry point)*

Follow-up: *"What's stuck?"* — what they said · how they said it · what I think they meant · what I didn't say back · that they might be right · that it landed on something old · I'm not sure what's stuck · none of these.

Transition: strong material for 1 and 3 — the said thing versus the meaning assigned to it, the event versus the reaction to it. Load (5) is context here, not a penalty.

### Guarantees this section must preserve

- **No branch hard-codes a destination number.** Every Level 1 / Level 2 combination must leave all nine patterns and Undetermined reachable. Any branch that can only produce one pattern is a bug in the branch, not a feature.
- Branch selections are stored as **context** and shown back with the result as context, never cited as evidence for the number.
- Honest-unknown taps are recorded as legitimate answers and are never counted as low clarity anywhere in classification.
- Copy tone check for every branch list: could a person read this on a bad day without feeling assessed? If not, rewrite it.

### Open items added by this milestone

1. Where the sortable lines come from once a branch is known — a small library of situation templates keyed to Level 2, or generated from optional short text. (Extends Milestone 3 open item 3.)
2. Whether typed free-text openings get a lightweight mapping into the nearest doorway, or their own generic framing.
3. Whether "none of these — let me explain" opens short text (skippable) or a second, wider tap list.

No production code, questions, scoring, or UI changed in this task.

---

## Milestone 5 — THE DEPTH LADDER (design only, no production code)

How a short contextual branch becomes evidence about the eight dimensions without feeling like an examination. This milestone covers the **experience and evidence-gathering architecture** only. It does not implement or redesign the number-determination algorithm, and it does not touch Sarah's established 1–9 meanings.

### The principle

Collect **just enough evidence to distinguish the current response pattern** — not a life story. The ladder gets shorter when the pattern is already clear and longer only where two patterns genuinely compete. Most runs should be 8–12 taps end to end, including the doorway.

```text
LEVEL 1  Context      2 taps        what brought you here, what kind of situation
LEVEL 2  Clarification 1–2 taps     what exactly is hard / unknown / wanted / avoided
LEVEL 3  Reveal        2–5 items    adaptively selected dimension probes
         ↓             stop as soon as the pattern is distinguishable
Result   number + meaning + observed pattern + a question to carry
```

### LEVEL 1 — Surface / context

Purpose: give the person a doorway in their own language, and give the system a topic to build concrete items from. Never scored.

- Interaction: the Context Doorways chain from Milestone 4 — an opening intent (tap a card or type a line), then one human follow-up ("Okay. What's underneath that?").
- Output: a context label plus, optionally, a few of the person's own words. Words are shown back later as context, never cited as evidence for the number.
- Honest-unknown is always available and is never treated as poor clarity.

### LEVEL 2 — Clarification

Purpose: locate the **live edge** of the situation, so Level 3 items are about something real rather than generic. Still topic language, still not scored.

One or two taps, drawn from the branch:
- *"What's the difficult part?"* — deciding · saying it · not knowing · waiting · how I'll feel after · that I already know and haven't acted · I couldn't say.
- *"What would you want out of this?"* — to decide · to stop thinking about it · to know where I stand · to feel less heavy · to not do the same thing again · not sure yet.
- Optional short text, skippable, one line max: *"anything you want to add?"*

Level 2 output determines the **framing** of Level 3 — which situation lines get sorted, which unknowns are offered, which parts are available to tap. It never selects, excludes, weights, or biases a number.

### LEVEL 3 — Pattern-revealing items (2–5, adaptive)

The app **does not probe all eight dimensions every time.** It opens with a small fixed core, then adds probes only where they would change the classification.

**Opening core (always, 2 items).** These two carry the most discriminating structure per tap:
- **Sort item → reveals 1 and 2 together.** 5–6 short lines about their own situation, sorted into "this happened" / "this is what I make of it". A second, lighter cut on the same lines ("could you show this to someone?") separates 2 from 1 without a new screen.
- **Gap item → reveals 4.** Tap the pieces you don't have yet, then tap which one would actually change your mind. Naming a resolver is the strength; naming none is the finding, not a failure.

**Adaptive probes (0–3 more), selected by what the core showed:**

| If the core shows | Add | Why |
| --- | --- | --- |
| Clean sort, resolver named | 6 movement, then 7 coverage | Nothing weak to re-test; what separates the strong patterns is whether the account moves and whether anything is being steered around. |
| Interpretation sorted as fact | 1 again in a different framing, then 3 | Rule out a wording artefact before concluding fusion; then check whether reaction is doing the work. |
| Load visible in Level 1/2 words | 5 coherence (two taps: weight present / weight seen) | Load is context. The signal is coherence between the two taps, never the level. |
| "Going round it for weeks", repetition language | 6 | Looping vs genuine iteration is decided by whether the *content* changed across passes, not by whether they revisited. |
| A part of the situation never tapped | 7 | Coverage is inferred from what is consistently not chosen when it was available. |
| Two patterns still tied | the single probe that separates them | See ambiguity handling below. |

**Stance close (always, 1 item) → reveals 8.** Re-show their own opening words: *"Having gone through that — where does it sit now?"* Movement against their own baseline, behavioural rather than self-rated. Reconsideration is never penalized; refusing to move is not rewarded.

**Hard limits.** Max 5 Level 3 items. Never two probes of the same dimension without a change of framing. Never a screen that names a dimension.

### Adaptive stopping — what is sufficient evidence

Sufficient to produce a number when **all** of these hold:
1. The core sort and the gap item are both completed with internally consistent structure (not all-same taps, not self-contradictory sorts).
2. The stance close is completed.
3. One candidate pattern is separated from its nearest competitor by at least one **directly observed** piece of evidence — not by inference from an unprobed dimension.
4. No probe still outstanding could plausibly flip the classification. If one could, run it; that is the whole adaptive rule.

Stop early and stop gladly: a clean core plus a clear stance close plus one adaptive probe is a complete run. Length is not a proxy for rigour.

### Undetermined — when and how

Trigger Undetermined when:
- The core items were skipped or abandoned.
- The taps carry no structure — everything sorted into one bucket, or sorts that contradict each other across passes with no discernible read.
- Two or more patterns remain tied after the probe that was supposed to separate them, and no further probe would help.
- The situation supplied is too thin to build concrete items from and the person declined the optional text (nothing real to sort).

Undetermined is **not** triggered by: honest uncertainty, "I don't know" taps, high emotional load, or changing one's mind. Those are readable patterns.

How it is presented — warm, specific, never an error:
> "Not enough to read yet. What's here is honest, it's just thin — there wasn't a concrete enough piece of the situation for the pattern to show. If you want, come back to it with one part of it in mind and it'll read."

Always offer: re-run, or leave it. Never a score of zero, never a retry counter, never "you failed to complete".

### Ambiguity between neighbouring patterns

The system does not pretend certainty it does not have.

1. **Probe once.** When two patterns tie, run the single item that distinguishes them (from the boundary table in the Phase 2C stress test).
2. **Apply precedence.** If still tied, use the locked precedence rules — named single-dimension patterns take precedence over the broad pattern; demonstrated structure classifies over self-reported confidence.
3. **Name it out loud.** If genuinely between two, the reading says so rather than picking silently: *"This sits between two shapes today — closer to X, with something of Y in it."* The primary number is given, the neighbour is named, and the reflection points at the specific thing that would tip it.
4. **Prefer Undetermined over a coin flip.** If neither pattern is better supported, Undetermined is the honest answer.

### The final result — language and shape

It should read like a **reading**, not an assessment. Four parts, in this order:

1. **The number.** Presented plainly, with today's framing: *"Today reads as a 7."* No score, no percentage, no bar, no comparison to other users, no "level".
2. **The established meaning.** Sarah's existing 1–9 meaning for that number, presented verbatim as the interpretive lens. Not invented, not paraphrased, not softened. Framed as a lens: *"This is what 7 tends to point at."*
3. **The observed pattern — concise, non-diagnostic, 2–3 sentences.** Describes what the responses did, in ordinary language, tied to their own material. Example register: *"You kept the facts and your read on them apart most of the way through, and you could name the one thing that would change your mind. The weight of it was clearly in view rather than driving. What you didn't go near was the part about the money."* No dimension names. No numbers per dimension. No "you scored low on".
4. **A question to carry forward — optional, one line.** Not advice, not a task, not a prediction. *"If the thing you named actually arrived tomorrow, would it change what you do — or just how you feel about it?"*

Plus: their opening words shown back as context, clearly marked as context. And a quiet line that today's number is today's, not a label they now carry.

**Language rules (hard).** No diagnosis, no verdict, no prediction, no advice on the premise. No good/bad numbers, no ranking, no progress framing, no push toward 9. Never "you are a 4" — always "today reads as a 4". Never explain the mechanism in clinical terms. Never claim mystical causation. Second person, plain words, short sentences.

### Explicitly not in this milestone

- The number-determination algorithm (deferred; the rejected arithmetic approach stays rejected).
- Any redesign of Sarah's 1–9 meanings — those are preserved as-is and are still awaited in readable form.
- Tree of Life / Pythagorean mapping beyond using the established meanings as the interpretive layer.
- Any production code, question, scoring, or UI change.

### Open items added by this milestone

1. The boundary-probe table needs one named item per competing pair before implementation.
2. Exact structural checks for "taps carry no structure" (single-bucket sort, cross-pass contradiction) need thresholds.
3. Whether the "between two shapes" phrasing appears for every near-tie or only above a stated closeness.
4. Whether the carry-forward question is generated from the observed pattern or drawn from a small library per number.

No production code, questions, scoring, or UI changed in this task.

---

## Milestone 6 — FIRST-PASS QUESTION LIBRARY (design only, no production code)

Concrete enough to review. Dimension tags in `[brackets]` are **design notes only** and never appear in user-facing copy. No branch implies a number. Every list allows an honest unknown.

Notation: `[1]` Fact vs Interpretation · `[2]` Known vs Felt/Assumed · `[3]` Observation vs Reaction · `[4]` Uncertainty/Missing Info · `[5]` Emotional Load (context only) · `[6]` Mental Movement · `[7]` Avoidance · `[8]` Revisability.

Item types: **SORT** (drag/tap lines into two buckets) · **PICK** (single tap) · **MULTI** (tap any) · **PAIR** (choose between two tellings) · **TEXT?** (optional one line, skippable).

---

### Doorway 1 — "I don't know what the hell to do today."

**Level 1 — "Okay. What's underneath that?"**
- I'm trying not to drink/use
- I'm avoiding something I need to deal with
- I have a conversation I don't want to have
- I don't know what I want anymore
- I have a decision hanging over me
- I feel restless and need something to do
- Something happened and I can't stop thinking about it
- Honestly, I have no idea
- None of these — let me explain

**Level 2 (branch: "I'm avoiding something") — "Any sense what kind of thing?"**
- A heavy conversation
- A responsibility
- A decision
- A feeling
- A person
- Something I know I need to change
- I don't actually know what I'm avoiding

**Level 3 (2–5, adaptive)**
1. SORT — *"Which of these is what's actually happened, and which is what you've made of it?"* Lines: "It's been sitting there a week" · "I'm being a coward about it" · "Nobody has asked me about it" · "If I bring it up it'll blow up" · "I keep finding other things to do". `[1]` then a second cut *"Which of these could you show someone else?"* `[2]`
2. MULTI — *"What don't you have yet?"* → then PICK *"Which one of those would actually change what you do today?"* Options include "nothing would" and "I don't know". `[4]` (the change-your-mind probe)
3. MULTI — *"Which part of this have you not looked at?"* Options: the timing · the cost of leaving it · the person involved · how I'll feel after · what happens if I never do it · I've looked at all of it · not sure. `[7]` (the avoidance probe; unselected options across earlier screens also feed this)
4. PICK — *"When you think about it, does it move or does it go round?"* Moves a bit each time · same loop, different words · it moves then snaps back · haven't thought about it enough to say. `[6]` (looping-vs-moving probe) — paired with the system's own check of whether the account changed across passes.
5. PICK ×2 — *"How much is this sitting on you?"* / *"How much of that can you see acting on your thinking?"* `[5]` context only, read as coherence between the two, never as level.

---

### Doorway 2 — "Should I text them?"

**Level 1 — "What's the pull here?"**
- I want to know where I stand
- I said something I regret
- They went quiet and I don't know why
- I miss them
- I want to fix it now, before I lose my nerve
- I'm bored and they're the person I reach for
- I don't want to text — I want to stop wanting to
- No idea, honestly / none of these

**Level 2 (branch: "They went quiet") — "How long are we talking?"**
- A few hours
- A day or two
- Longer than usual for us
- They've never gone quiet before
- I've lost track
- I'd rather not count

**Level 3**
1. SORT — *"What happened, and what's your read on it?"* Lines: "They read it six hours ago" · "They're annoyed with me" · "They've been busy this week" · "They're pulling away" · "I sent two in a row". `[1]` + second cut `[2]`
2. PAIR — *"Which is closer to how you'd tell it?"* A: "They haven't replied since this morning." B: "They've left me hanging all day." `[3]`
3. MULTI/PICK — *"What don't you know yet?"* (whether they've seen it · what the last message landed as · whether something else is going on · nothing, I know exactly) → *"Which one would change whether you send it?"* `[4]`
4. PICK — *"Have you already written it?"* Written and not sent · written it several times · haven't written anything · I've sent something already · don't want to say. `[6]` `[7]`
5. STANCE — re-show their own opening words → *"Where does it sit now?"* `[8]` (revisability/listening probe)

---

### Doorway 3 — "I'm feeling lucky / should I gamble?"

No judgment of the premise. The lens is the reasoning, not the activity.

**Level 1 — "Where's the luck coming from?"**
- I've been winning
- I'm due a win
- Something good happened today
- I want the rush
- I want to get something back
- I've got spare money and nothing on
- It's a mate's thing, not really my idea
- Couldn't tell you / none of these

**Level 2 (branch: "I'm due a win") — "What's the run actually been like?"**
- Losing lately
- Up and down
- I've stopped counting
- I'd rather not look
- I know exactly, to the penny
- Not sure

**Level 3**
1. SORT — *"Which of these is a fact and which is a read?"* Lines: "I won the last two" · "I'm on a run" · "It's about to turn" · "I've got £X spare" · "I can stop whenever". `[1]` + second cut `[2]`
2. MULTI — *"What don't you know here?"* (the actual odds · what I'd do if it went the other way · how much I've put in this month · nothing) → *"Which would change your mind?"* `[4]`
3. MULTI — *"What haven't you thought about?"* the losing case · the money · what I'd tell someone else in my position · how I'd feel tomorrow · I've thought about all of it. `[7]`
4. PICK ×2 — *"How much is riding on this for you?"* / *"How clearly can you see that pulling at you?"* `[5]` context only.
5. PICK — *"If none of the facts changed, would you still want to?"* Yes, and I know that · no · I'd have to think · that's a strange question. `[3]` `[8]` — separating the feeling from the facts and *still* choosing is a coverage finding, not a fault.

---

### Doorway 4 — "I have a huge decision to make."

**Level 1 — "What makes it huge?"**
- It's hard to undo
- Other people are affected
- Money
- It changes where I live or work
- It's been hanging over me for ages
- Everyone has an opinion about it
- It's not big to anyone else, only me
- I'm not sure why it feels huge / none of these

**Level 2 (branch: "hanging over me for ages") — "What's happened in that time?"**
- Nothing's changed
- I keep changing my mind
- I've decided and un-decided
- I've been gathering information
- I've been not looking at it
- Couldn't say

**Level 3**
1. SORT — *"What's known and what's your projection?"* Lines: "The offer expires in two weeks" · "It'll wreck things if I get it wrong" · "Two people have told me to do it" · "I'll regret it either way" · "I can't afford to be wrong". `[1]` `[2]`
2. MULTI — *"Which options are actually on the table?"* the one I'm leaning toward · the opposite · a third thing · doing nothing for now · I've only really considered one. `[4]` `[7]`
3. PICK — *"What would have to be true for you to choose the other way?"* I can name it · I sort of know · nothing would · I don't want to answer that. `[4]` `[8]`
4. PICK — *"Compared to a month ago, has your thinking changed shape or just changed words?"* Changed shape · same shape, new words · gone back and forth · it's newer than a month. `[6]`
5. PICK ×2 — weight present / weight seen. `[5]`

---

### Doorway 5 — "Something happened and I can't stop thinking about it."

**Level 1 — "What's stuck?"**
- What they said
- How they said it
- What I think they meant
- What I didn't say back
- That they might be right
- That it landed on something old
- That I can't undo it
- I'm not sure what's stuck / none of these

**Level 2 (branch: "what I think they meant") — "What kind of meaning are we talking?"**
- They were having a go at me
- They don't respect me
- They've been thinking this a while
- They didn't mean anything by it
- It confirmed something I already feared
- I honestly can't tell

**Level 3**
1. SORT — *"Which of these would a camera have caught?"* Lines: "They said it in front of other people" · "They wanted to embarrass me" · "I went quiet after" · "They've thought this for months" · "I laughed it off". `[1]` `[2]`
2. PAIR — *"Which telling is closer to yours?"* A: "They said X and I stopped talking." B: "They humiliated me and I froze." `[3]`
3. PICK — *"How many times have you replayed it?"* A few · lost count · I run it and something new shows up each time · I run it and it lands the same each time · not counting. `[6]` — "something new each time" is iteration, not looping.
4. PICK — *"If they told you what they actually meant, and it wasn't what you think — could you take it in?"* Yes · I'd want to but probably not today · no, I know what they meant · I don't know. `[8]`
5. PICK ×2 — weight present / weight seen. `[5]` Distress is context. Never a negative signal.

---

### Doorway 6 — "Something feels off and I don't know why."

**Level 1 — "Where do you notice it?"**
- With one particular person
- At work
- In my body
- When I'm on my own
- Around family
- First thing in the morning
- It follows me everywhere
- I only notice it afterwards / none of these

**Level 2 (branch: "in my body") — "What does it do?"**
- Tight chest
- Can't settle
- Tired but wired
- Nothing I can point to
- Comes and goes
- I don't want to look at it too closely

**Level 3**
1. MULTI — *"Which of these is definitely true, and which is a guess?"* (presented as SORT) Lines: "It started around a fortnight ago" · "It's about work" · "I've been sleeping badly" · "Something's coming" · "It goes when I'm busy". `[1]` `[2]`
2. MULTI — *"What would help you name it?"* a night's sleep · talking to someone · time on my own · one honest look at the thing I suspect · nothing I can think of · I don't know. → PICK *"Which of those would actually settle it?"* `[4]` — naming nothing is a finding, not a failure. Accurately locating the edge of what you know is clarity.
3. PICK — *"Is there something you already suspect it's about?"* Yes and I've looked at it · yes and I haven't · no · I don't want to say. `[7]`
4. PICK — *"Does it change when you look at it, or stay the same?"* Changes shape · stays exactly the same · gets bigger then settles · haven't looked directly. `[6]`
5. STANCE — re-show opening words → *"Where does it sit now?"* `[8]`

---

### Boundary probe library (pattern separation only — no number is assigned)

One or two short items per commonly-confused pair. Used **only** when two candidate readings remain close after the ladder. These probe structure, never symbolism.

| Pair | Probe | Reveals |
| --- | --- | --- |
| 1 vs 2 | *"Is your read on this something you'd defend, or something you're still holding loosely?"* Defend it · holding it loosely · haven't formed one · both, depending on the day | `[8]` `[2]` — unformed vs formed-and-held |
| 2 vs 3 | *"If someone disagreed with your read, what would you want first — to explain, or to hear theirs?"* | `[8]` `[3]` |
| 3 vs 6 | *"When it comes back to you, does the wording change or the content?"* Wording · content · both · it doesn't come back | `[6]` — re-said vs re-thought |
| 4 vs 5 | *"Is the part you can't see missing, or just not looked at?"* Missing · not looked at · can't tell the difference | `[4]` vs `[7]` |
| 5 vs 6 | *"Have you gone over this with anyone out loud?"* Yes, more than once · yes, once · only in my head · deliberately not | `[6]` `[7]` |
| 6 vs 7 | *"Is there a part of this you'd rather I didn't ask about?"* Yes and I know which · yes and I don't know which · no · maybe | `[7]` |
| 7 vs 8 | *"How much of the weight of this is in view to you right now?"* All of it · most · I can feel it but not see it · none | `[5]` coherence |
| 8 vs 9 | *"Did anything shift while you were answering these?"* Yes, something specific · a bit · no · I noticed I was avoiding something | `[8]` behavioural |
| 2 vs 6 | *"Would you describe yourself as decided, or as circling?"* then compare against whether the account changed across passes | `[6]` vs self-report — demonstrated structure classifies |

Rules: at most **one** boundary probe per run. If it doesn't separate the pair, precedence rules apply; if those don't, the reading names both shapes or returns Undetermined. Never a coin flip.

---

### Reusable vs context-specific — the compact engine

**Reusable across every doorway (write once, ~14 items).** These are structural and topic-agnostic; the only thing that changes is the noun injected from Level 2.
- The **second cut** on any sort: *"Which of these could you show someone else?"* `[2]`
- The **resolver** pair: *"What don't you have yet?"* → *"Which of those would change what you do?"* `[4]`
- The **coverage** probe: *"Which part of this have you not looked at?"* `[7]`
- The **movement** probe: *"Does it move, or go round?"* / *"Does the wording change or the content?"* `[6]`
- The **load** pair: weight present / weight seen. `[5]`
- The **stance close**: re-show their own words → *"Where does it sit now?"* `[8]`
- The **listening** probe: *"If it turned out not to be what you think, could you take it in?"* `[8]`
- Every boundary probe in the table above.

**Must be context-specific (the only per-doorway authoring cost).**
- The **sort lines** for `[1]`. These have to be about *their* situation to be evidence rather than a quiz — 5 lines per Level 2 branch, half observable and half interpretive, matched in length and tone so neither bucket is signposted.
- The **PAIR tellings** for `[3]` — two versions of the same event, one stripped of response language. Needs the concrete event.
- The **unknown options** for `[4]` — must name plausible real missing pieces for that situation.
- Level 1 and Level 2 choice lists themselves.

**Resulting size.** 6 doorways × (1 Level 1 list + ~3 Level 2 lists × 1 sort set + 1 pair + 1 unknown list) ≈ 60–70 authored strings, plus ~14 reusable structural items and 9 boundary probes. Compact enough to hand-author and review; no hundreds of questions.

**Authoring rules for sort lines (so they don't leak the answer).** Match sentence length across buckets. No emotional adjectives in the observable lines and no neutral verbs-only in the interpretive ones. Never use tell-tale markers ("obviously", "clearly") that make interpretation identifiable by style. Include one deliberately borderline line per set — the borderline handling is itself informative.

### Guarantees restated

- No doorway, branch, or item can only produce one number; all nine plus Undetermined stay reachable everywhere.
- "I don't know" is available on every item and is never scored as low clarity.
- Emotional load is context. Distress is never a negative signal.
- Self-report never overrides demonstrated structure; where they diverge, the divergence is named neutrally.
- The established 1–9 meanings remain the later interpretive layer, unchanged and still awaited in readable form.

No production code, scoring formula, averaging, or number algorithm in this task.

---

## Milestone 7 — "WHAT AM I TRYING NOT TO EXPERIENCE RIGHT NOW?" (design principle, locked)

A major design principle is now locked: **"What am I trying not to experience right now?" is a universal clarity doorway.** It is a core reusable pathway across the whole app, not a drinking- or addiction-specific question, and not an accusation.

### Why it belongs

The single most common shape under "I don't know what to do" is not indecision — it is the quiet steering-away from a feeling, conversation, or fact. Asking it directly, gently, and early gives the system a high-value piece of evidence and gives the person a useful thing to notice. But the question is only useful if it never assumes the answer.

### The non-negotiable rule

**Do NOT assume the behavior is avoidance.** Reaching for a drink, scrolling, gambling, texting someone, sleeping, working, shopping, picking a fight, making a sudden change — any of these may be avoidance, and any of them may be genuine enjoyment, celebration, curiosity, rest, or love. The doorway offers the question and follows the person's answer. The deeper framework decides what pattern is actually present. If the person says "I just enjoy it," that is taken at face value and the run continues from there — it is not treated as denial, and it is not scored down.

### Tone principle

Wrap the difficult question in approachable language and small choices, never clinical terminology or required writing. People resist direct discomfort; the doorway lowers the cost of looking by offering a tap before it asks for words. Short, human, sometimes a little warm or dry. "I don't know" is valid at every branch and is never low clarity.

### The doorway as a reusable pathway

This is a **cross-cutting branch**, not a top-level intent of its own. It can be reached from many surfaces:
- Doorway 1 ("I don't know what the hell to do today") → branch *"I'm trying not to drink/use"* or *"I feel restless and need something to do"*.
- Doorway 3 ("I'm feeling lucky") → the probe is available when the activity could be a steering-away, without moralizing the activity.
- Any Level 1 whose selected context implies a redirect behavior (scrolling, sleeping, shopping, working, picking a fight, sudden life change, texting) may route here.

It can also surface adaptively: when Level 3 coverage probes `[7]` show a consistently untouched part, the system may offer *"Is there something here you'd rather not sit with?"* as a gentle, optional invitation — never a demand.

### The branch shape

**Level 1 (the invitation, never an accusation):**
*"You reached for [thing]. What's that about, do you think?"*
- I enjoy it, genuinely
- I'm celebrating / it's a good thing
- I'm curious about it
- I'm trying not to feel something
- I'm trying not to think about something
- I'm trying not to be somewhere (in my head, in the room)
- It's just habit
- I don't know
- None of these — let me explain

If the answer is *enjoyment, celebration, curiosity, or habit*, the run continues from that honest position. The behavior is not reframed as avoidance behind the person's back. The deeper framework still runs its probes; if coverage `[7]` later shows an untouched area, that is reported as an observation, not as proof the person was in denial.

**Level 2 (only if the person pointed at a "trying not to"):**
*"What is it you're trying not to experience?"*
- A feeling (name it loosely — heavy, flat, anxious, ashamed, something else)
- A conversation
- A memory
- A decision
- The quiet
- Being alone with it
- I don't actually know
- None of these — let me explain

**Level 3** then proceeds into the normal Depth Ladder reusable core, framed on the named thing:
- SORT `[1]` + second cut `[2]` on lines built from the named discomfort.
- The resolver pair `[4]:` *"What don't you have yet?"* → *"Which would change what you do?"* — where "nothing would" and "I don't know" are valid and readable.
- The coverage probe `[7]:` *"Which part of this have you not looked at?"*
- The movement probe `[6]:` *"Does it move, or go round?"*
- The load pair `[5]` as **context only** — weight present / weight seen, read as coherence, never as level. Distress is never a negative signal.
- The stance close `[8]:* re-show their own opening words → *"Where does it sit now?"*

### Design guarantees this pathway must preserve

- It is a doorway, not a diagnosis. The purpose is to help the user **discover something about their current reality**, not to tell them what they should do.
- No shame, no assumption of avoidance, no reframing of an honest "I enjoy it" into denial.
- "I don't know" is valid at every branch and is never scored as low clarity.
- Honest uncertainty about what one is avoiding is itself readable — accurately locating the edge of what you know is clarity, not its absence.
- Every pattern from 1–9 plus Undetermined remains reachable from this pathway. Nothing here hard-codes a destination number.
- The established 1–9 meanings remain the later interpretive layer, unchanged.

### Reconciliation with earlier milestones

This does not replace Doorway 1's *"I'm trying not to drink/use"* branch — it generalizes the principle underneath it. That branch now routes through this pathway, and the same pathway is available from any behavior-redirect surface across the library. It is added to the reusable engine from Milestone 6 as a cross-cutting branch, not as additional per-doorway authoring.

No production code, questions, scoring, or UI changed in this task.

---

## Milestone 8 — CLARITY CONTRACT + OPENING SCREEN (design only, no production code)

### Product insight recorded

The original name **"Clarity Tracker"** described the app's original purpose for Sarah: checking whether she actually understood what she was talking about — whether she was seeing clearly, especially when discomfort, anxiety, or stress could distort perception. That underlying purpose is **preserved as the core function** of Gabriel's Number: reality-based clarity through reflection.

- We are **not** keeping "Clarity Tracker" as the product name or primary UX label.
- We are **not** renaming Gabriel's Number.
- The "Clarity Tracker" concept lives on as the instrument's job-to-be-done: it tracks whether you're seeing what's actually there, not what the discomfort wants you to see.

### The Clarity Contract

A compact set of principles the app communicates before the first doorway. The goal: say very little, say it well, and make it feel like an invitation rather than a disclaimer wall. Where possible these are shown implicitly (in tone, in the options offered, in the absence of right/wrong framing) rather than as a bullet list. When shown explicitly, they fit on one screen.

**The principles (what the contract guarantees):**

1. **No right or wrong answers.** There is nothing to get correct.
2. **No good or bad number.** No number is better than another; nothing pushes toward 9.
3. **No need to know what you're looking for.** You can arrive with "I don't know what the hell to do today" and that is enough.
4. **Honesty beats confidence.** A flat "I don't know" is more useful than a confident guess.
5. **"I don't know" is useful information.** It is never scored as poor clarity.
6. **The app will not tell you what decision to make.** It does not advise for or against your premise. It will not tell you to text, to not gamble, to quit your job, or to stay.
7. **The number is a reflection lens**, based on the pattern in your answers — not a diagnosis, verdict, prediction, or permanent label. Today's number is today's.

**How it is communicated (the compact form).** The contract appears as a short, warm passage — not a numbered disclaimer list — visible on the opening screen and collapsible/available later. Candidate copy:

> This isn't a test, and there's nothing to get right.
> You can't be wrong here, and there's no number worth more than another.
> If you don't know what you're looking for, that's a fine place to start.
> Honest is better than sure. "I don't know" counts.
> This won't tell you what to do. It'll show you the shape of how you're seeing it — and a number to hold that shape, just for today.

The tone is intriguing and human, not clinical. It lowers the stakes before the first tap.

### Three candidate opening screens

Each replaces the old numeric "Clarity Tracker" start screen while preserving its function (the doorway into reality-based reflection). Each carries the Clarity Contract in its own register and offers the same underlying doorways.

---

**(A) Direct / curious**

- **Headline:** *What are you actually seeing right now?*
- **One-line invitation:** *Answer a few honest questions. A number will come out the other side — not a verdict, just the shape of how you're seeing it today.*
- **Contract line:** *There are no right answers, and no number is better than another. "I don't know" counts. This won't tell you what to do.*
- **Initial doorway choices:**
  - I don't know what the hell to do today
  - Should I text them?
  - I have a huge decision to make
  - Something happened and I can't stop thinking about it
  - Something feels off and I don't know why
  - I'm feeling lucky — should I gamble?
  - Something else, in my own words

---

**(B) Playful / psychological-tarot**

- **Headline:** *A reading, not a rule.*
- **One-line invitation:** *Bring whatever's on your mind — the ordinary, the heavy, or the half-noticed. The cards here are your own answers, and the number is just the shape they make today.*
- **Contract line:** *No good cards or bad cards. No right draw. "I don't know" is a real card in this deck. We won't tell your fortune or your future — and we won't tell you what to do.*
- **Initial doorway choices:** (same six + "something else", slightly warmer wording)
  - I don't know what the hell to do today
  - Should I text them?
  - I have a huge decision to make
  - Something happened and I can't stop thinking about it
  - Something feels off and I don't know why
  - I'm feeling lucky — should I gamble?
  - Something else, in my own words

---

**(C) Minimal / mysterious**

- **Headline:** *Today's number.*
- **One-line invitation:** *Start anywhere. Say as little or as much as you like. A number emerges from the shape of it — yours, just for today.*
- **Contract line:** *(small, low)* *No right answers. No better number. "I don't know" is allowed. This won't decide for you.*
- **Initial doorway choices:**
  - I don't know what to do today
  - Should I text them?
  - A big decision
  - Something I can't stop thinking about
  - Something feels off
  - Should I gamble?
  - Something else

---

### Recommendation

**Recommend (A) Direct / curious**, with the doorways lightly warmed.

Reasoning:
- **(A) matches the locked product direction** ("psychologically grounded, reality-based reflection / decision lens") without leaning on a metaphor the user has to learn. It says plainly what the instrument does — show you the shape of how you're seeing it — which is exactly the "Clarity Tracker" function preserved under a new name.
- **(B) is appealing but risky.** The tarot framing is intriguing and human, but it can pull toward "the number means something mystical about you," which is the opposite of "today's number is today's, a reflection lens, not a label." It also preloads an expectation that the number is a *fortune*, which the established Tree-of-Life layer will later have to carefully correct rather than simply add. The playful register is worth borrowing in the doorways and the result language, but not as the governing frame.
- **(C) is beautiful but cold.** The minimal register can feel intriguing, but it under-communicates the safety contract at exactly the moment a hesitant user most needs it ("is this going to judge me?"). For a tool whose whole point is making discomfort approachable, (A)'s plain warmth is the better opening. (C)'s restraint is worth borrowing for the result screen, not the opening.

A small borrow from (B) and (C): the result reading can use the "a reading, not a rule" warmth, and the result's number presentation can use (C)'s spareness. But the opening screen stays (A) — direct, curious, and honest about what it is.

### Explicitly not in this milestone

- No renaming of Gabriel's Number.
- No production code, UI, or scoring change.
- No assignment or redesign of the 1–9 meanings — those remain the later interpretive layer, still awaited in readable form.

No production code, questions, scoring, or UI changed in this task.
