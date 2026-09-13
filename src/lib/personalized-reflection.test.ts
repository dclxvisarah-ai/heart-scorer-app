import { describe, expect, it } from "vitest";

import type { PatternResult } from "./gabriel";
import { buildPersonalizedReflection } from "./personalized-reflection";
import type { RelationalState } from "./relational-state";

function result(primary: PatternResult["primary"], choiceLabels: string[] = []): PatternResult {
  return {
    primary,
    supporting: primary === 5 ? [1] : [],
    contested: primary ? [] : [5, 1],
    reasoning: "",
    coherent: Boolean(primary),
    tallies: [],
    contributions: choiceLabels.map((choiceLabel, index) => ({
      questionPrompt: `Question ${index + 1}`,
      choiceLabel,
    })),
  };
}

function stateWithAnswer(choiceLabel: string): RelationalState {
  return {
    coordinateLabel: "5 Discernment × 1 Beginning",
    territories: [
      {
        n: 5,
        name: "Discernment",
        weight: 2.5,
        structuralQuestion: "What distinction becomes necessary?",
        vocabulary: ["discernment"],
        snippets: [
          {
            questionId: "q1",
            questionPrompt: "What do you know?",
            choiceLabel,
            numbers: [5, 1],
            roles: { 5: "leading", 1: "supporting" },
          },
        ],
      },
    ],
    relationships: [],
    unsupportedPairs: [],
    vocabularyField: ["discernment"],
    status: "unresolved",
    summary: "",
  };
}

function expectSingleQuestionEnding(paragraph: string) {
  expect(paragraph.match(/\?/g)).toHaveLength(1);
  expect(paragraph.endsWith("?")).toBe(true);
}

describe("personalized result reflection", () => {
  it("uses the person's selected answers and produces one deterministic paragraph", () => {
    const input = result(5, ["I know what happened", "I am filling in the rest"]);
    const first = buildPersonalizedReflection(input, null);
    const second = buildPersonalizedReflection(input, null);

    expect(first).toEqual(second);
    expect(first.paragraph).toContain("“I know what happened”");
    expect(first.paragraph).toContain("“I am filling in the rest”");
    expect(first.paragraph).not.toContain("5 Discernment");
    expect(first.paragraph).not.toMatch(/leading|underneath|vocabulary field/i);
    expectSingleQuestionEnding(first.paragraph);
  });

  it("does not expose surrounding territory labels in a multi-territory result", () => {
    const reflection = buildPersonalizedReflection(result(5, ["I need more information"]), null);
    expect(reflection.paragraph).not.toContain("1 Beginning");
    expect(reflection.paragraph).not.toContain("×");
    expectSingleQuestionEnding(reflection.paragraph);
  });

  it("preserves the Number 9 bridge question as the sole ending", () => {
    const reflection = buildPersonalizedReflection(result(9, ["I know the next step"]), null);
    expect(reflection.paragraph).toContain("What are you going to do with this insight?");
    expectSingleQuestionEnding(reflection.paragraph);
  });

  it("uses answer evidence for Undetermined without exposing territory machinery", () => {
    const reflection = buildPersonalizedReflection(
      result(undefined),
      stateWithAnswer("Two things still feel true"),
    );
    expect(reflection.paragraph).toContain("“Two things still feel true”");
    expect(reflection.paragraph).not.toMatch(/5 Discernment|1 Beginning|leading|underneath/i);
    expectSingleQuestionEnding(reflection.paragraph);
  });
});