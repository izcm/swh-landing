import type { Localized } from "@/lib/context/language";

export const copy: Localized<{
  eyebrow: string;
  heading: string;
  combine: string;
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
    combine: "Can be combined into a web app",
    explore: "Explore",
    service: {
      overview: "Overview",
      relatedServices: "Complementary services",
    },
    serviceNav: {
      allServices: "All services",
    },
  },
  no: {
    eyebrow: "Tjenester",
    heading: "Hva jeg lager",
    combine: "Kan kombineres til en webapp",
    explore: "Les mer",
    service: {
      overview: "Om tjenesten",
      relatedServices: "Utfyllende tjenester",
    },
    serviceNav: {
      allServices: "Alle tjenester",
    },
  },
};
