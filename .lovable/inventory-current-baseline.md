# Gabriel's Number — CURRENT INVENTORY (authoritative)

Baseline commit: **b02fcfe0ce232f54eb8141dc755a4e92836a7fd1** ("Restored RIGHT NOW CSS rules").

This document supersedes the earlier audit documents for all statements about *current*
behaviour. Nothing is deleted — the older documents remain as history of the states they
described.

## Superseded documents

| Document | Status | Why |
|---|---|---|
| `.lovable/audit-2026-08-19-baseline.md` | **superseded** | Describes 10 doorways with `chance`/`gamble`/`talk` hidden and a six-page Spiral. Neither exists at this commit. |
| `.lovable/audit-spiraling-lock.md` | **superseded** | Claims Spiral has `stage2: "spiral-known"`, `prefixPages: 3`, `totalPages: 6`, 15 questions, 84 options, 55,440 paths. Current Spiral has no stage2: 10 questions, 63 options, 5,500 paths, all 5 pages. |
| `docs/Chase_Stress_Test_2026-08-24.md` | **superseded** | Audits the `bet` doorway ("THE CHASE") and an `index.tsx` stale-answer prune. Neither exists at this commit. |
| `docs/Drinking_Branch_Full_Audit.md` | **partially superseded** | Its 1–9 meanings, weights and thresholds still hold; its Drinking page architecture and path counts do not. |

The 1–9 framework, evidence weights, normalization and thresholds are unchanged and remain
protected: `MIN_PRIMARY_WEIGHT = 2.4`, `MIN_LEAD = 0.35`, `MIN_SUPPORT_WEIGHT = 1.8`,
`W_n = Raw_n / sqrt(max(Available_n, 1)) * 2` rounded to two decimals.

## Doorways as they actually run (enumerated live from `buildSequence`)

| Doorway | own Qs | Qs via followUp/next | stage2 | page lengths | complete paths | options | shared pages/path |
|---|---|---|---|---|---|---|---|
| fire | 1 | 7 | fury-want (3/6) | 6 | 217,728 | 71 | 0 |
| lost | 1 | 10 | — | 5 | 8,250 | 112 | 3 |
| chance | 1 | 9 | — | 5, 6 | 18,180 | 104 | 2–3 |
| spiral | 2 | 10 | — | 5 | 5,500 | 63 | 2 |
| drink | 1 | 12 | — | 5, 6 | 36,750 | 140 | 1–3 |
| gamble | 2 | 2 | — | 5 | 3,900 | 65 | 3 |
| talk | 3 | 3 | — | 5, 6 | 5,120 | 69 | 2–3 |
| well | 2 | 2 | — | 5 | 4,500 | 27 | 3 |
| happened | 3 | 3 | — | 5 | 1,600 | 22 | 2 |
| loop | 3 | 3 | — | 5, 6 | 5,400 | 68 | 2–3 |
| surprise | 1 | 1 | — | 5 | 7,200 | 61 | 4 |

`BRANCH_QUESTIONS` holds 45 questions; all 45 are asked. No dangling `followUp`, `next` or
`stage2` target exists. THE FIRE is the only branch with the fixed-length architecture and the
only branch with no shared generic pages.

## Corrections to two earlier suspicions

- **Spiral / `spiral-known` is correctly wired.** `spiral-replay` has no `followUp` to it, but
  `spiral-known` is the doorway's second *own* question, so `buildSequence` expands it directly.
  Live path: `spiral-1 > spiral-<state> > spiral-known > c1 > c2`.
- **THE FIRE does reach stage 2.** `fire-1 > fury-crossed-* > fury-under` is exactly 3 pages, so
  the prefix satisfies `prefixPages: 3` and stage 2 is entered. Live path ends
  `fury-want > fury-power > fury-close`. `fury-want`/`fury-power`/`fury-close` are orphans in the
  followUp graph *only* — they are entered through `stage2`.

## Open findings — recorded, deliberately NOT changed

1. `happened` can never produce 8; its only 8-heavy option lives on `c3`, which the branch is
   too long to receive.
2. Seven choices carry a per-choice evidence *total* of 4 rather than the Aug-19 convention of 3:
   `chance-info/a`, `chance-split/a`, `drink-habit-4/c`, `happened-3/a`, `spiral-known/b`,
   `spiral-stuck/d`, `uf-conversation/c`. No single weight exceeds 3 anywhere.
3. Deeper probes use weight 4, above the documented per-choice maximum of 3.
4. `Available_n` includes questions present in the sequence but not yet answered. Harmless at the
   result screen; it deflates weights mid-flow.
5. Thin branches are majority-generic: `surprise` is 4 of 5 shared pages, `lost`/`gamble`/`well`
   3 of 5. Spiral yields 9 on 0.8% and 6 on 1.4% of paths; `well` exercises only 27 options and
   `happened` 22.

## Test gate

- `src/lib/gabriel.graph.test.ts` — transition integrity, reachability including stage2, id and
  label uniqueness, evidence-weight bounds, the recorded total-4 exception set.
- `src/lib/gabriel.sequence.test.ts` — doorway order, Fire's 6 pages and stage-2 tail, Spiral's
  5 pages with `spiral-known` at page 3, per-doorway page-length/path/option snapshots,
  back-edit invalidation at every position in every branch, deeper-probe appending.
- `src/lib/gabriel.evaluator.test.ts` — normalization recomputed independently, `Available_n`
  derived from the supplied sequence, the 2.4 / 0.35 / 1.8 gates, determinism, Undetermined never
  forced, and the observed Spiraling transcript as a golden fixture.
- `src/lib/gabriel.composition.test.ts` — shared vs doorway-specific composition per branch and
  the absence of cross-branch contamination.
- `src/lib/lab/__tests__/contract.test.ts` — pre-existing Lab recorder tests (unchanged).

The golden Spiraling fixture is a **design/regression fixture only**. It records what the current
engine returns for one observed traversal. It is not psychological validation and asserts nothing
about accuracy, reliability or construct validity.
