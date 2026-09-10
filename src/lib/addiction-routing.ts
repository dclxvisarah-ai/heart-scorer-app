/**
 * Gabriel's Number — addiction research layer (V5.3)
 *
 * RESEARCH-ONLY ROUTING. This module is deliberately separate from the
 * protected 1–9 evaluator:
 *
 *  - It never reads, writes, or weighs Number evidence.
 *  - Every question it contributes carries EMPTY Number evidence, so the
 *    evaluator's totals, available reach, normalization, and thresholds are
 *    mathematically untouched by this layer.
 *  - Routing eligibility is decided only by routing-fact state + temporal
 *    scope. Contested Numbers never trigger an addiction question.
 *
 * It applies to the existing addiction doorways only: DRINK and GAMBLE.
 * The proposed generic ADDICTION and SEX branches remain research
 * candidates and are NOT implemented here.
 */

import type { Question } from "./gabriel";

/* ------------------------------------------------------------------ */
/* Fact model                                                          */
/* ------------------------------------------------------------------ */

export type RoutingFactKey =
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

export type RoutingFactState =
  | "ESTABLISHED"
  | "NEGATED"
  | "PROVISIONAL"
  | "UNKNOWN"
  | "CONTRADICTED"
  | "NOT_APPLICABLE";

export type TemporalScope = "CURRENT" | "HISTORICAL" | "HYPOTHETICAL" | "UNSPECIFIED";

export interface RoutingFact {
  key: RoutingFactKey;
  state: RoutingFactState;
  temporalScope: TemporalScope;
  sourceQuestionId: string;
  sourceChoiceId: string;
}

