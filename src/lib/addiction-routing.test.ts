import { describe, expect, it } from "vitest";

import {
  ADDICTION_PROBE_PRIORITY,
  deriveRoutingFacts,
  getEarnedAddictionQuestions,
  isProbeEarned,
  summarizeRoutingFacts,
  type RoutingContext,
} from "./addiction-routing";
import { buildSequence, evaluatePattern, getDoorway } from "./gabriel";

/** Two answered base questions is the minimum context for the layer. */
const BASE = ["drink-1", "drink-plain"];
const BASE_ANSWERS = { "drink-1": "plain", "drink-plain": "e" };

function ctx(doorwayId: string, answers: Record<string, string>, base = BASE): RoutingContext {
  return { doorwayId, orderedQuestionIds: base, answers };
}

function summaryFor(answers: Record<string, string>, base = BASE) {
  return summarizeRoutingFacts([...base, ...ADDICTION_PROBE_PRIORITY], answers);
}

function earned(probeId: string, answers: Record<string, string>, doorwayId = "drink", base = BASE) {
  return isProbeEarned(probeId, ctx(doorwayId, answers, base), summaryFor(answers, base));
}

describe("routing facts derivation", () => {
  it("only reads answers that carry declared routing metadata", () => {
    const facts = deriveRoutingFacts(["drink-1", "drink-habit-1"], {
      "drink-1": "routine",
      "drink-habit-1": "f", // "A sense of control" — deliberately unmapped
    });
    expect(facts).toEqual([]);
  });

  it("keeps hypothetical drink-habit-3 answers hypothetical", () => {
    const summary = summaryFor({ ...BASE_ANSWERS, "drink-habit-3": "a" }, [
      ...BASE,
      "drink-habit-3",
    ]);
    expect(summary.MEANINGFUL_COST.state).toBe("PROVISIONAL");
    expect(summary.MEANINGFUL_COST.temporalScope).toBe("HYPOTHETICAL");
  });
});

