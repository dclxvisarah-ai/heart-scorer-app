import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { DevPreviewBanner } from "@/components/DevPreviewBanner";
import { FramingNote } from "@/components/FramingNote";
import { NumberPanel } from "@/components/NumberPanel";
import {
  DOORWAYS,
  FRAMING_LINES,
  NEXT_STEPS,
  NUMBERS,
  UNDETERMINED_NEXT,
  buildSequence,
  evaluatePattern,
  getDeeperProbe,
  getNineBridge,

  getDoorway,
  type AnswerMap,
  type Question,
} from "@/lib/gabriel";
import { loadHistory, newId, saveEntry, type HistoryEntry } from "@/lib/history";
import { getResultNarrative } from "@/lib/result-narrative";
import {
  UrgeTimer,
  UrgeTimerStrip,
  urgeTimerIntro,
  useUrgeTimer,
} from "@/components/UrgeTimer";


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

type Stage = "start" | "questions" | "result";

function GabrielsNumberPage() {
  const [stage, setStage] = useState<Stage>("start");
  const [doorwayId, setDoorwayId] = useState<string | undefined>();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [savedId, setSavedId] = useState<string | undefined>();
  /** Reworded probes the person opted into from an undetermined result. */
  const [deeperIds, setDeeperIds] = useState<string[]>([]);
  const [leftHere, setLeftHere] = useState(false);
  /**
   * Behavioural-support timer. Session-level state only — never read by the
   * scoring engine and never saved as evidence.
   */
  const urgeTimer = useUrgeTimer();


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
    setLeftHere(false);
    urgeTimer.reset();

  }

  function choose(questionId: string, choiceId: string) {
    const next = { ...answers, [questionId]: choiceId };
    // Changing an answer invalidates anything answered after this question,
    // since later questions can depend on this branch.
    for (const q of sequence.slice(index + 1)) delete next[q.id];

    const nextSequence = doorway ? buildSequence(doorway, next, deeperIds) : [];
    // Current-run isolation: the result may only ever quote answers that are
    // still on the live path. Any answer whose question is no longer part of
    // the path this run actually walked is dropped here, so a changed branch
    // can never leave a stale selection behind for the result page to cite.
    const livePath = new Set(nextSequence.map((q) => q.id));
    for (const key of Object.keys(next)) {
      if (!livePath.has(key)) delete next[key];
    }

    setAnswers(next);
    setSavedId(undefined);

    if (index + 1 >= nextSequence.length) {
      setStage("result");
    } else {
      setIndex(index + 1);
    }
  }

  /**
   * Opens one more question — the same underlying dimension, worded another
   * way — aimed at whichever numbers the answers are tied between.
   */
  function goDeeper() {
    if (!doorway || !result) return;
    const probe = getDeeperProbe(result.contested, deeperIds);
    if (!probe) return;
    setDeeperIds([...deeperIds, probe.id]);
    setLeftHere(false);
    setIndex(sequence.length);
    setSavedId(undefined);
    setStage("questions");
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
  /** Reconnects the result to the way the person actually came in. */
  const firstAnswerLabel = (() => {
    const first = sequence[0];
    if (!first) return undefined;
    const chosen = first.choices.find((c) => c.id === answers[first.id]);
    return chosen ? `${first.prompt} — ${chosen.label}` : undefined;
  })();
  const nextProbe = result && !result.primary ? getDeeperProbe(result.contested, deeperIds) : undefined;
  /** Branch- and response-specific result narrative for numbers 1–8. */
  const narrative =
    result?.primary && result.primary !== 9
      ? getResultNarrative(doorway?.id, result.primary, result.contributions)
      : undefined;
  /** Response-pattern summary for the 9 result (presentation only). */
  const nineSummary =
    result?.primary === 9
      ? (() => {
          const quoted = result.contributions
            .map((c) => c.choiceLabel)
            .filter(Boolean)
            .slice(0, 2);
          return quoted.length > 0
            ? `The answers that carried this: ${quoted.map((q) => `“${q}”`).join(" and ")}.`
            : undefined;
        })()
      : undefined;

  return (
    <main className="paper min-h-screen">
      <DevPreviewBanner />
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
                    setStage("questions");
                  }}
                  className="group rounded-xl border border-hairline bg-background/50 px-4 py-3.5 text-left transition-colors hover:border-teal/60 hover:bg-teal/5"
                >
                  <span className="block text-sm leading-snug text-foreground sm:text-base">
                    {option.label}
                  </span>
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

        {stage === "questions" && current && doorway ? (
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
              <p className="text-xs text-muted-foreground">
                {index + 1} of {sequence.length}
              </p>
            </div>

            <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-cream-deep">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500"
                style={{ width: `${((index + 1) / sequence.length) * 100}%` }}
              />
            </div>

            {(() => {
              const intro = urgeTimerIntro(doorway.id);
              if (!intro) return null;
              return index === 0 ? (
                <div className="mt-4">
                  <UrgeTimer timer={urgeTimer} intro={intro} />
                </div>
              ) : (
                <UrgeTimerStrip timer={urgeTimer} />
              );
            })()}



            {current.rebuild ? (
              <p className="mt-4 rounded-lg border border-gold/60 bg-gold/10 px-3 py-2 text-[11px] leading-relaxed tracking-wide text-olive-soft uppercase">
                Requires rebuild — internal flag
              </p>
            ) : null}

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


        {stage === "result" && result && doorway ? (
          <section className="animate-rise flex flex-col gap-4">
            <div className="card-cream p-5 sm:p-7">
              <p className="eyebrow">You came in with</p>
              <p className="mt-1 font-display text-lg leading-snug sm:text-xl">
                “{doorway.label}”
              </p>
              {firstAnswerLabel ? (
                <p className="mt-1 text-sm text-olive-soft">{firstAnswerLabel}</p>
              ) : null}

              {result.primary ? (
                <>
                  <p className="eyebrow mt-6">Your Gabriel Number</p>
                  <div className="mt-2 flex items-baseline gap-4">
                    <span className="numeral text-6xl text-teal sm:text-7xl">{result.primary}</span>
                    <div>
                      <p className="font-display text-xl leading-tight sm:text-2xl">
                        {NUMBERS[result.primary].name}
                      </p>
                      <p className="mt-0.5 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                        {NUMBERS[result.primary].tree}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-foreground">
                    {NUMBERS[result.primary].meaning}
                  </p>
                  {result.primary === 9 ? (
                    <div className="mt-4 rounded-xl border border-gold/50 bg-gold/10 px-4 py-3">
                      <p className="text-sm leading-relaxed text-foreground">
                        {getNineBridge(doorway.id).human}
                      </p>
                      {nineSummary ? (
                        <p className="mt-2 text-sm leading-relaxed text-olive-soft">{nineSummary}</p>
                      ) : null}
                      <p className="mt-3 font-display text-lg leading-snug">
                        {getNineBridge(doorway.id).question}
                      </p>
                    </div>
                  ) : null}
                  <div className="mt-4 rounded-xl border border-teal/30 bg-teal/8 px-4 py-3">
                    <p className="eyebrow">The clarity you're missing</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                      {NUMBERS[result.primary].lesson}
                    </p>
                    {narrative ? (
                      <>
                        <p className="mt-3 text-sm leading-relaxed text-foreground">
                          {narrative.clarity}
                        </p>
                        {narrative.patternSummary ? (
                          <p className="mt-2 text-sm leading-relaxed text-olive-soft">
                            {narrative.patternSummary}
                          </p>
                        ) : null}
                      </>
                    ) : null}
                  </div>

                </>
              ) : (
                <>
                  <p className="eyebrow mt-6">Your Gabriel Number</p>
                  <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
                    Undetermined — and that is an honest answer, not a failure.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground">{result.reasoning}</p>
                  {result.contested.length > 1 ? (
                    <p className="mt-3 text-sm leading-relaxed text-olive-soft">
                      At the moment the answers lean toward{" "}
                      {result.contested
                        .map((n) => `${n} ${NUMBERS[n].name}`)
                        .join(", ")
                        .replace(/, ([^,]*)$/, " and $1")}{" "}
                      at once — a real state, not a failed reading.
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    {UNDETERMINED_NEXT.human}
                  </p>


                  {leftHere ? (
                    <p className="mt-4 rounded-xl border border-hairline bg-background/50 px-4 py-3 text-sm leading-relaxed text-olive-soft">
                      Left here. Undetermined is a legitimate place to stop.
                    </p>
                  ) : nextProbe ? (
                    <div className="mt-5 rounded-xl border border-teal/30 bg-teal/8 p-4">
                      <p className="text-sm leading-relaxed text-foreground">
                        There's one more question that would help separate them — the same ground,
                        asked another way. It's still multiple choice, and you can stop instead.
                      </p>
                      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <button
                          type="button"
                          onClick={goDeeper}
                          className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-teal px-5 text-sm font-medium text-teal-foreground transition-opacity hover:opacity-90"
                        >
                          Go one layer deeper
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeftHere(true)}
                          className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-hairline bg-cream px-5 text-sm text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
                        >
                          Leave it here
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={restart}
                        className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Start over with a different way in
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl border border-hairline bg-background/50 p-4">
                      <p className="text-sm leading-relaxed text-foreground">
                        You've gone as deep as this situation goes today, and it's still pointing in
                        more than one direction. That's allowed to stand — there is no wrong number
                        and no wrong answer.
                      </p>
                      <button
                        type="button"
                        onClick={restart}
                        className="mt-3 text-xs text-olive-soft underline-offset-4 hover:underline"
                      >
                        Start over with a different way in
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {result.primary ? (
              <div className="card-cream p-5 sm:p-7">
                <h3 className="font-display text-lg">Why the pattern led there</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground">{result.reasoning}</p>
                {result.contributions.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-3">
                    {result.contributions.map((contribution, i) => (
                      <li key={i} className="border-l-2 border-gold/60 pl-3">
                        <p className="text-xs text-muted-foreground">
                          {contribution.questionPrompt}
                        </p>
                        <p className="mt-0.5 text-sm text-foreground">
                          {contribution.choiceLabel}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {(() => {
              const step = result.primary ? NEXT_STEPS[result.primary] : UNDETERMINED_NEXT;
              const question = narrative?.question ?? step.question;
              const advice = narrative?.advice ?? step.advice;
              return (
                <div className="card-cream p-5 sm:p-7">
                  <h3 className="font-display text-lg">What to look at next</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{step.human}</p>
                  <p className="mt-4 rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-foreground">
                    <span className="font-medium">Carry this question with you.</span>{" "}
                    {question}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-olive-soft">{advice}</p>
                </div>
              );
            })()}


            {result.supporting.length > 0 ? (
              <div className="card-cream p-5 sm:p-7">
                <h3 className="font-display text-lg">
                  {result.primary ? "Also present" : "Threads that showed up"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Supporting patterns — quieter, but there in your answers.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {result.supporting.map((n) => (
                    <NumberPanel key={n} n={n} />
                  ))}
                </div>
              </div>
            ) : null}

            {doorway.id === "bet" ? (
              <div className="rounded-xl border border-terracotta/40 bg-terracotta/5 px-5 py-4">
                <p className="text-sm leading-relaxed text-foreground">
                  If you're in the middle of the urge right now, you don't have to solve the whole
                  situation. Creating some distance before the next decision can give you back a
                  choice.
                </p>
              </div>
            ) : null}

            <FramingNote />


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
