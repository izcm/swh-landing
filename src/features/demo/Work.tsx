import { cn } from "@/lib/cn";
import { CubeStackDiagram, SoftwareDiagram } from "../diagrams/software";
import { DemoIndex, type Demo } from "./DemoIndex";

const demos: Demo[] = [
  {
    id: "hubben",
    title: "Hubben",
    subtitle: "Business operations · Live demo",
  },
];

export function Work() {
  return (
    <div className="tab-container">
      <header>
        <span className="eyebrow tracking-[0.25em] font-normal">MY WORK</span>
        <h1 className="mt-3 text-5xl">Selected demos</h1>
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
              Here you can get a better overview of the kind of work we do here
              at SWH. Each demo will have link to live app, alongside
              screenshots, video snippets and technical summaries for those
              interested.
            </p>
            <p>
              Recommended for Norwegian businesses:{" "}
              <a href="#hubben" className="text-accent underline">
                Hubben
              </a>
            </p>
            <p>
              For those who want to explore my decentralized payment services,
              visit{" "}
              <a
                href="https://izblocks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                izblocks.com
              </a>
              , the designated site for my blockchain work.
            </p>
            <nav
              aria-label="Project index"
              className={cn("w-full border-t border-faint mt-6", "md:max-w-lg")}
            >
              {demos.map((demo, i) => (
                <DemoIndex key={demo.id} demo={demo} index={i} />
              ))}

              <div className="flex items-center gap-5 border-b border-faint px-2 py-5 opacity-40">
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
            className={cn("hidden max-w-145 mx-auto min-w-0", "lg:block")}
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
        <section
          key={demo.id}
          id={demo.id}
          className="min-h-below-nav scroll-mt-18 flex flex-col gap-8"
        >
          <h2 className="text-3xl">{demo.title}</h2>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg">Screenshots</h3>
            <p className="text-subtle">Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg">Video snippets</h3>
            <p className="text-subtle">Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg">Technical summary</h3>
            <p className="text-subtle">Lorem ipsum dolor sit amet.</p>
          </div>
        </section>
      ))}
    </div>
  );
}
