/**
 * What's Gabriel's Number? — Clarity Evaluation App.
 *
 * The evaluator captures an initial 1–5 clarity number by feel, asks general
 * evaluation questions, branches into a situation-specific question set, then
 * produces a PROVISIONAL evaluated clarity number and the Clarity Gap between
 * felt and evaluated states.
 *
 * The scoring model is provisional by design. It is not a measurement, a
 * diagnosis, or a verdict, and it assigns no mystical meaning to any number.
 */

/* ------------------------------------------------------------------ */
/* Initial clarity                                                     */
/* ------------------------------------------------------------------ */

export const INITIAL_PROMPT =
  "Before you analyze anything, what number do you feel your clarity is right now?";
export const INITIAL_NOTE =
  "Pick by feel. Don't justify it. This number is recorded before the evaluation.";

export const SCALE = [1, 2, 3, 4, 5] as const;
export type ScaleValue = (typeof SCALE)[number];

/* ------------------------------------------------------------------ */
/* Evaluation branches                                                 */
/* ------------------------------------------------------------------ */

export type BranchId = "work" | "morning" | "relationship" | "decision" | "confused" | "other";

export interface Branch {
  id: BranchId;
  label: string;
  /** The five focused questions for this branch. */
  questions: string[];
}

export const BRANCH_PROMPT = "What are we evaluating right now?";

export const BRANCHES: Branch[] = [
  {
    id: "work",
    label: "Anxious because of work",
    questions: [
      "What specifically about work is creating the pressure?",
      "What do I actually know about the situation?",
      "What am I predicting or assuming?",
      "Do I feel like I have to solve this immediately?",
      "What would still be true if I slowed down for an hour?",
    ],
  },
  {
    id: "morning",
    label: "I woke up feeling anxious",
    questions: [
      "Was there a specific thought when I woke up?",
      "Can I identify a concrete problem, or did the feeling arrive first?",
      "What is my body doing right now?",
      "What am I afraid might happen today?",
      "What would it look like to observe the feeling without immediately explaining it?",
    ],
  },
  {
    id: "relationship",
    label: "Anxious because of a relationship",
    questions: [
      "What actually happened?",
      "What did I interpret it to mean?",
      "What do I know versus what am I afraid is true?",
      "Am I reacting to this event or to an older pattern?",
      "What would a steady response look like?",
    ],
  },
  {
    id: "decision",
    label: "I need to make a decision",
    questions: [
      "What decision am I facing?",
      "What information do I actually have?",
      "What information am I missing?",
      "What is making this feel urgent?",
      "Would waiting change the quality of my decision?",
    ],
  },
  {
    id: "confused",
    label: "I feel confused",
    questions: [
      "What part feels unclear?",
      "What do I know for certain?",
      "What am I trying to figure out before I have enough information?",
      "Am I adding possibilities faster than I can evaluate them?",
      "What is the smallest thing I can make clear right now?",
    ],
  },
  {
    id: "other",
    label: "Something else",
    questions: [
      "What is happening right now?",
      "What do I know for certain?",
      "What do I feel?",
      "What am I assuming?",
      "What would steadiness look like?",
    ],
  },
];

export function getBranch(id: BranchId | undefined): Branch | undefined {
  return BRANCHES.find((branch) => branch.id === id);
}

/* ------------------------------------------------------------------ */
/* General evaluation                                                  */
/* ------------------------------------------------------------------ */

export const NERVOUS_SYSTEM_OPTIONS = [
  "Calm / regulated",
  "Alert but okay",
  "Anxious / restless",
  "Overstimulated / spastic",
  "Shut down / numb",
] as const;

export const THOUGHT_STYLE_OPTIONS = [
  "Focused",
  "Jumping topics",
  "Racing",
  "Repetitive",
  "Avoidant",
  "Reflective",
] as const;

export const SOCIAL_TONE_OPTIONS = [
  "Gentle",
  "Neutral",
  "Talkative",
  "Sharp / rude",
  "Defensive",
  "Withdrawn",
] as const;

export const OBSERVATION_OPTIONS = [
  "Observing",
  "Mostly observing",
  "Mixed",
  "Mostly reacting",
  "Reacting",
] as const;

export const KNOWN_VS_FELT_OPTIONS = [
  "Very separate",
  "Mostly separate",
  "Mixed",
  "Mostly feelings / fears",
  "I can't tell yet",
] as const;

export type NervousSystem = (typeof NERVOUS_SYSTEM_OPTIONS)[number];
export type ThoughtStyle = (typeof THOUGHT_STYLE_OPTIONS)[number];
export type SocialTone = (typeof SOCIAL_TONE_OPTIONS)[number];
export type Observation = (typeof OBSERVATION_OPTIONS)[number];
export type KnownVsFelt = (typeof KNOWN_VS_FELT_OPTIONS)[number];

export interface GeneralEvaluation {
  mentalClarity?: ScaleValue;
  emotionalLoad?: ScaleValue;
  nervousSystem?: NervousSystem;
  thoughtStyle?: ThoughtStyle;
  socialTone?: SocialTone;
  observation?: Observation;
  knownVsFelt?: KnownVsFelt;
  mindframe: string;
  avoiding: string;
  steadyResponse: string;
}

export const EMPTY_GENERAL: GeneralEvaluation = {
  mindframe: "",
  avoiding: "",
  steadyResponse: "",
};

/** Every scored field must be answered before the evaluation can be revealed. */
export function isGeneralComplete(general: GeneralEvaluation): boolean {
  return (
    general.mentalClarity !== undefined &&
    general.emotionalLoad !== undefined &&
    general.nervousSystem !== undefined &&
    general.thoughtStyle !== undefined &&
    general.socialTone !== undefined &&
    general.observation !== undefined &&
    general.knownVsFelt !== undefined
  );
}

