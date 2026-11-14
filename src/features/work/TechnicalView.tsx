import { useState, type ReactNode } from "react";
import { ArrowList, ArrowRow } from "@a2zb/react";

import { cn } from "@/lib/cn";

export type TechnicalPart = {
  label: string;
  title?: string;
  approach: string[];
  result: string[];
  note?: string;
  diagram: ReactNode;
};

export function TechnicalView({
  parts,
  labels,
}: {
  parts: TechnicalPart[];
  labels: { approach: string; result: string };
}) {
  const tabs = parts.map(
    (part, i) => `${String(i + 1).padStart(2, "0")} ${part.label}`,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const active = parts[activeIndex];

  const details = [
    { label: labels.approach, paragraphs: active.approach },
    { label: labels.result, paragraphs: active.result },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ArrowList
        items={tabs}
        getId={(tab) => tab}
        selectedId={tabs[activeIndex]}
        onSelect={(tab) => setActiveIndex(tabs.indexOf(tab))}
        direction="horizontal"
        className="flex flex-wrap gap-3"
        htmlUlElementProps={{ role: "tablist" }}
        bare
      >
        {({ item: tab, isSelected, onSelect }) => (
          <ArrowRow
            key={tab}
            isSelected={isSelected}
            onSelect={onSelect}
            focusOnMount={false}
            htmlLiElementProps={{ role: "tab", "aria-selected": isSelected }}
            className={cn(
              "flex tracking-wider items-center h-8.5 w-auto px-3 rounded-xl border text-sm whitespace-nowrap transition-colors",
              isSelected
                ? "border-accent text-accent font-medium"
                : "border-transparent text-subtle hover:text-fg cursor-pointer font-normal",
            )}
          >
            {tab.padStart(2, "0")}
          </ArrowRow>
        )}
      </ArrowList>

      <div className="flex flex-col gap-6">
        {active.title && (
          <span className="eyebrow uppercase">{active.title}</span>
        )}

        {details.map(({ label, paragraphs }, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.2em] uppercase">
              {label}
            </span>
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-subtle">
                {paragraph}
              </p>
            ))}
          </div>
        ))}

        {active.note && <p className="text-subtle italic">{active.note}</p>}
      </div>

      {active.diagram}
    </div>
  );
}
