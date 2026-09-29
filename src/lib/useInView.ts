import { useEffect, useRef, useState } from "react";

// true once the element has entered the viewport, then stays true —
// a one-time scroll reveal trigger, not a continuous scroll tracker.
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView] as const;
}
