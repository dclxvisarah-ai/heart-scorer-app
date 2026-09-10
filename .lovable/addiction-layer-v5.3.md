# Addiction research layer — V5.3 (implemented)

Internal note. Scope of the single consolidated build pass.

## What was added

- `src/lib/addiction-routing.ts` — research-only module: `RoutingFactKey` /
  state / temporal scope model, sidecar `ANSWER_ROUTING_FACTS` metadata,
  approved questions E1–E6 and G1–G3 (exact prompts), pure
  `deriveRoutingFacts` / `normalizeRoutingFacts` / `summarizeRoutingFacts`,
  deterministic `ADDICTION_PROBE_PRIORITY`, and fact-gated `isProbeEarned` /
  `getEarnedAddictionQuestions`.
- `src/lib/gabriel.ts` — two additions only: optional `Doorway.researchLayer`
  (badge string) set on `drink` and `gamble`, and a fact-gated append of
  earned addiction questions at the end of the non-fixed `buildSequence()`
  tail.
- `src/routes/index.tsx` — menu badge rendered from `researchLayer`, so it
  appears on DRINK and GAMBLE only.
- `src/lib/addiction-routing.test.ts` — hard-case contract (23 tests).

## Invariants held

- Number evidence, weights, normalization, thresholds, meanings, branch
  content and wording are unchanged. Addiction questions carry `evidence: {}`,
  so `evaluatePattern()` output is identical with or without them (asserted).
- Generic deeper probes are untouched and remain contested-Number driven.
  Contested Numbers never trigger an addiction probe; addiction facts never
  feed `getDeeperProbe`.
- Actual vs hypothetical, HISTORICAL vs CURRENT, `NEGATED`, `CONTRADICTED`
  and a valid "Nothing right now." are preserved rather than collapsed.
- The nine pilot-restored / other branches are unmodified and never receive
  this layer.
- No generic ADDICTION or SEX branch was created; those remain research
  candidates with no finalized corpus.

## Test-baseline bookkeeping

The existing exhaustive enumerations (`gabriel.sequence.test.ts`,
`gabriel.composition.test.ts`) now treat research questions as terminal and
exclude them from recorded page-length / shared-share metrics. Recorded path
and option counts are unchanged (drink: 36750 paths, 140 options), so the
baseline contract still pins the Number graph exactly as before.

Verification: 117/117 tests, typecheck clean, build OK, live DRINK flow
confirmed to reach E1–E5 only after their prerequisites were answered.
