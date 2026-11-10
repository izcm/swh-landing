import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export type TechnicalPart = {
  label: string;
  title?: string;
  approach: string[];
  result: string[];
  diagram: ReactNode;
};

export function TechnicalView({ parts }: { parts: TechnicalPart[] }) {
  const tabs = parts.map(
    (part, i) => `${String(i + 1).padStart(2, "0")} ${part.label}`,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const active = parts[activeIndex];

  const details = [
    { label: "APPROACH", paragraphs: active.approach },
    { label: "RESULT", paragraphs: active.result },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={cn(
              "h-8 w-auto px-3 rounded-xl border font-normal text-sm whitespace-nowrap transition-colors",
              i === activeIndex
                ? "border-accent text-accent"
                : "border-transparent text-subtle hover:text-fg",
            )}
          >
            {tab.padStart(2, "0")}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <span className="eyebrow uppercase">
          {active.title ?? active.label}
        </span>

        {details.map(({ label, paragraphs }) => (
          <div key={label} className="flex flex-col gap-2">
            <span className="font-mono font-normal text-xs tracking-[0.2em]">
              {label}
            </span>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-subtle">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>

      {active.diagram}
    </div>
  );
}
