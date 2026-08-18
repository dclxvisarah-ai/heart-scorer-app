import { NUMBERS, type GNumber } from "@/lib/gabriel";

/** Compact presentation of one number: name, Tree of Life mapping, lesson. */
export function NumberPanel({ n, showLesson = true }: { n: GNumber; showLesson?: boolean }) {
  const meaning = NUMBERS[n];
  return (
    <div className="flex gap-4 rounded-xl border border-hairline bg-background/50 px-4 py-3.5">
      <span className="numeral shrink-0 text-3xl text-terracotta">{n}</span>
      <div className="min-w-0">
        <p className="font-display text-base leading-snug text-foreground">{meaning.name}</p>
        <p className="mt-0.5 text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase">
          {meaning.tree}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-olive-soft">{meaning.meaning}</p>
        {showLesson ? (
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            <span className="text-muted-foreground">Lesson — </span>
            {meaning.lesson}
          </p>
        ) : null}
      </div>
    </div>
  );
}
