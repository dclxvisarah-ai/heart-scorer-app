import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ProvisionalNote } from "@/components/ProvisionalNote";
import { getBranch } from "@/lib/evaluator";
import {
  clearHistory,
  deleteEntry,
  formatGap,
  formatWhen,
  loadHistory,
  type HistoryEntry,
} from "@/lib/history";

const TITLE = "Evaluation History — Gabriel's Number Clarity Evaluator";
const DESCRIPTION =
  "Your saved clarity evaluations, kept on this device only: felt reading, evaluated figure, Clarity Gap and reflection for each pass.";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Evaluation History" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [openId, setOpenId] = useState<string | undefined>();

  useEffect(() => {
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  return (
    <main className="paper min-h-screen">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Gabriel's Number</p>
            <h1 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
              Evaluation History
            </h1>
          </div>
          <Link
            to="/"
            className="mt-1 shrink-0 rounded-full border border-hairline bg-cream px-3 py-1.5 text-xs text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
          >
            Evaluator
          </Link>
        </header>

        <section className="card-cream p-5 sm:p-7">
          <p className="text-sm leading-relaxed text-olive-soft">
            Saved evaluations stay on this device and are never sent anywhere. Each row records the
            reading you gave by feel, the evaluated figure, and the Clarity Gap between
            them.
          </p>
          <ProvisionalNote className="mt-4" />

          {!hydrated ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
          ) : history.length === 0 ? (
            <div className="mt-6 rounded-xl border border-hairline bg-background/40 px-4 py-6 text-center">
              <p className="text-sm text-olive-soft">No saved evaluations yet.</p>
              <Link
                to="/"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-teal px-6 text-sm font-medium text-teal-foreground transition-opacity hover:opacity-90"
              >
                Start an evaluation
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-6 flex flex-col gap-3">
                {history.map((entry) => {
                  const open = openId === entry.id;
                  const branch = getBranch(entry.branchId);
                  const aligned = entry.gapDirection === "aligned";
                  return (
                    <li
                      key={entry.id}
                      className="rounded-xl border border-hairline bg-background/40 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-base leading-snug text-foreground">
                            {entry.branchLabel || branch?.label || "Evaluation"}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatWhen(entry.createdAt)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p
                            className={`numeral text-2xl ${aligned ? "text-teal" : "text-terracotta"}`}
                          >
                            {formatGap(entry.clarityGap)}
                          </p>
                          <p className="text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase">
                            Gap
                          </p>
                        </div>
                      </div>

                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <div className="flex gap-1.5">
                          <dt className="text-muted-foreground">By feel</dt>
                          <dd className="numeral text-foreground">{entry.initial.toFixed(1)}</dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="text-muted-foreground">Evaluated</dt>
                          <dd className="numeral text-foreground">{entry.evaluated.toFixed(1)}</dd>
                        </div>
                      </dl>

                      {open ? (
                        <div className="mt-3 border-t border-hairline pt-3">
                          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                            <div className="flex gap-1.5">
                              <dt className="text-muted-foreground">General</dt>
                              <dd className="numeral text-foreground">
                                {entry.generalMean.toFixed(1)}
                              </dd>
                            </div>
                            <div className="flex gap-1.5">
                              <dt className="text-muted-foreground">Focused</dt>
                              <dd className="numeral text-foreground">
                                {entry.focusedMean.toFixed(1)}
                              </dd>
                            </div>
                          </dl>
                          {entry.reflection ? (
                            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-olive-soft">
                              {entry.reflection}
                            </p>
                          ) : (
                            <p className="mt-3 text-sm text-muted-foreground">
                              No reflection recorded.
                            </p>
                          )}
                        </div>
                      ) : null}

                      <div className="mt-3 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setOpenId(open ? undefined : entry.id)}
                          className="text-xs text-teal underline-offset-4 hover:underline"
                        >
                          {open ? "Hide detail" : "Show detail"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHistory(deleteEntry(entry.id));
                            toast.success("Evaluation removed");
                          }}
                          className="text-xs text-muted-foreground underline-offset-4 hover:text-terracotta hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => {
                  setHistory(clearHistory());
                  toast.success("History cleared");
                }}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-hairline px-5 text-sm text-olive-soft transition-colors hover:border-terracotta/60 hover:text-terracotta"
              >
                Clear all history
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
