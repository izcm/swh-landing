import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";
import { CubeStackDiagram, SoftwareDiagram } from "../diagrams/software";
import { copy } from "./data/copy";
import { projects } from "./data/projects";
import { Project } from "./Project";
import { IndexRow } from "./IndexRow";

export function Work() {
  const { lang } = useLanguage();
  const t = copy[lang];

  return (
    <div className="tab-container">
      <header>
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.heading}</h1>
      </header>
      <div className="min-h-below-nav">
        <div className={cn("flex flex-col", "md:flex-row")}>
          <div
            className={cn(
              "relative z-10 w-full flex flex-col gap-4 text-subtle",
              "md:max-w-lg",
              "lg:max-w-3xl",
            )}
          >
            <p>{t.intro}</p>
            <p>
              {t.recommend}{" "}
              <a href="#hubben" className="text-accent underline">
                Hubben
              </a>
            </p>
            <p>
              {t.web3Before}{" "}
              <a
                href="https://izblocks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                izblocks.com
              </a>
              {t.web3After}
            </p>
            <nav
              aria-label={t.projectIndex}
              className={cn("w-full border-t border-line mt-6", "md:max-w-lg")}
            >
              {projects.map((project, i) => (
                <IndexRow key={project.id} project={project} index={i} />
              ))}

              <div className="flex items-center gap-5 border-b border-line px-2 py-5 opacity-60">
                <span className="font-mono text-xs text-muted">
                  {String(projects.length + 1).padStart(2, "0")}
                </span>

                <span className="flex-1 text-sm text-muted">
                  {t.moreProjects}
                </span>

                <span className="text-muted px-2">—</span>
              </div>
            </nav>
          </div>

          <SoftwareDiagram
            className={cn("hidden max-w-125 mx-auto min-w-0", "lg:block")}
          />

          <div
            className={cn(
              "order-first h-60 -mt-6 py-6 overflow-y-clip",
              "md:order-0 md:overflow-y-visible md:flex-1",
              "lg:hidden mb-8",
            )}
          >
            <CubeStackDiagram className={cn("h-50 min-w-0")} />
          </div>
        </div>
      </div>

      {projects.map((project) => (
        <Project key={project.id} project={project} />
      ))}
    </div>
  );
}
