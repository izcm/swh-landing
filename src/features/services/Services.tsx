import { SvgPlaceholder } from "@/components/SvgPlaceholder";
import { GeoVisualization } from "../diagrams/small/GeoVisualization";
import { GearPair } from "../diagrams/small/GearPair";
import { ArrowRight, Plus } from "lucide-react";

const sections = [
  {
    eyebrow: "INT",
    title: "Integrations",
    text: "Connect your existing systems for optimized data flow.",
    diagram: <SvgPlaceholder label="Integrations" />,
  },
  {
    eyebrow: "VIS",
    title: "Visualization",
    text: "Turn complex data into clear, actionable insight.",
    diagram: <GeoVisualization />,
  },
  {
    eyebrow: "TOOLS",
    title: "Interactive Tools",
    text: "Give users the right tools to explore, analyze, and act.",
    diagram: <SvgPlaceholder label="Interactive Tools" />,
  },
  {
    eyebrow: "AUTO",
    title: "Automation",
    text: "Streamline processes and reduce manual work.",
    diagram: <GearPair />,
  },
];

export function Services() {
  return (
    <div className="mx-auto w-full max-w-360 px-6 py-16">
      <header className="mb-10 border-b border-faint-accent pb-8 ">
        <span className="eyebrow tracking-[0.25em] font-normal">SERVICES</span>
        <h1 className="mt-3 text-5xl">What I build</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map((section, i) => (
          <section
            key={section.eyebrow}
            className="relative flex h-90 gap-6 border border-faint-accent p-8 rounded-sm"
          >
            {[
              "top-0 left-0",
              "top-0 right-0",
              "bottom-0 left-0",
              "bottom-0 right-0",
            ].map((corner) => (
              <Plus
                key={corner}
                className={`absolute ${corner} text-fg-tinted opacity-80 stroke-1`}
              />
            ))}
            <div className="flex w-2/5 flex-col gap-3">
              <span className="eyebrow pb-4 text-[14px]">{`0${i + 1} / ${section.eyebrow}`}</span>
              <h2 className="mt-4 text-4xl text-fg">{section.title}</h2>
              <p className="text-lg font-light text-subtle">{section.text}</p>

              <a
                href="something"
                className="btn btn-ghost self-start mt-auto px-1 inline-flex gap-3"
              >
                Read more
                <ArrowRight className="text-fg" strokeWidth={1} />
              </a>
            </div>
            <div className="flex w-3/5 items-center h-full">
              {section.diagram}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
