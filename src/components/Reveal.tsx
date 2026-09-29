import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  // ms to wait after the element enters view — use it to stagger siblings
  delay?: number;
};

// fades + slides its content up the first time it scrolls into view.
// people with "reduce motion" on just see the content, no animation
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          // only animate once
          observer.disconnect();
        }
      },
      // start a little before it's fully on screen so it doesn't feel late
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition duration-700 ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
