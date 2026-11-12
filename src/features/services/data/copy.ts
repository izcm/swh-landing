import type { Localized } from "@/lib/context/language";

export const copy: Localized<{
  eyebrow: string;
  heading: string;
  explore: string;
  service: {
    overview: string;
    relatedServices: string;
  };
  serviceNav: {
    allServices: string;
  };
}> = {
  en: {
    eyebrow: "Services",
    heading: "What I build",
    explore: "Explore",
    service: {
      overview: "Overview",
      relatedServices: "Related services",
    },
    serviceNav: {
      allServices: "All services",
    },
  },
  no: {
    eyebrow: "Tjenester",
    heading: "Hva jeg lager",
    explore: "Les mer",
    service: {
      overview: "Om tjenesten",
      relatedServices: "Relaterte tjenester",
    },
    serviceNav: {
      allServices: "Alle tjenester",
    },
  },
};
