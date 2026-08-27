/**
 * Gabriel's Lab — Contract V1 record format. RESEARCH ONLY.
 *
 * Nothing in this module is imported by production routes. It never touches
 * the production history key, never scores anything, and never interprets
 * evidence. It records exactly what was displayed and exactly what was
 * selected, in order, so a paired run can be audited from raw events alone.
 */

import type { GNumber } from "../gabriel";

export const CONTRACT_VERSION = "v1" as const;

export interface RecordedChoice {
  id: string;
  label: string;
}

interface BaseEvent {
  /** 1-based, strictly increasing within a run. */
  seq: number;
  at: string;
}

export interface RunStartEvent extends BaseEvent {
  type: "run_start";
  doorwayId: string;
  doorwayLabel: string;
}

export interface QuestionShownEvent extends BaseEvent {
  type: "question_shown";
  /** 1-based position in the traversal as displayed. */
  step: number;
  questionId: string;
  prompt: string;
  note: string | null;
  choices: RecordedChoice[];
}

export interface ChoiceSelectedEvent extends BaseEvent {
  type: "choice_selected";
  step: number;
  questionId: string;
  choiceId: string;
  choiceLabel: string;
}

export interface AnswerMissingEvent extends BaseEvent {
  type: "answer_missing";
  step: number;
  questionId: string;
  reason: "shown_not_answered";
}

export interface RunEndEvent extends BaseEvent {
  type: "run_end";
  /** Read-only snapshot of the production engine output. Never re-derived. */
  primary: GNumber | null;
  supporting: GNumber[];
}

export type LabEvent =
  | RunStartEvent
  | QuestionShownEvent
  | ChoiceSelectedEvent
  | AnswerMissingEvent
  | RunEndEvent;

export interface LabRunRecord {
  contractVersion: typeof CONTRACT_VERSION;
  runId: string;
  label: string;
  doorwayId: string;
  startedAt: string;
  endedAt: string | null;
  events: LabEvent[];
}

/* ------------------------------------------------------------------ */
/* Derived views — raw events are the only input                       */
/* ------------------------------------------------------------------ */

export interface ReconstructedAnswer {
  step: number;
  questionId: string;
  prompt: string;
  choiceId: string | null;
  choiceLabel: string | null;
  missing: boolean;
}

/**
 * Rebuilds the ordered answer vector purely from raw events. It does not call
 * the engine, so a mismatch between this and the live run is detectable.
 */
export function reconstructAnswerVector(record: LabRunRecord): ReconstructedAnswer[] {
  const shown: ReconstructedAnswer[] = [];
  const byQuestion = new Map<string, ReconstructedAnswer>();

  for (const event of [...record.events].sort((a, b) => a.seq - b.seq)) {
    if (event.type === "question_shown") {
      const entry: ReconstructedAnswer = {
        step: event.step,
        questionId: event.questionId,
        prompt: event.prompt,
        choiceId: null,
        choiceLabel: null,
        missing: true,
      };
      shown.push(entry);
      byQuestion.set(event.questionId, entry);
      continue;
    }
    if (event.type === "choice_selected") {
      const entry = byQuestion.get(event.questionId);
      if (entry) {
        entry.choiceId = event.choiceId;
        entry.choiceLabel = event.choiceLabel;
        entry.missing = false;
      }
    }
  }

  return shown.sort((a, b) => a.step - b.step);
}

export interface AnswerDiffRow {
  step: number;
  questionId: string;
  prompt: string;
  a: { choiceId: string | null; choiceLabel: string | null } | null;
  b: { choiceId: string | null; choiceLabel: string | null } | null;
  status: "same" | "changed" | "only_a" | "only_b";
}

export interface RunDiff {
  rows: AnswerDiffRow[];
  changedSteps: number[];
  /** First step where the two traversals stop matching, or null. */
  divergedAtStep: number | null;
  changedCount: number;
  /** True only when exactly one answered question differs and nothing else. */
  controlled: boolean;
}

export function diffRuns(a: LabRunRecord, b: LabRunRecord): RunDiff {
  const va = reconstructAnswerVector(a);
  const vb = reconstructAnswerVector(b);
  const length = Math.max(va.length, vb.length);
  const rows: AnswerDiffRow[] = [];
  const changedSteps: number[] = [];
  let structuralMismatch = false;

  for (let i = 0; i < length; i += 1) {
    const left = va[i];
    const right = vb[i];

    if (left && !right) {
      rows.push({
        step: left.step,
        questionId: left.questionId,
        prompt: left.prompt,
        a: { choiceId: left.choiceId, choiceLabel: left.choiceLabel },
        b: null,
        status: "only_a",
      });
      structuralMismatch = true;
      continue;
    }
    if (right && !left) {
      rows.push({
        step: right.step,
        questionId: right.questionId,
        prompt: right.prompt,
        a: null,
        b: { choiceId: right.choiceId, choiceLabel: right.choiceLabel },
        status: "only_b",
      });
      structuralMismatch = true;
      continue;
    }
    if (!left || !right) continue;

    if (left.questionId !== right.questionId) structuralMismatch = true;
    const changed = left.questionId !== right.questionId || left.choiceId !== right.choiceId;
    if (changed) changedSteps.push(i + 1);
    rows.push({
      step: i + 1,
      questionId: left.questionId,
      prompt: left.prompt,
      a: { choiceId: left.choiceId, choiceLabel: left.choiceLabel },
      b: { choiceId: right.choiceId, choiceLabel: right.choiceLabel },
      status: changed ? "changed" : "same",
    });
  }

  const divergedAtStep = changedSteps.length > 0 ? Math.min(...changedSteps) : null;

  return {
    rows,
    changedSteps,
    divergedAtStep,
    changedCount: changedSteps.length,
    controlled: !structuralMismatch && changedSteps.length === 1,
  };
}

export function runEndSnapshot(record: LabRunRecord): RunEndEvent | null {
  for (let i = record.events.length - 1; i >= 0; i -= 1) {
    const event = record.events[i];
    if (event && event.type === "run_end") return event;
  }
  return null;
}
