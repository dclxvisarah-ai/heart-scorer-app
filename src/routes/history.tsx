import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  deleteEvaluation,
  formatEvaluationDate,
  loadEvaluations,
  type EvaluationRecord,
} from "../lib/evaluations";

const TITLE = "Past clarity evaluations — What's Gabriel's Number?";
const DESCRIPTION =
  "Review evaluations saved on this device: initial felt clarity, evaluated clarity, the Clarity Gap, alignment, branch and reflection.";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [entries, setEntries] = useState<EvaluationRecord[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadEvaluations());
  }, []);

  return (
    <main className="paper min-h-screen">
      <div className="mx-auto w-full max-w-2xl px-4 pb-4 pt-10 sm:px-6 sm:pt-14">
        <header className="text-center">
          <p className="eyebrow">History</p>
          <h1 className="mt-3 text-3xl leading-tight text-olive sm:text-4xl">Past evaluations</h1>
          <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground">
            Saved on this device only. Nothing is uploaded anywhere.
          </p>
          <div className="mt-5">
            <Link to="/" className="text-[0.8125rem] text-teal underline-offset-4 hover:underline">
              Start another evaluation
            </Link>
          </div>
        </header>

        <div className="mt-8 space-y-4">
          {entries.length === 0 ? (
            <section className="card-cream p-8 text-center">
              <p className="text-[0.9375rem] text-olive-soft">No evaluations saved yet.</p>
            </section>
          ) : null}

          {entries.map((entry) => {
            const open = openId === entry.id;
            return (
              <section key={entry.id} className="card-cream p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="eyebrow">{formatEvaluationDate(entry.createdAt)}</p>
                    <p className="mt-1.5 text-[0.9375rem] text-olive">{entry.branchLabel}</p>
                  </div>
                  <p className="numeral text-2xl text-olive">
                    {entry.initial} → {entry.evaluated.toFixed(1)}
                  </p>
                </div>

                <p className="mt-3 text-[0.8125rem] text-olive-soft">
                  Clarity Gap {entry.gap.toFixed(1)} · {entry.alignment}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : entry.id)}
                    className="rounded-full border border-hairline bg-cream px-4 py-2 text-[0.8125rem] text-olive transition-colors hover:bg-cream-deep"
                  >
                    {open ? "Hide" : "View"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntries(deleteEvaluation(entry.id))}
                    className="rounded-full border border-hairline bg-cream px-4 py-2 text-[0.8125rem] text-terracotta transition-colors hover:bg-cream-deep"
                  >
                    Delete
                  </button>
                </div>

                {open ? (
                  <div className="mt-5 space-y-5 border-t border-hairline pt-5 text-[0.875rem] leading-relaxed">
                    <div>
                      <p className="eyebrow">General evaluation</p>
                      <ul className="mt-2 space-y-1 text-olive-soft">
                        <li>Mental clarity: {entry.general.mentalClarity}</li>
                        <li>Emotional load: {entry.general.emotionalLoad}</li>
                        <li>Nervous system: {entry.general.nervousSystem}</li>
                        <li>Thought style: {entry.general.thoughtStyle}</li>
                        <li>Social tone: {entry.general.socialTone}</li>
                        <li>Observation vs. reaction: {entry.general.observation}</li>
                        <li>Known vs. felt: {entry.general.knownVsFelt}</li>
                      </ul>
                      {entry.general.mindframe.trim() ? (
                        <p className="mt-2 text-olive-soft">
                          Mindframe: {entry.general.mindframe}
                        </p>
                      ) : null}
                      {entry.general.avoiding.trim() ? (
                        <p className="mt-2 text-olive-soft">
                          Avoiding: {entry.general.avoiding}
                        </p>
                      ) : null}
                      {entry.general.steadyResponse.trim() ? (
                        <p className="mt-2 text-olive-soft">
                          Steady response: {entry.general.steadyResponse}
                        </p>
                      ) : null}
                    </div>

                    {entry.focused.some((item) => item.answer.trim()) ? (
                      <div>
                        <p className="eyebrow">Focused evaluation</p>
                        <ul className="mt-2 space-y-3">
                          {entry.focused
                            .filter((item) => item.answer.trim())
                            .map((item) => (
                              <li key={item.question}>
                                <p className="text-olive">{item.question}</p>
                                <p className="mt-1 text-olive-soft">{item.answer}</p>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.mismatchSources.length > 0 ? (
                      <div>
                        <p className="eyebrow">Possible sources of mismatch</p>
                        <ul className="mt-2 space-y-1 text-olive-soft">
                          {entry.mismatchSources.map((source) => (
                            <li key={source}>— {source}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.reflection.trim() ? (
                      <div>
                        <p className="eyebrow">Reflection</p>
                        <p className="mt-2 text-olive-soft">{entry.reflection}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
