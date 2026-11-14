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
        "Businesses collect large amounts of data through their daily operations, but that information isn't always easy to understand or navigate.",
        "Interactive dashboards bring information together in a visual format, using charts, maps, and other elements to highlight patterns, trends, and important details.",
      ],
    },
    contact: {
      description: "Lorem ipsum",
      cta: "Get in touch",
    },
    relatedServices: {
      description:
        "Interactive Tools complement Visualization by allowing users to perform actions directly from the information presented.",
      // "Interactive tools are a natural extension of data visualization. They allow users to filter and locate specific records, then perform actions directly from the dashboard without switching between applications.",
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
    short: "Øk innsikt med interaktive dashboard.",
    overview: {
      title: "",
      paragraphs: [
        "Bedrifter genererer store mengder data gjennom den daglige driften. Når denne informasjonen samles og visualiseres, blir det enklere å oppdage mønstre, se sammenhenger og ta beslutninger basert på faktiske tall.",
        "En skreddersydd webapplikasjon kan hente data fra eksisterende systemer og presentere dem gjennom interaktive grafer, kart og oversikter tilpasset bedriftens arbeidsprosesser.",
      ],
    },
    contact: {
      description: "Lorem ipsum",
      cta: "Ta kontakt",
    },
    relatedServices: {
      description:
        "Interaktive verktøy utfyller visualisering ved å knytte konkrete handlinger til informasjonen som vises.",
      groups: [
        {
          serviceIds: ["interactive-tools"],
        },
      ],
    },
  },
};
