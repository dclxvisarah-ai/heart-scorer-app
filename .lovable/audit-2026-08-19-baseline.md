# Gabriel's Number — project-wide audit & validated baseline (2026-08-19)

Immutable core: the 1–9 meanings in `NUMBERS`, the evidence weights, the thresholds
(`MIN_PRIMARY_WEIGHT` 2.4, `MIN_LEAD` 0.35, `MIN_SUPPORT_WEIGHT` 1.8) and the
convergence maths in `evaluatePattern` (`raw / sqrt(availability) * 2`, no averaging).
Questions are evidence-gathering mechanisms only.

## Inventory

10 doorways, 81 distinct questions, 514 answer options.

| doorway | own questions | reachable questions | pages | notes |
|---|---|---|---|---|
| lost | lost-1 (+9 follow-ups) | 20 | 5 | strongest non-drink branch |
| chance | chance-1 → chance-2 (+7) | 19 | 5–6 | |
| spiral | spiral-1, spiral-known (+8) | 13 | 5 | |
| drink | drink-1 (+14 stage-1, 10 stage-2) | 18 | 6 fixed | reference implementation |
| gamble | gamble-1, gamble-2 | 12 | 5 | thin: relies on c1/c2/c3 |
| talk | talk-1..3 | 13 | 5–6 | |
| well | well-1, well-2 | 5 | 5 | thin |
| happened | happened-1..3 | 5 | 5 | thin; see defect list |
| loop | loop-1..3 | 13 | 5–6 | |
| surprise | surprise-1 (universal: always) | 11 | 5 | |

Shared: `c1`, `c2`, `c3` (top-up closers), `u1` + `uf-*` (avoidance branch, asked only
when an answer carries `avoids`), `DEEPER_PROBES` (undetermined resolution).

## Flags

REQUIRES REBUILD (flagged in code via the non-scoring `Question.rebuild` field, which
records the 1–9 information target to preserve; live mappings untouched so nothing breaks):

- `u1` — banned generic avoidance question.
- `uf-discomfort`, `uf-conversation`, `uf-uncertainty`, `uf-decision`, `uf-boredom`,
  `uf-relief` — follow-ups of the banned question, generic therapy language.
- `c1` — asks the person to label their own epistemics in quiz language.
- `c3` — options restate the nine lessons, so it self-reports the result.

PASS: `c2`, all drink questions, all doorway openers and their follow-ups.
REMOVE: none — every question maps to at least one legitimate 1–9 criterion.

## Defects found and fixed

1. Six answers carried total weight 4 while every peer carried 2–3, i.e. they were
   silently double-weighted: `chance-info/a`, `chance-split/a`, `spiral-stuck/d`,
   `uf-conversation/c`, `happened-3/a`, `spiral-known/b`. Normalized to the house
   convention ({x:3} or {x:2,y:1}) keeping the dominant criterion. No threshold,
   meaning, or formula changed.

## Known gap, deliberately NOT patched (needs the rebuild pass, not invented weights)

- `happened` cannot produce 8 (Listening). Its own three questions carry no 8 evidence
  above weight 1 and the branch is long enough that `c3` (the only 8:3 option) is never
  appended. The fix belongs to the rebuild: give the branch real "what did they actually
  say / what did you receive before interpreting" material.

## Stress-test results (all clean)

309,650 complete paths. Exhaustive for 9 doorways; drink capped at 250,000 leaves
(previously validated exhaustively at 696,420). Checks: static integrity (no unmapped
answer, no weight outside 1–3, no choice sum outside 1–3, no per-question reach above 3,
no dangling `next`/`followUp`, no duplicate labels), per-answer exercise coverage,
determinism, back-button edits at every page with stale-answer invalidation, repeated
selection idempotency, bogus/missing answer ids, null state (no primary with zero
answers), contradictions, and deeper-probe resolution.

- All nine numbers reachable app-wide; per doorway all nine except `happened` (no 8).
- Undetermined reachable in every doorway (≈25–30% of paths).
- Deeper probes resolve ≈97% of undetermined cases; never a dead end.
- Problems reported: 0.

## Future (flagged only, must never affect scoring)

Progress indicator: seed → sprout → young tree → growing tree → blooming tree →
fruit-bearing tree. Purely visual.
