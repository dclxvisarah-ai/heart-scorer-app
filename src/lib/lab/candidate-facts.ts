/**
 * Gabriel's Lab — CANDIDATE fact model (V5.4 research candidate).
 * RESEARCH ONLY. Nothing here is imported by production code.
 *
 * It does not import or alter production routing behaviour: it does not use
 * `ANSWER_ROUTING_FACTS`, `deriveRoutingFacts`, `normalizeRoutingFacts`,
 * `isProbeEarned` or `getEarnedAddictionQuestions`. It only reads question
 * TEXT (ids/choices) from the existing modules.
 *
 * Two corrections over the V5.3 production model:
 *   1. A fact holds CURRENT, HISTORICAL and HYPOTHETICAL states at the SAME
 *      time, so "it used to, not now" keeps both halves.
 *   2. STOP_MECHANISM carries a research-only locus value, so an external stop
 *      and a chosen stop are different states.
 *
 * No addiction score, no severity value, no diagnosis. Facts never touch
 * Number scoring.
 */

export type CandidateFactKey =
  | "CONTROL_ATTEMPT"
  | "CONTROL_RESULT"
  | "BASIC_LIFE_DISPLACEMENT"
  | "MEANINGFUL_COST"
  | "TIME_ROLE_DISPLACEMENT"
  | "CHASE_OR_CONTINUE"
  | "LIMIT_MOVED"
  | "STOP_MECHANISM"
  | "RECOGNITION"
  | "READINESS";

export const CANDIDATE_FACT_KEYS: CandidateFactKey[] = [
  "CONTROL_ATTEMPT",
  "CONTROL_RESULT",
  "BASIC_LIFE_DISPLACEMENT",
  "MEANINGFUL_COST",
  "TIME_ROLE_DISPLACEMENT",
  "CHASE_OR_CONTINUE",
  "LIMIT_MOVED",
  "STOP_MECHANISM",
  "RECOGNITION",
  "READINESS",
];

export type FactState =
  | "ESTABLISHED"
  | "NEGATED"
  | "PROVISIONAL"
  | "UNKNOWN"
  | "NOT_APPLICABLE";

export type Scope = "CURRENT" | "HISTORICAL" | "HYPOTHETICAL";

/** Research-only shape of what ends an episode. Never a grade. */
export type StopLocus =
  | "SELF_DECISION"
  | "RESPONSIBILITY"
  | "EXTERNAL_ACCESS"
  | "BODY_DEPLETION"
  | "SOMEONE_ELSE"
  | "NO_TRUE_END"
  | "UNKNOWN";

/** Research-only shape of an attempted change. */
export type ControlOutcome =
  | "HELD"
  | "RETURNED"
  | "NO_CHANGE"
  | "NOT_ATTEMPTED"
  | "NO_WISH_TO_CHANGE"
  | "UNKNOWN";

export interface FactSource {
  questionId: string;
  choiceId: string;
}

export interface CandidateFact {
  key: CandidateFactKey;
  /** All three scopes are tracked independently and simultaneously. */
  current: FactState;
  historical: FactState;
  hypothetical: FactState;
  /** True only when two different questions assert opposite CURRENT states. */
  contradiction: boolean;
  locus?: StopLocus;
  controlOutcome?: ControlOutcome;
  sources: FactSource[];
}

export type CandidateFactSummary = Record<CandidateFactKey, CandidateFact>;

interface Spec {
  key: CandidateFactKey;
  scope: Scope;
  state: FactState;
  locus?: StopLocus;
  controlOutcome?: ControlOutcome;
}

const s = (
  key: CandidateFactKey,
  scope: Scope,
  state: FactState,
  extra: { locus?: StopLocus; controlOutcome?: ControlOutcome } = {},
): Spec => ({ key, scope, state, ...extra });

/**
 * Candidate answer -> fact map, keyed `questionId/choiceId`.
 * Existing DRINK/GAMBLE branch answers about routine, mood, boredom or
 * "a sense of control" are deliberately NOT mapped: they are context, not
 * control-failure or severity evidence.
 */
