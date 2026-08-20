/**
 * Development-preview warning banner.
 *
 * Presentation-only: shows a red-tinted notice at the top of the public
 * preview so visitors know the app is an active build, not the finished
 * product. It does not touch any branch logic, scoring, or framework.
 */
export function DevPreviewBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full border-b border-terracotta/40 bg-terracotta/12 px-4 py-2.5 sm:py-3"
    >
      <div className="mx-auto flex w-full max-w-2xl items-start gap-2.5 sm:items-center">
        <span
          aria-hidden
          className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-terracotta sm:mt-0"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta sm:text-xs">
            Development preview — active build
          </p>
          <p className="mt-0.5 text-xs leading-snug text-foreground/90 sm:text-[13px]">
            This app is still under construction. Some branches, questions,
            scoring, and results are being tested and may change. This preview
            is not the finished product.
          </p>
        </div>
      </div>
    </div>
  );
}
