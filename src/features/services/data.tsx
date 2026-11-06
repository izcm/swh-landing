import { FlowPlaceholder } from "@/components/FlowPlaceholder";
import { SvgPlaceholder } from "@/components/SvgPlaceholder";
import { ConnectingNodes } from "../diagrams/connect/ConnectingNodes";
import { GeoVisualization } from "../diagrams/visualize/GeoVisualization";
import { GearPair } from "../diagrams/automate/GearPair";
import { AutomateDiagram } from "../diagrams/automate/Diagram";
import { ConnectDiagram } from "../diagrams/connect/Diagram";
import { VisualizeDiagram } from "../diagrams/visualize/Diagram";

export const services = [
  {
    id: "integrations",
    eyebrow: "INT",
    title: "Integrations",
    short: "Connect your existing systems for optimized data flow.",
    smallDiagram: (
      <ConnectingNodes
        width="100%"
        height="100%"
        viewboxWidth={320}
        viewboxHeight={240}
        strokeWidth={1}
        shares={{ nodes: 1 / 3, connectors: 1 / 3, centerpiece: 1 / 3 }}
      />
    ),
    heroDiagram: <ConnectDiagram />,
    exampleFlowDiagram: <FlowPlaceholder label="Integrations example flow" />,
    exampleText: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    ],
    today: [
      "A business usually run daily operations by using several pieces of software. Maybe an ERP for accounting, Microsoft teams for collaboration, and internal spreadsheets for etc. bookkeeping.",
      "Each system may work great on its own, where you can gain value is the interaction between them.",
      "SWH helps you build the bridges between them, unlocking new capabilities. Review the short example below to see how.",
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
    smallDiagram: <GeoVisualization />,
    heroDiagram: <VisualizeDiagram />,
    exampleFlowDiagram: <FlowPlaceholder label="Visualization example flow" />,
    exampleText: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    ],
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
    smallDiagram: <SvgPlaceholder label="Interactive Tools" />,
    heroDiagram: <SvgPlaceholder label="Interactive Tools" />,
    exampleFlowDiagram: (
      <FlowPlaceholder label="Interactive Tools example flow" />
    ),
    exampleText: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    ],
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
    smallDiagram: <GearPair />,
    heroDiagram: <AutomateDiagram />,
    exampleFlowDiagram: <FlowPlaceholder label="Automation example flow" />,
    exampleText: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    ],
    today: [
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    ],
  },
];
