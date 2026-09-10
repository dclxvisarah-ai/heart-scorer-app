/**
 * DEEP READING LAYER (interpretation only)
 * ----------------------------------------
 * Human-facing interpretation of an already-computed result. This file does not
 * score, weigh, threshold, or infer anything. It consumes `PatternResult` +
 * relational state and returns language.
 *
 * Rules encoded here:
 *  - Depth leads. The deeper human meaning comes first; the older short
 *    distinction ("separate what you know, feel, assume") may remain as
 *    supporting language, never as the headline.
 *  - Gabriel never decides for the person. Every reading ends in a recognition
 *    or a question, never an instruction about what to do.
 *  - The proprietary vocabulary/semantic machinery is never used as the
 *    explanation of the reading.
 */

import { NUMBERS, type GNumber, type PatternResult } from "./gabriel";
import type { RelationalState } from "./relational-state";

export interface NumberFormulation {
  /** The leading human meaning. Depth first. */
  lead: string;
  /** Kept as secondary, structural support — never the headline. */
  support: string;
  /** How this number reads when it sits underneath another number. */
  companion: string;
  /** Recognition questions. Never advice, never a decision. */
  recognitions: string[];
}

/**
 * Approved working formulations. 5 and 8 are locked (see
 * `.lovable/number-8-approved-formulation.md` and
 * `.lovable/number-5-approved-formulation.md`). The rest follow the same
 * DEPTH / DISTINCTION standard.
 */
export const FORMULATIONS: Record<GNumber, NumberFormulation> = {
  1: {
    lead: "Something has become impossible to leave unexamined. The beginning is not necessarily acting — it is honestly naming the first question before deciding what the answer requires.",
    support: NUMBERS[1].lesson,
    companion:
      "something here has become impossible to leave unexamined, and naming it honestly comes before doing anything with it",
    recognitions: [
      "What is the first question here, said plainly, with nothing added to soften it?",
      "Are you looking for an answer, or for permission to stop looking?",
    ],
  },
  2: {
    lead: "Two things are true at the same time, and you are being asked to hold both without collapsing one into the other or turning yourself into the villain of it.",
    support: NUMBERS[2].lesson,
    companion: "two true things are being held at once rather than resolved into one",
    recognitions: [
      "Which of the two truths do you keep quietly dropping, and what does dropping it protect?",
    ],
  },
  3: {
    lead: "Something is recurring, and your state is part of what you are seeing. Recognition here is noticing the shape of the repetition before you decide what it means about anyone.",
    support: NUMBERS[3].lesson,
    companion: "a repetition is being recognised, not yet interpreted",
    recognitions: [
      "If this has happened before, what part of it is the situation and what part is the way you meet it?",
    ],
  },
  4: {
    lead: "You are carrying something loose that wants a container. Structure here is not control — it is giving an insight a shape it can survive in.",
    support: NUMBERS[4].lesson,
    companion: "something is looking for a container instead of being carried loose",
    recognitions: ["What would this look like if it were held rather than managed?"],
  },
  5: {
    lead: "You are standing at the boundary between knowing something and deciding what responsibility that knowledge creates.",
    support: NUMBERS[5].lesson,
    companion:
      "a boundary is active between what is known and what that knowledge obliges",
    recognitions: [
      "Knowing something is not the same as knowing what responsibility that knowledge creates. What do you believe it obliges you to do — and where did that obligation come from?",
      "Why do you believe this person needs to hear it from you?",
      "Would you still believe it needed to be told if telling it cost you the relationship?",
    ],
  },
  6: {
    lead: "Pieces that have been kept apart are being asked to function together — accountability without prosecution, complexity without abandoning yourself inside it.",
    support: NUMBERS[6].lesson,
    companion: "separated pieces are being asked to work together rather than be judged",
    recognitions: [
      "Where does your honesty about this turn into a case against yourself, and what happens right after it does?",
    ],
  },
  7: {
    lead: "Something is asking you to stay with it rather than move. Staying is not passivity — it is tolerating a moment that has no resolution in it yet.",
    support: NUMBERS[7].lesson,
    companion: "something is persisting and being stayed with rather than escaped",
    recognitions: ["What becomes available if nothing is solved in the next hour?"],
  },
  8: {
    lead: "Making room to receive before deciding what to do. When something has been carried alone for a while, the next step may not be to act or retreat, but to listen — to yourself, to what the situation is actually telling you, and to what the other person may have to say.",
    support: "Listen before you decide.",
    companion: "information is still arriving, and receiving it comes before deciding",
    recognitions: [
      "What have you not actually heard yet — from yourself, from the situation, or from them?",
    ],
  },
  9: {
    lead: "Something here has become sufficiently resolved to be carried rather than kept turning over. Completion is not the whole solution; it is the part that can now be lived.",
    support: NUMBERS[9].lesson,
    companion: "part of this is resolved enough to be carried forward",
    recognitions: ["What are you going to do with this insight?"],
  },
};

export interface DeepReading {
  /** Headline interpretation. Depth leads. */
  lead: string;
  /** Secondary structural distinction, kept but not leading. */
  support: string;
  /** How the surrounding numbers complement the primary, in plain language. */
  companions: string[];
  /** Recognition questions — never instructions. */
  recognitions: string[];
  /** A closing line about what Gabriel is and is not doing here. */
  closing: string;
}

const CLOSING_RESOLVED =
  "Gabriel is not telling you what to do with this. The structure is what it is; the decision stays yours.";
const CLOSING_OPEN =
  "Nothing here is a verdict. The reading points at the layer that is still open, and leaves the deciding to you.";

/**
 * Builds the human reading. Deterministic: same result + state gives the same
 * text. No scoring, no thresholds, no vocabulary exposure.
 */
export function buildDeepReading(
  result: PatternResult,
  state?: RelationalState | null,
): DeepReading | null {
  const primary = result.primary;
  if (!primary) {
    // Undetermined still gets a reading, built from the contested territories.
    const contested = result.contested.slice(0, 3);
    if (contested.length === 0) return null;
    return {
      lead: contested.map((n) => FORMULATIONS[n].lead).join(" "),
      support: "",
      companions: [],
      recognitions: contested.flatMap((n) => FORMULATIONS[n].recognitions.slice(0, 1)),
      closing: CLOSING_OPEN,
    };
  }

  const f = FORMULATIONS[primary];

  const around = new Set<GNumber>();
  for (const n of result.supporting) around.add(n);
  for (const t of state?.territories ?? []) around.add(t.n);
  around.delete(primary);

  const companions = [...around]
    .sort((a, b) => a - b)
    .map(
      (n) =>
        `${n} ${NUMBERS[n].name} sits with it: ${FORMULATIONS[n].companion}.`,
    );

  const recognitions = [...f.recognitions];
  // A companion territory contributes its own recognition question underneath
  // the primary one, so the reading stays specific to this pattern.
  for (const n of [...around].sort((a, b) => a - b)) {
    const extra = FORMULATIONS[n].recognitions[0];
    if (extra && !recognitions.includes(extra)) recognitions.push(extra);
  }

  return {
    lead: f.lead,
    support: f.support,
    companions,
    recognitions: recognitions.slice(0, 4),
    closing: state?.status === "unresolved" ? CLOSING_OPEN : CLOSING_RESOLVED,
  };
}
