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
  showcase: {
    application: string;
    technicalOverview: string;
    approach: string;
    result: string;
    previous: string;
    next: string;
    figure: string;
    close: string;
  };
  project: {
    work: string;
    project: string;
    client: string;
    situation: string;
    solution: string;
  };
}> = {
  en: {
    eyebrow: "My work",
    heading: "Selected demos",
    intro:
      "Take a closer look at the services SWH offers and the work behind them. Each demo includes a link to a live app, alongside screenshots, short videos, and technical summaries.",
    recommend: "I recommend having a look at:",
    web3Before: "For those interested in blockchain related services, visit",
    web3After: ", I publish all of my Web3 work there.",
    projectIndex: "Project index",
    moreProjects: "More projects to follow",
    showcase: {
      application: "Application",
      technicalOverview: "Technical overview",
      approach: "Approach",
      result: "Result",
      previous: "Previous",
      next: "Next",
      figure: "FIG.",
      close: "Close",
    },
    project: {
      work: "Work",
      project: "Project",
      client: "Client",
      situation: "Situation",
      solution: "Solution",
    },
  },
  no: {
    eyebrow: "Portefølje",
    heading: "Utvalgt arbeid",
    intro: "Lorem ipsum",
    recommend: "Lorem ipsum",
    web3Before: "Lorem ipsum",
    web3After: "Lorem ipsum",
    projectIndex: "Lorem ipsum",
    moreProjects: "Lorem ipsum",
    showcase: {
      application: "Lorem ipsum",
      technicalOverview: "Lorem ipsum",
      approach: "Lorem ipsum",
      result: "Lorem ipsum",
      previous: "Lorem ipsum",
      next: "Lorem ipsum",
      figure: "Lorem ipsum",
      close: "Lorem ipsum",
    },
    project: {
      work: "Lorem ipsum",
      project: "Lorem ipsum",
      client: "Lorem ipsum",
      situation: "Lorem ipsum",
      solution: "Lorem ipsum",
    },
  },
};
