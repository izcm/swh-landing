import { Plus } from "lucide-react";
import { Link } from "react-router";
import { ArrowRight } from "../diagrams/shared/ArrowRight";
import { services } from "./data";

export function Services() {
  return (
    <div className="tab-container">
      <header>
        <span className="eyebrow tracking-[0.25em] font-normal">SERVICES</span>
        <h1 className="mt-3 text-5xl">What I build</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {services.map((section, i) => (
          <section
            key={section.eyebrow}
            className={`
              relative flex h-90 gap-6
              border border-faint-accent
              p-8 rounded-sm overflor-hidden
            `}
          >
            {[
              "top-0 left-0",
              "top-0 right-0",
              "bottom-0 left-0",
              "bottom-0 right-0",
            ].map((corner) => (
              <Plus
                key={corner}
                className={`absolute ${corner} text-fg-tinted opacity-80 stroke-1`}
              />
            ))}
            <div className="flex w-2/5 flex-col gap-3">
              <span className="eyebrow pb-4 text-[14px]">{`0${i + 1} / ${section.eyebrow}`}</span>
              <h2 className="mt-4 text-4xl text-fg">{section.title}</h2>
              <p className="font-light text-subtle">{section.short}</p>

              <Link
                to={`/services/${section.id}`}
                className="btn btn-ghost self-start mt-auto px-1 inline-flex gap-3"
              >
                Explore
                <ArrowRight color="var(--fg)" size={24} strokeWidth={1} />
              </Link>
            </div>
            <div className="cartesian-grid" />

            <div className="relative z20 w-3/5 items-center h-full shrink-0">
              {section.smallDiagram}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
