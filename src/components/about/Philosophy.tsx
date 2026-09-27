import { Fragment } from "react";
import { ArrowRight, Box, LayoutGrid, Settings } from "lucide-react";

import { Section, SvgPlaceholder } from "./Section";

const principles = [
  {
    icon: Box,
    title: "Reuse, don't repeat",
    text: "I build modular components and libraries that can be reused across projects.",
  },
  {
    icon: LayoutGrid,
    title: "Keep it simple",
    text: "Focus on clear structure, small and consistent building blocks, and minimal dependencies.",
  },
  {
    icon: Settings,
    title: "Fit the context",
    text: "Use the right tools for the job and keep the business-specific parts separate from the reusable core.",
  },
];

export function Philosophy() {
  return (
    <Section index="01" eyebrow="Building philosophy">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-3xl text-fg">
            How I approach <span className="text-accent">software</span>
          </h2>
          <p className="mt-5 max-w-md text-sm text-subtle">
            I keep business logic separate from frameworks and infrastructure,
            treating things like databases and external services as
            implementation details.
          </p>
        </div>

        <SvgPlaceholder label="philosophy svg" className="h-40" />
      </div>

      <ul className="mt-10 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        {principles.map(({ icon: Icon, title, text }, i) => (
          <Fragment key={title}>
            {i > 0 && (
              <ArrowRight
                aria-hidden
                className="hidden size-4 text-accent md:block"
                strokeWidth={1.6}
              />
            )}
            <li className="flex h-full flex-col gap-2 rounded-lg border border-faint-accent bg-raised/40 p-5">
              <Icon className="size-5 text-accent" strokeWidth={1.6} />
              <h3 className="mt-2 text-fg">{title}</h3>
              <p className="text-sm text-subtle">{text}</p>
            </li>
          </Fragment>
        ))}
      </ul>
    </Section>
  );
}
