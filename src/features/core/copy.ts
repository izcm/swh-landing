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
        "Welcome to SWH Studio, an independent software studio focused on helping Norwegian businesses modernize their technology and operations.",
        "Explore the page to see what SWH does. I've tried to make the content approachable whilst still presenting the actual tech, not just buzzwords. If you have any questions, feel free to reach out.",
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
      welcome: ["Lorem ipsum", "Lorem ipsum"],
      cta: "Lorem ipsum",
    },
  },
};
