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
      title: "Lorem ipsum dolor sit amet",
      paragraphs: [
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
      ],
    },
    contact: {
      description: "Lorem ipsum dolor sit amet.",
      cta: "Lorem ipsum",
    },
    relatedServices: {
      description:
        "Automation can operate independently or across several systems. When a process requires information from multiple applications, integrations can provide the necessary connections to automate the workflow.",
      groups: [
        {
          serviceIds: ["integrations"],
        },
      ],
    },
  },
  no: {
    ...shared,
    eyebrow: "Lorem ipsum",
    title: "Lorem ipsum",
    short: "Lorem ipsum",
    overview: {
      title: "Lorem ipsum",
      paragraphs: ["Lorem ipsum", "Lorem ipsum"],
    },
    contact: { description: "Lorem ipsum", cta: "Lorem ipsum" },
    relatedServices: {
      description: "Lorem ipsum",
      groups: [{ serviceIds: ["integrations"] }],
    },
  },
};
