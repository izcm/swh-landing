import type { Localized } from "@/lib/context/language";
import { AutomationDiagram, GearPair } from "../../../diagrams/automation";
import type { Service } from ".";

const shared = {
  id: "automation",
  diagrams: {
    card: <GearPair />,
    hero: <AutomationDiagram />,
  },
  example: { part: "automating-updates" },
};

export const automation: Localized<Service> = {
  en: {
    ...shared,
    eyebrow: "AUTO",
    title: "Automation",
    short: "Streamline processes and reduce manual work.",
    overview: {
      title: "Let software handle repetitive tasks",
      paragraphs: [
        "Automation allows software to execute predefined tasks based on specific conditions, events, or schedules. This can include processing incoming emails, updating records, or notifying relevant people when something changes.",
        "When integrating with external systems, automation can also be used to schedule regular data updates between them.",
        "SWH helps identify which processes can be automated, define the necessary rules, and implement the technical solutions.",
      ],
    },
    contact: {
      description: "Lorem ipsum",
      cta: "Get in touch",
    },
    relatedServices: {
      description:
        "Integrations make it possible to automate processes across multiple systems.",
      groups: [{ serviceIds: ["integrations"] }],
    },
  },
  no: {
    ...shared,
    eyebrow: "AUTO",
    title: "Automatisering",
    short: "Reduser manuelt arbeid med bakgrunnsprosesser.",
    overview: {
      title: "Automatiser gjentakende oppgaver",
      paragraphs: [
        "Automatisering innebærer at programvare utfører forhåndsdefinerte oppgaver uten at brukeren trenger å starte dem manuelt. Oppgavene kan utløses av bestemte hendelser, oppfylte betingelser eller faste tidspunkter.",
        "Det kan for eksempel være å behandle innkommende e-poster, oppdatere oppføringer eller sende varsler når noe endrer seg. Automatisering kan også brukes til å hente inn data fra eksterne systemer med jevne mellomrom.",
        "SWH hjelper med å kartlegge aktuelle prosesser, definere regelsett og stå for programmering og vedlikehold.",
      ],
    },
    contact: {
      description: "Lorem ipsum",
      cta: "Ta kontakt",
    },
    relatedServices: {
      description:
        "Man kan automatisere prosesser på tvers av systemer ved hjelp av integrasjoner.",
      groups: [{ serviceIds: ["integrations"] }],
    },
  },
};
