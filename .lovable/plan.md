# Remove canned result text — display-only cleanup

Goal: on the results screen, every branch shows only the Gabriel Number, its plain-English name, and the personalized reflection. Remove the Hebrew/Kabbalistic name, the "Core lesson" box, and the fixed per-number meaning paragraph. Display-only — no scoring, evidence, or territory logic changes.

## Changes

### `src/routes/index.tsx` (result section, lines ~338–359)
- Remove the small uppercase line showing `NUMBERS[result.primary].tree` (e.g. "Netzach") under the name.
- Remove the bordered "Core lesson." paragraph box.
- Remove the fixed paragraph showing `NUMBERS[result.primary].meaning` (canned, identical for everyone with that number).
- Keep untouched: the big numeral, the plain-English name (e.g. "7 — Staying"), the Undetermined state, deeper-probe UI, DeepReadingPanel, RelationalStatePanel.

### `src/lib/gabriel.ts`
- No changes. The `tree`, `lesson`, and `meaning` data fields stay in the data model (scoring/evidence untouched); they simply stop being displayed.

## Verification
- Run full test suite + typecheck + build.
- Browser check: earn a result (e.g. DRINK path) and confirm the screen shows only the number, plain-English name, and personalized reflection — no Hebrew name, no Core lesson box, no meaning paragraph. Confirm Undetermined result still renders normally.
