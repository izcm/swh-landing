import type { ReactNode } from "react";

import EyebrowRule from "./EyebrowRule";

// a full-height <section>: "01 ──────── EYEBROW" rule, then title + paragraphs.
// `diagram` renders below that, still in the section
export function SectionBase({
  id,
  index,
  maxIndex,
  eyebrow,
  title,
  text,
  diagram,
}: {
  id?: string; // anchor target; scroll-mt keeps it clear of the nav
  index: number; // 0-based
  maxIndex: number;
  eyebrow: string;
  title: ReactNode;
  text: ReactNode;
  diagram?: ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex flex-col min-h-below-nav scroll-mt-18 py-6 lg:py-3"
    >
      <div
        className="
      relative isolate overflow-hidden
      flex flex-col gap-6
      p-4 w-full mx-auto
      sm:p-8 max-w-3xl 
      "
      >
        <EyebrowRule index={index} label={eyebrow} maxIndex={maxIndex} />
        <h2 className="text-3xl font-medium text-fg">{title}</h2>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-4 text-fg-tinted/90 text-lg">
            {text}
          </div>
        </div>
      </div>
      {diagram && (
        <div
          id={`diagram-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}
          className="relative w-full max-w-200 mx-auto px-2 mt-8"
        >
          {diagram}
        </div>
      )}
    </section>
  );
}
