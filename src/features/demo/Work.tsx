import { cn } from "@/lib/cn";
import { CubeStackDiagram, SoftwareDiagram } from "../diagrams/software";
import { DemoSection } from "./Demo";
import { DemoIndex, type Demo } from "./DemoIndex";

const demos: Demo[] = [
  {
    id: "hubben",
    title: "Hubben",
    subtitle: "Business operations · Live demo",
    client: "A medium sized vehicle rental operations.",
    situation:
      "Manual processes and fragmented information made inspections and follow-up time consuming and hard to scale.",
    solution:
      "A custom solution that brings inspections, data and operations together in one place, with integrations, clear visualization and automation.",
    services: [
      "integrations",
      "visualization",
      "interactive-tools",
      "automation",
    ],
  },
];

export function Work() {
  return (
    <div className="tab-container">
      <header>
        <span className="eyebrow">MY WORK</span>
        <h1>Selected demos</h1>
      </header>
      <div className="min-h-below-nav">
        <div className={cn("flex flex-col", "md:flex-row")}>
          <div
            className={cn(
              "relative z-10 w-full max-w-2xl flex flex-col gap-4 text-subtle",
              "md:min-w-lg",
            )}
          >
            <p>
              Here you can get a better overview of the kind of work SWH offers.
              Each demo will have link to live app, alongside screenshots, video
              snippets and technical summaries for those interested.
            </p>
            <p>
              I recommend having a look at:{" "}
              <a href="#hubben" className="text-accent underline">
                Hubben
              </a>
            </p>
            <p>
              For those interested in blockchain related services, visit{" "}
              <a
                href="https://izblocks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                izblocks.com
              </a>
              , I publish all of my Web3 work there.
            </p>
            <nav
              aria-label="Project index"
              className={cn("w-full border-t border-line mt-6", "md:max-w-lg")}
            >
              {demos.map((demo, i) => (
                <DemoIndex key={demo.id} demo={demo} index={i} />
              ))}

              <div className="flex items-center gap-5 border-b border-line px-2 py-5 opacity-60">
                <span className="font-mono text-xs text-muted">
                  {String(demos.length + 1).padStart(2, "0")}
                </span>

                <span className="flex-1 text-sm text-muted">
                  More projects to follow
                </span>

                <span className="text-muted px-2">—</span>
              </div>
            </nav>
          </div>
          <SoftwareDiagram
            className={cn("hidden max-w-125 mx-auto min-w-0", "lg:block")}
          />
          <CubeStackDiagram
            className={cn(
              "h-48 min-w-0 order-first mb-8",
              "md:order-0",
              "lg:hidden",
            )}
          />
        </div>
      </div>

      {demos.map((demo) => (
        <DemoSection key={demo.id} demo={demo} />
      ))}
    </div>
  );
}
