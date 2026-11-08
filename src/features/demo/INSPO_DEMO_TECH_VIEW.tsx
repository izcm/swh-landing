"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  MonitorPlay,
} from "lucide-react";

type Step = {
  name: string;
  service: string;
  description: string;
  result: string;
  media: string[];
};

const steps: Step[] = [
  {
    name: "Connecting systems",
    service: "INTEGRATIONS",
    description:
      "Hubben brings employee information, vehicle contracts, and incoming inspection reports together so the data can be used throughout the application.",
    result: "Connected employee, contract, and vehicle records.",
    media: ["Connected records", "Employee information", "Vehicle contracts"],
  },
  {
    name: "Visualizing operations",
    service: "VISUALIZATION",
    description:
      "Inspection deadlines, results, and vehicle responsibilities are presented in a dashboard. Filters help employees find relevant records and identify what needs attention.",
    result: "A clearer overview of ongoing operations.",
    media: ["Dashboard overview", "Filtering records", "Inspection details"],
  },
  {
    name: "Working with records",
    service: "INTERACTIVE TOOLS",
    description:
      "Employees can open vehicle records, inspect details, change responsibility, and initiate actions directly in the application.",
    result: "Information and actions in one place.",
    media: ["Vehicle details", "Change responsible", "Notify employee"],
  },
  {
    name: "Automating updates",
    service: "AUTOMATION",
    description:
      "Structured workshop emails can be parsed and matched to the correct vehicle, allowing inspection statuses to be updated without manual re-entry.",
    result: "Less manual follow-up and more consistent records.",
    media: [
      "Incoming report",
      "Matching a vehicle",
      "Updated inspection status",
    ],
  },
];

