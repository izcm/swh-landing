import type { ReactNode } from "react";

// a full-height <section>: "01 / EYEBROW" label, then title + paragraphs.
// `diagram` renders below that, still in the section
export function SectionBase({
  id,
  index,
  eyebrow,
  title,
  text,
  tldr,
  diagram,
}: {
  id?: string; // anchor target; scroll-mt keeps it clear of the nav
  index: number; // 0-based
  eyebrow: string;
  title: ReactNode;
  text: ReactNode;
  tldr?: string; // one-line summary, in a small box under the paragraphs
  diagram?: ReactNode;
  // how wide the diagram can get. any CSS length; 50rem = max-w-200
  diagramMaxWidth?: string;
}) {
  return (
    <section
      id={id}
      className="
        flex flex-col mt-6 gap-6
        min-h-below-nav scroll-mt-18 mx-4
        lg:flex-row lg:gap-12
        "
    >
      <div
        className="
          relative isolate overflow-hidden
          flex flex-col gap-6 w-full mx-auto max-w-3xl
          lg:max-w-150
          "
      >
        <span className="eyebrow">{`0${index + 1} / ${eyebrow.toUpperCase()}`}</span>
        <h2 className="text-2xl sm:text-3xl font-medium text-fg">{title}</h2>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-4 text-fg-tinted/90 text-base sm:text-lg">
            {text}
          </div>
        </div>

        {/* lg:mt-auto: side by side with the diagram, sits at the column's bottom */}
        {tldr && (
          <aside className=" mt-6 rounded border border-faint bg-raised/40 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wider text-accent">
              TL;DR
            </span>
            <p className="mt-1 text-sm text-fg-tinted/90">{tldr}</p>
          </aside>
        )}
      </div>
      {diagram && (
        <div
          id={`diagram-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}
          className="relative w-full mx-auto px-2 mt-8 max-w-2xl lg:max-w-2xl"
        >
          {diagram}
        </div>
      )}
    </section>
  );
}