/* ------------------------------------------------------------------ */
/* Provisional scoring — exactly the maps from the source evaluator     */
/* ------------------------------------------------------------------ */

const NERVOUS_SYSTEM_SCORES: Record<NervousSystem, number> = {
  "Calm / regulated": 5,
  "Alert but okay": 4,
  "Anxious / restless": 2,
  "Overstimulated / spastic": 1,
  "Shut down / numb": 1,
};

const THOUGHT_STYLE_SCORES: Record<ThoughtStyle, number> = {
  Focused: 5,
  Reflective: 5,
  "Jumping topics": 3,
  Racing: 2,
  Repetitive: 2,
  Avoidant: 2,
};

const OBSERVATION_SCORES: Record<Observation, number> = {
  Observing: 5,
  "Mostly observing": 4,
  Mixed: 3,
  "Mostly reacting": 2,
  Reacting: 1,
};

const KNOWN_SCORES: Record<KnownVsFelt, number> = {
  "Very separate": 5,
  "Mostly separate": 4,
  Mixed: 3,
  "Mostly feelings / fears": 2,
  "I can't tell yet": 2,
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export type Alignment = "Strong alignment" | "Moderate alignment" | "Significant clarity gap";

export interface EvaluationOutcome {
  /** Provisional evaluated clarity, one decimal. */
  evaluated: number;
  /** Absolute distance from the initial felt number, one decimal. */
  gap: number;
  alignment: Alignment;
  /** Which way the evaluation moved relative to the initial feeling. */
  direction: "higher" | "lower" | "same";
  /** The individual provisional inputs, for the breakdown panel. */
  parts: { label: string; answer: string; score: number }[];
  /** Possible sources of mismatch, from the source logic only. */
  mismatchSources: string[];
}

export function alignmentFor(gap: number): Alignment {
  if (gap <= 0.4) return "Strong alignment";
  if (gap <= 0.9) return "Moderate alignment";
  return "Significant clarity gap";
}

/**
 * The provisional scoring model. Mental clarity counts as given, emotional
 * load is inverted (6 - load), and the four categorical answers map to the
 * fixed scores above. The evaluated number is the average, to one decimal.
 */
export function evaluate(initial: ScaleValue, general: GeneralEvaluation): EvaluationOutcome | undefined {
  if (!isGeneralComplete(general)) return undefined;

  const mentalClarity = general.mentalClarity as ScaleValue;
  const emotionalLoad = general.emotionalLoad as ScaleValue;
  const nervousSystem = general.nervousSystem as NervousSystem;
  const thoughtStyle = general.thoughtStyle as ThoughtStyle;
  const observation = general.observation as Observation;
  const knownVsFelt = general.knownVsFelt as KnownVsFelt;

  const parts = [
    { label: "Mental clarity", answer: String(mentalClarity), score: mentalClarity },
    {
      label: "Emotional load (inverted)",
      answer: `${emotionalLoad} → ${6 - emotionalLoad}`,
      score: 6 - emotionalLoad,
    },
    { label: "Nervous system state", answer: nervousSystem, score: NERVOUS_SYSTEM_SCORES[nervousSystem] },
    { label: "Thought style", answer: thoughtStyle, score: THOUGHT_STYLE_SCORES[thoughtStyle] },
    { label: "Observation vs. reaction", answer: observation, score: OBSERVATION_SCORES[observation] },
    { label: "What I know vs. what I feel", answer: knownVsFelt, score: KNOWN_SCORES[knownVsFelt] },
  ];

  const evaluated = round1(parts.reduce((sum, part) => sum + part.score, 0) / parts.length);
  const gap = round1(Math.abs(initial - evaluated));

  return {
    evaluated,
    gap,
    alignment: alignmentFor(gap),
    direction: evaluated > initial ? "higher" : evaluated < initial ? "lower" : "same",
    parts,
    mismatchSources: mismatchSources(general),
  };
}

/** Possible sources of mismatch — exactly the source logic, nothing added. */
export function mismatchSources(general: GeneralEvaluation): string[] {
  const sources: string[] = [];

  if (
    general.nervousSystem === "Anxious / restless" ||
    general.nervousSystem === "Overstimulated / spastic" ||
    general.nervousSystem === "Shut down / numb"
  ) {
    sources.push("Activation may influence perception.");
  }

  if (general.thoughtStyle === "Racing" || general.thoughtStyle === "Repetitive") {
    sources.push("More thinking may feel like more certainty.");
  }

  if (general.thoughtStyle === "Avoidant") {
    sources.push("Avoidance may change what feels clear.");
  }

  if (general.observation === "Mostly reacting" || general.observation === "Reacting") {
    sources.push("Reaction may get ahead of observation.");
  }

  if (
    general.knownVsFelt === "Mostly feelings / fears" ||
    general.knownVsFelt === "Mixed" ||
    general.knownVsFelt === "I can't tell yet"
  ) {
    sources.push("What is felt may blend with what is known.");
  }

  if (general.avoiding.trim().length > 0) {
    sources.push(
      "There may be discomfort worth examining instead of explaining away.",
    );
  }

  return sources;
}

/* ------------------------------------------------------------------ */
/* Reflection                                                          */
/* ------------------------------------------------------------------ */

export const REFLECTION_PROMPT =
  "What did I initially believe, what did the questions reveal, and what do I understand differently now?";

export const PROVISIONAL_NOTE =
  "This evaluated number is provisional. It is a reflection tool built from your own answers — not a measurement, a diagnosis, or a verdict.";
