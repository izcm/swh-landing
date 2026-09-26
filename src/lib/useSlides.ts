import { useState } from "react";

import { useControllableState } from "./useControllableState";

type Options = {
  count: number;
  // pass `index` (+ `onChange`) to control from the parent,
  // or `defaultIndex` to let the hook own it
  index?: number;
  defaultIndex?: number;
  onChange?: (i: number) => void;
};

// shared prev/next/goTo for anything that steps through a list of slides.
// `direction` is which way the last move went, for slide-in animations.
export function useSlides({
  count,
  index: indexProp,
  defaultIndex = 0,
  onChange,
}: Options) {
  const [index, setIndex] = useControllableState(
    indexProp,
    defaultIndex,
    onChange,
  );
  const [direction, setDirection] = useState<"left" | "right">("right");

  const prev = () => {
    setDirection("left");
    setIndex((index - 1 + count) % count);
  };

  const next = () => {
    setDirection("right");
    setIndex((index + 1) % count);
  };

  const goTo = (i: number) => {
    if (i === index) return;
    setDirection(i > index ? "right" : "left");
    setIndex(i);
  };

  return { index, direction, prev, next, goTo };
}