export const CANDIDATE_FACT_SPECS: Record<string, Spec[]> = {
  /* --- E1: attempted change vs not wanting change ---------------- */
  "addiction-e1/held": [
    s("CONTROL_ATTEMPT", "HISTORICAL", "ESTABLISHED"),
    s("CONTROL_RESULT", "CURRENT", "ESTABLISHED", { controlOutcome: "HELD" }),
  ],
  "addiction-e1/returned": [
    s("CONTROL_ATTEMPT", "HISTORICAL", "ESTABLISHED"),
    s("CONTROL_ATTEMPT", "CURRENT", "ESTABLISHED"),
    s("CONTROL_RESULT", "CURRENT", "ESTABLISHED", { controlOutcome: "RETURNED" }),
  ],
  "addiction-e1/no-change": [
    s("CONTROL_ATTEMPT", "HISTORICAL", "ESTABLISHED"),
    s("CONTROL_ATTEMPT", "CURRENT", "ESTABLISHED"),
    s("CONTROL_RESULT", "CURRENT", "ESTABLISHED", { controlOutcome: "NO_CHANGE" }),
  ],
  // Not having tried is NOT the same as not wanting to change.
  "addiction-e1/not-tried": [
    s("CONTROL_ATTEMPT", "CURRENT", "NEGATED"),
    s("CONTROL_RESULT", "CURRENT", "NOT_APPLICABLE", { controlOutcome: "NOT_ATTEMPTED" }),
  ],
  "addiction-e1/no-wish": [
    s("CONTROL_ATTEMPT", "CURRENT", "NEGATED"),
    s("CONTROL_RESULT", "CURRENT", "NOT_APPLICABLE", { controlOutcome: "NO_WISH_TO_CHANGE" }),
    s("READINESS", "CURRENT", "NEGATED"),
  ],
  "addiction-e1/unsure": [
    s("CONTROL_ATTEMPT", "CURRENT", "UNKNOWN"),
    s("CONTROL_RESULT", "CURRENT", "UNKNOWN", { controlOutcome: "UNKNOWN" }),
  ],

  /* --- E2: upstream CURRENT displacement ------------------------- */
  "addiction-e2/intact": [s("BASIC_LIFE_DISPLACEMENT", "CURRENT", "NEGATED")],
  "addiction-e2/skipping": [s("BASIC_LIFE_DISPLACEMENT", "CURRENT", "ESTABLISHED")],
  "addiction-e2/hours": [
    s("BASIC_LIFE_DISPLACEMENT", "CURRENT", "ESTABLISHED"),
    // Upstream source of time/role displacement — this is what makes G3 reachable.
    s("TIME_ROLE_DISPLACEMENT", "CURRENT", "ESTABLISHED"),
  ],
  // The correction: both halves are kept.
  "addiction-e2/before": [
    s("BASIC_LIFE_DISPLACEMENT", "HISTORICAL", "ESTABLISHED"),
    s("BASIC_LIFE_DISPLACEMENT", "CURRENT", "NEGATED"),
  ],
  "addiction-e2/slips": [s("BASIC_LIFE_DISPLACEMENT", "CURRENT", "PROVISIONAL")],
  "addiction-e2/unsure": [s("BASIC_LIFE_DISPLACEMENT", "CURRENT", "UNKNOWN")],

  /* --- E3: actual cost vs hypothetical future cost --------------- */
  "addiction-e3/money": [s("MEANINGFUL_COST", "CURRENT", "ESTABLISHED")],
  "addiction-e3/time": [s("MEANINGFUL_COST", "CURRENT", "ESTABLISHED")],
  "addiction-e3/trust": [s("MEANINGFUL_COST", "CURRENT", "ESTABLISHED")],
  "addiction-e3/health": [s("MEANINGFUL_COST", "CURRENT", "ESTABLISHED")],
  "addiction-e3/none": [s("MEANINGFUL_COST", "CURRENT", "NEGATED")],
  // Hypothetical stays hypothetical and never satisfies a current prerequisite.
  "addiction-e3/later": [s("MEANINGFUL_COST", "HYPOTHETICAL", "PROVISIONAL")],
  "addiction-e3/unsure": [s("MEANINGFUL_COST", "CURRENT", "UNKNOWN")],

  /* --- E4: stopping mechanism, with locus ------------------------ */
  "addiction-e4/decide": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "SELF_DECISION" }),
  ],
  "addiction-e4/responsibility": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "RESPONSIBILITY" }),
  ],
  "addiction-e4/run-out": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "EXTERNAL_ACCESS" }),
  ],
  "addiction-e4/body": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "BODY_DEPLETION" }),
  ],
  "addiction-e4/someone": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "SOMEONE_ELSE" }),
  ],
  "addiction-e4/pauses": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "NO_TRUE_END" }),
  ],
  "addiction-e4/unsure": [s("STOP_MECHANISM", "CURRENT", "UNKNOWN", { locus: "UNKNOWN" })],

  /* --- E5: recognition ------------------------------------------- */
  "addiction-e5/no-pattern": [s("RECOGNITION", "CURRENT", "NEGATED")],
  "addiction-e5/partial": [s("RECOGNITION", "CURRENT", "PROVISIONAL")],
  "addiction-e5/clear": [s("RECOGNITION", "CURRENT", "ESTABLISHED")],
  "addiction-e5/problems": [s("RECOGNITION", "CURRENT", "PROVISIONAL")],
  "addiction-e5/unsure": [s("RECOGNITION", "CURRENT", "UNKNOWN")],

  /* --- E6: readiness, downstream of recognition ------------------ */
  "addiction-e6/nothing": [s("READINESS", "CURRENT", "NEGATED")],
  "addiction-e6/cut-back": [s("READINESS", "CURRENT", "ESTABLISHED")],
  "addiction-e6/stop": [s("READINESS", "CURRENT", "ESTABLISHED")],
  "addiction-e6/underneath": [s("READINESS", "CURRENT", "ESTABLISHED")],
  "addiction-e6/understand": [s("READINESS", "CURRENT", "PROVISIONAL")],
  "addiction-e6/unsure": [s("READINESS", "CURRENT", "UNKNOWN")],

  /* --- Existing GAMBLE branch answers that carry real facts ------ */
  "gamble-1/c": [s("CHASE_OR_CONTINUE", "CURRENT", "ESTABLISHED")],
  "gamble-2/a": [s("LIMIT_MOVED", "CURRENT", "NEGATED")],
  "gamble-2/b": [s("LIMIT_MOVED", "HISTORICAL", "ESTABLISHED")],

  /* --- G1/G2/G3 -------------------------------------------------- */
  "gamble-g1/decide": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "SELF_DECISION" }),
  ],
  "gamble-g1/run-out": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "EXTERNAL_ACCESS" }),
  ],
  "gamble-g1/responsibility": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "RESPONSIBILITY" }),
  ],
  "gamble-g1/closed": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "EXTERNAL_ACCESS" }),
  ],
  "gamble-g1/win-back": [
    s("STOP_MECHANISM", "CURRENT", "ESTABLISHED", { locus: "NO_TRUE_END" }),
    s("CHASE_OR_CONTINUE", "CURRENT", "ESTABLISHED"),
  ],
  "gamble-g1/unsure": [s("STOP_MECHANISM", "CURRENT", "UNKNOWN", { locus: "UNKNOWN" })],

  "gamble-g2/win-back": [s("CHASE_OR_CONTINUE", "CURRENT", "ESTABLISHED")],
  "gamble-g2/not-over": [s("LIMIT_MOVED", "CURRENT", "ESTABLISHED")],
  "gamble-g2/too-low": [s("LIMIT_MOVED", "CURRENT", "ESTABLISHED")],
  "gamble-g2/no-decision": [
    s("LIMIT_MOVED", "CURRENT", "ESTABLISHED"),
    s("CONTROL_RESULT", "CURRENT", "ESTABLISHED", { controlOutcome: "NO_CHANGE" }),
  ],
  "gamble-g2/unsure": [s("LIMIT_MOVED", "CURRENT", "UNKNOWN")],

  "gamble-g3/sleep": [s("TIME_ROLE_DISPLACEMENT", "CURRENT", "ESTABLISHED")],
  "gamble-g3/work": [s("TIME_ROLE_DISPLACEMENT", "CURRENT", "ESTABLISHED")],
  "gamble-g3/people": [s("TIME_ROLE_DISPLACEMENT", "CURRENT", "ESTABLISHED")],
  "gamble-g3/care": [
    s("TIME_ROLE_DISPLACEMENT", "CURRENT", "ESTABLISHED"),
    s("BASIC_LIFE_DISPLACEMENT", "CURRENT", "ESTABLISHED"),
  ],
  "gamble-g3/nothing": [s("TIME_ROLE_DISPLACEMENT", "CURRENT", "NEGATED")],
  "gamble-g3/unsure": [s("TIME_ROLE_DISPLACEMENT", "CURRENT", "UNKNOWN")],
};

