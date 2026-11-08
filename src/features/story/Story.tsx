import { SectionBase } from "@/features/core/SectionBase";

import { InteractiveToolsDiagram } from "@/features/diagrams/interactive-tools";
import { VisualizationsDiagram } from "../diagrams/visualizations";
import { AutomationDiagram } from "@/features/diagrams/automation";
import { SvgPlaceholder } from "@/components/SvgPlaceholder";

const sections = [
  {
    eyebrow: "INTEGRATIONS",
    title: "Extend what your data can do",
    paragraphs: [
      "Most businesses use several robust systems to run their day-to-day operations — accounting software, industry-specific tools, etc.",
      "While each system may work well on its own, there is often significant room for improvement in how data flows between them.",
      // "We have the expertise to bridge this gap by collecting and transforming data across your existing systems.",
    ],
    diagram: <SvgPlaceholder label="Integrations Step" width={480} height={300} />,
    // diagram: <IntegrationsDiagram />,
  },
  {
    eyebrow: "VISUALIZATIONS",
    title: "See the bigger picture",
    // tldr: "We build interactive dashboards.",
    paragraphs: [
      "Dashboards are a common feature in modern software, providing an overview of important information in one place.",
      "Rather than presenting static charts and figures, I focus on interactive views where data can be filtered, explored, and broken down into more detail.",
      "For example, if you want to examine trends in a particular region, you could select an area directly on a map and see the related figures and charts update automatically.",
      // "Once scattered data is connected and transformed, you can see way more than any individual system can show on its own.",
      // "We build interactive dashboards that present up-to-date information in formats tailored to your business needs.",
      // "Explore information at different levels, spot patterns, and drill down into the details that matter.",
    ],
    diagram: <VisualizationsDiagram />,
  },
  {
    eyebrow: "INTERACTIVE TOOLS",
    title: "Turn insight into action",
    paragraphs: [
      // "Better visibility makes it easier to understand what should happen next. Whether that be some deadline closing in and assuring that an employee stays on top of that record, the optimal solution is to have those actions available quickly in front of you instead of switching between systems.",
      // "These actions may contact several APIs, and might stand for manual labour that span several hours weekly. Having a streamlined solution that does all in one go blablablabla _))) blababl.",
      // "We have the competence to make custom solutions for your needs, dhofsdjiofkdposfkdopfkopdf.",
      // "Better visibility make it easier to spot what needs attention and decide what to do next.",
      // "We build tools that bring your key actions into one place, allowing you to work directly with the information in front of you rather than switching between systems.",
    ],
    diagram: <InteractiveToolsDiagram />,
  },

  {
    eyebrow: "AUTOMATION",
    title: "Let routine work take care of itself",
    paragraphs: [
      "Think of the manual steps involved in moving information from one system to another, checking for updates, or following up on tasks.",
      "When your systems work together, new opportunities for automation emerge. Repetitive tasks that once required manual effort can happen automatically.",
      "I help you define rulesets and automated workers that execute tasks like clockwork.",
    ],
    diagram: <AutomationDiagram />,
  },
];

export function Story() {
  return (
    <div className="overflow-clip">
      {/* page-wide floor tiles, off while each diagram draws its own
      <div
        className="
          sticky top-[calc(100dvh-30rem)]
          overflow-hidden h-120 -mb-120 pointer-events-none"
      >
        <div className="floor-grid" aria-hidden />
      </div>
      */}

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
      id={`story-${section.eyebrow.toLowerCase().replaceAll(" ", "-")}`}
      index={index}
      eyebrow={section.eyebrow}
      title={section.title}
      text={section.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      // tldr={section.tldr}
      diagram={section.diagram}
    />
  );
}
