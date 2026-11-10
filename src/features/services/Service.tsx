import { Link, Navigate, NavLink, useParams } from "react-router";

import { SvgPlaceholder } from "@/components/SvgPlaceholder";
import { cn } from "@/lib/cn";
import { services } from "./data/services";
import { ExampleBox } from "./ExampleBox";
import { RelatedServices } from "./RelatedServices";

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
    <div className="tab-container max-w-7xl">
      <ServiceNav />
      <header className="mt-10">
        <h1 className="text-5xl">{section.title}</h1>
      </header>
      <div className="flex mx-auto pb-16 border-b border-line overflow-y-clip">
        <div className="max-w-2xl w-full mx-auto">{section.diagrams.hero}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        <section>
          <span className="eyebrow font-semibold">OVERVIEW</span>

          <div className="mt-3 flex flex-col gap-3 leading-relaxed text-subtle text-lg font-light">
            {section.overview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* <section
        className={cn("mt-16 p-6", "bg-lowered border border-line rounded")}
      >
        <SvgPlaceholder label="Diagram" width={450} height={200} />
      </section> */}

        {section.relatedServices && (
          <RelatedServices relatedServices={section.relatedServices} />
        )}
      </div>
    </div>
  );
}
