/**
 * Gabriel's Lab — Contract V1 recorder. RESEARCH ONLY.
 *
 * Append-only: existing events are never rewritten or reordered. Each call
 * returns a new record object so React state updates stay immutable.
 */

import type { GNumber, Doorway, Question } from "../gabriel";
import {
  CONTRACT_VERSION,
  type LabEvent,
  type LabRunRecord,
} from "./contract";

/** Lab storage key. Deliberately distinct from the production history key. */
export const LAB_STORAGE_KEY = "gabriels-lab-contract-v1";

function now(): string {
  return new Date().toISOString();
}

export function newRunId(label: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `run-${label.toLowerCase()}-${rand}`;
}

function append(record: LabRunRecord, event: Omit<LabEvent, "seq" | "at">): LabRunRecord {
  const seq = record.events.length + 1;
  const next = { ...event, seq, at: now() } as LabEvent;
  return { ...record, events: [...record.events, next] };
}

export function startRun(doorway: Doorway, label: string): LabRunRecord {
  const base: LabRunRecord = {
    contractVersion: CONTRACT_VERSION,
    runId: newRunId(label),
    label,
    doorwayId: doorway.id,
    startedAt: now(),
    endedAt: null,
    events: [],
  };
  return append(base, {
    type: "run_start",
    doorwayId: doorway.id,
    doorwayLabel: doorway.label,
  });
}

export function logQuestionShown(
  record: LabRunRecord,
  question: Question,
  step: number,
): LabRunRecord {
  const already = record.events.some(
    (e) => e.type === "question_shown" && e.questionId === question.id && e.step === step,
  );
  if (already) return record;
  return append(record, {
    type: "question_shown",
    step,
    questionId: question.id,
    prompt: question.prompt,
    note: question.note ?? null,
    choices: question.choices.map((c) => ({ id: c.id, label: c.label })),
  });
}

export function logChoiceSelected(
  record: LabRunRecord,
  question: Question,
  choiceId: string,
  step: number,
): LabRunRecord {
  const choice = question.choices.find((c) => c.id === choiceId);
  return append(record, {
    type: "choice_selected",
    step,
    questionId: question.id,
    choiceId,
    choiceLabel: choice?.label ?? "",
  });
}

export function logAnswerMissing(
  record: LabRunRecord,
  questionId: string,
  step: number,
): LabRunRecord {
  return append(record, {
    type: "answer_missing",
    step,
    questionId,
    reason: "shown_not_answered",
  });
}

export function endRun(
  record: LabRunRecord,
  primary: GNumber | null,
  supporting: GNumber[],
): LabRunRecord {
  const withEvent = append(record, { type: "run_end", primary, supporting });
  return { ...withEvent, endedAt: now() };
}

/* ------------------------------------------------------------------ */
/* Export helpers                                                      */
/* ------------------------------------------------------------------ */

export function toJson(records: LabRunRecord[]): string {
  return JSON.stringify(
    { contractVersion: CONTRACT_VERSION, exportedAt: now(), runs: records },
    null,
    2,
  );
}

export function persistLabRuns(records: LabRunRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAB_STORAGE_KEY, toJson(records));
  } catch {
    /* lab persistence is a convenience only */
  }
}

export function downloadJson(filename: string, json: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
