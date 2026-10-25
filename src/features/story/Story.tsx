import { SectionBase } from "@/features/core/SectionBase";

import { ConnectDiagram } from "@/features/diagrams/connect/Diagram";
import { ActDiagram } from "@/features/diagrams/act/Diagram";
import { VisualizeDiagram } from "@/features/diagrams/visualize/Diagram";
import { AutomateDiagram } from "@/features/diagrams/automate/Diagram";

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
  },
  {
    eyebrow: "VISUALIZE",
    title: "See the bigger picture",
    paragraphs: [
      "Connecting data across systems makes it possible to see more than any individual system can show on its own.",
      "We build interactive dashboards that present up-to-date information in formats tailored to your business needs.",
      // "Explore information at different levels, spot patterns, and drill down into the details that matter.",
    ],
    diagram: <VisualizeDiagram />,
  },
  {
    eyebrow: "ACT",
    title: "Turn insight into action",
    paragraphs: [
      "Connected data and better visibility make it easier to identify what needs attention and decide what to do next.",
      "We build tools that bring your key actions into one place, allowing you to work directly with the information in front of you rather than switching between systems.",
    ],
    diagram: <ActDiagram />,
  },

  {
    eyebrow: "AUTOMATE",
    title: "Let routine work take care of itself",
    paragraphs: [
      "Think of the manual steps involved in moving information from one system to another, checking for updates, or following up on tasks.",
      "Once your systems are connected, you can define rules and add workers that execute tasks like clockwork, retriering bothersome manual work.",
    ],
    diagram: <AutomateDiagram />,
  },
];

export function Story() {
  return (
    <div className="overflow-clip">
      <div
        className="
          sticky top-[calc(100dvh-30rem)]
          overflow-hidden h-120 -mb-120 pointer-events-none"
      >
        <div className="floor-grid" aria-hidden />
      </div>

      {sections.map((section, i) => (
        <StorySection key={`story-${i}`} index={i} section={section} />
      ))}
    </div>
  );
}

function StorySection({
  index,
  section,
}: {
  index: number;
  section: (typeof sections)[number];
}) {
  return (
    <SectionBase
      id={`story-${index}`}
      index={index}
      maxIndex={sections.length}
      eyebrow={section.eyebrow}
      title={section.title}
      text={section.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      diagram={section.diagram}
    />
  );
}
