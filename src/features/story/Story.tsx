import { SectionBase } from "@/features/core/SectionBase";

import { SvgPlaceholder } from "@/components/SvgPlaceholder";

const sections = [
  {
    eyebrow: "CONNECT",
    title: "Extend what your data can do",
    paragraphs: [
      "Most businesses use several robust systems to run their day-to-day operations — accounting software, industry-specific tools, etc.",
      "While each system may work well on its own, there is often significant room for improvement in how data flows between them.",
      // "We have the expertise to bridge this gap by collecting and transforming data across your existing systems.",
    ],
    diagram: <SvgPlaceholder label="Connect diagram" />,
  },
  {
    eyebrow: "VISUALIZE",
    title: "See the bigger picture",
    paragraphs: [
      "Collecting data cross systems makes it possible to see more than any individual system or spreadsheet can show on its own.",
      "Spreadsheets are excellent tools, but understanding a larger operation can mean moving between several sheets, comparing numbers, and building a picture of what is happening in your head.",
      "We make that process easier by presenting relevant information through interactive dashboards designed to show the bigger picture.",
    ],
    diagram: <SvgPlaceholder label="Visualize diagram" />,
  },
  {
    eyebrow: "ACT",
    title: "Turn insight into action",
    paragraphs: [
      "Connected data and better visibility make it easier to identify what needs attention and decide what to do next.",
      "We extend your existing systems with tools that let you act directly on that information, rather than moving between systems and completing each step manually.",
      // "This can turn a time-consuming, multi-step process into a much simpler and faster workflow.",
    ],
    diagram: <SvgPlaceholder label="Act diagram" />,
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
      diagram={<div className="w-full max-w-150">{section.diagram}</div>}
    />
  );
}
