import { SvgPlaceholder } from "@/components/SvgPlaceholder";

import { IntegrationsDiagram, Nodes } from "../../diagrams/integrations";
import { GeoVisualization, VisualizationsDiagram } from "../../diagrams/visualizations";
import { AutomationDiagram, GearPair } from "../../diagrams/automation";

export const services = [
  {
    id: "integrations",
    eyebrow: "INT",
    title: "Integrations",
    short: "Connect your existing systems for optimized data flow.",
    cardDiagram: (
      <Nodes
        width="100%"
        height="100%"
        viewboxWidth={320}
        viewboxHeight={240}
        strokeWidth={1}
        shares={{ nodes: 1 / 3, connectors: 1 / 3, cube: 1 / 3 }}
      />
    ),
    heroDiagram: <IntegrationsDiagram />,
    examplePart: "connecting-systems",
    today: [
      "A business usually run daily operations by using several pieces of software. Maybe an ERP for accounting, Microsoft teams for collaboration, and internal spreadsheets for etc. bookkeeping.",
      "Each system may work great on its own, where you can gain value is the interaction between them.",
      "SWH helps you build these connections, unlocking new capabilities. Review the short example below to see how.",
    ],
    sisterServices: [
      "After integrating successfully, several new doors open. Lets put those into two categories: ",
      "",
    ],
  },
  {
    id: "visualization",
    eyebrow: "VIS",
    title: "Visualization",
    short: "Turn complex data into clear, actionable insight.",
    cardDiagram: <GeoVisualization />,
    heroDiagram: <VisualizationsDiagram />,
    examplePart: "understanding-data",
    today: [
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    ],
  },
  {
    id: "interactive-tools",
    eyebrow: "TOOLS",
    title: "Interactive Tools",
    short: "Give users the right tools to explore, analyze, and act.",
    cardDiagram: (
      <SvgPlaceholder label="Interactive Tools" width={480} height={300} />
    ),
    heroDiagram: (
      <SvgPlaceholder label="Interactive Tools" width={480} height={300} />
    ),
    examplePart: "working-with-records",
    today: [
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    ],
  },
  {
    id: "automation",
    eyebrow: "AUTO",
    title: "Automation",
    short: "Streamline processes and reduce manual work.",
    cardDiagram: <GearPair />,
    heroDiagram: <AutomationDiagram />,
    examplePart: "automating-updates",
    today: [
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    ],
  },
];
