import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import EyebrowRule from "./EyebrowRule";

// numbered page section: "01 ──────── EYEBROW" rule, then title + paragraphs
// with an optional diagram beside them, then optional extra content (children)
export function SectionBase({
  index,
  maxIndex,
  eyebrow,
  title,
  text,
  diagram,
  id,
  children,
  className,
}: {
  index: number; // 0-based
  maxIndex: number;
  eyebrow: string;
  title: ReactNode;
  text: ReactNode;
  diagram?: ReactNode;
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 h-below-nav",
        "scroll-mt-18 p-4 sm:p-8 md:p-12",
        className,
      )}
      id={id}
    >
      <EyebrowRule index={index} label={eyebrow} maxIndex={maxIndex} />

      <div className="flex flex-col min-[72rem]:flex-row gap-8 justify-between">
        <div>
          <h2 className="text-3xl font-medium text-fg">{title}</h2>

          <div className="mt-5 flex max-w-2xl min-w-lg w-full flex-col gap-4 text-subtle">
            {text}
          </div>
        </div>
        <div className="max-w-124 w-full mt-6 min-[72rem]:mx-auto">
          {diagram}
        </div>
      </div>

      {children}
    </section>
  );
}
