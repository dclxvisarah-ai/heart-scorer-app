/**
 * Kept next to every result. The number is a reflection lens, never a
 * measurement, a diagnosis, or a permanent type.
 */
export function FramingNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-olive-soft ${className}`}
    >
      <span className="font-medium text-foreground">How to hold this.</span> The number comes from
      the pattern in your own answers about this situation, right now. It is not a measurement, a
      diagnosis, or a verdict — and it is not a personality type. Every number is useful
      information about what your mind is doing in this moment.
    </p>
  );
}