export const ROUTING_FACT_KEYS: RoutingFactKey[] = [
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

/** A fact declaration attached to one answer, without its source ids. */
type FactSpec = Pick<RoutingFact, "key" | "state" | "temporalScope">;

const f = (
  key: RoutingFactKey,
  state: RoutingFactState,
  temporalScope: TemporalScope = "UNSPECIFIED",
): FactSpec => ({ key, state, temporalScope });

/* ------------------------------------------------------------------ */
/* Routing metadata attached to answers                                */
/* ------------------------------------------------------------------ */

/**
 * Research routing metadata, keyed `questionId/choiceId`. This is a sidecar
 * map on purpose: no existing question or Number evidence weight is edited.
 *
 * Existing DRINK answers about routine, stress, boredom, urge duration,
 * avoidance, or "a sense of control" are intentionally NOT mapped. They are
 * not severity or control-failure evidence.
 */
export const ANSWER_ROUTING_FACTS: Record<string, FactSpec[]> = {
  /* --- GAMBLE: existing answers that genuinely carry routing facts --- */
  // "I'm behind and want to catch up"
  "gamble-1/c": [f("CHASE_OR_CONTINUE", "ESTABLISHED", "CURRENT")],
  // "Yes, a set amount, and I stick to it"
  "gamble-2/a": [f("LIMIT_MOVED", "NEGATED", "CURRENT")],
  // "Yes, but I've moved it before"
  "gamble-2/b": [f("LIMIT_MOVED", "ESTABLISHED", "HISTORICAL")],

  /* --- DRINK: hypothetical-only answers stay hypothetical -------- */
  // drink-habit-3 asks what *might* change. A possible future benefit is
  // never current cost or current impairment evidence.
  "drink-habit-3/a": [f("MEANINGFUL_COST", "PROVISIONAL", "HYPOTHETICAL")],
  "drink-habit-3/b": [f("MEANINGFUL_COST", "PROVISIONAL", "HYPOTHETICAL")],
  "drink-habit-3/e": [f("MEANINGFUL_COST", "PROVISIONAL", "HYPOTHETICAL")],
  "drink-habit-3/g": [f("MEANINGFUL_COST", "PROVISIONAL", "HYPOTHETICAL")],

  /* --- E1: attempted change / control ---------------------------- */
  "addiction-e1/held": [
    f("CONTROL_ATTEMPT", "ESTABLISHED", "HISTORICAL"),
    f("CONTROL_RESULT", "ESTABLISHED", "HISTORICAL"),
  ],
  "addiction-e1/returned": [
    f("CONTROL_ATTEMPT", "ESTABLISHED", "CURRENT"),
    f("CONTROL_RESULT", "ESTABLISHED", "CURRENT"),
  ],
  "addiction-e1/no-change": [
    f("CONTROL_ATTEMPT", "ESTABLISHED", "CURRENT"),
    f("CONTROL_RESULT", "ESTABLISHED", "CURRENT"),
  ],
  "addiction-e1/not-tried": [
    f("CONTROL_ATTEMPT", "NEGATED", "CURRENT"),
    f("CONTROL_RESULT", "NOT_APPLICABLE", "CURRENT"),
  ],
  "addiction-e1/no-wish": [
    f("CONTROL_ATTEMPT", "NEGATED", "CURRENT"),
    f("READINESS", "NEGATED", "CURRENT"),
  ],
  "addiction-e1/unsure": [f("CONTROL_ATTEMPT", "UNKNOWN", "CURRENT")],

  /* --- E2: current basic-life displacement ----------------------- */
  "addiction-e2/intact": [f("BASIC_LIFE_DISPLACEMENT", "NEGATED", "CURRENT")],
  "addiction-e2/skipping": [f("BASIC_LIFE_DISPLACEMENT", "ESTABLISHED", "CURRENT")],
  "addiction-e2/hours": [
    f("BASIC_LIFE_DISPLACEMENT", "ESTABLISHED", "CURRENT"),
    f("TIME_ROLE_DISPLACEMENT", "ESTABLISHED", "CURRENT"),
  ],
  // Historical impairment plus current improvement. The improvement is kept
  // as current, and the history is kept as history.
  "addiction-e2/before": [
    f("BASIC_LIFE_DISPLACEMENT", "ESTABLISHED", "HISTORICAL"),
    f("BASIC_LIFE_DISPLACEMENT", "NEGATED", "CURRENT"),
  ],
  "addiction-e2/slips": [f("BASIC_LIFE_DISPLACEMENT", "PROVISIONAL", "CURRENT")],
  "addiction-e2/unsure": [f("BASIC_LIFE_DISPLACEMENT", "UNKNOWN", "CURRENT")],

  /* --- E3: actual meaningful cost -------------------------------- */
  "addiction-e3/money": [f("MEANINGFUL_COST", "ESTABLISHED", "CURRENT")],
  "addiction-e3/time": [f("MEANINGFUL_COST", "ESTABLISHED", "CURRENT")],
  "addiction-e3/trust": [f("MEANINGFUL_COST", "ESTABLISHED", "CURRENT")],
  "addiction-e3/health": [f("MEANINGFUL_COST", "ESTABLISHED", "CURRENT")],
  "addiction-e3/none": [f("MEANINGFUL_COST", "NEGATED", "CURRENT")],
  "addiction-e3/later": [f("MEANINGFUL_COST", "PROVISIONAL", "HYPOTHETICAL")],
  "addiction-e3/unsure": [f("MEANINGFUL_COST", "UNKNOWN", "CURRENT")],

  /* --- E4: what ends the episode --------------------------------- */
  // Stopping is not automatically recovery or control. The kind of stop is
  // preserved in the fact's sourceChoiceId, not collapsed into a verdict.
  "addiction-e4/decide": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "addiction-e4/responsibility": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "addiction-e4/run-out": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "addiction-e4/body": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "addiction-e4/someone": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "addiction-e4/pauses": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "addiction-e4/unsure": [f("STOP_MECHANISM", "UNKNOWN", "CURRENT")],

  /* --- E5: recognition (never denial, never a verdict) ----------- */
  "addiction-e5/no-pattern": [f("RECOGNITION", "NEGATED", "CURRENT")],
  "addiction-e5/partial": [f("RECOGNITION", "PROVISIONAL", "CURRENT")],
  "addiction-e5/clear": [f("RECOGNITION", "ESTABLISHED", "CURRENT")],
  "addiction-e5/problems": [f("RECOGNITION", "PROVISIONAL", "CURRENT")],
  "addiction-e5/unsure": [f("RECOGNITION", "UNKNOWN", "CURRENT")],

  /* --- E6: readiness, downstream only --------------------------- */
  "addiction-e6/nothing": [f("READINESS", "NEGATED", "CURRENT")],
  "addiction-e6/cut-back": [f("READINESS", "ESTABLISHED", "CURRENT")],
  "addiction-e6/stop": [f("READINESS", "ESTABLISHED", "CURRENT")],
  "addiction-e6/underneath": [f("READINESS", "ESTABLISHED", "CURRENT")],
  "addiction-e6/understand": [f("READINESS", "PROVISIONAL", "CURRENT")],
  "addiction-e6/unsure": [f("READINESS", "UNKNOWN", "CURRENT")],

  /* --- G1: what ends a losing session --------------------------- */
  "gamble-g1/decide": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "gamble-g1/run-out": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "gamble-g1/responsibility": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "gamble-g1/closed": [f("STOP_MECHANISM", "ESTABLISHED", "CURRENT")],
  "gamble-g1/win-back": [
    f("STOP_MECHANISM", "ESTABLISHED", "CURRENT"),
    f("CHASE_OR_CONTINUE", "ESTABLISHED", "CURRENT"),
  ],
  "gamble-g1/unsure": [f("STOP_MECHANISM", "UNKNOWN", "CURRENT")],

  /* --- G2: how a moved limit gets approved ---------------------- */
  "gamble-g2/win-back": [f("CHASE_OR_CONTINUE", "ESTABLISHED", "CURRENT")],
  "gamble-g2/not-over": [f("LIMIT_MOVED", "ESTABLISHED", "CURRENT")],
  "gamble-g2/too-low": [f("LIMIT_MOVED", "ESTABLISHED", "CURRENT")],
  "gamble-g2/no-decision": [
    f("LIMIT_MOVED", "ESTABLISHED", "CURRENT"),
    f("CONTROL_RESULT", "ESTABLISHED", "CURRENT"),
  ],
  "gamble-g2/unsure": [f("LIMIT_MOVED", "UNKNOWN", "CURRENT")],

  /* --- G3: what a long session displaces ------------------------ */
  "gamble-g3/sleep": [f("TIME_ROLE_DISPLACEMENT", "ESTABLISHED", "CURRENT")],
  "gamble-g3/work": [f("TIME_ROLE_DISPLACEMENT", "ESTABLISHED", "CURRENT")],
  "gamble-g3/people": [f("TIME_ROLE_DISPLACEMENT", "ESTABLISHED", "CURRENT")],
  "gamble-g3/care": [
    f("TIME_ROLE_DISPLACEMENT", "ESTABLISHED", "CURRENT"),
    f("BASIC_LIFE_DISPLACEMENT", "ESTABLISHED", "CURRENT"),
  ],
  "gamble-g3/nothing": [f("TIME_ROLE_DISPLACEMENT", "NEGATED", "CURRENT")],
  "gamble-g3/unsure": [f("TIME_ROLE_DISPLACEMENT", "UNKNOWN", "CURRENT")],
};

/* ------------------------------------------------------------------ */
/* The research questions                                              */
/* ------------------------------------------------------------------ */

/** Research-layer questions carry no Number evidence, by design. */
const none = {};

export const E1: Question = {
  id: "addiction-e1",
  prompt:
    "When you've tried to change how often, how much, or when you do this, what usually happens?",
  note: "No right answer here. Not trying is a real answer.",
  choices: [
    { id: "held", label: "I changed it and it stayed changed", evidence: none },
    { id: "returned", label: "It changes for a while, then comes back", evidence: none },
    { id: "no-change", label: "I've tried and it didn't really change", evidence: none },
    { id: "not-tried", label: "I haven't tried to change it", evidence: none },
    { id: "no-wish", label: "I've never wanted to change it", evidence: none },
    { id: "unsure", label: "I'm not sure", evidence: none },
  ],
};

export const E2: Question = {
  id: "addiction-e2",
  prompt:
    "Right now, has this made you regularly go without something you need to take care of yourself or your daily life?",
  note: "Only what's actually been happening lately.",
  choices: [
    { id: "intact", label: "No — I'm still taking care of what I need to", evidence: none },
    {
      id: "skipping",
      label: "Yes — I regularly skip things I need: food, sleep, bills, care",
      evidence: none,
    },
    { id: "hours", label: "Yes — I lose hours to it and other things slide", evidence: none },
    { id: "before", label: "It was like that before, but not right now", evidence: none },
    { id: "slips", label: "Some things slip, but nothing I'd call going without", evidence: none },
    { id: "unsure", label: "I'm not sure", evidence: none },
  ],
};

export const E3: Question = {
  id: "addiction-e3",
  prompt: "What has this actually cost you that matters to you?",
  note: "What's already happened, not what could happen.",
  choices: [
    { id: "money", label: "Money I could name a number for", evidence: none },
    { id: "time", label: "Time I can't get back", evidence: none },
    { id: "trust", label: "Someone's trust, or a relationship", evidence: none },
    { id: "health", label: "My health or my sleep", evidence: none },
    { id: "none", label: "Nothing that matters to me so far", evidence: none },
    { id: "later", label: "Something it could cost me later, but hasn't yet", evidence: none },
    { id: "unsure", label: "I don't know yet", evidence: none },
  ],
};

export const E4: Question = {
  id: "addiction-e4",
  prompt: "When you finally stop, what actually makes the episode end?",
  note: "Whatever ends it is information, not a grade.",
  choices: [
    { id: "decide", label: "I decide I'm done, and I stop", evidence: none },
    { id: "responsibility", label: "Something I'm responsible for pulls me out", evidence: none },
    { id: "run-out", label: "I run out — money, supply, access", evidence: none },
    { id: "body", label: "My body gives out — sick, exhausted, asleep", evidence: none },
    { id: "someone", label: "Someone else steps in", evidence: none },
    { id: "pauses", label: "It doesn't really end, it just pauses", evidence: none },
    { id: "unsure", label: "I'm not sure what ends it", evidence: none },
  ],
};

export const E5: Question = {
  id: "addiction-e5",
  prompt: "When you look at what's been happening over time, which feels closest?",
  note: "Not a test. Not seeing a pattern is a legitimate answer.",
  choices: [
    { id: "no-pattern", label: "I don't see a pattern in it.", evidence: none },
    {
      id: "partial",
      label: "I can see what I've been doing, but I'm not sure what it adds up to.",
      evidence: none,
    },
    { id: "clear", label: "I can see a pattern, and I can see what it's costing me.", evidence: none },
    {
      id: "problems",
      label: "I know it's causing problems, but I'm not sure I'd call it a pattern.",
      evidence: none,
    },
    { id: "unsure", label: "I'm not sure yet.", evidence: none },
  ],
};

export const E6: Question = {
  id: "addiction-e6",
  prompt: "Knowing what you know right now, what do you actually want to be different?",
  note: "\"Nothing right now\" is a complete answer.",
  choices: [
    { id: "nothing", label: "Nothing right now", evidence: none },
    { id: "cut-back", label: "I want to cut back", evidence: none },
    { id: "stop", label: "I want to stop", evidence: none },
    { id: "underneath", label: "I want the thing underneath it to change", evidence: none },
    { id: "understand", label: "I want to understand it before I change anything", evidence: none },
    { id: "unsure", label: "I don't know yet", evidence: none },
  ],
};

export const G1: Question = {
  id: "gamble-g1",
  prompt: "When you lose more than you planned to, what usually makes you finally stop?",
  choices: [
    { id: "decide", label: "I decide I'm done, and I stop", evidence: none },
    { id: "run-out", label: "I run out of money or access", evidence: none },
    { id: "responsibility", label: "Something I'm responsible for pulls me out", evidence: none },
    { id: "closed", label: "The night ends — it closes, or the app stops me", evidence: none },
    { id: "win-back", label: "I stop once I've won some of it back", evidence: none },
    { id: "unsure", label: "I'm not sure", evidence: none },
  ],
};

export const G2: Question = {
  id: "gamble-g2",
  prompt: "When you move the limit, what usually makes you decide the new limit is okay?",
  choices: [
    { id: "win-back", label: "I tell myself I'll win it back", evidence: none },
    { id: "not-over", label: "The night isn't over yet", evidence: none },
    { id: "too-low", label: "I decide the first number was too low", evidence: none },
    { id: "no-decision", label: "I don't really decide — I just keep going", evidence: none },
    { id: "unsure", label: "I'm not sure", evidence: none },
  ],
};

export const G3: Question = {
  id: "gamble-g3",
  prompt: "If gambling starts taking up the rest of the day, what do you end up going without?",
  note: "Only if that's actually how it goes.",
  choices: [
    { id: "sleep", label: "Sleep", evidence: none },
    { id: "work", label: "Work, or something I'm responsible for", evidence: none },
    { id: "people", label: "Time with people", evidence: none },
    { id: "care", label: "Food, or basic care of myself", evidence: none },
    { id: "nothing", label: "Nothing — the rest of the day still happens", evidence: none },
    { id: "unsure", label: "I'm not sure", evidence: none },
  ],
};

export const ADDICTION_QUESTIONS: Record<string, Question> = {
  [E1.id]: E1,
  [E2.id]: E2,
  [E3.id]: E3,
  [E4.id]: E4,
  [E5.id]: E5,
  [E6.id]: E6,
  [G1.id]: G1,
  [G2.id]: G2,
  [G3.id]: G3,
};

/** True for the research-layer questions only (they carry no Number evidence). */
export function isAddictionResearchQuestion(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(ADDICTION_QUESTIONS, id);
}


/** The existing addiction doorways. Nothing else uses this layer. */
export const ADDICTION_DOORWAY_IDS = ["drink", "gamble"] as const;

export function isAddictionDoorway(id: string | undefined): boolean {
  return !!id && (ADDICTION_DOORWAY_IDS as readonly string[]).includes(id);
}

/** Menu badge for the branches this pass updated. */
export const ADDICTION_RESEARCH_VERSION = "V5.3 — addiction research layer";

/* ------------------------------------------------------------------ */
/* Derivation and normalization (pure)                                 */
/* ------------------------------------------------------------------ */

/**
 * Reads routing facts out of the answers, in the order the questions were
 * encountered. Number evidence is never consulted.
 */
export function deriveRoutingFacts(
  orderedQuestionIds: string[],
  answers: Record<string, string>,
): RoutingFact[] {
  const out: RoutingFact[] = [];
  for (const questionId of orderedQuestionIds) {
    const choiceId = answers[questionId];
    if (!choiceId) continue;
    const specs = ANSWER_ROUTING_FACTS[`${questionId}/${choiceId}`];
    if (!specs) continue;
    for (const spec of specs) {
      out.push({ ...spec, sourceQuestionId: questionId, sourceChoiceId: choiceId });
    }
  }
  return out;
}

export type RoutingFactSummary = Record<RoutingFactKey, RoutingFact>;

/**
 * Resolves one state per key.
 *
 *  - Two *different* questions asserting ESTABLISHED and NEGATED for the same
 *    key in the same current scope is a real CONTRADICTION and is preserved.
 *  - Otherwise a CURRENT assertion wins over HISTORICAL or HYPOTHETICAL ones,
 *    so historical impairment plus current improvement stays "improved now".
 *  - A HYPOTHETICAL assertion can only ever be PROVISIONAL. It can never
 *    satisfy a current prerequisite.
 *  - Re-answering a question replaces its own earlier fact, so a person's
 *    correction is never overridden.
 */
export function normalizeRoutingFacts(facts: RoutingFact[]): RoutingFactSummary {
  const summary = {} as RoutingFactSummary;
  for (const key of ROUTING_FACT_KEYS) {
    summary[key] = {
      key,
      state: "UNKNOWN",
      temporalScope: "UNSPECIFIED",
      sourceQuestionId: "",
      sourceChoiceId: "",
    };
  }

  for (const key of ROUTING_FACT_KEYS) {
    const forKey = facts.filter((fact) => fact.key === key);
    if (forKey.length === 0) continue;

    const current = forKey.filter((fact) => fact.temporalScope === "CURRENT");
    const established = current.filter((fact) => fact.state === "ESTABLISHED");
    const negated = current.filter((fact) => fact.state === "NEGATED");

    if (established.length > 0 && negated.length > 0) {
      const latest = forKey[forKey.length - 1]!;
      summary[key] = { ...latest, state: "CONTRADICTED", temporalScope: "CURRENT" };
      continue;
    }
    if (established.length > 0) {
      summary[key] = established[established.length - 1]!;
      continue;
    }
    if (negated.length > 0) {
      summary[key] = negated[negated.length - 1]!;
      continue;
    }
    if (current.length > 0) {
      summary[key] = current[current.length - 1]!;
      continue;
    }

    const latest = forKey[forKey.length - 1]!;
    summary[key] =
      latest.temporalScope === "HYPOTHETICAL" && latest.state === "ESTABLISHED"
        ? { ...latest, state: "PROVISIONAL" }
        : latest;
  }

  return summary;
}

export function summarizeRoutingFacts(
  orderedQuestionIds: string[],
  answers: Record<string, string>,
): RoutingFactSummary {
  return normalizeRoutingFacts(deriveRoutingFacts(orderedQuestionIds, answers));
}

/* ------------------------------------------------------------------ */
/* Eligibility                                                         */
/* ------------------------------------------------------------------ */

/** Established now — the only thing that satisfies a current prerequisite. */
function establishedNow(summary: RoutingFactSummary, key: RoutingFactKey): boolean {
  const fact = summary[key];
  return fact.state === "ESTABLISHED" && fact.temporalScope === "CURRENT";
}

/** Established at some point (used where history genuinely counts). */
function establishedEver(summary: RoutingFactSummary, key: RoutingFactKey): boolean {
  return summary[key].state === "ESTABLISHED";
}

/**
 * A distinction is unresolved when nothing has settled it yet. NEGATED,
 * NOT_APPLICABLE, and CONTRADICTED all stop probing: a stated "no" is
 * respected, and a contradiction is not argued with.
 */
function unresolved(summary: RoutingFactSummary, key: RoutingFactKey): boolean {
  const state = summary[key].state;
  return state === "UNKNOWN" || state === "PROVISIONAL";
}

/**
 * Deterministic, documented priority order. No optimization or
 * information-gain algorithm is used.
 */
export const ADDICTION_PROBE_PRIORITY: string[] = [
  "addiction-e1",
  "addiction-e2",
  "addiction-e3",
  "addiction-e4",
  "gamble-g1",
  "gamble-g2",
  "gamble-g3",
  "addiction-e5",
  "addiction-e6",
];

export interface RoutingContext {
  doorwayId: string;
  /** Questions already in the sequence, in order. */
  orderedQuestionIds: string[];
  answers: Record<string, string>;
}

function answeredCount(ctx: RoutingContext): number {
  return ctx.orderedQuestionIds.filter((id) => ctx.answers[id]).length;
}

function answeredAny(ctx: RoutingContext, ids: string[]): number {
  return ids.filter((id) => ctx.answers[id]).length;
}

/**
 * Fact-gated eligibility. Contested Numbers are never consulted.
 */
export function isProbeEarned(
  probeId: string,
  ctx: RoutingContext,
  summary: RoutingFactSummary,
): boolean {
  if (!isAddictionDoorway(ctx.doorwayId)) return false;

  // Enough branch context to ask anything at all.
  const hasContext = answeredCount(ctx) >= 2;
  const evidenceAsked = answeredAny(ctx, ["addiction-e1", "addiction-e2", "addiction-e3", "addiction-e4"]);

  switch (probeId) {
    case "addiction-e1":
      return hasContext && unresolved(summary, "CONTROL_ATTEMPT");
    case "addiction-e2":
      return hasContext && unresolved(summary, "BASIC_LIFE_DISPLACEMENT");
    case "addiction-e3":
      return hasContext && unresolved(summary, "MEANINGFUL_COST");
    case "addiction-e4":
      return !!ctx.answers["addiction-e1"] && unresolved(summary, "STOP_MECHANISM");

    // Gamble-specific probes, each gated on its own actual evidence.
    case "gamble-g1":
      return ctx.doorwayId === "gamble" && establishedNow(summary, "CHASE_OR_CONTINUE");
    case "gamble-g2":
      return ctx.doorwayId === "gamble" && establishedEver(summary, "LIMIT_MOVED");
    case "gamble-g3":
      return ctx.doorwayId === "gamble" && establishedNow(summary, "TIME_ROLE_DISPLACEMENT");

    case "addiction-e5":
      return evidenceAsked >= 2 && unresolved(summary, "RECOGNITION");
    case "addiction-e6": {
      // Downstream only: recognition has to have been reached first, and
      // readiness is never inferred from ambivalence.
      const recognition = summary.RECOGNITION.state;
      return (
        (recognition === "ESTABLISHED" || recognition === "PROVISIONAL") &&
        !!ctx.answers["addiction-e5"] &&
        unresolved(summary, "READINESS")
      );
    }
    default:
      return false;
  }
}

/**
 * The addiction questions that belong in the sequence right now: every one
 * already answered (so the path never loses a question the person answered),
 * plus every currently earned one, in the documented priority order.
 */
export function getEarnedAddictionQuestions(
  doorwayId: string,
  orderedQuestionIds: string[],
  answers: Record<string, string>,
): Question[] {
  if (!isAddictionDoorway(doorwayId)) return [];
  const ctx: RoutingContext = { doorwayId, orderedQuestionIds, answers };
  const summary = summarizeRoutingFacts(
    [...orderedQuestionIds, ...ADDICTION_PROBE_PRIORITY],
    answers,
  );

  const out: Question[] = [];
  for (const id of ADDICTION_PROBE_PRIORITY) {
    if (orderedQuestionIds.includes(id)) continue;
    if (answers[id] || isProbeEarned(id, ctx, summary)) {
      const question = ADDICTION_QUESTIONS[id];
      if (question) out.push(question);
    }
  }
  return out;
}
