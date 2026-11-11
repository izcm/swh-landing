import { useState } from "react";

import { cn } from "@/lib/cn";

import { Carosel } from "@/components/Carosel";
import { LightBox } from "@/components/LightBox";

import { TechnicalView, type TechnicalPart } from "./TechnicalView";

export type MediaItem =
  | { type: "image"; src: string; alt: string; title: string }
  | { type: "video"; src: string; title: string };

const tabs = ["application", "technicalOverview"] as const;

export function Showcase({
  labels,
  mediaItems,
  technicalParts,
}: {
  labels: {
    application: string;
    technicalOverview: string;
    approach: string;
    result: string;
    previous: string;
    next: string;
    figure: string;
    close: string;
  };
  mediaItems: MediaItem[];
  technicalParts: TechnicalPart[];
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <>
      <div
        className={cn(
          "flex flex-col max-w-200 w-full mx-auto px-4 py-2",
          "max-h-[calc(100dvh-var(--nav-height)-4rem)]",
          "bg-raised/80 border border-line rounded",
        )}
      >
        <div role="tablist" className="flex gap-6 mb-4 border-b border-line">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={tab === activeTab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "-mb-px flex items-end h-10 border-b pb-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors",
                tab === activeTab
                  ? "border-accent text-accent"
                  : "border-transparent text-subtle hover:text-fg",
              )}
            >
              {labels[tab]}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto p-1">
          {activeTab === "application" ? (
            <Carosel
              items={mediaItems.map((item, i) => ({
                title: item.title,
                content:
                  item.type === "image" ? (
                    <img
                      className="border border-line rounded"
                      src={item.src}
                      alt={item.alt}
                      // the same img is used as a thumbnail — only the current
                      // slide opens the lightbox, others just navigate
                      onClick={() => {
                        if (i === slideIndex) setOpenLightBox(true);
                      }}
                    />
                  ) : (
                    <video
                      className="border border-line rounded"
                      src={item.src}
                      onClick={() => {
                        if (i === slideIndex) setOpenLightBox(true);
                      }}
                    />
                  ),
              }))}
              labels={labels}
              index={slideIndex}
              onChange={setSlideIndex}
              animate={false}
            />
          ) : (
            <TechnicalView parts={technicalParts} labels={labels} />
          )}
        </div>
      </div>

      <LightBox
        items={mediaItems}
        labels={labels}
        isOpen={openLightBox}
        index={slideIndex}
        onChange={setSlideIndex}
        onClose={() => setOpenLightBox(false)}
      />
    </>
  );
}
