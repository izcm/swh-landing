import type { ReactNode } from "react";

import { AISvg } from "./diagrams/ai/diagram";
import { SoftwareDiagram } from "./diagrams/software/Diagram";
import { IZBLOCKS_URL } from "@/lib/links";
import { SectionBase } from "@/features/core/SectionBase";
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
        My approach to <span className="text-accent">building</span> software
      </>
    ),
    paragraphs: [
      "I start by talking with the client about how the work is done today, then map the process, systems, and pain points involved.",
      "From there, I design the smallest useful solution around the actual business process — solving the core problem without building more than needed.",
      "Reusable code is extracted into libraries that form my developer toolbox, making future projects faster to build and easier to maintain.",
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
