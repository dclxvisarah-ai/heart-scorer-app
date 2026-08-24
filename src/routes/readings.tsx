import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FramingNote } from "@/components/FramingNote";
import { NUMBERS } from "@/lib/gabriel";
import {
  clearHistory,
  deleteEntry,
  formatWhen,
  loadHistory,
  type HistoryEntry,
} from "@/lib/history";

const TITLE = "Past readings — What's Gabriel's Number? Vol. 2";
const DESCRIPTION =
  "Your saved readings, kept on this device only: the situation you brought, the number that emerged, and why the pattern led there.";

export const Route = createFileRoute("/readings")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Past readings — Gabriel's Number" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReadingsPage,
});

function ReadingsPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  return (
    <main className="paper min-h-screen">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12">
        <header className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Gabriel's Number™</p>
            <h1 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">Past readings</h1>
          </div>
          <Link
            to="/"
            className="mt-1 shrink-0 rounded-full border border-hairline bg-cream px-3 py-1.5 text-xs text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
          >
            New reading
          </Link>
        </header>

        <section className="card-cream p-5 sm:p-7">
          <p className="text-sm leading-relaxed text-olive-soft">
            Readings stay on this device and are never sent anywhere. Each one records the situation
            you brought and the pattern that emerged from your answers at the time.
          </p>

          {!hydrated ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
          ) : history.length === 0 ? (
            <div className="mt-6 rounded-xl border border-hairline bg-background/40 px-4 py-6 text-center">
              <p className="text-sm text-olive-soft">No readings saved yet.</p>
              <Link
                to="/"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-teal px-6 text-sm font-medium text-teal-foreground transition-opacity hover:opacity-90"
              >
                Start one
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-6 flex flex-col gap-3">
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-xl border border-hairline bg-background/40 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm leading-snug text-foreground">
                          {entry.doorwayLabel || "A reading"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatWhen(entry.createdAt)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        {entry.primary ? (
                          <>
                            <p className="numeral text-3xl text-teal">{entry.primary}</p>
                            <p className="text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase">
                              {NUMBERS[entry.primary].name}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-olive-soft">Undetermined</p>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-olive-soft">
                      {entry.reasoning}
                    </p>

                    {entry.supporting?.length ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Also present:{" "}
                        {entry.supporting
                          .map((n) => `${n} · ${NUMBERS[n].name}`)
                          .join("   ")}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => {
                        setHistory(deleteEntry(entry.id));
                        toast.success("Reading removed");
                      }}
                      className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  setHistory(clearHistory());
                  toast.success("All readings cleared");
                }}
                className="mt-5 text-xs text-terracotta underline-offset-4 hover:underline"
              >
                Clear all readings
              </button>
            </>
          )}
        </section>

        <FramingNote className="mt-4" />
      </div>
    </main>
  );
}
