# Roadmap

## Done
- Architectural audit of the question graph, sequence builder and evaluator at baseline b02fcfe.
- Safe audit gate: automated tests only, no production behaviour changed.
  - `src/lib/gabriel.graph.test.ts`
  - `src/lib/gabriel.sequence.test.ts`
  - `src/lib/gabriel.evaluator.test.ts`
  - `src/lib/gabriel.composition.test.ts`
  - `.lovable/inventory-current-baseline.md` (marks earlier audits superseded)

## Open — awaiting Sarah's review, not to be changed unilaterally
- `happened` cannot reach 8 (its only 8-heavy option lives on the shared `c3`).
- Seven choices carry a per-choice evidence total of 4 instead of the Aug-19 convention of 3.
- Deeper probes use weight 4, above the documented maximum of 3.
- `Available_n` counts sequence questions that are not yet answered.
- Thin branches are majority-generic (`surprise` 4/5 shared pages); Spiral rarely reaches 6 or 9.

## Next (blocked on the above review)
- Relational State Layer design, against the corrected inventory. Not started; explicitly
  out of scope for this pass.
