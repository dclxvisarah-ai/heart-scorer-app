/**
 * Gabriel's Lab — CANDIDATE addiction-pattern read (V5.4 research candidate).
 * RESEARCH ONLY.
 *
 * This is NOT a Number, NOT a score, NOT a severity rating and NOT a
 * diagnosis. It is a plain-language description of what the person's own
 * answers established, what they did not, and what contradicts.
 * "Not enough established yet" is a valid, complete read.
 */

import {
  CANDIDATE_FACT_KEYS,
  type CandidateFactSummary,
  type ControlOutcome,
  type StopLocus,
} from "./candidate-facts";

export interface AddictionRead {
  /** True when at least one current fact was actually established or negated. */
  enoughEstablished: boolean;
  /** Plain-language facts about right now. */
  currentFacts: string[];
  /** Plain-language facts about the past that are no longer current. */
  historicalFacts: string[];
  /** Costs the person said have already happened. */
  meaningfulCosts: string[];
  /** Costs named only as possible futures. Never treated as current. */
  hypotheticalCosts: string[];
  controlAttempt: string;
  controlResult: string;
  stopping: string;
  recognition: string;
  readiness: string;
  contradictions: string[];
  /** Named areas nothing has settled yet. */
  unresolved: string[];
  /** One-line summary. Descriptive, never a verdict. */
  headline: string;
  /** Stable signature of the read, for deterministic comparison. */
  stateKey: string;
}

const STOP_TEXT: Record<StopLocus, string> = {
  SELF_DECISION: "You said the episode ends because you decide it does.",
  RESPONSIBILITY: "You said something you are responsible for is what pulls you out.",
  EXTERNAL_ACCESS: "You said it ends when the money, supply or access runs out — not by decision.",
  BODY_DEPLETION: "You said your body ends it: sick, exhausted, or asleep.",
  SOMEONE_ELSE: "You said someone else steps in and that is what ends it.",
  NO_TRUE_END: "You said it doesn't really end — it pauses.",
  UNKNOWN: "What ends the episode is not clear yet.",
};

const CONTROL_TEXT: Record<ControlOutcome, string> = {
  HELD: "You changed it and the change stayed.",
  RETURNED: "The change held for a while and then came back.",
  NO_CHANGE: "You tried and it did not really change.",
  NOT_ATTEMPTED: "You haven't tried to change it. That is not the same as not wanting to.",
  NO_WISH_TO_CHANGE: "You said you have never wanted to change it.",
  UNKNOWN: "What happens when you try to change it is not clear yet.",
};

const PLAIN: Record<string, { established: string; negated: string; provisional: string; unresolved: string }> = {
  BASIC_LIFE_DISPLACEMENT: {
    established: "Right now this is regularly displacing things you need to take care of.",
    negated: "Right now you are still taking care of what you need to.",
    provisional: "Some things slip, but you would not call it going without.",
    unresolved: "whether daily life is being displaced right now",
  },
  TIME_ROLE_DISPLACEMENT: {
    established: "It is taking up hours, and other things slide.",
    negated: "The rest of the day still happens.",
    provisional: "It may be taking time, but that isn't settled.",
    unresolved: "how much of the day this takes",
  },
  MEANINGFUL_COST: {
    established: "Something that matters to you has already been cost.",
    negated: "Nothing that matters to you has been cost so far.",
    provisional: "A cost may be building, but nothing has landed yet.",
    unresolved: "what this has actually cost you",
  },
  CHASE_OR_CONTINUE: {
    established: "You are playing to get back to even, not to play.",
    negated: "You are not chasing losses.",
    provisional: "Chasing may be part of it.",
    unresolved: "whether you are chasing losses",
  },
  LIMIT_MOVED: {
    established: "You move the limit once you are inside it.",
    negated: "The limit you set is the limit you keep.",
    provisional: "The limit may move.",
    unresolved: "whether your limit holds",
  },
};

function facts(summary: CandidateFactSummary, scope: "current" | "historical") {
  const out: string[] = [];
  for (const key of CANDIDATE_FACT_KEYS) {
    const plain = PLAIN[key];
    if (!plain) continue;
    const state = summary[key][scope];
    if (state === "ESTABLISHED") {
      out.push(
        scope === "historical"
          ? `${plain.established} That was true before, not right now.`
          : plain.established,
      );
    } else if (state === "NEGATED" && scope === "current") {
      out.push(plain.negated);
    } else if (state === "PROVISIONAL" && scope === "current") {
      out.push(plain.provisional);
    }
  }
  return out;
}

const COST_LABELS: Record<string, string> = {
  money: "money you could name a number for",
  time: "time you can't get back",
  trust: "someone's trust, or a relationship",
  health: "your health or your sleep",
};