function DemoLink({
  outlined = false,
  children,
}: {
  outlined?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href="https://hubben.swh.no"
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex w-fit items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors " +
        (outlined
          ? "border-line text-fg hover:bg-elevated-alt"
          : "btn btn-primary")
      }
    >
      {children} <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

export function Work() {
  const [active, setActive] = useState(0);
  const [media, setMedia] = useState(0);
  const [layout, setLayout] = useState<"side" | "stack">("side");

  const selected = steps[active];

  function switchStep(index: number) {
    setActive(index);
    setMedia(0);
  }

  return (
    <main className="mx-auto w-full max-w-5xl rounded border border-faint bg-ground p-5 text-fg sm:p-7 lg:p-10">
      {/* Introduction */}
      <header className="space-y-5 py-3">
        <p className="text-xs font-medium tracking-wider text-fg-tinted">
          WORK
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">Hubben</h1>
        <p className="text-sm italic text-subtle">
          A demo application for connected business operations.
        </p>
        <p className="max-w-2xl text-sm leading-7 text-subtle">
          Hubben is a demonstration project developed by SWH Studio to show how
          integrations, data visualization, interactive tools, and automation
          can work together in a single application.
        </p>
        <p className="max-w-2xl text-sm leading-7 text-subtle">
          The application is based on a fictional business scenario and is
          available to explore at{" "}
          <span className="text-accent">hubben.swh.no</span>.
        </p>
        <DemoLink>Explore live demo</DemoLink>
      </header>

      <div className="my-9 h-px bg-line" />

      {/* Interactive walkthrough */}
      <section aria-labelledby="how-it-works" className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-medium tracking-wider text-fg-tinted">
            THE SOLUTION
          </span>
          <span className="text-xs text-muted">01 — 04</span>
        </div>

        <div className="space-y-2">
          <h2 id="how-it-works" className="text-3xl sm:text-4xl">
            How it works
          </h2>
          <p className="text-sm text-subtle">
            Four parts of one connected application.
          </p>
        </div>

        {/* Desktop/stacked preview control. Feel free to remove this once layout is chosen. */}
        <div
          className="inline-flex rounded-md border border-line p-1 text-xs"
          aria-label="Layout preview"
        >
          {(["side", "stack"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLayout(option)}
              aria-pressed={layout === option}
              className={`rounded px-3 py-2 transition-colors ${
                layout === option
                  ? "bg-faint text-fg"
                  : "text-subtle hover:text-fg"
              }`}
            >
              {option === "side" ? "Side-by-side" : "Stacked"}
            </button>
          ))}
        </div>

        <div
          className={`flex flex-col items-start gap-8 ${layout === "side" ? "md:flex-row" : ""}`}
        >
          {/* Step navigation */}
          <nav
            aria-label="Explore the four parts of Hubben"
            className={`w-full shrink-0 ${layout === "side" ? "md:w-[31%]" : ""}`}
          >
            <p className="mb-2 text-xs font-medium tracking-wide text-fg-tinted">
              EXPLORE
            </p>
            <div className="grid grid-cols-2 gap-x-2 md:grid-cols-1">
              {steps.map((step, index) => (
                <button
                  key={step.name}
                  type="button"
                  onClick={() => switchStep(index)}
                  aria-current={active === index ? "step" : undefined}
                  className={`w-full rounded-sm border-b px-3 py-3 text-left transition-colors ${
                    active === index
                      ? "border-accent bg-elevated-alt"
                      : "border-faint hover:bg-elevated"
                  }`}
                >
                  <span
                    className={`block text-xs ${active === index ? "text-accent" : "text-muted"}`}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={`mt-1 block text-sm ${active === index ? "font-semibold text-fg" : "text-subtle"}`}
                  >
                    {step.name}
                  </span>
                </button>
              ))}
            </div>
          </nav>

          {/* One active step at a time */}
          <article key={active} className="min-w-0 flex-1 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wider text-fg-tinted">
                0{active + 1} / {selected.service}
              </p>
              <h3 className="text-2xl leading-tight sm:text-3xl">
                {selected.name}
              </h3>
              <p className="text-sm leading-7 text-subtle">
                {selected.description}
              </p>
            </div>

            {/* Replace this entire div with your own 2D diagram component. */}
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-sm border border-line px-4 py-8">
              <GitBranch
                size={28}
                className="text-accent-muted"
                aria-hidden="true"
              />
              <span className="text-xs tracking-wider text-subtle">
                2D DIAGRAM
              </span>
              <span className="text-xs text-muted">Placeholder</span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wider text-fg-tinted">
                APPLICATION PREVIEW
              </p>
              <div className="rounded-md border border-line bg-elevated p-3">
                {/* Replace with an image/video player later. */}
                <div className="flex aspect-video flex-col items-center justify-center gap-3 text-center">
                  <MonitorPlay
                    size={32}
                    className="text-accent-muted"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-subtle">
                    {selected.media[media]}
                  </p>
                  <p className="text-xs text-muted">GIF / VIDEO / SCREENSHOT</p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous preview"
                      disabled={media === 0}
                      onClick={() =>
                        setMedia((current) => Math.max(0, current - 1))
                      }
                      className="rounded p-1 text-fg-tinted hover:bg-faint disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs tabular-nums text-muted">
                      {media + 1} / {selected.media.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Next preview"
                      disabled={media === selected.media.length - 1}
                      onClick={() =>
                        setMedia((current) =>
                          Math.min(selected.media.length - 1, current + 1),
                        )
                      }
                      className="rounded p-1 text-fg-tinted hover:bg-faint disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <span className="text-xs text-muted">HUBBEN DEMO</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wider text-fg-tinted">
                RESULT
              </p>
              <p className="text-sm leading-7 text-subtle">{selected.result}</p>
            </div>
          </article>
        </div>
      </section>

      <div className="my-9 h-px bg-line" />

      {/* Final CTA */}
      <footer className="space-y-4 py-3">
        <p className="text-xs font-medium tracking-wider text-fg-tinted">
          EXPLORE HUBBEN
        </p>
        <h2 className="text-2xl sm:text-3xl">Try the live demo</h2>
        <p className="text-sm text-subtle">
          Explore how the different parts of the application work together.
        </p>
        <DemoLink outlined>Open Hubben</DemoLink>
      </footer>
    </main>
  );
}
