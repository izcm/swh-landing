import { Link } from "react-router";
import { Card } from "@/components/Card";
import { useLanguage } from "@/lib/context/language";
import { ArrowRight } from "./ArrowRight";
import { copy } from "./data/copy";
import { services } from "./data/services";

export function Services() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const serviceList = services[lang];

  return (
    <div className="tab-container">
      <header>
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.heading}</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {serviceList.map((section, i) => (
          <Card
            key={section.id}
            className="flex flex-col gap-6 sm:h-90 sm:flex-row"
          >
            <div className="flex flex-col gap-3 sm:w-2/5">
              <span className="eyebrow text-muted text-xs mb-4">{`0${i + 1} / ${section.eyebrow}`}</span>
              <h2 className="mt-4 text-4xl text-fg">{section.title}</h2>
              <p className="font-light text-subtle">{section.short}</p>

              <Link
                to={`/services/${section.id}`}
                className="btn btn-ghost self-start mt-auto px-1 inline-flex gap-3"
              >
                {t.explore}
                <ArrowRight color="var(--fg)" size={24} strokeWidth={1} />
              </Link>
            </div>
            <div className="cartesian-grid" />

            <div className="relative z20 order-first h-48 w-full shrink-0 items-center sm:order-0 sm:h-full sm:w-3/5">
              {section.diagrams.card}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
