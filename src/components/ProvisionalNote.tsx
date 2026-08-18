/**
 * The scoring model is provisional. This note keeps that explicit wherever a
 * figure is shown, so no number reads as a measurement or a verdict.
 */
export function ProvisionalNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-olive-soft ${className}`}
    >
      <span className="font-medium text-foreground">This figure is provisional.</span> It is a
      working estimate built from your own answers, meant to support reflection. It is not a
      measurement, a diagnosis, or a verdict — and it does not interpret what the number means.
    </p>
  );
}
