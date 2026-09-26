import { cn } from "../../lib/cn";

import { ConnectDiagram } from "../diagrams/ConnectDiagram";
import { VisualizeDiagram } from "../diagrams/Visualize/VisualizeDiagram";
import { ActDiagram } from "../diagrams/ActDiagram";

const sections = [
  {
    eyebrow: "CONNECT",
    title: "Extend what your data can do",
    paragraphs: [
      "Most businesses use several robust systems to run their day-to-day operations — accounting software, industry-specific tools, etc.",
      "While each system may work well on its own, there is often significant room for improvement in how data flows between them.",
      // "We have the expertise to bridge this gap by collecting and transforming data across your existing systems.",
    ],
    diagram: <ConnectDiagram />,
    bg: "bg-story-connect",
  },
  {
    eyebrow: "VISUALIZE",
    title: "See the bigger picture",
    paragraphs: [
      "Collecting data cross systems makes it possible to see more than any individual system or spreadsheet can show on its own.",
      "Spreadsheets are excellent tools, but understanding a larger operation can mean moving between several sheets, comparing numbers, and building a picture of what is happening in your head.",
      "We make that process easier by presenting relevant information through interactive dashboards designed to show the bigger picture.",
    ],
    diagram: <VisualizeDiagram />,
    bg: "bg-story-visualize",
  },
  {
    eyebrow: "ACT",
    title: "Turn insight into action",
    paragraphs: [
      "Connected data and better visibility make it easier to identify what needs attention and decide what to do next.",
      "We extend your existing systems with tools that let you act directly on that information, rather than moving between systems and completing each step manually.",
      // "This can turn a time-consuming, multi-step process into a much simpler and faster workflow.",
    ],
    diagram: <ActDiagram />,
    bg: "bg-story-act",
  },
];

export function Story() {
  return (
    <>
      {sections.map((section, i) => (
        <section
          className={cn(
            "flex flex-col items-center gap-8",
            "border-t border-faint-accent",
            "px-4 py-8",
            "lg:px-12",
            section.bg,
          )}
          key={`story-${i}`}
          id={`story-${i}`}
        >
          <div className="flex w-full items-center gap-6 self-start">
            <span className="eyebrow">0{i + 1}</span>

            <div className="horizontal-line bg-accent/40" />

            <span className="eyebrow">{section.eyebrow}</span>
          </div>

          <h2 className={cn("text-2xl text-fg", "lg:text-3xl")}>
            {section.title}
          </h2>

          <div className="flex gap-6 max-w-[600px] mx-auto px-6">
            <div className="vertical-line rounded w-0.5 bg-accent/75" />
            <div className="flex flex-col py-1 gap-4 text-subtle">
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          {section.diagram && (
            <div className="w-full my-8 max-w-[600px]">{section.diagram}</div>
          )}
        </section>
      ))}
    </>
  );
}
