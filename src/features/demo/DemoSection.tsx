import { services } from "../services/data/services";
import type { Demo } from "./DemoIndex";
import { DemoShowcase } from "./DemoShowcase";

export function DemoSection({ demo }: { demo: Demo }) {
  const details = [
    { label: "CLIENT", text: demo.client },
    { label: "SITUATION", text: demo.situation },
    { label: "SOLUTION", text: demo.solution },
  ];

  return (
    <section
      id={demo.id}
      className="flex flex-col gap-8 min-h-below-nav scroll-mt-18 justify-center"
    >
      <div className="flex flex-col xl:flex-row gap-6">
        {/* TEXT CONTENT */}
        <div className="w-full flex flex-col gap-6 xl:max-w-sm">
          <div className="flex flex-col gap-3">
            <span className="inline-flex gap-2 eyebrow font-mono text-xs">
              WORK <span>/</span> PROJECT
            </span>
            <h2 className="text-5xl">{demo.title}</h2>
          </div>

          <div className="horizontal-line" />

          {details.map(({ label, text }) => (
            <div key={label} className="flex flex-col gap-2">
              <span className="font-mono font-normal text-xs tracking-[0.2em]">
                {label}
              </span>
              <p className="text-subtle">{text}</p>
            </div>
          ))}

          <div className="horizontal-line" />

          <span className="text-sm text-accent-strong">
            {demo.services
              .map((id) => services.find((service) => service.id === id)?.title)
              .join(" · ")}
          </span>
        </div>

        <DemoShowcase />
      </div>
    </section>
  );
}
