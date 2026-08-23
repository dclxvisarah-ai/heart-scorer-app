# Fire (anger) branch — psychometric architecture audit

No code changes. The audit below is complete; the only proposed action is to commit it
to the repo as a citable document.

## Proposed action

Create `docs/Fire_Branch_Psychometric_Alignment_Audit.md` containing the full audit
(sections 1–6, both rubrics, the raw evidence table, and the file/line citations),
so it sits alongside `docs/Drinking_Branch_Full_Audit.md`,
`.lovable/audit-spiraling-lock.md` and `.lovable/audit-2026-08-19-baseline.md`.

Nothing else changes: no question, weight, threshold, formula, narrative, or menu edit.

## Sources inspected

- `src/lib/gabriel.ts` — `NUMBERS` (L46–130), Fire doorway `happened` (L626–658),
  Fire branch pages `fury-crossed-*` / `fury-under` / `fury-want` / `fury-power` /
  `fury-close` (L730–862), `VISIBLE_DOORWAY_ORDER` (L1839), `DEEPER_PROBES`
  (L1995–2100), scoring `evaluatePattern` + constants (L2153–2240).
- `src/lib/result-narrative.ts`, `src/components/RightNow.tsx` (non-scoring).
- `mem://features/architecture-handoff-2026-08-22`, project knowledge core framework,
  `.lovable/audit-2026-08-19-baseline.md`, `.lovable/audit-spiraling-lock.md`.

## Headline results (as delivered in chat)

- Reference-construct coverage of the anger engine: **64%** (weighted rubric, 7 constructs).
- Alignment with the 2026-08-22 locked Gabriel architecture: **56%** (18 scored requirements).
- Implementation of the *new* evidence/resolution mathematics specifically: **24%**.
- Both figures are conceptual construct-alignment scores, not empirical validity;
  no validation statistic exists because no scored response datasets have been collected.
