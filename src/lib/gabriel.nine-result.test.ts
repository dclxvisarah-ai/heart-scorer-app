/**
 * REGRESSION GUARD — Gabriel Number 9 result presentation.
 *
 * Verifies that every branch able to produce a 9 shows the exact required
 * header ("Your Gabriel Number" + "9 — Embodiment / Completion") and the exact
 * bridge question, and that the immutable scoring constants / formula are
 * untouched. This test must never be weakened to make a branch pass.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  ALL_DOORWAYS,
  NINE_BRIDGE_QUESTION,
  NUMBERS,
  buildSequence,
  evaluatePattern,
  getNineBridge,
  type AnswerMap,
} from "./gabriel";

const BRIDGE_QUESTION = "What are you going to do with this insight?";
const gabrielSource = readFileSync("src/lib/gabriel.ts", "utf8");
const resultPageSource = readFileSync("src/routes/index.tsx", "utf8");

/** Walk one deterministic path through a doorway, choosing the nth option. */
function walk(doorwayId: string, seed: number): AnswerMap {
  const doorway = ALL_DOORWAYS.find((d) => d.id === doorwayId)!;
  const answers: AnswerMap = {};
  let rng = seed * 2654435761;
  for (let step = 0; step < 12; step++) {
    const sequence = buildSequence(doorway, answers, []);
    const question = sequence[step];
    if (!question) break;
    rng = (rng * 1103515245 + 12345) >>> 0;
    const choice = question.choices[rng % question.choices.length]!;
    answers[question.id] = choice.id;
  }
  return answers;
}

describe("immutable framework constants", () => {
  it("keeps the locked thresholds and normalization formula", () => {
    expect(gabrielSource).toContain("const MIN_PRIMARY_WEIGHT = 2.4;");
    expect(gabrielSource).toContain("const MIN_LEAD = 0.35;");
    expect(gabrielSource).toContain("const MIN_SUPPORT_WEIGHT = 1.8;");
    expect(NUMBERS[9].name).toBe("Embodiment / Completion");
    expect(Object.keys(NUMBERS).map(Number).sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });
});

describe("Gabriel Number 9 result copy", () => {
  it("uses the exact bridge question", () => {
    expect(NINE_BRIDGE_QUESTION).toBe(BRIDGE_QUESTION);
  });

  it("renders header, meaning, lesson and the 9 bridge on the result page", () => {
    expect(resultPageSource).toContain("Your Gabriel Number");
    expect(resultPageSource).toContain("The clarity you're missing");
    expect(resultPageSource).toContain("What to look at next");
    expect(resultPageSource).toContain("result.primary === 9");
    expect(resultPageSource).toContain("getNineBridge(doorway.id).human");
    expect(resultPageSource).toContain("getNineBridge(doorway.id).question");
  });

  it("gives every doorway a branch-specific 9 explanation plus the bridge question", () => {
    for (const doorway of ALL_DOORWAYS) {
      const bridge = getNineBridge(doorway.id);
      expect(bridge.question, doorway.id).toBe(BRIDGE_QUESTION);
      expect(bridge.human.length, doorway.id).toBeGreaterThan(80);
      expect(bridge.human, doorway.id).toContain("underneath");
      expect(/land(ed|ing)?/i.test(bridge.human), doorway.id).toBe(false);
    }
  });

  it("shows the full 9 result block for real paths that earn a 9", () => {
    let ninesFound = 0;
    for (const doorway of ALL_DOORWAYS) {
      for (let seed = 1; seed <= 4000; seed++) {
        const answers = walk(doorway.id, seed);
        const sequence = buildSequence(doorway, answers, []);
        const result = evaluatePattern(sequence, answers);
        if (result.primary !== 9) continue;
        ninesFound++;
        const bridge = getNineBridge(doorway.id);
        // The exact user-facing pieces required by the universal 9 standard.
        expect(NUMBERS[9].name).toBe("Embodiment / Completion");
        expect(NUMBERS[9].lesson.length).toBeGreaterThan(20);
        expect(bridge.question).toBe(BRIDGE_QUESTION);
        expect(bridge.human).toBeTruthy();
        break;
      }
    }
    expect(ninesFound).toBeGreaterThan(0);
  });
});
