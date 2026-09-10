import type { RelationalState } from "@/lib/relational-state";

const STATUS_COPY: Record<RelationalState["status"], string> = {
  resolved: "Resolved — the active territories hold together.",
  "partially resolved": "Partially resolved — part of this state is connected, part is still loose.",
  unresolved: "Unresolved — the territories are active but not yet separated.",
};

/**
 * Presentation only. Every line here comes from `deriveRelationalState`, which
 * reads the same answers the number was scored from. Nothing is calculated here.
 */
export function RelationalStatePanel({ state }: { state: RelationalState }) {
  if (state.territories.length === 0) return null;

  return (
    <div className="card-cream p-5 sm:p-7">
      <p className="eyebrow">Relational state</p>

      <h3 className="mt-2 font-display text-xl leading-snug sm:text-2xl">{state.coordinateLabel}</h3>
      <p className="mt-1 text-xs tracking-[0.14em] text-muted-foreground uppercase">
        Active semantic territories
      </p>

      <p className="mt-4 text-sm leading-relaxed text-foreground">{state.summary}</p>

      <p className="mt-3 rounded-xl border border-teal/30 bg-teal/8 px-4 py-3 text-sm leading-relaxed text-foreground">
        <span className="font-medium">Resolution status.</span> {STATUS_COPY[state.status]}
      </p>

      <div className="mt-6">
        <h4 className="font-display text-base">Territories in play</h4>
        <div className="mt-3 flex flex-col gap-3">
          {state.territories.map((t) => (
            <div key={t.n} className="border-l-2 border-gold/60 pl-3">
              <p className="text-sm text-foreground">
                <span className="numeral text-terracotta">{t.n}</span> {t.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.structuralQuestion}</p>
              {t.snippets.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {t.snippets.slice(0, 3).map((s, i) => (
                    <li key={`${t.n}-${s.questionId}-${i}`} className="text-sm text-olive-soft">
                      “{s.choiceLabel}”{" "}
                      <span className="text-xs text-muted-foreground">
                        ({s.roles[t.n] === "leading" ? "leading" : "underneath"})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-display text-base">What your answers actually connect</h4>
        {state.relationships.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-3">
            {state.relationships.map((r) => (
              <li
                key={`${r.pair[0]}-${r.pair[1]}`}
                className="rounded-xl border border-hairline bg-background/50 px-4 py-3"
              >
                <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  {r.pair[0]} × {r.pair[1]}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{r.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-olive-soft">
            No single answer of yours carried two of these territories at once, so nothing here is
            being called a connection.
          </p>
        )}

        {state.unsupportedPairs.length > 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Active side by side, but not connected by your answers:{" "}
            {state.unsupportedPairs.map(([a, b]) => `${a} × ${b}`).join(", ")}. Shared vocabulary on
            its own doesn't count as a connection.
          </p>
        ) : null}
      </div>

    </div>
  );
}
