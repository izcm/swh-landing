import { Link, Navigate, NavLink, useParams } from "react-router";

import { cn } from "@/lib/cn";
import { services } from "./data/services";
import { ExampleBox } from "./ExampleBox";

function ServiceNav() {
  return (
    <nav className="flex flex-col items-start gap-8">
      <Link
        to="/services"
        className="eyebrow text-xs tracking-[0.25em] underline decoration-accent/50 decoration-1 underline-offset-8 hover:text-fg"
      >
        ALL SERVICES
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        {services.map((service) => (
          <NavLink
            key={service.id}
            to={`/services/${service.id}`}
            state={{ keepScroll: true }}
            className={({ isActive }) =>
              cn(
                "rounded-sm border px-4 py-2 text-[11px] font-normal uppercase tracking-[0.2em] transition-colors",
                isActive
                  ? "border-accent/40 bg-raised/40 text-accent"
                  : "border-line text-subtle hover:text-fg",
              )
            }
          >
            {service.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function Service() {
  const { id } = useParams();
  const section = services.find((s) => s.id === id);

  if (!section) return <Navigate to="/services" replace />;

  return (
    <div className="tab-container max-w-4xl">
      <ServiceNav />
      <header className="mt-10">
        <h1 className="text-6xl">{section.title}</h1>
      </header>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="max-w-2xl mx-auto">{section.heroDiagram}</div>
      </div>

      <section className="mt-16">
        <span className="eyebrow">TODAY</span>
        <div className="mt-3 flex flex-col gap-3 text-lg leading-relaxed text-subtle">
          {section.today.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <ExampleBox examplePart={section.examplePart} />
    </div>
  );
}
