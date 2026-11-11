import { Link } from "react-router";

import { useLanguage } from "@/lib/context/language";
import { ArrowRight } from "./ArrowRight";
import { copy } from "./data/copy";
import { services, type RelatedServicesData } from "./data/services";

export function RelatedServices({
  relatedServices,
}: {
  relatedServices: RelatedServicesData;
}) {
  const { lang } = useLanguage();
  const t = copy[lang].service;
  const { description, groups } = relatedServices;

  return (
    <section className="px-6 border-l-2 border-line rounded-sm bg-faint/10 py-6">
      <h2 className="eyebrow font-semibold">{t.relatedServices}</h2>
      <p className="mt-3 leading-relaxed text-subtle">{description}</p>

      <div className="mt-6 flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.serviceIds.join("-")} className="flex flex-col gap-2">
            {group.label && (
              <h3 className="font-mono font-normal text-xs tracking-[0.2em] uppercase">
                {group.label}
              </h3>
            )}
            {group.description && (
              <p className="text-subtle">{group.description}</p>
            )}

            {group.serviceIds
              .map((id) => services[lang].find((service) => service.id === id))
              .filter((service) => service !== undefined)
              .map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="btn btn-ghost flex justify-between items-center py-2.5 pr-2"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-normal">{service.title}</span>
                    <span className="text-subtle font-light text-sm">
                      {service.short}
                    </span>
                  </div>
                  <ArrowRight color="var(--fg)" size={24} strokeWidth={1} />
                </Link>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
