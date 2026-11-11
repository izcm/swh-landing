import type { Localized } from "@/lib/context/language";
import {
  GeoVisualization,
  VisualizationsDiagram,
} from "../../../diagrams/visualizations";
import type { Service } from ".";

const shared = {
  id: "visualization",
  diagrams: {
    card: <GeoVisualization />,
    hero: <VisualizationsDiagram />,
  },
  example: { part: "understanding-data" },
};

export const visualization: Localized<Service> = {
  en: {
    ...shared,
    eyebrow: "VIS",
    title: "Visualization",
    short: "Turn complex data into clear, actionable insight.",
    overview: {
      title: "Connecting systems, making data accessible",
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
        "Interactive Tools are a natural extension of data visualization. They allow users to filter and locate specific records, then perform actions directly from the dashboard without switching between applications.",
      groups: [
        {
          serviceIds: ["interactive-tools"],
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
      groups: [{ serviceIds: ["interactive-tools"] }],
    },
  },
};
