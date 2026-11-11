import type { Localized } from "@/lib/context/language";
import { IntegrationsDiagram, Nodes } from "../../../diagrams/integrations";
import type { Service } from ".";

const shared = {
  id: "integrations",
  diagrams: {
    card: (
      <Nodes
        width="100%"
        height="100%"
        viewboxWidth={320}
        viewboxHeight={240}
        strokeWidth={1}
        shares={{ nodes: 1 / 3, connectors: 1 / 3, cube: 1 / 3 }}
      />
    ),
    hero: <IntegrationsDiagram />,
  },
  example: { part: "connecting-systems" },
};

export const integrations: Localized<Service> = {
  en: {
    ...shared,
    eyebrow: "INT",
    title: "Integrations",
    short: "Connect your existing systems for optimized data flow.",
    overview: {
      title: "Connecting systems, making data accessible",
      paragraphs: [
        "A business usually run daily operations by using several pieces of software. Maybe an ERP for accounting, Microsoft teams for collaboration, and internal spreadsheets for etc. bookkeeping.",
        "Connecting these systems helps break down what we call information silos, where valuable data is isolated in separate systems.",
        "SWH can build and maintain such connections, unlocking new capabilities for your data.",
      ],
    },
    contact: {
      description: "Lorem ipsum dolor sit amet.",
      cta: "Lorem ipsum",
    },
    relatedServices: {
      description:
        "Integrations often provide the foundation for extending existing systems.",
      groups: [
        {
          label: "User-facing",
          description: "Explore data and perform actions through a browser.",
          serviceIds: ["visualization", "interactive-tools"],
        },
        {
          label: "Background processes",
          description: "Handle tasks and updates automatically.",
          serviceIds: ["automation"],
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
      paragraphs: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
    },
    contact: { description: "Lorem ipsum", cta: "Lorem ipsum" },
    relatedServices: {
      description: "Lorem ipsum",
      groups: [
        {
          label: "Lorem ipsum",
          description: "Lorem ipsum",
          serviceIds: ["visualization", "interactive-tools"],
        },
        {
          label: "Lorem ipsum",
          description: "Lorem ipsum",
          serviceIds: ["automation"],
        },
      ],
    },
  },
};
