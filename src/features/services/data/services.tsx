import type { ReactNode } from "react";

import { SvgPlaceholder } from "@/components/SvgPlaceholder";

import { IntegrationsDiagram, Nodes } from "../../diagrams/integrations";
import {
  GeoVisualization,
  VisualizationsDiagram,
} from "../../diagrams/visualizations";
import { AutomationDiagram, GearPair } from "../../diagrams/automation";

type Service = {
  id: string;
  eyebrow: string;
  title: string;
  short: string;

  diagrams: {
    card: ReactNode;
    hero: ReactNode;
  };

  overview: {
    paragraphs: string[];
  };

  example: {
    part: string;
  };

  contact: {
    description: string;
    cta: string;
  };
};

export const services: Service[] = [
  {
    id: "integrations",
    eyebrow: "INT",
    title: "Integrations",
    short: "Connect your existing systems for optimized data flow.",
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
    overview: {
      paragraphs: [
        "A business usually run daily operations by using several pieces of software. Maybe an ERP for accounting, Microsoft teams for collaboration, and internal spreadsheets for etc. bookkeeping.",
        "Connecting these systems helps break down what we call information silos, where valuable data is isolated in separate systems.",
        "SWH can build and maintain such connections, unlocking new capabilities for your data.",
      ],
    },
    example: { part: "connecting-systems" },
    contact: {
      description: "Lorem ipsum dolor sit amet.",
      cta: "Lorem ipsum",
    },
  },
  {
    id: "visualization",
    eyebrow: "VIS",
    title: "Visualization",
    short: "Turn complex data into clear, actionable insight.",
    diagrams: {
      card: <GeoVisualization />,
      hero: <VisualizationsDiagram />,
    },
    overview: {
      paragraphs: [
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
      ],
    },
    example: { part: "understanding-data" },
    contact: {
      description: "Lorem ipsum dolor sit amet.",
      cta: "Lorem ipsum",
    },
  },
  {
    id: "interactive-tools",
    eyebrow: "TOOLS",
    title: "Interactive Tools",
    short: "Give users the right tools to explore, analyze, and act.",
    diagrams: {
      card: (
        <SvgPlaceholder label="Interactive Tools" width={480} height={300} />
      ),
      hero: (
        <SvgPlaceholder label="Interactive Tools" width={480} height={300} />
      ),
    },
    overview: {
      paragraphs: [
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
      ],
    },
    example: { part: "working-with-records" },
    contact: {
      description: "Lorem ipsum dolor sit amet.",
      cta: "Lorem ipsum",
    },
  },
  {
    id: "automation",
    eyebrow: "AUTO",
    title: "Automation",
    short: "Streamline processes and reduce manual work.",
    diagrams: {
      card: <GearPair />,
      hero: <AutomationDiagram />,
    },
    overview: {
      paragraphs: [
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
      ],
    },
    example: { part: "automating-updates" },
    contact: {
      description: "Lorem ipsum dolor sit amet.",
      cta: "Lorem ipsum",
    },
  },
];
