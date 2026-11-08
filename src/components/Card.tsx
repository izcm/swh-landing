import type { ReactNode } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/cn";

const corners = [
  "top-0 left-0",
  "top-0 right-0",
  "bottom-0 left-0",
  "bottom-0 right-0",
];

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn("relative rounded-sm border border-faint p-8", className)}
    >
      {corners.map((corner) => (
        <Plus
          key={corner}
          className={`absolute ${corner} text-fg-tinted opacity-80 stroke-1`}
        />
      ))}
      {children}
    </section>
  );
}
