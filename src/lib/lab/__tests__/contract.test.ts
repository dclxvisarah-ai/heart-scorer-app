import { describe, expect, it } from "vitest";

import { buildSequence, evaluatePattern, getDoorway, type AnswerMap } from "@/lib/gabriel";
import { diffRuns, reconstructAnswerVector, runEndSnapshot } from "@/lib/lab/contract";
import {
  endRun,
  logAnswerMissing,
  logChoiceSelected,
  logQuestionShown,
  startRun,
  type LabRunRecord,
} from "@/lib/lab/recorder";

const doorway = getDoorway("spiral")!;

/** Records a full traversal choosing the choice at `pick` on each question. */
function recordRun(label: string, pick: (step: number) => number): {
  record: LabRunRecord;
  answers: AnswerMap;
} {
  let record = startRun(doorway, label);
  const answers: AnswerMap = {};
  for (let step = 1; step <= 40; step += 1) {
    const sequence = buildSequence(doorway, answers);
    const question = sequence[step - 1];
    if (!question) break;
    record = logQuestionShown(record, question, step);
    const choice = question.choices[Math.min(pick(step), question.choices.length - 1)]!;
    record = logChoiceSelected(record, question, choice.id, step);
    answers[question.id] = choice.id;
  }
  const sequence = buildSequence(doorway, answers);
  const result = evaluatePattern(sequence, answers);
  record = endRun(record, result.primary ?? null, result.supporting);
  return { record, answers };
}

describe("Contract V1 lab recorder", () => {
  it("records exact prompt, note and ordered choices for every displayed question", () => {
    const { record, answers } = recordRun("Run A", () => 0);
    const sequence = buildSequence(doorway, answers);
    const shown = record.events.filter((e) => e.type === "question_shown");
    expect(shown.length).toBe(sequence.length);
    shown.forEach((event, i) => {
      if (event.type !== "question_shown") return;
      const question = sequence[i]!;
      expect(event.questionId).toBe(question.id);
      expect(event.prompt).toBe(question.prompt);
      expect(event.note).toBe(question.note ?? null);
      expect(event.choices).toEqual(question.choices.map((c) => ({ id: c.id, label: c.label })));
    });
  });

  it("records exact questionId, choiceId and choiceLabel for every selection", () => {
    const { record, answers } = recordRun("Run A", () => 1);
    const sequence = buildSequence(doorway, answers);
    for (const event of record.events) {
      if (event.type !== "choice_selected") continue;
      const question = sequence.find((q) => q.id === event.questionId)!;
      const choice = question.choices.find((c) => c.id === event.choiceId)!;
      expect(event.choiceLabel).toBe(choice.label);
      expect(answers[question.id]).toBe(event.choiceId);
    }
  });

  it("gives runs distinct runIds and strictly ordered append-only events", () => {
    const a = recordRun("Run A", () => 0).record;
    const b = recordRun("Run B", () => 0).record;
    expect(a.runId).not.toBe(b.runId);
    const seqs = a.events.map((e) => e.seq);
    expect(seqs).toEqual([...Array(a.events.length)].map((_, i) => i + 1));
    // Appending later never rewrites earlier events.
    const grown = logAnswerMissing(a, "probe", 99);
    expect(grown.events.slice(0, a.events.length)).toEqual(a.events);
    expect(a.events.length + 1).toBe(grown.events.length);
  });

  it("reconstructs the answer vector from raw events only", () => {
    const { record, answers } = recordRun("Run A", () => 2);
    const vector = reconstructAnswerVector(record);
    const sequence = buildSequence(doorway, answers);
    expect(vector.map((row) => row.questionId)).toEqual(sequence.map((q) => q.id));
    for (const row of vector) {
      expect(row.missing).toBe(false);
      expect(row.choiceId).toBe(answers[row.questionId]);
    }
  });

  it("marks shown-but-unanswered questions as explicitly missing", () => {
    let record = startRun(doorway, "Run A");
    const first = buildSequence(doorway, {})[0]!;
    record = logQuestionShown(record, first, 1);
    record = logAnswerMissing(record, first.id, 1);
    const vector = reconstructAnswerVector(record);
    expect(vector).toHaveLength(1);
    expect(vector[0]!.missing).toBe(true);
    expect(vector[0]!.choiceId).toBeNull();
  });

  it("reports exactly one changed answer for a clone-then-change-one pair", () => {
    const runA = recordRun("Run A", () => 0);
    // Clone A, then change only the answer at step 2.
    let record = startRun(doorway, "Run B");
    const answers: AnswerMap = {};
    const sourceVector = reconstructAnswerVector(runA.record);
    for (let step = 1; step <= sourceVector.length; step += 1) {
      const sequence = buildSequence(doorway, answers);
      const question = sequence[step - 1];
      if (!question) break;
      const cloned = sourceVector[step - 1]!.choiceId!;
      const choiceId =
        step === 2
          ? (question.choices.find((c) => c.id !== cloned)?.id ?? cloned)
          : cloned;
      record = logQuestionShown(record, question, step);
      record = logChoiceSelected(record, question, choiceId, step);
      answers[question.id] = choiceId;
    }
    const diff = diffRuns(runA.record, record);
    expect(diff.changedCount).toBe(1);
    expect(diff.changedSteps).toEqual([2]);
    expect(diff.divergedAtStep).toBe(2);
  });

  it("keeps derived views separate from the raw record", () => {
    const { record } = recordRun("Run A", () => 0);
    const before = JSON.stringify(record);
    reconstructAnswerVector(record);
    diffRuns(record, record);
    expect(JSON.stringify(record)).toBe(before);
    expect(diffRuns(record, record).changedCount).toBe(0);
    expect(diffRuns(record, record).controlled).toBe(false);
  });

  it("stores the engine result read-only in the run_end event", () => {
    const { record, answers } = recordRun("Run A", () => 0);
    const snapshot = runEndSnapshot(record)!;
    const live = evaluatePattern(buildSequence(doorway, answers), answers);
    expect(snapshot.primary).toBe(live.primary ?? null);
    expect(snapshot.supporting).toEqual(live.supporting);
    expect(record.endedAt).not.toBeNull();
  });
});
