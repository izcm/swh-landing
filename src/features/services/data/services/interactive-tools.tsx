import { SvgPlaceholder } from "@/components/SvgPlaceholder";
import type { Localized } from "@/lib/context/language";
import type { Service } from ".";

const shared = {
  id: "interactive-tools",
  diagrams: {
    card: <SvgPlaceholder label="Interactive Tools" width={480} height={300} />,
    hero: <SvgPlaceholder label="Interactive Tools" width={480} height={300} />,
  },
  example: { part: "working-with-records" },
};

export const interactiveTools: Localized<Service> = {
  en: {
    ...shared,
    eyebrow: "TOOLS",
    title: "Interactive Tools",
    short: "Give users the right tools to explore, analyze, and act.",
    overview: {
      title: "Lorem ipsum dolor sit amet",
      paragraphs: [
        "Beyond visualizing data, a web application can provide interactive tools that allow users to act on the information they see.",
        "With custom software, we can define how these actions are carried out. Instead of moving between different systems to complete a task, we can bring the necessary steps together into a single workflow, triggered directly from the application.",
        "Interactive tools are conceptually similar to automation, but differ in how actions are initiated. While automation executes predefined workflows based on schedules or conditions, interactive tools let users initiate actions directly from the application.",
      ],
    },
    contact: {
      description: "Lorem ipsum dolor sit amet.",
      cta: "Lorem ipsum",
    },
    relatedServices: {
      description:
        "Interactive Tools and Visualization work particularly well together, allowing users to navigate data and perform actions in one place.",
      groups: [
        {
          serviceIds: ["visualization"],
        },
      ],
    },
  },
  no: {
    ...shared,
    eyebrow: "TOOLS",
    title: "Interaktive verktøy",
    short: "Gjør oppgaver med mange steg til én enkel handling.",
    overview: {
      title: "Lorem ipsum",
      paragraphs: [
        "Når man bruker flere systemer, må man ofte utføre én handling i ett system og den neste i et annet for å fullføre en oppgave. Med skreddersydd programvare kan vi samle disse stegene i én prosess som brukeren kan starte direkte fra applikasjonen.",
        "Interaktive verktøy og automatisering bygger på lignende prinsipper. Begge kan utføre forhåndsdefinerte handlinger, men forskjellen ligger i hvordan de settes i gang. Mens automatisering starter prosesser basert på bestemte regler eller faste tidspunkter, lar interaktive verktøy brukeren selv starte dem fra applikasjonen.",
      ],
    },
    contact: { description: "Lorem ipsum", cta: "Lorem ipsum" },
    relatedServices: {
      description:
        "Interaktive verktøy og visualisering fungerer spesielt godt sammen, ettersom brukeren kan utforske data og utføre handlinger på ett og samme sted.",
      groups: [{ serviceIds: ["visualization"] }],
    },
  },
};