describe("hard-case contract", () => {
  it("intact basic care blocks E2", () => {
    const answers = { ...BASE_ANSWERS, "addiction-e2": "intact" };
    expect(summaryFor(answers).BASIC_LIFE_DISPLACEMENT.state).toBe("NEGATED");
    expect(earned("addiction-e2", answers)).toBe(false);
    // and it must not create a gambling displacement probe either
    expect(earned("gamble-g3", answers, "gamble")).toBe(false);
  });

  it("current displacement establishes E2 and can earn G3 in gamble", () => {
    const answers = { ...BASE_ANSWERS, "addiction-e2": "hours" };
    const summary = summaryFor(answers);
    expect(summary.BASIC_LIFE_DISPLACEMENT.state).toBe("ESTABLISHED");
    expect(summary.TIME_ROLE_DISPLACEMENT.temporalScope).toBe("CURRENT");
    expect(earned("gamble-g3", answers, "gamble")).toBe(true);
  });

  it("attempted change is separate from desire or lack of desire", () => {
    const notTried = summaryFor({ ...BASE_ANSWERS, "addiction-e1": "not-tried" });
    expect(notTried.CONTROL_ATTEMPT.state).toBe("NEGATED");
    expect(notTried.READINESS.state).toBe("UNKNOWN");

    const noWish = summaryFor({ ...BASE_ANSWERS, "addiction-e1": "no-wish" });
    expect(noWish.CONTROL_ATTEMPT.state).toBe("NEGATED");
    expect(noWish.READINESS.state).toBe("NEGATED");
  });

  it("actual meaningful cost is separate from hypothetical cost", () => {
    expect(summaryFor({ ...BASE_ANSWERS, "addiction-e3": "money" }).MEANINGFUL_COST).toMatchObject({
      state: "ESTABLISHED",
      temporalScope: "CURRENT",
    });
    const later = summaryFor({ ...BASE_ANSWERS, "addiction-e3": "later" }).MEANINGFUL_COST;
    expect(later.state).toBe("PROVISIONAL");
    expect(later.temporalScope).toBe("HYPOTHETICAL");
  });

  it("external stopping is preserved as external, not as deliberate control", () => {
    const external = summaryFor({ ...BASE_ANSWERS, "addiction-e4": "run-out" });
    expect(external.STOP_MECHANISM.sourceChoiceId).toBe("run-out");
    expect(external.CONTROL_ATTEMPT.state).toBe("UNKNOWN");
    expect(external.CONTROL_RESULT.state).toBe("UNKNOWN");

    const deliberate = summaryFor({ ...BASE_ANSWERS, "addiction-e4": "decide" });
    expect(deliberate.STOP_MECHANISM.sourceChoiceId).toBe("decide");
    expect(deliberate.CONTROL_RESULT.state).toBe("UNKNOWN");
  });

  it("historical impairment plus current improvement preserves temporal scope", () => {
    const answers = { ...BASE_ANSWERS, "addiction-e2": "before" };
    const raw = deriveRoutingFacts([...BASE, "addiction-e2"], answers);
    expect(raw).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ state: "ESTABLISHED", temporalScope: "HISTORICAL" }),
        expect.objectContaining({ state: "NEGATED", temporalScope: "CURRENT" }),
      ]),
    );
    const summary = summaryFor(answers);
    expect(summary.BASIC_LIFE_DISPLACEMENT.state).toBe("NEGATED");
    expect(summary.BASIC_LIFE_DISPLACEMENT.temporalScope).toBe("CURRENT");
  });

  it("clear recognition with no desire to change does not trigger further probing", () => {
    const answers = {
      ...BASE_ANSWERS,
      "addiction-e1": "no-change",
      "addiction-e2": "intact",
      "addiction-e5": "clear",
      "addiction-e6": "nothing",
    };
    const summary = summaryFor(answers);
    expect(summary.RECOGNITION.state).toBe("ESTABLISHED");
    expect(summary.READINESS.state).toBe("NEGATED");
    expect(earned("addiction-e5", answers)).toBe(false);
    expect(earned("addiction-e6", answers)).toBe(false);
  });

  it("shame or discomfort without impairment creates no addiction facts", () => {
    const base = ["drink-1", "drink-well"];
    const answers = { "drink-1": "well", "drink-well": "d" }; // "Feeling successful or comfortable"
    expect(deriveRoutingFacts(base, answers)).toEqual([]);
    const summary = summaryFor(answers, base);
    for (const key of ["BASIC_LIFE_DISPLACEMENT", "MEANINGFUL_COST", "CHASE_OR_CONTINUE"] as const) {
      expect(summary[key].state).toBe("UNKNOWN");
    }
  });

  it("gambling chasing and moved limit are independent, and can coexist", () => {
    const base = ["gamble-1", "gamble-2"];
    const chasingOnly = { "gamble-1": "c", "gamble-2": "d" };
    expect(earned("gamble-g1", chasingOnly, "gamble", base)).toBe(true);
    expect(earned("gamble-g2", chasingOnly, "gamble", base)).toBe(false);

    const limitOnly = { "gamble-1": "a", "gamble-2": "b" };
    expect(earned("gamble-g1", limitOnly, "gamble", base)).toBe(false);
    expect(earned("gamble-g2", limitOnly, "gamble", base)).toBe(true);

    const both = { "gamble-1": "c", "gamble-2": "b" };
    expect(earned("gamble-g1", both, "gamble", base)).toBe(true);
    expect(earned("gamble-g2", both, "gamble", base)).toBe(true);
  });

  it("a kept limit negates LIMIT_MOVED and blocks G2", () => {
    const base = ["gamble-1", "gamble-2"];
    const answers = { "gamble-1": "a", "gamble-2": "a" };
    expect(summaryFor(answers, base).LIMIT_MOVED.state).toBe("NEGATED");
    expect(earned("gamble-g2", answers, "gamble", base)).toBe(false);
  });

  it("the generic avoids flag alone never counts as chasing", () => {
    const base = ["drink-1", "drink-happened"];
    const answers = { "drink-1": "happened", "drink-happened": "a" }; // avoids: true
    expect(summaryFor(answers, base).CHASE_OR_CONTINUE.state).toBe("UNKNOWN");
  });

  it("preserves contradiction instead of picking a side", () => {
    const base = ["gamble-1", "gamble-2", "addiction-e2", "gamble-g3"];
    const answers = {
      "gamble-1": "c",
      "gamble-2": "b",
      "addiction-e2": "hours", // time/role displacement established
      "gamble-g3": "nothing", // person then says nothing is actually going without
    };
    const summary = summarizeRoutingFacts(base, answers);
    expect(summary.TIME_ROLE_DISPLACEMENT.state).toBe("CONTRADICTED");
    expect(isProbeEarned("gamble-g3", ctx("gamble", answers, base), summary)).toBe(false);
  });

  it("hypothetical statements cannot satisfy a current prerequisite", () => {
    const answers = { ...BASE_ANSWERS, "addiction-e3": "later" };
    // still unresolved, so the cost question stays available rather than
    // being treated as satisfied
    expect(earned("addiction-e3", answers)).toBe(true);
  });

  it("E6 is downstream only", () => {
    const withoutE5 = { ...BASE_ANSWERS, "addiction-e1": "returned" };
    expect(earned("addiction-e6", withoutE5)).toBe(false);
    const withE5 = { ...withoutE5, "addiction-e5": "partial" };
    expect(earned("addiction-e6", withE5)).toBe(true);
    const unsureE5 = { ...withoutE5, "addiction-e5": "unsure" };
    expect(earned("addiction-e6", unsureE5)).toBe(false);
  });

  it("E5 needs at least two evidence questions answered first", () => {
    const one = { ...BASE_ANSWERS, "addiction-e1": "returned" };
    expect(earned("addiction-e5", one)).toBe(false);
    const two = { ...one, "addiction-e2": "intact" };
    expect(earned("addiction-e5", two)).toBe(true);
  });

  it("never routes for a non-addiction doorway", () => {
    expect(earned("addiction-e1", BASE_ANSWERS, "spiral")).toBe(false);
    expect(getEarnedAddictionQuestions("spiral", BASE, BASE_ANSWERS)).toEqual([]);
  });
});

