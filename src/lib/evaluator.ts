/**
 * Gabriel's Number Clarity Evaluator — question set and provisional scoring.
 *
 * The scoring model here is PROVISIONAL by design. It produces a working
 * estimate for reflection, not a measurement, a diagnosis, or a verdict.
 * Nothing in this file interprets what Gabriel's Number means.
 */

export type ScaleValue = 1 | 2 | 3 | 4 | 5;

export const SCALE_VALUES: ScaleValue[] = [1, 2, 3, 4, 5];

/** Labels for the initial "by feel" reading (step 1). */
export const INITIAL_SCALE_LABELS: Record<ScaleValue, string> = {
  1: "Not clear at all",
  2: "Mostly unclear",
  3: "Somewhere in between",
  4: "Fairly clear",
  5: "Very clear",
};

/** Labels for the agreement scale used by every evaluation question. */
export const AGREEMENT_LABELS: Record<ScaleValue, string> = {
  1: "Not true",
  2: "Rarely true",
  3: "Sometimes true",
  4: "Mostly true",
  5: "True",
};

export interface Question {
  id: string;
  /** The statement the person rates. Wording is fixed — do not paraphrase. */
  text: string;
  /** Shown under the statement to steady the reading. */
  note?: string;
  /** What a low score on this question may point at. Never a diagnosis. */
  mismatchSource: string;
}

export interface Branch {
  id: string;
  label: string;
  description: string;
  questions: Question[];
}

/** Step 3 — general clarity questions, asked on every branch. */
export const GENERAL_QUESTIONS: Question[] = [
  {
    id: "g1",
    text: "I can state what this is actually about in one plain sentence.",
    note: "Without conditions, background, or a story attached.",
    mismatchSource:
      "The situation may still be more than one situation. A sense of clarity can sit on top of an unseparated bundle.",
  },
  {
    id: "g2",
    text: "I can tell the difference between what I know and what I am assuming.",
    note: "Not whether the assumptions are right — only whether you can name which is which.",
    mismatchSource:
      "Assumptions may be carrying the weight of facts. That reads as certainty from the inside.",
  },
  {
    id: "g3",
    text: "My sense of this has stayed steady rather than shifting with my mood.",
    note: "Compare how it felt on a good day and a hard day.",
    mismatchSource:
      "The reading may be tracking your state rather than the situation. Worth checking on a different day.",
  },
  {
    id: "g4",
    text: "I could describe this to someone else without needing to defend it.",
    note: "Describing, not convincing.",
    mismatchSource:
      "Some of the certainty may be doing protective work. Defended clarity is harder to test.",
  },
  {
    id: "g5",
    text: "I know what I would need in order to be more certain.",
    note: "A specific piece of information, time, or conversation.",
    mismatchSource:
      "Without a named next piece of information, there is no way to tell clarity from a closed loop.",
  },
];

/** Step 4 — situation-specific focused questions, per branch. */
export const BRANCHES: Branch[] = [
  {
    id: "decision",
    label: "A decision I am facing",
    description: "There is a choice in front of you and a point at which it gets made.",
    questions: [
      {
        id: "d1",
        text: "I can name the actual options, not just the one I am leaning toward.",
        mismatchSource:
          "The decision may already be narrowed. Clarity about one option is not clarity about the choice.",
      },
      {
        id: "d2",
        text: "I know what each option would cost me.",
        mismatchSource:
          "Costs that have not been named tend to arrive later as surprise, not as information.",
      },
      {
        id: "d3",
        text: "I know whether this decision is mine to make.",
        mismatchSource:
          "Ownership may be unsettled. That reads as indecision even when the thinking is sound.",
      },
      {
        id: "d4",
        text: "I know when this needs to be decided by.",
        mismatchSource:
          "Without a real deadline, urgency and clarity are easy to confuse for one another.",
      },
    ],
  },
  {
    id: "relationship",
    label: "A relationship or a conversation",
    description: "The situation lives between you and another person.",
    questions: [
      {
        id: "r1",
        text: "I can describe the other person's position in their own terms.",
        mismatchSource:
          "Their position may be held as a version you constructed. That version is usually thinner than the real one.",
      },
      {
        id: "r2",
        text: "I know what I actually want from this, stated plainly.",
        mismatchSource:
          "An unstated want tends to leak into the conversation sideways.",
      },
      {
        id: "r3",
        text: "I have said the important part out loud to them, not only in my head.",
        mismatchSource:
          "Rehearsed conversations can feel completed. Nothing has been tested until it is spoken.",
      },
      {
        id: "r4",
        text: "I can separate what happened from what I concluded about it.",
        mismatchSource:
          "Event and conclusion may have fused. Once fused, the conclusion stops being checkable.",
      },
    ],
  },
  {
    id: "direction",
    label: "Direction or path",
    description: "The question is about where you are heading rather than a single choice.",
    questions: [
      {
        id: "p1",
        text: "I can describe the direction without naming a specific outcome.",
        mismatchSource:
          "Direction may be standing in for one hoped-for result. If the result falls away, so does the direction.",
      },
      {
        id: "p2",
        text: "I can name the next concrete step, not only the destination.",
        mismatchSource:
          "A destination with no first step often stays a picture rather than a path.",
      },
      {
        id: "p3",
        text: "This direction holds up when I imagine it taking much longer than I want.",
        mismatchSource:
          "The clarity may be resting on speed. Timelines are the part least under your control.",
      },
      {
        id: "p4",
        text: "I can tell which parts of this are mine and which were handed to me.",
        mismatchSource:
          "Inherited direction can feel entirely native. It usually shows up as effort without pull.",
      },
    ],
  },
  {
    id: "pattern",
    label: "A recurring pattern",
    description: "Something that keeps returning in a recognisable shape.",
    questions: [
      {
        id: "n1",
        text: "I can describe the pattern by what happens, not by what it means.",
        mismatchSource:
          "Meaning may have been applied before the pattern was fully observed.",
      },
      {
        id: "n2",
        text: "I can point to more than one occasion, with detail.",
        mismatchSource:
          "One vivid instance can stand in for a pattern. A single case is a case, not a pattern.",
      },
      {
        id: "n3",
        text: "I can say what is different about the times it does not happen.",
        mismatchSource:
          "Without the exceptions, the pattern cannot be distinguished from a constant.",
      },
      {
        id: "n4",
        text: "I can name my own part in the pattern.",
        mismatchSource:
          "A pattern described entirely from outside it is usually still partly unseen.",
      },
    ],
  },
  {
    id: "timing",
    label: "Timing — whether to act now",
    description: "The what may be settled. The question is when.",
    questions: [
      {
        id: "t1",
        text: "I can tell the difference between being ready and being impatient.",
        mismatchSource:
          "Pressure can present itself as readiness. It tends to fade rather than resolve.",
      },
      {
        id: "t2",
        text: "I know what would actually change if I waited.",
        mismatchSource:
          "If waiting changes nothing nameable, the delay may be doing something other than waiting.",
      },
      {
        id: "t3",
        text: "I know what would actually change if I acted today.",
        mismatchSource:
          "Acting without a named change is motion. It can relieve the feeling without moving the situation.",
      },
      {
        id: "t4",
        text: "This timing still makes sense when I set aside how I feel right now.",
        mismatchSource:
          "The timing may be anchored to a passing state rather than to the situation.",
      },
    ],
  },
];

