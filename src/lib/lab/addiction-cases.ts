/**
 * Gabriel's Lab — the eleven controlled synthetic addiction cases.
 * RESEARCH ONLY. Researcher-authored fixtures, not anyone's real answers.
 *
 * Design rule: within each doorway the non-addiction answers are held
 * IDENTICAL across cases (the `DRINK_HOLD` / `GAMBLE_HOLD` constants), so the
 * only thing that differs between two cases is the addiction-relevant fact
 * named in the case label.
 */

import type { RunScript } from "./scripted";

/** Held constant for every DRINK case: routine opening, same routine chain. */
export const DRINK_HOLD: RunScript = {
  "drink-1": "routine",
  "drink-habit-1": "a",
  "drink-habit-2": "d",
  "drink-habit-3": "l",
  "drink-habit-4": "d",
  c1: "b",
  c2: "a",
  c3: "c",
};

/** Held constant for every GAMBLE case except where the case varies it. */
export const GAMBLE_HOLD: RunScript = {
  "gamble-1": "b",
  "gamble-2": "a",
  c1: "b",
  c2: "a",
  c3: "c",
};

export interface AddictionCase {
  caseId: string;
  label: string;
  doorwayId: "drink" | "gamble";
  /** The single addiction fact this case is meant to isolate. */
  varies: string;
  script: RunScript;
}

export const ADDICTION_CASES: AddictionCase[] = [
  {
    caseId: "intact-functioning",
    label: "Intact functioning",
    doorwayId: "drink",
    varies: "no current displacement, no cost, control held",
    script: {
      ...DRINK_HOLD,
      "addiction-e1": "held",
      "addiction-e2": "intact",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "no-pattern",
      "addiction-e6": "nothing",
    },
  },
  {
    caseId: "current-displacement",
    label: "Current displacement",
    doorwayId: "drink",
    varies: "basic-life displacement happening now",
    script: {
      ...DRINK_HOLD,
      "addiction-e1": "held",
      "addiction-e2": "skipping",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "no-pattern",
      "addiction-e6": "nothing",
    },
  },
  {
    caseId: "change-did-not-hold",
    label: "Attempted change that did not hold",
    doorwayId: "drink",
    varies: "control attempted, result did not hold",
    script: {
      ...DRINK_HOLD,
      "addiction-e1": "returned",
      "addiction-e2": "intact",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "no-pattern",
      "addiction-e6": "nothing",
    },
  },
  {
    caseId: "recognition-no-readiness",
    label: "Clear recognition, no readiness",
    doorwayId: "drink",
    varies: "recognition established, readiness negated",
    script: {
      ...DRINK_HOLD,
      "addiction-e1": "held",
      "addiction-e2": "intact",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "clear",
      "addiction-e6": "nothing",
    },
  },
  {
    caseId: "shame-without-impairment",
    label: "Shame without impairment",
    doorwayId: "drink",
    varies: "self-judgement present, nothing displaced or cost",
    script: {
      ...DRINK_HOLD,
      "drink-habit-1": "e", // "A break from myself"
      "addiction-e1": "not-tried",
      "addiction-e2": "intact",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "problems",
      "addiction-e6": "understand",
    },
  },
  {
    caseId: "historical-impairment-improved",
    label: "Historical impairment, improved now",
    doorwayId: "drink",
    varies: "displacement in the past, not current",
    script: {
      ...DRINK_HOLD,
      "addiction-e1": "held",
      "addiction-e2": "before",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "clear",
      "addiction-e6": "nothing",
    },
  },
  {
    caseId: "external-stopping",
    label: "Stopped by outside circumstance",
    doorwayId: "drink",
    varies: "stop mechanism is external, not chosen",
    script: {
      ...DRINK_HOLD,
      "addiction-e1": "held",
      "addiction-e2": "intact",
      "addiction-e3": "none",
      "addiction-e4": "run-out",
      "addiction-e5": "no-pattern",
      "addiction-e6": "nothing",
    },
  },
  {
    caseId: "deliberate-stopping",
    label: "Stopped by own decision",
    doorwayId: "drink",
    varies: "stop mechanism is deliberate",
    script: {
      ...DRINK_HOLD,
      "addiction-e1": "held",
      "addiction-e2": "intact",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "no-pattern",
      "addiction-e6": "nothing",
    },
  },
  {
    caseId: "contradictory-correction",
    label: "Contradictory self-correction",
    doorwayId: "drink",
    varies: "cost affirmed and displacement denied in the same run",
    script: {
      ...DRINK_HOLD,
      "addiction-e1": "returned",
      "addiction-e2": "intact",
      "addiction-e3": "trust",
      "addiction-e4": "pauses",
      "addiction-e5": "partial",
      "addiction-e6": "unsure",
    },
  },
  {
    caseId: "gambling-chasing",
    label: "Gambling: chasing losses",
    doorwayId: "gamble",
    varies: "chase established, limit held",
    script: {
      ...GAMBLE_HOLD,
      "gamble-1": "c", // "I'm behind and want to catch up"
      "gamble-2": "a",
      "gamble-g1": "win-back",
      "gamble-g3": "nothing",
      u1: "u1-enjoy",
      "addiction-e1": "held",
      "addiction-e2": "intact",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "no-pattern",
      "addiction-e6": "nothing",
    },
  },
  {
    caseId: "gambling-moved-limits",
    label: "Gambling: moved limits",
    doorwayId: "gamble",
    varies: "limit moved, no chase",
    script: {
      ...GAMBLE_HOLD,
      "gamble-1": "b",
      "gamble-2": "b", // "Yes, but I've moved it before"
      "gamble-g2": "too-low",
      "gamble-g3": "nothing",
      "addiction-e1": "held",
      "addiction-e2": "intact",
      "addiction-e3": "none",
      "addiction-e4": "decide",
      "addiction-e5": "no-pattern",
      "addiction-e6": "nothing",
    },
  },
];

export function getCase(caseId: string): AddictionCase {
  const found = ADDICTION_CASES.find((c) => c.caseId === caseId);
  if (!found) throw new Error(`Lab: unknown case "${caseId}"`);
  return found;
}
