import { cn } from "../../lib/cn";
import { Toolbox } from "./Toolbox";

const sections = [
  {
    eyebrow: "BUILDING PHILOSOPHY",
    title: "How I approach software",
    paragraphs: [
      "I keep business logic separate from frameworks and infrastructure, treating databases and external services as implementation details.",
      "Common functionality gets extracted into reusable packages, allowing new projects to build on foundations I've already developed and tested.",
    ],
  },
  {
    eyebrow: "AI",
    title: "How I use AI",
    paragraphs: [
      "I use AI for research, exploring alternatives, reviewing ideas and speeding up focused development tasks.",
      "It doesn't replace understanding the software I deliver. I'm also exploring agentic workflows where my existing libraries and APIs become building blocks agents can work with.",
    ],
  },
  {
    eyebrow: "TOOLBOX",
    title: "What I build with",
    paragraphs: [
      "My toolbox combines the technologies I work with most often with reusable libraries and components I've built across projects.",
    ],
    decoration: <Toolbox className="w-full max-w-6xl px-6 pb-10" />,
  },
];
// ...

export function About() {
  return (
    <>
      <header className="mx-auto px-6 py-24">
        <span className="eyebrow">ABOUT SWH</span>

        <h1 className="mt-4 text-3xl text-fg">A little about how I work</h1>

        <p className="mt-6 max-w-[600px] text-subtle">
          My background is in consulting, system integration and business
          automation. I build focused software around the systems and data
          businesses already use.
        </p>

        <p className="mt-6 max-w-[600px] text-subtle">
          I'm also into blockchain and distributed systems. My Web3 demos are
          listed at izblocks.com.
        </p>
      </header>

      <div className="border-t border-faint-accent">
        {sections.map((section, i) => {
          // every other section mirrors: text left, eyebrow right
          const flip = i % 2 === 1;

          return (
            <section
              key={section.eyebrow}
              className="
              mx-auto gap-6
              border-b border-faint-accent
              flex flex-col justify-center items-center
            "
            >
              <div
                className={cn(
                  "p-6 grid gap-3 w-full max-w-4xl",
                  flip
                    ? "md:grid-cols-[1fr_180px]"
                    : "md:grid-cols-[180px_1fr]",
                )}
              >
                <span className="eyebrow text-sm h-10 inline-flex items-center">
                  {section.eyebrow}
                </span>

                <div className={cn("max-w-[600px]", flip && "md:order-first")}>
                  <h2 className="text-2xl h-10 text-fg inline-flex items-center">
                    {section.title}
                  </h2>

                  <div className="mt-5 flex flex-col gap-4 text-subtle">
                    {section.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* outside the grid so it can be wider than the text columns */}
              {section.decoration}
            </section>
          );
        })}
      </div>
    </>
  );
}