export function getBranch(id: string): Branch | undefined {
  return BRANCHES.find((branch) => branch.id === id);
}

export type Answers = Record<string, ScaleValue>;

export interface EvaluationResult {
  /** Provisional evaluated clarity, 1.0–5.0, one decimal. */
  evaluated: number;
  /** Mean of the general questions, 1.0–5.0. */
  generalMean: number;
  /** Mean of the branch questions, 1.0–5.0. */
  focusedMean: number;
  /** evaluated − initial, one decimal. Negative = evaluated lower than felt. */
  clarityGap: number;
  /** Absolute size of the gap. */
  gapMagnitude: number;
  gapDirection: "overestimated" | "underestimated" | "aligned";
  /** Plain-language band for the provisional figure. */
  band: string;
  /** Up to three questions that scored lowest, as possible mismatch sources. */
  mismatchSources: Question[];
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Provisional formula:
 *   evaluated clarity = (mean of general answers × 0.5)
 *                     + (mean of focused answers × 0.5)
 * Both parts are already on the same 1–5 scale, so the result stays on 1–5.
 * The two halves are weighted equally: general clarity and situation-specific
 * clarity each account for half of the provisional figure.
 */
export function evaluate(
  branch: Branch,
  answers: Answers,
  initial: ScaleValue,
): EvaluationResult {
  const generalValues = GENERAL_QUESTIONS.map((q) => answers[q.id]).filter(
    (value): value is ScaleValue => typeof value === "number",
  );
  const focusedValues = branch.questions.map((q) => answers[q.id]).filter(
    (value): value is ScaleValue => typeof value === "number",
  );

  const generalMean = mean(generalValues);
  const focusedMean = mean(focusedValues);
  const evaluated = round1(generalMean * 0.5 + focusedMean * 0.5);

  const clarityGap = round1(evaluated - initial);
  const gapMagnitude = Math.abs(clarityGap);

  const gapDirection: EvaluationResult["gapDirection"] =
    gapMagnitude < 0.5 ? "aligned" : clarityGap < 0 ? "overestimated" : "underestimated";

  const allQuestions = [...GENERAL_QUESTIONS, ...branch.questions];
  const mismatchSources = allQuestions
    .filter((q) => (answers[q.id] ?? 5) <= 3)
    .sort((a, b) => (answers[a.id] ?? 5) - (answers[b.id] ?? 5))
    .slice(0, 3);

  return {
    evaluated,
    generalMean: round1(generalMean),
    focusedMean: round1(focusedMean),
    clarityGap,
    gapMagnitude,
    gapDirection,
    band: bandFor(evaluated),
    mismatchSources,
  };
}

export function bandFor(value: number): string {
  if (value < 1.8) return "Very little clarity yet";
  if (value < 2.6) return "Early, mostly unformed";
  if (value < 3.4) return "Partial — some parts hold";
  if (value < 4.3) return "Largely clear, with gaps";
  return "Clear on the terms you can see";
}

export const GAP_READINGS: Record<EvaluationResult["gapDirection"], string> = {
  aligned:
    "Your felt reading and the provisional figure land close together. That agreement is worth noting, not celebrating — both readings come from you.",
  overestimated:
    "The provisional figure came out lower than your felt reading. That is common, and it is not a verdict. It usually points at a part of the situation that has not been examined as closely as the rest.",
  underestimated:
    "The provisional figure came out higher than your felt reading. You may know more about this than it feels like from the inside.",
};

/** Reflection prompts shown at the end of the flow. */
export const REFLECTION_PROMPTS = [
  "What did you notice while answering that you had not put into words before?",
  "Which single question was hardest to answer honestly?",
  "What is the one thing you would need in order to move this forward?",
];

export const TOTAL_STEPS = 4;
