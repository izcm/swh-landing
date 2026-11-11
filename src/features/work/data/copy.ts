import type { Localized } from "@/lib/context/language";

export const copy: Localized<{
  eyebrow: string;
  heading: string;
  intro: string;
  recommend: string;
  web3Before: string;
  web3After: string;
  projectIndex: string;
  moreProjects: string;
}> = {
  en: {
    eyebrow: "MY WORK",
    heading: "Selected demos",
    intro:
      "Take a closer look at the services SWH offers and the work behind them. Each demo includes a link to a live app, alongside screenshots, short videos, and technical summaries.",
    recommend: "I recommend having a look at:",
    web3Before: "For those interested in blockchain related services, visit",
    web3After: ", I publish all of my Web3 work there.",
    projectIndex: "Project index",
    moreProjects: "More projects to follow",
  },
  no: {
    eyebrow: "PORTEFØLJE",
    heading: "Utvalgt arbeid",
    intro: "Lorem ipsum",
    recommend: "Lorem ipsum",
    web3Before: "Lorem ipsum",
    web3After: "Lorem ipsum",
    projectIndex: "Lorem ipsum",
    moreProjects: "Lorem ipsum",
  },
};
