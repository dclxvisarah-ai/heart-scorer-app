/**
 * Site-wide copyright and attribution notice. Rendered once in the root
 * layout so it appears on every page automatically.
 */
export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-2xl px-4 pb-10 pt-6 sm:px-6">
      <div className="border-t border-hairline pt-5 text-center text-[0.6875rem] leading-relaxed text-muted-foreground">
        <p className="tracking-[0.04em]">
          © 2026 Sarah DeFazio. All rights reserved.
        </p>
        <p className="mt-1">
          Gabriel's Number™ — Original concept, framework, and application design.
        </p>
        <p className="mt-1 italic">
          For demonstration purposes only. Unauthorized copying, reproduction, or commercial use is
          prohibited.
        </p>
      </div>
    </footer>
  );
}
