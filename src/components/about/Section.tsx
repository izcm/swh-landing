import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

// numbered section wrapper: "01 ──────── EYEBROW" rule above the content
export function Section({
  index,
  eyebrow,
  children,
  className,
}: {
  index: string;
  eyebrow: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="border-b border-faint-accent px-6 py-6">
      <div className={cn("mx-auto w-full max-w-5xl", className)}>
        <div className="flex w-full items-center gap-6 self-start">
          <span className="eyebrow">{index}</span>

          <div className="horizontal-line bg-accent/40" />

          <span className="eyebrow shrink-0">{eyebrow.toUpperCase()}</span>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

// stand-in for illustrations that haven't been drawn yet
export function SvgPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed border-accent-muted/30 text-xs text-subtle",
        className,
      )}
    >
      {label}
    </div>
  );
}
