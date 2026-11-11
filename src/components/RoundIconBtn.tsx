import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  onClick: () => void;
  label: string;
  children: ReactNode;
  className?: string;
};

// colors derive from currentColor — pass a text-* class to recolor
export function RoundIconBtn({ onClick, label, children, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full",
        "bg-current/10 transition-colors hover:bg-current/10",
        "touch-manipulation",
        className,
      )}
    >
      {children}
    </button>
  );
}
