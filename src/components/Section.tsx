import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import EyebrowRule from "./EyebrowRule";

// numbered section wrapper: "01 ──────── EYEBROW" rule above the content
export function Section({
  index,
  maxIndex,
  eyebrow,
  id,
  children,
  className,
}: {
  index: number; // 0-based
  maxIndex: number;
  eyebrow: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("page-section", className)} id={id}>
      <EyebrowRule index={index} label={eyebrow} maxIndex={maxIndex} />

      {children}
    </section>
  );
}
