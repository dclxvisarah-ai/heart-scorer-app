import { describe, expect, it } from "vitest";

import { FORMULATIONS, buildDeepReading } from "./deep-reading";
import type { PatternResult } from "./gabriel";

function resultWith(primary: PatternResult["primary"], supporting: PatternResult["supporting"]) {
  return {
    primary,
    supporting,
    contested: primary ? [primary] : [],
    reasoning: "",
    tallies: [],
    contributions: [],
  } as unknown as PatternResult;
}

describe("deep reading layer", () => {
  it("leads 5 with the approved boundary formulation, not the short distinction", () => {
    const reading = buildDeepReading(resultWith(5, []))!;
    expect(reading.lead).toBe(
      "You are standing at the boundary between knowing something and deciding what responsibility that knowledge creates.",
    );
    expect(reading.support).toContain("Separate what you know");
  });

  it("reaches the 5 × 1 recognitions without prescribing a decision", () => {
    const reading = buildDeepReading(resultWith(5, [1]))!;
    const text = reading.recognitions.join(" ");
    expect(text).toContain("Knowing something is not the same as knowing what responsibility");
    expect(text).toContain("needs to hear it from you");
    expect(text).toContain("cost you the relationship");
    expect(reading.companions.join(" ")).toContain("impossible to leave unexamined");
    expect(text).not.toMatch(/you should|you must|tell (them|her|him)\b/i);
  });

  it("preserves the approved 8 Listening formulation", () => {
    expect(FORMULATIONS[8].lead).toContain("Making room to receive before deciding what to do");
    expect(FORMULATIONS[8].support).toBe("Listen before you decide.");
    expect(FORMULATIONS[8].lead).not.toMatch(/fear|hesitation/i);
  });

  it("still reads when the number is undetermined", () => {
    const undetermined = {
      primary: null,
      supporting: [],
      contested: [5, 1],
      reasoning: "",
      tallies: [],
      contributions: [],
    } as unknown as PatternResult;
    const reading = buildDeepReading(undetermined)!;
    expect(reading.lead).toContain("boundary between knowing something");
    expect(reading.recognitions.length).toBeGreaterThan(0);
  });

  it("is deterministic", () => {
    const a = buildDeepReading(resultWith(5, [1]));
    const b = buildDeepReading(resultWith(5, [1]));
    expect(a).toEqual(b);
  });
});
