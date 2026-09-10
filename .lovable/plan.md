# Architectural Audit — Gabriel's Number at b02fcfe (audit only, no code changed)

Baseline confirmed: HEAD is `b02fcfe` ("Restored RIGHT NOW CSS rules"). All findings below come
from executing the current `src/lib/gabriel.ts` and exhaustively enumerating every reachable
path per doorway through the live `buildSequence` + `evaluatePattern`.

## 1. Doorways and reachable question graphs (current source)

Eleven visible doorways. `DOORWAYS` is the visible list; there is no `hidden` flag and no
four-item menu in this baseline.

| Doorway | own Qs | Qs reachable via followUp/next | stage2 | page lengths | complete paths | options exercised |
|---|---|---|---|---|---|---|
| fire | 1 | 7 | fury-want (3/6) | all 6 | 217,728 | 71 |
| lost | 1 | 10 | — | all 5 | 8,250 | 112 |
| chance | 1 | 9 | — | 5 and 6 | 18,180 | 104 |
| spiral | 2 | 10 | — | all 5 | 5,500 | 63 |
| drink | 1 | 12 | — | 5 and 6 | 36,750 | 140 |
| gamble | 2 | 2 | — | all 5 | 3,900 | 65 |
| talk | 3 | 3 | — | 5 and 6 | 5,120 | 69 |
| well | 2 | 2 | — | all 5 | 4,500 | 27 |
| happened | 3 | 3 | — | all 5 | 1,600 | 22 |
| loop | 3 | 3 | — | 5 and 6 | 5,400 | 68 |
| surprise | 1 | 1 | — | all 5 | 7,200 | 61 |

No dangling `followUp`/`next` target anywhere: every referenced id resolves. `BRANCH_QUESTIONS`
holds 45 questions and all 45 are asked somewhere.

## 2. The two reported findings, corrected

**Finding 1 (Spiral / spiral-known) — not a defect.** `spiral-replay` indeed has no
`followUp`/`next` to `spiral-known`, but `spiral-known` is the doorway's *second own question*,
so `buildSequence` expands it directly. The live Spiral path is
`spiral-1 > spiral-<state> > spiral-known > c1 > c2` — five pages. This matches the screenshot
where Q3 is "What's actually known?". Nothing to repair; the wiring assumption was wrong, not
the graph.

**Finding 2 (Fire cannot reach fury-want) — not a defect.** `fire-1 > fury-crossed-* >
fury-under` is exactly 3 pages, so the prefix does reach `prefixPages: 3`, and stage 2 is
entered. Verified live sequence: `fire-1 > fury-crossed-trust > fury-under > fury-want >
fury-power > fury-close`. All 217,728 Fire paths are exactly 6 pages.
`fury-want / fury-power / fury-close` are orphans *in the followUp graph only* — they are
reached solely through `doorway.stage2`. That is intended by the fixed-length design, but it
means any naive graph-reachability check reports them as unreachable (this audit's first pass
did). Worth a comment and a test, not a rewiring.

**Finding 3 (stale audit docs) — confirmed stale.** `.lovable/audit-spiraling-lock.md` claims
Spiral has a fixed six-page architecture, `stage2: "spiral-known"`, `prefixPages: 3`,
`totalPages: 6`, 15 reachable questions, 84 options and 55,440 paths. Current source has none
of that: no stage2 on Spiral, 10 questions, 63 options, 5,500 paths, all 5 pages. Likewise
`.lovable/audit-2026-08-19-baseline.md` (10 doorways, hidden `chance`/`gamble`/`talk`, six-page
Spiral) and `docs/Chase_Stress_Test_2026-08-24.md` (the `bet` doorway, and a stale-answer prune
in `index.tsx` L133–143) describe branches and code that do not exist at this commit.

## 3. Real issues found

1. **Documentation drift is the largest trust risk.** Three audit documents describe a
   different application than the one that runs. Any Relational State work planned against them
   would be planned against fiction.
2. **`happened` cannot produce 8.** Confirmed over all 1,600 paths: primaries are
   1,2,3,4,5,6,7,9 and Undetermined — 8 never occurs. Same defect the Aug-19 baseline recorded,
   still present.
3. **Very thin coverage in some branches.** `well` exercises 27 options and `happened` 22;
   `happened` and `well` reach 5 total questions each. `spiral` yields 9 on 0.8% of paths and 6
   on 1.4% — near-unreachable coordinates.
4. **Fire's Undetermined rate is 27.8%** (60,528 / 217,728) — in range, but its 3 (2.9%) and
   9 (5.3%) are thin relative to 7 (15.6%) and 5 (14.3%).
