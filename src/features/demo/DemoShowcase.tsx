import { useState } from "react";

import { Carosel } from "@/components/Carosel";
import { LightBox } from "@/components/LightBox";
import { cn } from "@/lib/cn";
import { TechnicalView } from "./TechnicalView";

const tabs = ["Application", "Technical overview"] as const;

export function DemoShowcase() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const mediaItems = Array.from({ length: 3 }).map((_, i) => ({
    type: "image" as const,
    src: `/hubben/hubben_${i + 1}.png`,
    alt: "temporary alt",
    title: "Inspection overview",
  }));

  return (
    <>
      <div
        className={cn(
          "max-w-200 w-full mx-auto px-4 py-2",
          "bg-lowered border border-line rounded",
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
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Application" ? (
          <Carosel
            items={mediaItems.map(({ src, alt, title }, i) => ({
              title,
              content: (
                <img
                  className="border border-line rounded"
                  src={src}
                  alt={alt}
                  // the same img is used as a thumbnail — only the current
                  // slide opens the lightbox, others just navigate
                  onClick={() => {
                    if (i === slideIndex) setOpenLightBox(true);
                  }}
                />
              ),
            }))}
            index={slideIndex}
            onChange={setSlideIndex}
          />
        ) : (
          <TechnicalView />
        )}
      </div>

      <LightBox
        items={mediaItems}
        isOpen={openLightBox}
        index={slideIndex}
        onChange={setSlideIndex}
        onClose={() => setOpenLightBox(false)}
      />
    </>
  );
}