function emptyFact(key: CandidateFactKey): CandidateFact {
  return {
    key,
    current: "UNKNOWN",
    historical: "UNKNOWN",
    hypothetical: "UNKNOWN",
    contradiction: false,
    sources: [],
  };
}

export function emptySummary(): CandidateFactSummary {
  const out = {} as CandidateFactSummary;
  for (const key of CANDIDATE_FACT_KEYS) out[key] = emptyFact(key);
  return out;
}

/**
 * Derives the candidate summary. Every question contributes at most one
 * answer, so a person's correction always replaces their own earlier claim;
 * a contradiction is only recorded when two DIFFERENT questions assert
 * opposite CURRENT states for the same key.
 */
export function deriveCandidateFacts(
  orderedQuestionIds: string[],
  answers: Record<string, string>,
): CandidateFactSummary {
  const summary = emptySummary();
  const currentClaims = new Map<CandidateFactKey, Map<string, FactState>>();

  for (const questionId of orderedQuestionIds) {
    const choiceId = answers[questionId];
    if (!choiceId) continue;
    const specs = CANDIDATE_FACT_SPECS[`${questionId}/${choiceId}`];
    if (!specs) continue;

    for (const spec of specs) {
      const fact = summary[spec.key];
      const scopeField =
        spec.scope === "CURRENT" ? "current" : spec.scope === "HISTORICAL" ? "historical" : "hypothetical";

      // UNKNOWN never overwrites something already established or negated.
      const existing = fact[scopeField];
      const keepExisting = spec.state === "UNKNOWN" && existing !== "UNKNOWN";
      if (!keepExisting) fact[scopeField] = spec.state;

      if (spec.locus && (spec.state !== "UNKNOWN" || !fact.locus)) fact.locus = spec.locus;
      if (spec.controlOutcome) fact.controlOutcome = spec.controlOutcome;
      fact.sources.push({ questionId, choiceId });

      if (spec.scope === "CURRENT" && (spec.state === "ESTABLISHED" || spec.state === "NEGATED")) {
        const byQuestion = currentClaims.get(spec.key) ?? new Map<string, FactState>();
        byQuestion.set(questionId, spec.state);
        currentClaims.set(spec.key, byQuestion);
      }
    }
  }

  for (const [key, byQuestion] of currentClaims) {
    const states = new Set(byQuestion.values());
    if (states.has("ESTABLISHED") && states.has("NEGATED") && byQuestion.size > 1) {
      summary[key].contradiction = true;
    }
  }

  return summary;
}

