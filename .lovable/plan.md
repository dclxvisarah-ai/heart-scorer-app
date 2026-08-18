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
