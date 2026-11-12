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
        "Businesses spend time updating records, transferring information, and sending notifications. These tasks are necessary, but many can be automated.",
        "Automation allows software to execute predefined tasks based on specific conditions or events. For example, processing incoming emails, updating records, or notifying the right person when something changes.",
        "SWH develops automated processes tailored to your workflows, reducing manual work and keeping information up to date.",
      ],
    },
    contact: {
      description: "Lorem ipsum",
      cta: "Get in touch",
    },
    relatedServices: {
      description:
        "Automation works within a single system or across several. When a process depends on data from multiple applications, integrations provide the connections needed.",
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
      paragraphs: ["Lorem ipsum"],
    },
    contact: {
      description: "Lorem ipsum",
      cta: "Ta kontakt",
    },
    relatedServices: {
      description: "Lorem ipsum",
      groups: [{ serviceIds: ["integrations"] }],
    },
  },
};
