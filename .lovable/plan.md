# Checkpoint 42 — Gabriel's Lab: Spiral paired-perturbation auditability fixture

Research-only. No change to production flow, scoring, Number logic, Spiral wording, or the August 18 baseline.

## Current state (verified)

- There is no Lab route or Lab code in the project yet: `src/routes/` contains only `__root.tsx`, `index.tsx`, `readings.tsx`.
- The engine (`src/lib/gabriel.ts`) is pure and already exports everything a Lab needs: `DOORWAYS`/`getDoorway`, `buildSequence`, `evaluatePattern`, `AnswerMap`, `Question`, `PatternResult`, `getDeeperProbe`.
- Durable history (`src/lib/history.ts`) stores only doorway, primary, supporting, reasoning — it never stores the question/choice vector. This is exactly the Checkpoint 40 gap: Run A (5) vs Run B (7) could not be proven to differ in Q2 only.

Conclusion: nothing in production needs to change. The fixture can be built entirely as a new, additive Lab route that drives the same pure engine functions.

## What gets built (minimum)

A single Lab route that runs Spiral twice and records a complete, ordered, raw answer vector for each run, then diffs them.

New files only:

1. `src/lib/lab/contract.ts` — Contract V1 types + helpers, Lab-only:
   - `LabRunRecord { contractVersion: "v1"; runId; doorwayId; startedAt; endedAt; events: LabEvent[]; result: PatternResult | null }`
   - `LabEvent` (ordered, `seq` starting at 1): `run_start`, `question_shown` (exact displayed prompt + note + full ordered choice list with ids and exact labels), `choice_selected` (questionId, choiceId, exact choice label, `seq`), `answer_missing` (explicit missingness when a question was shown but never answered), `run_end` (boundary + result snapshot).
   - `reconstructAnswerVector(record)` → ordered `[{seq, questionId, choiceId}]` derived from raw events only, no engine re-derivation.
   - `diffRuns(a, b)` → `{ sharedPrefix, changedIndices, divergedFrom, aOnly, bOnly }`, computed only from reconstructed vectors.
2. `src/lib/lab/recorder.ts` — a plain in-memory recorder object (`startRun`, `logQuestionShown`, `logChoice`, `logMissing`, `endRun`) that appends monotonically and never mutates prior events; plus optional persistence to `localStorage` under a distinct Lab key (`gabriels-lab-runs-v1`), completely separate from `gabriels-number-readings-v2`.
3. `src/routes/lab.spiral-perturbation.tsx` — route `/lab/spiral-perturbation`, `noindex`. UI:
   - Run A pane and Run B pane, each stepping through `buildSequence(getDoorway("spiral"), answers)` using the *unmodified* Spiral questions/wording, recording every shown question and every selected choice.
   - "Clone Run A into Run B" to seed an identical vector, then change exactly one answer; the diff panel proves how many answers differ and at which index.
   - Result per run from `evaluatePattern` (read-only call), shown next to the diff.
   - Raw record viewer: pretty-printed JSON of each `LabRunRecord`, plus copy-to-clipboard / download `.json` for audit attachment.

No edits to: `src/lib/gabriel.ts`, `src/lib/history.ts`, `src/routes/index.tsx`, `src/routes/readings.tsx`, `src/styles.css`. The Lab route is not linked from any user-facing page (reachable by URL only).

## Acceptance criteria

1. `/lab/spiral-perturbation` runs Spiral A and B end to end using the existing Spiral wording verbatim; production `/` behaves identically to before (unchanged files).
2. Every question displayed in each run produces a `question_shown` event containing the exact prompt and the exact ordered choice labels; every selection produces a `choice_selected` event with the exact choice id + label.
3. A completed run's reconstructed vector, built from raw events alone, equals the answers actually chosen, in order, with no gaps; unanswered-but-shown questions appear as `answer_missing`.
4. `diffRuns` on a clone-then-change-one-answer pair reports exactly one changed index, and names it (e.g. Q2 / `spiral-…`).
5. Each run has a unique `runId`; events are strictly ordered by `seq`; re-rendering or re-mounting never rewrites or reorders existing events.
6. Raw JSON for both runs is exportable and contains no data beyond Contract V1 fields.
7. No Lab writes touch the production history key; `/readings` is unaffected by Lab runs.

## How we test it

- Unit (Vitest, new `src/lib/lab/__tests__/contract.test.ts`): reconstruction fidelity from raw events; single-answer-change diff yields exactly one changed index; divergent-length runs report shared prefix + divergence point; missingness recorded; event ordering immutability.
- Replay check: feed a reconstructed vector back into `buildSequence`/`evaluatePattern` and assert the recorded `result` matches — proving the record is sufficient to reproduce the run.
- Regression guard: confirm the Spiral question/choice text asserted in Lab tests is read from `gabriel.ts` (no duplicated copy), so wording stays single-sourced.
- Manual browser pass: complete Run A, clone, change Q2 only, confirm the diff panel says one changed answer at Q2 and the two results (expected 5 vs 7) sit beside it; confirm no console errors and `/` plus `/readings` unchanged.

## Explicitly out of scope

Scoring/threshold changes, Number-mapping changes, Spiral rewording, adaptive probing changes, analytics, any server/database capture, and linking the Lab from production UI.
