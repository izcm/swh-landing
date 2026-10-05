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
    eyebrow: "Working together",
    title: (
      <>
        How I <span className="text-accent">work with you</span>
      </>
    ),
    paragraphs: [
      "I start by understanding how your process works today and where the friction is. From there, we map out the smallest useful solution.",
      "Next, I look through my existing toolbox for integrations, components and patterns that can be reused before writing anything custom.",
      "The custom pieces are then built around your exact needs and connected into the finished solution.",
      "Anything reusable that comes out of the project goes back into the toolbox, making future projects faster to build and easier to maintain.",
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
      "AI lets solo developers like me broaden our expertise and move faster than was possible before. For you, that means getting a lot more horsepower from a single developer.",
      "I use AI throughout the process — for research, exploring approaches, reviewing ideas and speeding up development.",
      "But the final product is still built and understood by me, not handed over to AI. Knowing how the software actually works is what makes it possible to maintain, debug and improve later, so that stays a core principle at SWH.",
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

      <div className="border-t border-faint-accent overflow-clip">
        <div
          className="
            sticky top-[calc(100dvh-30rem)]
            overflow-hidden h-120 -mb-120 pointer-events-none"
        >
          <div className="floor-grid" aria-hidden />
        </div>

        {abouts.map((about, i) => (
          <SectionBase
            key={about.eyebrow}
            index={i}
            maxIndex={abouts.length}
            eyebrow={about.eyebrow}
            title={about.title}
            text={about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            diagram={about.diagram}
          >
            {about.extra}
          </SectionBase>
        ))}
      </div>
    </>
  );
}
