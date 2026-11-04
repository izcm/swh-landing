import { SvgPlaceholder } from "@/components/SvgPlaceholder";

const sections = [
  {
    eyebrow: "INT",
    title: "Integrations",
    text: "Connect your systems and data into a cohesive whole.",
    diagram: <SvgPlaceholder label="Integrations" />,
  },
  {
    eyebrow: "VIS",
    title: "Visualization",
    text: "Turn complex data into clear, actionable insight.",
    diagram: <SvgPlaceholder label="Visualization" />,
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
    diagram: <SvgPlaceholder label="Automation" />,
  },
];

export function Services() {
  return (
    <div className="mx-auto w-full px-6 py-16">
      <header className="mb-10 border-b border-faint-accent pb-8">
        <span className="eyebrow tracking-[0.25em]">SERVICES</span>
        <h1 className="mt-3 text-5xl">What we do</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map((section, i) => (
          <section
            key={section.eyebrow}
            className="flex h-64 gap-6 border border-faint-accent p-6"
          >
            <div className="flex w-2/5 flex-col gap-3">
              <span className="eyebrow">{`0${i + 1} / ${section.eyebrow}`}</span>
              <h2 className="mt-4 text-4xl text-fg">{section.title}</h2>
              <p className="text-subtle">{section.text}</p>
            </div>
            <div className="flex w-3/5 items-center">{section.diagram}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
