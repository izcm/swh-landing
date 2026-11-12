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
    short: "Turn complex data into clear, actionable insights.",
    overview: {
      title: "Making sense of your data",
      paragraphs: [
        "Businesses collect large amounts of data through their daily operations, but that information isn't always easy to understand or navigate. Spreadsheets and long lists can make it difficult to see the bigger picture.",
        "Interactive dashboards bring information together in a visual format, using charts, maps, and other elements to highlight patterns, trends, and important details.",
        // "SWH develops visualizations tailored to your data and workflows, making it easier to find relevant information and make informed decisions.",
      ],
    },
    contact: {
      description: "Lorem ipsum",
      cta: "Get in touch",
    },
    relatedServices: {
      description:
        "Interactive tools are a natural extension of data visualization. They allow users to filter and locate specific records, then perform actions directly from the dashboard without switching between applications.",
      groups: [
        {
          serviceIds: ["interactive-tools"],
        },
      ],
    },
  },
  no: {
    ...shared,
    eyebrow: "VIS",
    title: "Visualisering",
    short: "Gjør komplekse data til tydelig og nyttig innsikt.",
    overview: {
      title: "Gjør data enklere å forstå",
      paragraphs: ["Lorem ipsum."],
    },
    contact: {
      description: "Lorem ipsum",
      cta: "Ta kontakt",
    },
    relatedServices: {
      description:
        "Interaktive verktøy er en naturlig utvidelse av datavisualisering.",
      groups: [
        {
          serviceIds: ["interactive-tools"],
        },
      ],
    },
  },
};