5. **`Available_n` includes trailing unanswered questions.** `evaluatePattern` accumulates
   availability for every question in the sequence, answered or not. At the result screen the
   sequence is fully answered so it is harmless there, but mid-flow and immediately after a
   deeper probe is appended the denominator counts a question with no answer, deflating weights.
   Not a scoring change — a boundary to pin with a test before anything else touches the
   evaluator.
6. **Deeper probes carry weight 4**, above the documented max of 3, and are added after the
   normalisation was calibrated. Intended, undocumented in the baseline docs.
7. **Cross-branch injection is real but by design**: every branch shorter than 5 pages is
   topped up with the shared generic `c1`/`c2`/`c3`, and `c3` is appended to longer branches.
   So `drink`'s live 5-page path is `drink-1 > drink-well > c1 > c2 > c3` — three of five pages
   are generic. This is the dominant source of evidence in the thin branches and the reason
   `happened` can never reach 8 (its only 8-carrying option lives on `c3`, which that branch is
   too long to receive). No accidental contamination beyond this documented mechanism; no
   number is redefined per branch.
8. **Q1–Q6 stage distinctness** can only be assessed for `fire`, the one six-page branch.
   Its stages are distinct: kind of fury → what was crossed → what is under it → what you want
   → what you would actually have power over → how it closes. No two Fire questions share an
   evidence signature. No other branch claims a six-question progression at this commit.

## 4. Back-navigation and deeper probes — verified sound

- `choose` in `src/routes/index.tsx` deletes every answer after the edited page, then rebuilds.
  Verified: editing `fire-1` from `betray` to `hurt` leaves exactly `{fire-1}` and the new path
  is `fire-1 > fury-crossed-hurt`. No stale answer survives, so no phantom evidence.
- The secondary "drop answers not on the rebuilt path" prune described in the Chase document is
  absent here, and is not needed: prefix-deterministic sequences plus the slice-delete cover it.
- `goBack` from the result returns to the last question; `goDeeper` appends the probe by id and
  `buildSequence` re-appends it on every rebuild, so probe order is stable.
- Undetermined never forced; `getDeeperProbe` returns undefined when probes run out.

## 5. Test coverage gaps

The only test file is `src/lib/lab/__tests__/contract.test.ts` (15 tests, Lab recorder only).
There is **zero** test coverage of `gabriel.ts`. Nothing currently guards:
graph integrity, path lengths, stage2 entry for Fire, Spiral's five-page shape,
per-doorway number reachability, evidence weight bounds, `Available_n` derivation from the
actual sequence, threshold/rounding behaviour, determinism, back-edit invalidation, or
deeper-probe appending.

## 6. Smallest safe repair / regression sequence (proposed, not yet done)

No scoring formula, weight, threshold, wording or question change in any step below.

1. **Freeze the truth in tests** — add `src/lib/gabriel.graph.test.ts`:
   every `followUp`/`next` resolves; every question in `BRANCH_QUESTIONS` is asked by some
   doorway *including via stage2*; no duplicate choice ids; branch-question weights ≤ 3;
   per-choice evidence sum ≤ 3.
2. **Pin the sequence contract** — `src/lib/gabriel.sequence.test.ts`: Fire is always exactly 6
   pages and always reaches `fury-want > fury-power > fury-close`; Spiral is always exactly 5
   pages with `spiral-known` at page 3; per-doorway page-length sets match the table above;
   editing an earlier answer discards every later answer.
3. **Pin the evaluator** — `src/lib/gabriel.evaluator.test.ts`: `Available_n` equals the sum of
   per-question maxima over the sequence actually passed in; `raw / sqrt(max(reach,1)) * 2`
   with 2-decimal rounding; the 2.4 / 0.35 / 1.8 gates; determinism on re-evaluation; the
   documented Fire and Spiral transcripts above as golden fixtures.
4. **Correct the documentation** — mark `.lovable/audit-spiraling-lock.md`,
   `.lovable/audit-2026-08-19-baseline.md` and `docs/Chase_Stress_Test_2026-08-24.md` as
   describing superseded states, and add one current inventory document containing section 1 of
   this audit as the single source of truth.
5. **Record, do not yet fix, the open construct issues** — `happened` cannot reach 8; thin
   Spiral 6/9; generic `c1`–`c3` dominating short branches; probe weight 4; availability
   counting unanswered trailing questions. Each gets an entry with the intended coordinate left
   blank for your review.
6. **Only then** open the Relational State Layer design, against the corrected inventory.

Steps 1–3 add test files only. Step 4 touches documents only. Nothing in this sequence modifies
`src/lib/gabriel.ts`, `src/routes/index.tsx`, or any user-facing wording.
