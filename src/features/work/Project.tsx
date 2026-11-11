import { services } from "../services/data/services";
import type { ProjectData } from "./data/projects";
import { Showcase } from "./Showcase";

export function Project({ project }: { project: ProjectData }) {
  const details = [
    { label: "CLIENT", text: project.client },
    { label: "SITUATION", text: project.situation },
    { label: "SOLUTION", text: project.solution },
  ];

  return (
    <section
      id={project.id}
      className="flex flex-col gap-8 min-h-below-nav scroll-mt-24 mt-6"
    >
      <div className="flex flex-col xl:flex-row gap-6">
        {/* TEXT CONTENT */}
        <div className="w-full flex flex-col gap-6 xl:max-w-sm">
          <div className="flex flex-col gap-3">
            <span className="inline-flex gap-2 eyebrow font-mono text-xs">
              WORK <span>/</span> PROJECT
            </span>
            <h2 className="text-5xl">{project.title}</h2>
          </div>

          <div className="horizontal-line" />

          {details.map(({ label, text }) => (
            <div key={label} className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-[0.2em]">
                {label}
              </span>
              <p className="text-subtle">{text}</p>
            </div>
          ))}

          <div className="horizontal-line" />

          <span className="text-sm text-accent-strong">
            {project.services
              .map((id) => services.find((service) => service.id === id)?.title)
              .join(" · ")}
          </span>
        </div>

        <Showcase technicalParts={project.technicalParts} />
      </div>
    </section>
  );
}
