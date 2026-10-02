import type { ReactNode } from "react";

import EyebrowRule from "./EyebrowRule";

// "01 ──────── EYEBROW" rule, then title + paragraphs with an optional
// diagram beside them — callers wrap it in a <section>
export function SectionBase({
  index,
  maxIndex,
  eyebrow,
  title,
  text,
  diagram,
}: {
  index: number; // 0-based
  maxIndex: number;
  eyebrow: string;
  title: ReactNode;
  text: ReactNode;
  diagram?: ReactNode;
}) {
  return (
    <div
      className="
      relative isolate overflow-hidden
      flex flex-col gap-6
      scroll-mt-18 p-4 w-full mt-6 mx-auto
      sm:p-8 max-w-3xl
      "
    >
      <EyebrowRule index={index} label={eyebrow} maxIndex={maxIndex} />
      <h2 className="text-3xl font-medium text-fg">{title}</h2>

      <div className="flex flex-col gap-6 justify-between">
        <div className="flex flex-col gap-4 text-fg-tinted/90 text-lg">
          {text}
        </div>
        <div
          id={`diagram-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}
          className="max-w-120 w-full mt-6 mx-auto"
        >
          {diagram}
        </div>
      </div>
    </div>
  );
}
