import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

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
        "border border-current/60 bg-ground text-accent",
        "transition-colors hover:bg-current/10 active:bg-current/20",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
        "touch-manipulation",
        className,
      )}
    >
      {children}
    </button>
  );
}
