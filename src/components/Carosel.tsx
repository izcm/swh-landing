import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { RoundIconBtn } from "./RoundIconBtn";
import { cn } from "@/lib/cn";
import { useSlides } from "@/lib/useSlides";

export type CaroselItem = { content: ReactNode; title: string };

type Props = {
  items: CaroselItem[];

  defaultIndex?: number; // where to start when uncontrolled

  // pass if parent controls the index
  index?: number;
  onChange?: (i: number) => void;

  animate?: boolean;

  className?: string;
};

// https://www.youtube.com/watch?v=HXIHpDnsizk&list=PLZlA0Gpn_vH8mpXIUHjWoMAAgoCEinL0R&index=67
// have a look at carosel animations

const pad = (n: number) => String(n).padStart(2, "0");

export function Carosel({
  items,
  index: indexProp,
  defaultIndex,
  onChange,
  animate = true,
  className,
}: Props) {
  const { index, direction, prev, next, goTo } = useSlides({
    count: items.length,
    index: indexProp,
    defaultIndex,
    onChange,
  });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <CaroselSlide
        key={index}
        item={items[index]}
        direction={direction}
        animate={animate}
      />
      <CaroselCaption
        title={items[index].title}
        index={index}
        count={items.length}
      />
      <CaroselControls
        items={items}
        index={index}
        prev={prev}
        next={next}
        goTo={goTo}
      />
    </div>
  );
}

export function CaroselSlide({
  item,
  direction,
  animate = true,
}: {
  item: CaroselItem;
  direction: "left" | "right";
  animate?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 self-center rounded-sm overflow-hidden",
        animate && direction === "right" && "in-from-right",
        animate && direction === "left" && "in-from-left",
      )}
    >
      {item.content}
    </div>
  );
}

export function CaroselCaption({
  title,
  index,
  count,
}: {
  title: string;
  index: number;
  count: number;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 font-mono tracking-wider text-xs text-subtle">
        <span className="whitespace-nowrap">
          FIG. {pad(index + 1)} – {title}
        </span>
        <div className="horizontal-line" />
        <span className="whitespace-nowrap">
          {pad(index + 1)} / {pad(count)}
        </span>
      </div>

      <div className="horizontal-line mt-2" />
    </div>
  );
}

export function CaroselControls({
  items,
  index,
  prev,
  next,
  goTo,
}: {
  items: CaroselItem[];
  index: number;
  prev: () => void;
  next: () => void;
  goTo: (i: number) => void;
}) {
  return (
    <div className="flex gap-6 p-3 items-center justify-evenly">
      <RoundIconBtn
        onClick={prev}
        label="Previous"
        className="border border-line"
      >
        <ArrowLeft className="size-5" strokeWidth={1.8} />
      </RoundIconBtn>

      <div className="flex gap-4">
        {items.map((item, i) => (
          <div
            onClick={() => goTo(i)}
            className={cn(
              "cursor-pointer rounded border border-transparent p-0.5",
              i !== index && "hover:border-accent/60",
              i === index && "border border-accent",
            )}
            key={i}
          >
            {item.content}
          </div>
        ))}
      </div>

      <RoundIconBtn onClick={next} label="Next" className="border border-line">
        <ArrowRight className="size-5" strokeWidth={1.8} />
      </RoundIconBtn>
    </div>
  );
}

export function CaroselDots({
  count,
  index,
  goTo,
}: {
  count: number;
  index: number;
  goTo: (i: number) => void;
}) {
  return (
    <div className="flex self-center gap-3">
      {Array.from({ length: count }).map((_, i) => (
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
  );
}
