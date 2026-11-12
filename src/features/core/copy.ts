import type { Localized } from "@/lib/context/language";

export const copy: Localized<{
  underDevelopment: string;
  contact: string;
  home: string;
  services: string;
  work: string;
  hero: {
    welcome: string[];
    cta: string;
  };
}> = {
  en: {
    underDevelopment: "Currently under development",
    contact: "Contact",
    home: "Home",
    services: "Services",
    work: "Work",
    hero: {
      welcome: [
        "Welcome to SWH Studio, an independent software company focused on helping Norwegian businesses modernize their technology and operations.",
        "Explore the page to see what SWH does. I've kept the content approachable while still presenting the actual tech, not just buzzwords. If you have any questions, feel free to reach out.",
      ],
      cta: "See what I build",
    },
  },
  no: {
    underDevelopment: "Under utvikling",
    contact: "Kontakt",
    home: "Hjem",
    services: "Tjenester",
    work: "Arbeid",
    hero: {
      welcome: [
        "Velkommen til SWH Studio, et uavhengig, norsk firma som leverer skreddersydd programvare. Målet er å hjelpe bedrifter med å modernisere sine IT-prosesser.",
        "Utforsk siden for å bli bedre kjent med tjenestene SWH tilbyr. Forklaringene er holdt enkle, samtidig som den faktiske teknologien vises frem, ikke bare buzzord. Har du spørsmål, er det bare å ta kontakt.",
      ],
      cta: "Sjekk ut hva jeg lager",
    },
  },
};
