import { describe, it, expect } from "vitest";
import { getDoorway, buildSequence, evaluatePattern, type AnswerMap } from "@/lib/gabriel";

const bet = getDoorway("bet")!;
const BANNED = /\b(land|landed|landing)\b|create some distance|hold space|ground yourself|process your feelings|what are you avoiding|what would help/i;

function run(states: string, picks: string[]) {
  const answers: AnswerMap = { "bet-1": states };
  let seq = buildSequence(bet, answers);
  let i = 1;
  while (i < 6) {
    seq = buildSequence(bet, answers);
    const q = seq[i];
    if (!q) break;
    const choice = q.choices[Math.min(Number(picks[i - 1] ?? 0), q.choices.length - 1)]!;
    answers[q.id] = choice.id;
    i++;
  }
  seq = buildSequence(bet, answers);
  return { seq, answers, result: evaluatePattern(seq, answers) };
}

describe("The Chase", () => {
  for (const state of ["up", "down", "even", "early"]) {
    it(`${state} runs six pages and quotes only selected answers`, () => {
      for (let p = 0; p < 4; p++) {
        const { seq, answers, result } = run(state, [String(p), String(p), String(p), String(p), String(p)]);
        expect(seq.length).toBe(6);
        expect(Object.keys(answers).length).toBe(6);
        const selected = new Set(
          seq.map((q) => q.choices.find((c) => c.id === answers[q.id])?.label),
        );
        for (const c of result.contributions) expect(selected.has(c.choiceLabel)).toBe(true);
        for (const q of seq) {
          expect(q.prompt).not.toMatch(BANNED);
          for (const c of q.choices) expect(c.label).not.toMatch(BANNED);
        }
      }
    });
  }

  it("changing the entry state leaves no stale answers on the path", () => {
    const first = run("up", ["0", "0", "0", "0", "0"]);
    // simulate the app's prune: switch entry state, keep the old answer map
    const changed: AnswerMap = { ...first.answers, "bet-1": "down" };
    const seq = buildSequence(bet, changed);
    const live = new Set(seq.map((q) => q.id));
    for (const k of Object.keys(changed)) if (!live.has(k)) delete changed[k];
    const res = evaluatePattern(buildSequence(bet, changed), changed);
    const selected = new Set(
      buildSequence(bet, changed).map((q) => q.choices.find((c) => c.id === changed[q.id])?.label),
    );
    for (const c of res.contributions) expect(selected.has(c.choiceLabel)).toBe(true);
    expect(Object.keys(changed)).not.toContain("bet-up");
  });
});