/** Established right now — the only thing that satisfies a current prerequisite. */
export function establishedNow(summary: CandidateFactSummary, key: CandidateFactKey): boolean {
  return summary[key].current === "ESTABLISHED";
}

export function establishedHistorically(
  summary: CandidateFactSummary,
  key: CandidateFactKey,
): boolean {
  return summary[key].historical === "ESTABLISHED";
}

/** Nothing has settled this yet. A stated "no" stops probing. */
export function unresolved(summary: CandidateFactSummary, key: CandidateFactKey): boolean {
  const fact = summary[key];
  if (fact.contradiction) return false;
  return (
    fact.current === "UNKNOWN" &&
    fact.historical === "UNKNOWN" &&
    (fact.hypothetical === "UNKNOWN" || fact.hypothetical === "PROVISIONAL")
  );
}

/** Stable signature of the whole fact state, for matrix comparison. */
export function candidateFingerprint(summary: CandidateFactSummary): string {
  return CANDIDATE_FACT_KEYS.map((key) => {
    const f = summary[key];
    const extra = [f.locus, f.controlOutcome, f.contradiction ? "CONTRADICTION" : null]
      .filter(Boolean)
      .join(",");
    return `${key}=${f.current}/${f.historical}/${f.hypothetical}${extra ? `(${extra})` : ""}`;
  }).join("|");
}
