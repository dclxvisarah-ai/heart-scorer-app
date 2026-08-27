import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  buildSequence,
  evaluatePattern,
  getDoorway,
  NUMBERS,
  type AnswerMap,
  type Question,
} from "@/lib/gabriel";
import {
  diffRuns,
  reconstructAnswerVector,
  runEndSnapshot,
  type LabRunRecord,
} from "@/lib/lab/contract";
import {
  downloadJson,
  endRun,
  logAnswerMissing,
  logChoiceSelected,
  logQuestionShown,
  persistLabRuns,
  startRun,
  toJson,
} from "@/lib/lab/recorder";

export const Route = createFileRoute("/lab/spiral-perturbation")({
  head: () => ({
    meta: [
      { title: "Gabriel's Lab — Spiral answer-perturbation fixture" },
      {
        name: "description",
        content:
          "Research-only Contract V1 capture fixture for paired Spiral traversals. Not part of the application.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SpiralPerturbationLab,
});

const DOORWAY_ID = "spiral";

type RunKey = "A" | "B";

interface RunState {
  answers: AnswerMap;
  record: LabRunRecord | null;
  finished: boolean;
}

const EMPTY: RunState = { answers: {}, record: null, finished: false };

function SpiralPerturbationLab() {
  const doorway = getDoorway(DOORWAY_ID);
  const [runs, setRuns] = useState<Record<RunKey, RunState>>({ A: EMPTY, B: EMPTY });
  const [showRaw, setShowRaw] = useState(false);

  const sequences = useMemo(() => {
    if (!doorway) return { A: [] as Question[], B: [] as Question[] };
    return {
      A: buildSequence(doorway, runs.A.answers),
      B: buildSequence(doorway, runs.B.answers),
    };
  }, [doorway, runs.A.answers, runs.B.answers]);

  const results = useMemo(() => {
    if (!doorway) return { A: null, B: null };
    return {
      A: runs.A.finished ? evaluatePattern(sequences.A, runs.A.answers) : null,
      B: runs.B.finished ? evaluatePattern(sequences.B, runs.B.answers) : null,
    };
  }, [doorway, runs.A, runs.B, sequences]);

  if (!doorway) {
    return <main className="paper min-h-screen p-6">Spiral doorway not found.</main>;
  }

  function update(key: RunKey, next: RunState) {
    setRuns((prev) => {
      const merged = { ...prev, [key]: next };
      const records = [merged.A.record, merged.B.record].filter(
        (r): r is LabRunRecord => r !== null,
      );
      persistLabRuns(records);
      return merged;
    });
  }

  function begin(key: RunKey) {
    const record = startRun(doorway!, `Run ${key}`);
    const sequence = buildSequence(doorway!, {});
    const first = sequence[0];
    update(key, {
      answers: {},
      record: first ? logQuestionShown(record, first, 1) : record,
      finished: false,
    });
  }

  function answer(key: RunKey, question: Question, step: number, choiceId: string) {
    const state = runs[key];
    if (!state.record) return;
    const answers: AnswerMap = { ...state.answers, [question.id]: choiceId };
    // Changing an answer invalidates everything the old answer opened after it.
    const oldSequence = buildSequence(doorway!, state.answers);
    for (const later of oldSequence.slice(step)) delete answers[later.id];

    let record = logChoiceSelected(state.record, question, choiceId, step);
    const nextSequence = buildSequence(doorway!, answers);
    const next = nextSequence[step];
    if (next) record = logQuestionShown(record, next, step + 1);

    update(key, { answers, record, finished: false });
  }

  function finish(key: RunKey) {
    const state = runs[key];
    if (!state.record) return;
    const sequence = buildSequence(doorway!, state.answers);
    let record = state.record;
    sequence.forEach((question, i) => {
      record = logQuestionShown(record, question, i + 1);
      if (!state.answers[question.id]) record = logAnswerMissing(record, question.id, i + 1);
    });
    const result = evaluatePattern(sequence, state.answers);
    record = endRun(record, result.primary ?? null, result.supporting);
    update(key, { ...state, record, finished: true });
  }

  /** Research control: copy Run A's recorded answer vector verbatim into Run B. */
  function cloneAintoB() {
    const source = runs.A.record;
    if (!source) return;
    const vector = reconstructAnswerVector(source).filter((row) => row.choiceId);
    let record = startRun(doorway!, "Run B");
    const answers: AnswerMap = {};
    for (const row of vector) {
      const sequence = buildSequence(doorway!, answers);
      const step = sequence.findIndex((q) => q.id === row.questionId);
      const question = step >= 0 ? sequence[step] : undefined;
      if (!question || !row.choiceId) break;
      record = logQuestionShown(record, question, step + 1);
      record = logChoiceSelected(record, question, row.choiceId, step + 1);
      answers[question.id] = row.choiceId;
    }
    const nextSequence = buildSequence(doorway!, answers);
    nextSequence.forEach((question, i) => {
      record = logQuestionShown(record, question, i + 1);
    });
    update("B", { answers, record, finished: false });
  }

  function resetAll() {
    setRuns({ A: EMPTY, B: EMPTY });
    persistLabRuns([]);
  }

  const records = [runs.A.record, runs.B.record].filter((r): r is LabRunRecord => r !== null);
  const diff = runs.A.record && runs.B.record ? diffRuns(runs.A.record, runs.B.record) : null;

  return (
    <main className="paper min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <p className="eyebrow">Gabriel's Lab — research only</p>
        <h1 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
          Spiral answer-perturbation fixture
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-olive-soft">
          Contract V1 capture of two paired Spiral traversals. Questions, wording, branching and
          scoring come unchanged from the production engine; this surface only records what was
          displayed and what was selected. Nothing here writes to the production reading history.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button type="button" onClick={cloneAintoB} className="lab-btn" disabled={!runs.A.record}>
            Clone Run A → Run B
          </button>
          <button
            type="button"
            onClick={() => downloadJson("gabriel-lab-spiral-pair.json", toJson(records))}
            className="lab-btn"
            disabled={records.length === 0}
          >
            Download raw JSON
          </button>
          <button type="button" onClick={() => setShowRaw((v) => !v)} className="lab-btn">
            {showRaw ? "Hide raw records" : "Show raw records"}
          </button>
          <button type="button" onClick={resetAll} className="lab-btn">
            Reset both runs
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {(["A", "B"] as RunKey[]).map((key) => (
            <RunPane
              key={key}
              runKey={key}
              state={runs[key]}
              sequence={sequences[key]}
              result={results[key]}
              onBegin={() => begin(key)}
              onAnswer={(question, step, choiceId) => answer(key, question, step, choiceId)}
              onFinish={() => finish(key)}
            />
          ))}
        </div>

        {diff ? (
          <section className="card-cream mt-6 p-5 sm:p-7">
            <h2 className="font-display text-lg">Controlled-pair diff</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Derived from raw events only. Changed answers: {diff.changedCount}
              {diff.divergedAtStep ? ` · first divergence at step ${diff.divergedAtStep}` : ""}
            </p>
            <p
              className={`mt-3 rounded-xl border px-4 py-2.5 text-sm ${
                diff.controlled
                  ? "border-teal/40 bg-teal/8 text-foreground"
                  : "border-hairline bg-background/50 text-olive-soft"
              }`}
            >
              {diff.controlled
                ? "CONTROLLED: exactly one answered question differs between Run A and Run B."
                : "NOT CONTROLLED: the pair differs in zero or more than one place, or the traversals are not aligned."}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {diff.rows.map((row) => (
                <li
                  key={`${row.step}-${row.questionId}`}
                  className={`border-l-2 pl-3 ${
                    row.status === "same" ? "border-hairline" : "border-gold"
                  }`}
                >
                  <p className="text-xs text-muted-foreground">
                    Step {row.step} · {row.questionId} · {row.status}
                  </p>
                  <p className="text-sm text-foreground">{row.prompt}</p>
                  <p className="mt-0.5 text-xs text-olive-soft">
                    A: {row.a?.choiceLabel ?? "—"} ({row.a?.choiceId ?? "none"})
                  </p>
                  <p className="text-xs text-olive-soft">
                    B: {row.b?.choiceLabel ?? "—"} ({row.b?.choiceId ?? "none"})
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {showRaw
          ? records.map((record) => (
              <section key={record.runId} className="card-cream mt-4 p-5">
                <h2 className="font-display text-lg">
                  {record.label} — raw Contract V1 record
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  runId {record.runId} · {record.events.length} events
                </p>
                <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-background/60 p-3 text-[11px] leading-relaxed">
                  {JSON.stringify(record, null, 2)}
                </pre>
                <h3 className="mt-4 font-display text-base">
                  Reconstructed answer vector (from raw events only)
                </h3>
                <ol className="mt-2 flex flex-col gap-1 text-xs text-olive-soft">
                  {reconstructAnswerVector(record).map((row) => (
                    <li key={`${row.step}-${row.questionId}`}>
                      {row.step}. {row.questionId} →{" "}
                      {row.missing ? "MISSING" : `${row.choiceId} · ${row.choiceLabel}`}
                    </li>
                  ))}
                </ol>
              </section>
            ))
          : null}
      </div>
    </main>
  );
}

function RunPane({
  runKey,
  state,
  sequence,
  result,
  onBegin,
  onAnswer,
  onFinish,
}: {
  runKey: RunKey;
  state: RunState;
  sequence: Question[];
  result: ReturnType<typeof evaluatePattern> | null;
  onBegin: () => void;
  onAnswer: (question: Question, step: number, choiceId: string) => void;
  onFinish: () => void;
}) {
  const snapshot = state.record ? runEndSnapshot(state.record) : null;
  const answeredAll = sequence.length > 0 && sequence.every((q) => state.answers[q.id]);

  return (
    <section className="card-cream p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg">Run {runKey}</h2>
        {state.record ? (
          <p className="text-[11px] text-muted-foreground">{state.record.runId}</p>
        ) : null}
      </div>

      {!state.record ? (
        <button type="button" onClick={onBegin} className="lab-btn mt-4">
          Start Run {runKey}
        </button>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-4">
            {sequence.map((question, i) => (
              <div key={question.id}>
                <p className="text-xs text-muted-foreground">
                  Step {i + 1} · {question.id}
                </p>
                <p className="mt-0.5 text-sm text-foreground">{question.prompt}</p>
                {question.note ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{question.note}</p>
                ) : null}
                <div className="mt-2 flex flex-col gap-1.5">
                  {question.choices.map((choice) => {
                    const selected = state.answers[question.id] === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onAnswer(question, i + 1, choice.id)}
                        className={`rounded-lg border px-3 py-2 text-left text-xs leading-snug transition-colors ${
                          selected
                            ? "border-teal bg-teal/10"
                            : "border-hairline bg-background/50 hover:border-teal/60"
                        }`}
                      >
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onFinish}
            disabled={!answeredAll}
            className="lab-btn mt-5"
          >
            Close Run {runKey} and record result
          </button>

          {result && snapshot ? (
            <div className="mt-4 rounded-xl border border-teal/30 bg-teal/8 px-4 py-3 text-sm">
              <p className="text-foreground">
                Primary:{" "}
                {snapshot.primary
                  ? `${snapshot.primary} ${NUMBERS[snapshot.primary].name}`
                  : "Undetermined"}
              </p>
              <p className="mt-1 text-xs text-olive-soft">
                Supporting:{" "}
                {snapshot.supporting.length
                  ? snapshot.supporting.map((n) => `${n} ${NUMBERS[n].name}`).join(", ")
                  : "none"}
              </p>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
