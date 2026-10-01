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
      flex flex-col gap-6 
      scroll-mt-18 p-4 w-full mt-6 max-w-360 mx-auto
      sm:p-8
      "
    >
      <EyebrowRule index={index} label={eyebrow} maxIndex={maxIndex} />
      <h2 className="text-3xl font-medium text-fg">{title}</h2>

      <div className="flex flex-col xl:flex-row gap-6 justify-between">
        <div className="flex max-w-2xl w-full flex-col gap-4 text-fg-tinted/90 text-lg">
          {text}
        </div>
        <div className="max-w-140 w-full xl:mx-auto max-xl:mt-6">{diagram}</div>
      </div>
    </div>
  );
}
