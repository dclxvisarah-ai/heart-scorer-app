import { describe, expect, it } from "vitest";

import {
  DOORWAYS,
  buildSequence,
  evaluatePattern,
  getDeeperProbe,
  type AnswerMap,
  type Question,
} from "./gabriel";
import { ACTIVATION_WEIGHT, TERRITORIES, deriveRelationalState } from "./relational-state";

function byId(id: string) {
  const d = DOORWAYS.find((x) => x.id === id);
  if (!d) throw new Error(`no doorway ${id}`);
  return d;
}

function derive(doorwayId: string, answers: AnswerMap, deeperIds: string[] = []) {
  const d = byId(doorwayId);
  const sequence = buildSequence(d, answers, deeperIds);
  const result = evaluatePattern(sequence, answers);
  return { sequence, result, state: deriveRelationalState(sequence, answers, result) };
}

/** The recorded Spiral traversal already pinned in gabriel.evaluator.test.ts. */
const SPIRAL: AnswerMap = {
  "spiral-1": "replay",
  "spiral-replay": "e",
  "spiral-known": "c",
  c1: "c",
  c2: "d",
};

describe("active territories", () => {
  it("includes every territory at or above the activation weight, and nothing below", () => {
    const { result, state } = derive("spiral", SPIRAL);
    const expected = result.tallies.filter((t) => t.weight >= ACTIVATION_WEIGHT).map((t) => t.n);
    expect(state.territories.map((t) => t.n)).toEqual(expected);
    expect(expected.length).toBeGreaterThan(1);
  });

  it("does not cap the number of active territories", () => {
    const { result, state } = derive("spiral", SPIRAL);
    const active = result.tallies.filter((t) => t.weight >= ACTIVATION_WEIGHT).length;
    expect(state.territories).toHaveLength(active);
  });

  it("carries the established structural question and vocabulary for each territory", () => {
    const { state } = derive("spiral", SPIRAL);
    for (const t of state.territories) {
      expect(t.structuralQuestion).toBe(TERRITORIES[t.n].structuralQuestion);
      expect(t.vocabulary).toEqual(TERRITORIES[t.n].vocabulary);
    }
  });

  it("every active territory is backed by at least one of the person's own answers", () => {
    const { state } = derive("spiral", SPIRAL);
    for (const t of state.territories) expect(t.snippets.length).toBeGreaterThan(0);
  });
});

describe("relationships are evidence-supported only", () => {
  it("every relationship is carried by a single answer holding both territories", () => {
    const { sequence, state } = derive("spiral", SPIRAL);
    for (const r of state.relationships) {
      expect(r.support.length).toBeGreaterThan(0);
      for (const s of r.support) {
        expect(s.numbers).toContain(r.pair[0]);
        expect(s.numbers).toContain(r.pair[1]);
        expect(sequence.some((q) => q.id === s.questionId)).toBe(true);
        expect(
          s.roles[r.pair[0]] === "leading" || s.roles[r.pair[1]] === "leading",
        ).toBe(true);
      }
    }
  });

  it("shared vocabulary alone never creates a relationship", () => {
    // Two answers, each carrying one territory only. Their vocabulary fields
    // sit side by side in the panel, but no answer carries both.
    const q = (id: string, evidence: Record<number, number>): Question => ({
      id,
      prompt: id,
      choices: [{ id: "a", label: id, evidence }],
    });
    const sequence = [q("x", { 3: 3 }), q("y", { 4: 3 })];
    const answers: AnswerMap = { x: "a", y: "a" };
    const state = deriveRelationalState(sequence, answers, evaluatePattern(sequence, answers));

    expect(state.territories.map((t) => t.n)).toEqual(expect.arrayContaining([3, 4]));
    expect(state.relationships).toHaveLength(0);
    expect(state.unsupportedPairs).toEqual([[3, 4]]);
    // Vocabulary from both is still shown as context.
    expect(state.vocabularyField).toEqual(
      expect.arrayContaining([...TERRITORIES[3].vocabulary, ...TERRITORIES[4].vocabulary]),
    );
  });

  it("a pair is a relationship exactly when an answer carries both", () => {
    const sequence: Question[] = [
      { id: "x", prompt: "x", choices: [{ id: "a", label: "both", evidence: { 3: 3, 4: 2 } }] },
      { id: "y", prompt: "y", choices: [{ id: "a", label: "more", evidence: { 3: 3, 4: 2 } }] },
    ];
    const answers: AnswerMap = { x: "a", y: "a" };
    const state = deriveRelationalState(sequence, answers, evaluatePattern(sequence, answers));
    expect(state.relationships.map((r) => r.pair)).toEqual([[3, 4]]);
    expect(state.unsupportedPairs).toEqual([]);
    expect(state.relationships[0]!.description).toContain("3 Pattern");
  });
});

describe("Undetermined", () => {
  it("a relational state still exists when Gabriel's Number is Undetermined", () => {
    const { result, state } = derive("spiral", SPIRAL);
    expect(result.primary).toBeUndefined();
    expect(state.territories.length).toBeGreaterThan(0);
    expect(state.status).toBe("unresolved");
    expect(state.coordinateLabel.length).toBeGreaterThan(0);
    expect(state.summary.length).toBeGreaterThan(0);
  });

  it("no answers at all yields an empty, non-throwing state", () => {
    const d = byId("spiral");
    const sequence = buildSequence(d, {});
    const state = deriveRelationalState(sequence, {}, evaluatePattern(sequence, {}));
    expect(state.territories).toEqual([]);
    expect(state.relationships).toEqual([]);
    expect(state.status).toBe("unresolved");
  });
});

describe("determinism", () => {
  it("same sequence + answers always give the same state", () => {
    const a = derive("spiral", SPIRAL).state;
    const b = derive("spiral", { ...SPIRAL }).state;
    expect(a).toEqual(b);
  });
});

describe("deeper probes feed the relational state", () => {
  it("the deeper answer appears as evidence without changing the engine's weights", () => {
    const base = derive("spiral", SPIRAL);
    const probe = getDeeperProbe(base.result.contested, [])!;
    expect(probe).toBeDefined();

    const answers: AnswerMap = { ...SPIRAL, [probe.id]: probe.choices[1]!.id };
    const deep = derive("spiral", answers, [probe.id]);

    // The probe's own answer is now part of the described evidence.
    const cited = deep.state.territories.flatMap((t) => t.snippets.map((s) => s.questionId));
    expect(cited).toContain(probe.id);

    // The relational layer did not alter what the engine scored.
    const sequence = buildSequence(byId("spiral"), answers, [probe.id]);
    expect(evaluatePattern(sequence, answers)).toEqual(deep.result);
  });
});
