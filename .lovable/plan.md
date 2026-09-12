# Save the addiction-system code audit as an internal artifact

Documentation only. No production code, scoring, questions, branches, or UI change.

## What gets written

One new internal file: `.lovable/addiction-code-audit-2026-09-12.md`, clearly
labeled as a read-only current-code audit (not a test result, not a readiness
claim, not a plan).

Contents, exactly as verified from current source:

1. Header: purpose, date, method (source reading only — no live test, no build,
   no inference from prior documents or claims).
2. One section per audited mechanism, each in the
   `CODE LOCATION → WHAT IT ACTUALLY DOES → MATCHES CURRENT V2 TRAJECTORY? → GAP`
   form, covering: sequencing; psychological purpose/distinction; drinking
   doorway; gambling doorway; research facts; response→evidence;
   Number evidence; 1–9 structural location; relationships/intersections;
   recognition; readiness; control attempt/result; consequence/cost;
   displacement; persistence/chasing; stopping mechanism.
3. Confirmed-correct list (what is working as intended, so it is not "fixed"
   later by mistake): Number-evidence isolation, hypothetical-never-current
   prerequisite rule, "Nothing right now" preserved, G3 not self-gating,
   `not-tried` vs `no-wish` separated.
4. Confirmed-gap list, in the same order as the sections.
5. Explicit closing statement: no implementation is authorized by this document.

## Technical notes

- Line references are recorded as of the current working tree
  (`src/lib/gabriel.ts`, `src/lib/addiction-routing.ts`,
  `src/lib/relational-state.ts`, `src/lib/deep-reading.ts`,
  `src/routes/index.tsx`).
- No `src/**` file is touched. No tests added or changed. No build or live run.
- Nothing in the audit is exposed to the user-facing app.

## Not in this pass

Any correction of sequencing, the fact model, stop-locus, dual
current/historical state, or a separate addiction read. Those are planned only
after you approve this artifact.
