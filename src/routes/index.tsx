import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { PersonalizedReflection } from "@/components/PersonalizedReflection";
import { RightNow } from "@/components/RightNow";
import { buildPersonalizedReflection } from "@/lib/personalized-reflection";
import { deriveRelationalState } from "@/lib/relational-state";
import {
  DOORWAYS,
  FRAMING_LINES,
  buildSequence,
  evaluatePattern,
  getDoorway,
  type AnswerMap,
  type Question,
} from "@/lib/gabriel";
import { loadHistory, newId, saveEntry, type HistoryEntry } from "@/lib/history";

const TITLE = "What's Gabriel's Number? Vol. 2";
const DESCRIPTION =
  "Bring whatever is actually going on. A few short, honest questions, and a number emerges from the pattern in your answers — no right answer, no wrong number.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${TITLE} — a reflection lens for real situations` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GabrielsNumberPage,
});

type Stage = "start" | "release" | "questions" | "result";

/** Branches that open with the optional, unscored release panel. */
const RELEASE_DOORWAYS = new Set(["fire"]);

function GabrielsNumberPage() {
  const [stage, setStage] = useState<Stage>("start");
  // RIGHT NOW overlay: de-escalation only, never scored. Question position
  // (index/answers) is untouched while it is open.
  const [rightNowOpen, setRightNowOpen] = useState(false);
  const [doorwayId, setDoorwayId] = useState<string | undefined>();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [savedId, setSavedId] = useState<string | undefined>();
  /** Reworded probes the person opted into from an undetermined result. */
  const [deeperIds, setDeeperIds] = useState<string[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const doorway = getDoorway(doorwayId);

  const sequence: Question[] = useMemo(
    () => (doorway ? buildSequence(doorway, answers, deeperIds) : []),
    [doorway, answers, deeperIds],
  );

  const result = useMemo(
    () => (stage === "result" ? evaluatePattern(sequence, answers) : undefined),
    [stage, sequence, answers],
  );

  /** Read-only layer over the same sequence/answers the number came from. */
  const relational = useMemo(
    () => (result ? deriveRelationalState(sequence, answers, result) : undefined),
    [result, sequence, answers],
  );

  const reflection = useMemo(
    () => (result ? buildPersonalizedReflection(result, relational ?? null) : null),
    [result, relational],
  );

  useEffect(() => {
    if (stage !== "result" || !result || !doorway) return;
    const id = `${doorway.id}-${Object.keys(answers).length}`;
    if (savedId === id) return;
    setSavedId(id);
    setHistory(
      saveEntry({
        id: newId(),
        createdAt: new Date().toISOString(),
        doorwayId: doorway.id,
        doorwayLabel: doorway.label,
        primary: result.primary ?? null,
        supporting: result.supporting,
        reasoning: result.reasoning,
      }),
    );
  }, [stage, result, doorway, answers, savedId]);

  function restart() {
    setStage("start");
    setDoorwayId(undefined);
    setAnswers({});
    setIndex(0);
    setSavedId(undefined);
    setDeeperIds([]);
    setRightNowOpen(false);
  }

  function choose(questionId: string, choiceId: string) {
    const next = { ...answers, [questionId]: choiceId };
    // Changing an answer invalidates anything answered after this question,
    // since later questions can depend on this branch.
    for (const q of sequence.slice(index + 1)) delete next[q.id];
    setAnswers(next);
    setSavedId(undefined);

    const nextSequence = doorway ? buildSequence(doorway, next, deeperIds) : [];
    if (index + 1 >= nextSequence.length) {
      setStage("result");
    } else {
      setIndex(index + 1);
    }
  }

  function goBack() {
    if (stage === "result") {
      setStage("questions");
      setIndex(Math.max(sequence.length - 1, 0));
      setSavedId(undefined);
      return;
    }
    if (index > 0) setIndex(index - 1);
  }


  const current = sequence[index];
  return (
    <main className="paper min-h-screen">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12">
        <header className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Gabriel's Number™</p>
            <h1 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
              What's Gabriel's Number?{" "}
              <span className="text-olive-soft">Vol. 2</span>
            </h1>
          </div>
          <Link
            to="/readings"
            className="mt-1 shrink-0 rounded-full border border-hairline bg-cream px-3 py-1.5 text-xs text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
          >
            Readings
          </Link>
        </header>

        {stage === "start" ? (
          <section className="card-cream animate-fade-in p-5 sm:p-7">
            <h2 className="rule-gold font-display text-xl sm:text-2xl">What's going on?</h2>
            <p className="mt-4 text-sm leading-relaxed text-olive-soft">
              Pick whatever is closest to true right now — casual, serious, or barely formed. A few
              short questions follow, and a number emerges from the pattern in your answers.
            </p>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm text-olive-soft">
              {FRAMING_LINES.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5">
              {DOORWAYS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setDoorwayId(option.id);
                    setAnswers({});
                    setIndex(0);
                    setSavedId(undefined);
                    setStage(RELEASE_DOORWAYS.has(option.id) ? "release" : "questions");
                  }}
                  className="group rounded-xl border border-hairline bg-background/50 px-4 py-3.5 text-left transition-colors hover:border-teal/60 hover:bg-teal/5"
                >
                  <span className="block text-sm leading-snug text-foreground sm:text-base">
                    {option.label}
                  </span>
                  {option.researchLayer ? (
                    <span className="mt-1 inline-block rounded-full border border-teal/40 bg-teal/10 px-2 py-0.5 text-[10px] tracking-[0.12em] text-teal uppercase">
                      {option.researchLayer}
                    </span>
                  ) : null}
                  <span className="mt-0.5 block text-xs text-muted-foreground">{option.sub}</span>
                </button>

              ))}
            </div>

            {history.length > 0 ? (
              <p className="mt-6 text-xs text-muted-foreground">
                You have {history.length} saved reading{history.length === 1 ? "" : "s"} on this
                device.{" "}
                <Link to="/readings" className="text-teal underline-offset-4 hover:underline">
                  Look back
                </Link>
              </p>
            ) : null}
          </section>
        ) : null}

        {stage === "release" && doorway ? (
          <RightNow onExit={() => setStage("questions")} exitLabel="GO TO THE FIRE (the investigation)" />
        ) : null}

        {stage === "questions" && rightNowOpen && doorway ? (
          <RightNow
            onExit={() => setRightNowOpen(false)}
            exitLabel={`RETURN TO THE FIRE — QUESTION ${index + 1}`}
          />
        ) : null}

        {stage === "questions" && !rightNowOpen && current && doorway ? (
          <section className="card-cream animate-rise p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back to the previous question"
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background/60 px-3 py-1.5 text-xs text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
                  >
                    <span aria-hidden>←</span> Back
                  </button>
                ) : null}
                <p className="eyebrow">{doorway.label}</p>
              </div>
              <div className="flex items-center gap-2">
                {RELEASE_DOORWAYS.has(doorway.id) ? (
                  <button
                    type="button"
                    onClick={() => setRightNowOpen(true)}
                    className="rounded-full border border-terracotta/60 bg-terracotta/10 px-3 py-1.5 text-[11px] tracking-wide text-foreground uppercase transition-colors hover:bg-terracotta/20"
                  >
                    🔥 Right now — de-escalate
                  </button>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  {index + 1} of {sequence.length}
                </p>
              </div>
            </div>

            <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-cream-deep">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500"
                style={{ width: `${((index + 1) / sequence.length) * 100}%` }}
              />
            </div>

            <h2 className="mt-5 font-display text-xl leading-snug sm:text-2xl">{current.prompt}</h2>
            {current.note ? (
              <p className="mt-2 text-sm text-muted-foreground">{current.note}</p>
            ) : null}

            <div className="mt-5 flex flex-col gap-2.5">
              {current.choices.map((choice) => {
                const selected = answers[current.id] === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => choose(current.id, choice.id)}
                    className={`rounded-xl border px-4 py-3.5 text-left text-sm leading-snug text-foreground transition-colors sm:text-base ${
                      selected
                        ? "border-teal bg-teal/10"
                        : "border-hairline bg-background/50 hover:border-teal/60 hover:bg-teal/5"
                    }`}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={index === 0 ? restart : goBack}
                className="text-xs text-olive-soft underline-offset-4 hover:underline"
              >
                {index === 0 ? "Back to the start" : "Previous question"}
              </button>
              <button
                type="button"
                onClick={restart}
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Start over
              </button>
            </div>
          </section>
        ) : null}


        {stage === "result" && result && doorway && reflection ? (
          <section className="animate-rise flex flex-col gap-4">
            <PersonalizedReflection result={result} reflection={reflection} />

            <button
              type="button"
              onClick={goBack}
              className="self-start text-xs text-olive-soft underline-offset-4 hover:underline"
            >
              ← Back to the last question
            </button>



            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={restart}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-teal px-6 text-sm font-medium text-teal-foreground transition-opacity hover:opacity-90"
              >
                Try another question
              </button>
              <Link
                to="/readings"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-hairline bg-cream px-6 text-sm text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
              >
                See past readings
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
