/**
 * The scoring model is provisional. This note keeps that explicit wherever a
 * figure is shown, so no number reads as a measurement or a verdict.
 */
export function ProvisionalNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-olive-soft ${className}`}
    >
      <span className="font-medium text-foreground">A reflection tool.</span> The evaluated figure
      is built from your own answers and is meant to support reflection. It is not a measurement, a
      diagnosis, or a verdict — and it does not interpret what the number means.
    </p>
  );
}