describe("integration with the protected evaluator", () => {
  it("appends earned addiction questions to the drink sequence", () => {
    const drink = getDoorway("drink")!;
    const answers = { "drink-1": "plain", "drink-plain": "e" };
    const ids = buildSequence(drink, answers).map((q) => q.id);
    expect(ids).toContain("addiction-e1");
    expect(ids).toContain("addiction-e2");
    expect(ids.indexOf("addiction-e1")).toBeLessThan(ids.indexOf("addiction-e2"));
  });

  it("keeps an answered addiction question in the sequence after it is negated", () => {
    const drink = getDoorway("drink")!;
    const answers = { "drink-1": "plain", "drink-plain": "e", "addiction-e2": "intact" };
    expect(buildSequence(drink, answers).map((q) => q.id)).toContain("addiction-e2");
  });

  it("does not add addiction questions to unrelated branches", () => {
    const spiral = getDoorway("spiral")!;
    const ids = buildSequence(spiral, { "spiral-1": "replay" }).map((q) => q.id);
    expect(ids.some((id) => id.startsWith("addiction-") || id.startsWith("gamble-g"))).toBe(false);
  });

  it("leaves the Number evaluator output unchanged for identical Number evidence", () => {
    const drink = getDoorway("drink")!;
    const answers = { "drink-1": "plain", "drink-plain": "e" };
    const withLayer = buildSequence(drink, answers);
    const withoutLayer = withLayer.filter(
      (q) => !q.id.startsWith("addiction-") && !q.id.startsWith("gamble-g"),
    );
    expect(withLayer.length).toBeGreaterThan(withoutLayer.length);
    expect(evaluatePattern(withLayer, answers)).toEqual(evaluatePattern(withoutLayer, answers));
  });

  it("addiction questions carry no Number evidence at all", () => {
    for (const id of ADDICTION_PROBE_PRIORITY) {
      const question = getEarnedAddictionQuestions("drink", [], { [id]: "x" }).find(
        (q) => q.id === id,
      );
      if (!question) continue;
      for (const choice of question.choices) {
        expect(Object.keys(choice.evidence)).toEqual([]);
      }
    }
  });
});
