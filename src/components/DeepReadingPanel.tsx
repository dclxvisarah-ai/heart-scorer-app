import type { DeepReading } from "@/lib/deep-reading";

/**
 * Presentation only. Every line comes from `buildDeepReading`, which reads the
 * already-computed result. Nothing is calculated or decided here.
 */
export function DeepReadingPanel({ reading }: { reading: DeepReading }) {
  return (
    <div className="card-cream p-5 sm:p-7">
      <p className="eyebrow">What this may actually be</p>

      <p className="mt-3 font-display text-lg leading-snug sm:text-xl">{reading.lead}</p>

      {reading.support ? (
        <p className="mt-3 text-sm leading-relaxed text-olive-soft">{reading.support}</p>
      ) : null}

      {reading.companions.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {reading.companions.map((line) => (
            <li key={line} className="border-l-2 border-gold/60 pl-3 text-sm leading-relaxed text-foreground">
              {line}
            </li>
          ))}
        </ul>
      ) : null}

      {reading.recognitions.length > 0 ? (
        <div className="mt-5 rounded-xl border border-teal/30 bg-teal/8 px-4 py-3">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Questions worth sitting with
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {reading.recognitions.map((q) => (
              <li key={q} className="text-sm leading-relaxed text-foreground">
                {q}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{reading.closing}</p>
    </div>
  );
}
