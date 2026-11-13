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
      "Take a closer look at the services SWH offers and the work behind them. Each demo includes a link to the live app, alongside screenshots, short videos, and technical summaries.",
    recommend: "I recommend having a look at",
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
    intro:
      "Sjekk ut hva SWH tilbyr gjennom disse utvalgte demoene. Hver demo inkluderer link til live applikasjon, skjermbilder og videoer, samt en teknisk oppsummering.",
    recommend: "Jeg anbefaler å sjekke ut ",
    web3Before:
      "For de som er interesserte i SWHs blockchain relaterte arbeid, besøk",
    web3After: ".",
    projectIndex: "Prosjekt indeks",
    moreProjects: "Flere prosjekter kommer",
    showcase: {
      application: "Applikasjon",
      technicalOverview: "Teknisk oppsummering",
      approach: "Fremgangsmåte",
      result: "Resultat",
      previous: "Forrige",
      next: "Neste",
      figure: "FIG.",
      close: "Lukk",
    },
    project: {
      work: "Arbeid",
      project: "Prosjekt",
      client: "Klient",
      situation: "Situasjonen",
      solution: "Løsningen",
    },
  },
};
