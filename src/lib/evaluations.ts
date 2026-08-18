/**
 * Local, device-only storage of completed clarity evaluations.
 * Nothing leaves the browser.
 */

import type { Alignment, BranchId, GeneralEvaluation, ScaleValue } from "./evaluator";

export const EVALUATIONS_KEY = "gabriels-number-evaluations-v1";
const MAX_ENTRIES = 60;

export interface EvaluationRecord {
  id: string;
  /** ISO timestamp. */
  createdAt: string;
  initial: ScaleValue;
  evaluated: number;
  gap: number;
  alignment: Alignment;
  branchId: BranchId;
  branchLabel: string;
  general: GeneralEvaluation;
  /** Focused question → answer, in question order. */
  focused: { question: string; answer: string }[];
  mismatchSources: string[];
  reflection: string;
}

function isRecord(value: unknown): value is EvaluationRecord {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Partial<EvaluationRecord>;
  return (
    typeof entry.id === "string" &&
    typeof entry.createdAt === "string" &&
    typeof entry.initial === "number" &&
    typeof entry.evaluated === "number"
  );
}

export function loadEvaluations(): EvaluationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EVALUATIONS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecord);
  } catch {
    return [];
  }
}

function persist(entries: EvaluationRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EVALUATIONS_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    /* storage unavailable — history is a convenience, never required */
  }
}

export function saveEvaluation(entry: EvaluationRecord): EvaluationRecord[] {
  const next = [entry, ...loadEvaluations().filter((existing) => existing.id !== entry.id)];
  persist(next);
  return next.slice(0, MAX_ENTRIES);
}

export function deleteEvaluation(id: string): EvaluationRecord[] {
  const next = loadEvaluations().filter((entry) => entry.id !== id);
  persist(next);
  return next;
}

export function newEvaluationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatEvaluationDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
