import type { ReactNode } from "react";

import { AISvg } from "@/components/diagrams/about/ai/diagram";
import { SoftwareDiagram } from "../diagrams/about/software/diagram";
import { IZBLOCKS_URL } from "@/lib/links";
import { SectionBase } from "../SectionBase";
import { ToolboxPanels } from "./Toolbox";

const abouts: {
  eyebrow: string;
  title: ReactNode;
  paragraphs: string[];
  diagram?: ReactNode;
  extra?: ReactNode; // rendered below the text + diagram
}[] = [
  {
    eyebrow: "Building philosophy",
    title: (
      <>
        My approach to building <span className="text-accent">software</span>
      </>
    ),
    paragraphs: [
      "I build products around their business logic, while keeping reusable pieces separate from the product itself.",
      "When a component, pattern, or integration is useful beyond one project, I extract it into a reusable library. Those pieces become part of a growing toolbox that can be combined with new business logic in future systems.",
    ],
    diagram: <SoftwareDiagram />,
  },
  {
    eyebrow: "AI",
    title: (
      <>
        How I use <span className="text-accent">AI</span>
      </>
    ),
    paragraphs: [
      "I use AI for research, exploring alternatives, reviewing ideas and speeding up focused development tasks.",
      "It doesn't replace understanding the software I deliver. I need to know what the code does, why it's there and how to maintain it. I'm also exploring agentic workflows where my existing libraries and APIs become building blocks agents can work with.",
    ],
    diagram: <AISvg />,
  },
  {
    eyebrow: "Tools",
    title: "My toolbox",
    paragraphs: [
      "My toolbox combines the technologies I work with most often with reusable libraries and components I've built across projects.",
    ],
    extra: <ToolboxPanels />,
  },
];

export function About() {
  return (
    <>
      <header className="mx-auto w-full px-6 py-24">
        <span className="eyebrow">ABOUT SWH</span>

        {/* <h1 className="mt-4 text-4xl text-fg">
          A little about how I <span className="text-accent">work</span>
        </h1> */}

        <h1 className="mt-4 text-4xl text-fg">
          Introducing our <span className="text-accent">solo dev</span> team
        </h1>

        <p className="mt-6 max-w-150 text-subtle">
          I'm an independent developer focused on integrations, automation and
          data. I also build Web3 software at{" "}
          <a
            href={IZBLOCKS_URL}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline underline-offset-2"
          >
            izblocks.com
          </a>
          .
        </p>
      </header>

      <div className="border-t border-faint-accent">
        <div
          className="
            sticky top-[calc(100dvh-30rem)]
            overflow-hidden h-120 -mb-120"
        >
          <div className="floor-grid" aria-hidden />
        </div>

        {/* <div className="sticky top-[calc(100dvh-30rem)] h-120 -mb-120 overflow-hidden">
          <div className="floor-grid" aria-hidden />
        </div> */}

        {abouts.map((about, i) => (
          <section
            className="flex flex-col min-h-below-nav"
            key={about.eyebrow}
          >
            <SectionBase
              index={i}
              maxIndex={abouts.length}
              eyebrow={about.eyebrow}
              title={about.title}
              text={about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              diagram={about.diagram}
            />
            {about.extra}
          </section>
        ))}
      </div>
    </>
  );
}
