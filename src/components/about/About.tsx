import { AISvg } from "@/components/diagrams/about/ai/diagram";
import { Philosophy } from "./Philosophy";
import { Section } from "../Section";
import { Toolbox } from "./Toolbox";

export function About() {
  return (
    <>
      <header className="mx-auto w-full px-6 py-24">
        <span className="eyebrow">ABOUT SWH</span>

        <h1 className="mt-4 text-4xl text-fg">
          A little about how I <span className="text-accent">work</span>
        </h1>

        <p className="mt-6 max-w-[600px] text-subtle">
          I'm an independent developer focused on integrations, automation and
          data. I also build Web3 software at{" "}
          <a
            href="https://izblocks.com"
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
        <Philosophy />
        <AiUsage />
        <Toolbox />
      </div>
    </>
  );
}

function AiUsage() {
  return (
    <Section index={1} maxIndex={3} eyebrow="AI">
      <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-3xl text-fg">
            How I use <span className="text-accent">AI</span>
          </h2>

          <div className="mt-5 flex max-w-md flex-col gap-4 text-subtle">
            <p>
              I use AI for research, exploring alternatives, reviewing ideas and
              speeding up focused development tasks.
            </p>
            <p>
              It doesn't replace understanding the software I deliver. I need to
              know what the code does, why it's there and how to maintain it.
              I'm also exploring agentic workflows where my existing libraries
              and APIs become building blocks agents can work with.
            </p>
          </div>
        </div>

        <AISvg />
      </div>
    </Section>
  );
}
