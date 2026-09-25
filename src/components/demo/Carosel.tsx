import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { RoundIconBtn } from "./RoundIconBtn";
import { cn } from "../../lib/cn";

type Props = {
  items: ReactNode[];
};

export function Carosel({ items }: Props) {
  const [index, setIndex] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const current = items[index];

  const prev = () => {
    setDirection("left");
    setIndex((index - 1 + items.length) % items.length);
  };

  const next = () => {
    setDirection("right");
    setIndex((index + 1) % items.length);
  };

  const goTo = (i: number) => {
    if (i === index) return;
    setDirection(i > index ? "right" : "left");
    setIndex(i);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "flex-1 self-center rounded-sm overflow-hidden",
          direction === "right" && "in-from-right",
          direction === "left" && "in-from-left",
        )}
        key={index}
      >
        {current}
      </div>

      <div className="flex gap-6 items-center justify-evenly">
        <RoundIconBtn onClick={prev} label="Previous">
          <ArrowLeft className="size-5" strokeWidth={1.8} />
        </RoundIconBtn>

        <div className="flex gap-4">
          {items.map((item, i) => (
            <div
              onClick={() => goTo(i)}
              className={cn(
                "rounded cursor-pointer rounded border border-transparent p-0.5",
                i !== index && "hover:border-accent/60",
                i === index && "border border-accent",
              )}
              key={i}
            >
              {item}
            </div>
          ))}
        </div>

        <RoundIconBtn onClick={next} label="Next">
          <ArrowRight className="size-5" strokeWidth={1.8} />
        </RoundIconBtn>
      </div>

      <div className="flex self-center gap-3">
        {Array.from({ length: items.length }).map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to item ${i + 1}`}
            className={cn(
              "bg-accent rounded-full size-2 opacity-20 cursor-pointer",
              i !== index && "hover:opacity-50",
              i === index && "opacity-100",
            )}
          />
        ))}
      </div>
    </div>
  );
}
