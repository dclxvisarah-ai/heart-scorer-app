/**
 * REGRESSION GUARD — universal result standard for Gabriel Numbers 1–8.
 *
 * Presentation-only guard. It must never be weakened to make a branch pass.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { ALL_DOORWAYS, NUMBERS, G_NUMBERS, type GNumber } from "./gabriel";
import { getResultNarrative, numberHeadline } from "./result-narrative";

const gabrielSource = readFileSync("src/lib/gabriel.ts", "utf8");
const narrativeSource = readFileSync("src/lib/result-narrative.ts", "utf8");
const pageSource = readFileSync("src/routes/index.tsx", "utf8");

const NUMBERS_1_TO_8: GNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

const CANONICAL: Record<GNumber, [string, string]> = {
  1: ["Beginning", "Keter"],
  2: ["Duality", "Chokmah"],
  3: ["Pattern", "Binah"],
  4: ["Structure", "Chesed"],
  5: ["Discernment", "Gevurah"],
  6: ["Integration", "Tiferet"],
  7: ["Staying", "Netzach"],
  8: ["Listening", "Hod"],
  9: ["Embodiment / Completion", "Yesod → Malkuth"],
};

describe("canonical meanings are immutable", () => {
  it("keeps every 1–9 name and Tree mapping", () => {
    expect(G_NUMBERS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const n of G_NUMBERS) {
      expect([NUMBERS[n].name, NUMBERS[n].tree]).toEqual(CANONICAL[n]);
    }
  });
});

describe("scoring framework is unchanged", () => {
  it("keeps the locked constants and normalization formula", () => {
    expect(gabrielSource).toContain("const MIN_PRIMARY_WEIGHT = 2.4");
    expect(gabrielSource).toContain("const MIN_LEAD = 0.35");
    expect(gabrielSource).toContain("const MIN_SUPPORT_WEIGHT = 1.8");
    expect(gabrielSource).toContain("raw / Math.sqrt(Math.max(reach, 1)) * 2");
  });

  it("keeps the result-presentation layer free of scoring logic", () => {
    expect(narrativeSource).not.toMatch(/MIN_PRIMARY_WEIGHT|MIN_LEAD|MIN_SUPPORT_WEIGHT/);
    expect(narrativeSource).not.toMatch(/evidence\s*:/);
  });
});

describe("numbers 1–8 have branch-specific, response-informed results", () => {
  const branches = ALL_DOORWAYS.map((d) => d.id);

  it("returns a three-part narrative for every branch × number 1–8", () => {
    for (const id of branches) {
      for (const n of NUMBERS_1_TO_8) {
        const narrative = getResultNarrative(id, n, [
          { questionPrompt: "p", choiceLabel: "a real answer" },
        ]);
        expect(narrative, `${id} / ${n}`).toBeDefined();
        expect(narrative!.clarity.length).toBeGreaterThan(60);
        expect(narrative!.question).toMatch(/\?$/);
        expect(narrative!.advice.length).toBeGreaterThan(20);
        expect(narrative!.patternSummary).toContain("a real answer");
      }
    }
  });

  it("does not reuse identical explanatory text across visible branches", () => {
    const visible = ALL_DOORWAYS.filter((d) => !d.hidden).map((d) => d.id);
    for (const n of NUMBERS_1_TO_8) {
      const texts = visible.map((id) => getResultNarrative(id, n, [])!.clarity);
      expect(new Set(texts).size, `number ${n}`).toBe(texts.length);
    }
  });

  it("never uses banned wording in 1–8 result copy", () => {
    for (const id of ALL_DOORWAYS.map((d) => d.id)) {
      for (const n of NUMBERS_1_TO_8) {
        const nar = getResultNarrative(id, n, [])!;
        expect(`${nar.clarity} ${nar.question}`.toLowerCase()).not.toMatch(/land/);
      }
    }
  });

  it("leaves number 9 to the dedicated bridge implementation", () => {
    for (const id of ALL_DOORWAYS.map((d) => d.id)) {
      expect(getResultNarrative(id, 9, [])).toBeUndefined();
    }
  });

  it("exposes the canonical headline form", () => {
    expect(numberHeadline(3)).toBe("3 — Pattern");
  });
});

describe("result page renders the three required sections", () => {
  it("keeps header, clarity and next-step sections wired to the narrative", () => {
    expect(pageSource).toContain("Your Gabriel Number");
    expect(pageSource).toContain("The clarity you're missing");
    expect(pageSource).toContain("What to look at next");
    expect(pageSource).toContain("getResultNarrative");
    expect(pageSource).toContain("narrative.clarity");
    expect(pageSource).toContain("narrative?.question");
  });
});