export function buildAddictionRead(
  summary: CandidateFactSummary,
  answers: Record<string, string> = {},
): AddictionRead {
  const currentFacts = facts(summary, "current");
  const historicalFacts = facts(summary, "historical");

  const costChoice = answers["addiction-e3"];
  const meaningfulCosts =
    summary.MEANINGFUL_COST.current === "ESTABLISHED" && costChoice && COST_LABELS[costChoice]
      ? [COST_LABELS[costChoice]!]
      : [];
  const hypotheticalCosts =
    summary.MEANINGFUL_COST.hypothetical === "PROVISIONAL"
      ? ["something it could cost later, which has not happened yet"]
      : [];

  const controlOutcome = summary.CONTROL_RESULT.controlOutcome;
  const controlAttempt =
    summary.CONTROL_ATTEMPT.current === "ESTABLISHED"
      ? "You have tried to change it, recently."
      : summary.CONTROL_ATTEMPT.historical === "ESTABLISHED"
        ? "You have tried to change it in the past."
        : summary.CONTROL_ATTEMPT.current === "NEGATED"
          ? controlOutcome === "NO_WISH_TO_CHANGE"
            ? "You have not tried, because you have not wanted to."
            : "You have not tried to change it."
          : "Whether you have tried to change it is not established.";
  const controlResult = controlOutcome
    ? CONTROL_TEXT[controlOutcome]
    : "What happens when you try to change it is not established.";

  const stopping = summary.STOP_MECHANISM.locus
    ? STOP_TEXT[summary.STOP_MECHANISM.locus]
    : "What ends the episode is not established.";

  const recognitionState = summary.RECOGNITION.current;
  const recognition =
    recognitionState === "ESTABLISHED"
      ? "You can see the pattern, and you can see what it costs."
      : recognitionState === "PROVISIONAL"
        ? "You can see part of it. What it adds up to is still open."
        : recognitionState === "NEGATED"
          ? "You do not see a pattern in it right now."
          : "Recognition is not established.";

  const readinessState = summary.READINESS.current;
  const readiness =
    readinessState === "ESTABLISHED"
      ? "You have named something you want to be different."
      : readinessState === "PROVISIONAL"
        ? "You want to understand it before changing anything."
        : readinessState === "NEGATED"
          ? "Nothing right now. That is a complete answer."
          : "Readiness was not asked, and is not assumed.";

  const contradictions = CANDIDATE_FACT_KEYS.filter((key) => summary[key].contradiction).map(
    (key) => `Two of your answers point opposite ways about ${PLAIN[key]?.unresolved ?? key}.`,
  );

  const unresolvedAreas = CANDIDATE_FACT_KEYS.filter((key) => {
    const f = summary[key];
    return (
      PLAIN[key] &&
      f.current === "UNKNOWN" &&
      f.historical === "UNKNOWN" &&
      f.hypothetical === "UNKNOWN"
    );
  }).map((key) => PLAIN[key]!.unresolved);

  const establishedOrNegated = CANDIDATE_FACT_KEYS.some(
    (key) => summary[key].current === "ESTABLISHED" || summary[key].current === "NEGATED",
  );

  const headline = !establishedOrNegated
    ? "Not enough established yet."
    : contradictions.length > 0
      ? "Your answers hold two opposite things at once, and both are being kept."
      : summary.BASIC_LIFE_DISPLACEMENT.current === "ESTABLISHED"
        ? "Daily life is being displaced right now."
        : summary.BASIC_LIFE_DISPLACEMENT.historical === "ESTABLISHED"
          ? "It displaced daily life before. It is not doing that right now."
          : summary.MEANINGFUL_COST.current === "ESTABLISHED"
            ? "Nothing is being displaced, but something has already been cost."
            : "Nothing established as displaced or cost right now.";

  const stateKey = [
    `displacement:${summary.BASIC_LIFE_DISPLACEMENT.current}/${summary.BASIC_LIFE_DISPLACEMENT.historical}`,
    `time:${summary.TIME_ROLE_DISPLACEMENT.current}`,
    `cost:${summary.MEANINGFUL_COST.current}/${summary.MEANINGFUL_COST.hypothetical}`,
    `control:${controlOutcome ?? "NONE"}`,
    `stop:${summary.STOP_MECHANISM.locus ?? "NONE"}`,
    `chase:${summary.CHASE_OR_CONTINUE.current}`,
    `limit:${summary.LIMIT_MOVED.current}/${summary.LIMIT_MOVED.historical}`,
    `recognition:${recognitionState}`,
    `readiness:${readinessState}`,
    `contradiction:${contradictions.length > 0}`,
  ].join("|");

  return {
    enoughEstablished: establishedOrNegated,
    currentFacts,
    historicalFacts,
    meaningfulCosts,
    hypotheticalCosts,
    controlAttempt,
    controlResult,
    stopping,
    recognition,
    readiness,
    contradictions,
    unresolved: unresolvedAreas,
    headline,
    stateKey,
  };
}

/** Deterministic text fixture, for snapshot-style comparison in the Lab. */
export function renderAddictionRead(read: AddictionRead): string {
  const lines: string[] = [read.headline];
  const section = (title: string, items: string[]) => {
    if (items.length) lines.push(`${title}: ${items.join(" ")}`);
  };
  section("Right now", read.currentFacts);
  section("Before", read.historicalFacts);
  section("Already cost", read.meaningfulCosts);
  section("Possible later", read.hypotheticalCosts);
  lines.push(`Trying to change: ${read.controlAttempt} ${read.controlResult}`);
  lines.push(`Ending it: ${read.stopping}`);
  lines.push(`Seeing it: ${read.recognition}`);
  lines.push(`Wanting something different: ${read.readiness}`);
  section("Contradiction", read.contradictions);
  if (read.unresolved.length) lines.push(`Not established: ${read.unresolved.join("; ")}`);
  return lines.join("\n");
}
