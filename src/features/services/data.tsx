import { SvgPlaceholder } from "@/components/SvgPlaceholder";
import { GeoVisualization } from "../diagrams/small/GeoVisualization";
import { GearPair } from "../diagrams/small/GearPair";
import { ActDiagram } from "../diagrams/act/Diagram";
import { AutomateDiagram } from "../diagrams/automate/Diagram";
import { ConnectDiagram } from "../diagrams/connect/Diagram";
import { VisualizeDiagram } from "../diagrams/visualize/Diagram";

export const services = [
  {
    id: "integrations",
    eyebrow: "INT",
    title: "Integrations",
    short: "Connect your existing systems for optimized data flow.",
    smallDiagram: <SvgPlaceholder label="Integrations" />,
    bigDiagram: <ConnectDiagram />,
  },
  {
    id: "visualization",
    eyebrow: "VIS",
    title: "Visualization",
    short: "Turn complex data into clear, actionable insight.",
    smallDiagram: <GeoVisualization />,
    bigDiagram: <VisualizeDiagram />,
  },
  {
    id: "interactive-tools",
    eyebrow: "TOOLS",
    title: "Interactive Tools",
    short: "Give users the right tools to explore, analyze, and act.",
    smallDiagram: <SvgPlaceholder label="Interactive Tools" />,
    bigDiagram: <ActDiagram />,
  },
  {
    id: "automation",
    eyebrow: "AUTO",
    title: "Automation",
    short: "Streamline processes and reduce manual work.",
    smallDiagram: <GearPair />,
    bigDiagram: <AutomateDiagram />,
  },
];
