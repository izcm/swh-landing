import type { ReactNode } from "react";
import {
  FileSpreadsheet,
  Cloud,
  Settings,
  FileText,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

// Every satellite's position, in absolute canvas coordinates.
// Change a number here and both the box and its connector move together.
const hub = { x: 300, y: 200 };

type NodeId = "sheet" | "cloud" | "settings" | "file" | "chart";

// const nodes: { id: NodeId; x: number; y: number; gradient: string }[] = [
//   { id: "sheet", x: 180, y: 90, gradient: "sheet-gradient" },
//   { id: "cloud", x: 420, y: 90, gradient: "cloud-gradient" },
//   { id: "settings", x: 150, y: 200, gradient: "settings-gradient" },
//   { id: "file", x: 450, y: 200, gradient: "document-gradient" },
//   { id: "chart", x: 180, y: 310, gradient: "chart-gradient" },
// ];

const nodes: { id: NodeId; x: number; y: number; gradient: string }[] = [
  { id: "sheet", x: 180, y: 110, gradient: "sheet-gradient" },
  { id: "cloud", x: 420, y: 110, gradient: "cloud-gradient" },
  { id: "settings", x: 150, y: 200, gradient: "settings-gradient" },
  { id: "file", x: 450, y: 200, gradient: "document-gradient" },
  { id: "chart", x: 180, y: 290, gradient: "chart-gradient" },
];

const HUB_HALF = 45;
const NODE_HALF = 30;

// Right-angle path from a satellite's edge into the hub's nearest edge.
function connectorPath(node: { x: number; y: number }) {
  const dx = node.x - hub.x;
  const dy = node.y - hub.y;

  if (dy === 0) {
    // same height as hub: one straight horizontal line
    const startX = node.x + (dx > 0 ? -NODE_HALF : NODE_HALF);
    const endX = hub.x + (dx > 0 ? HUB_HALF : -HUB_HALF);
    return `M${startX} ${node.y} H${endX}`;
  }

  // above/below the hub: run sideways into the hub's edge, round the corner,
  // then drop/rise into its top/bottom face
  const radius = 15;
  const startX = node.x + (dx > 0 ? -NODE_HALF : NODE_HALF);
  const sideX = hub.x + (dx > 0 ? HUB_HALF : -HUB_HALF);
  const cornerX = sideX + (dx > 0 ? -radius : radius);
  const cornerY = node.y + (dy < 0 ? radius : -radius);
  const faceY = hub.y + (dy < 0 ? -HUB_HALF : HUB_HALF);
  return `M${startX} ${node.y} H${sideX} Q${cornerX} ${node.y} ${cornerX} ${cornerY} V${faceY}`;
}

const ICONS: Record<NodeId, ReactNode> = {
  sheet: <FileSpreadsheet stroke="url(#sheet-gradient)" strokeWidth={1.6} />,
  cloud: <Cloud stroke="url(#cloud-gradient)" strokeWidth={1.6} />,
  settings: <Settings stroke="url(#settings-gradient)" strokeWidth={1.6} />,
  file: <FileText stroke="url(#document-gradient)" strokeWidth={1.6} />,
  chart: (
    <ChartNoAxesColumnIncreasing
      stroke="url(#chart-gradient)"
      strokeWidth={2}
    />
  ),
};

export default function Map() {
  return (
    <svg
      className="map"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 60 400 280"
    >
      <defs>
        <linearGradient
          id="sheet-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#8AF0D4" />
          <stop offset="100%" stopColor="#42D6AC" />
        </linearGradient>
        <linearGradient
          id="cloud-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#67D4FF" />
          <stop offset="100%" stopColor="#269BFF" />
        </linearGradient>
        <linearGradient
          id="settings-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#A7A1FF" />
          <stop offset="100%" stopColor="#747BFF" />
        </linearGradient>
        <linearGradient
          id="document-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#EDF7FF" />
          <stop offset="100%" stopColor="#A9CBE8" />
        </linearGradient>
        <linearGradient
          id="chart-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#79D5FF" />
          <stop offset="100%" stopColor="#3AA5FF" />
        </linearGradient>
      </defs>

      {/* connectors: base lines, drawn first so the boxes sit on top of the ends */}
      <g fill="none" stroke="var(--line)" strokeWidth={1}>
        {nodes.map((n) => (
          <path key={n.id} d={connectorPath(n)} />
        ))}
      </g>

      {/* connectors: traveling pulse, same paths, drawn on top */}
      <g
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinecap="round"
      >
        {nodes.map((n, i) => (
          <path
            key={n.id}
            className="pulse"
            d={connectorPath(n)}
            style={{ animationDelay: `${-(i * (5 / nodes.length))}s` }}
          />
        ))}
      </g>

      {/* center hub */}
      <g transform={`translate(${hub.x} ${hub.y})`}>
        <rect
          x={-HUB_HALF}
          y={-HUB_HALF}
          width={HUB_HALF * 2}
          height={HUB_HALF * 2}
          rx="var(--rx-center)"
          fill="none"
          stroke="#335976"
          strokeWidth="var(--node-stroke-width) * 1.5"
        />
        <text
          x={0}
          y={7}
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontSize={22}
          fontWeight={600}
          fill="#fff"
        >
          SWH
        </text>
      </g>

      {/* satellites */}
      {nodes.map((n) => (
        <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
          <rect
            x={-NODE_HALF}
            y={-NODE_HALF}
            width={NODE_HALF * 2}
            height={NODE_HALF * 2}
            rx="var(--rx-node)"
            fill="none"
            stroke="#335976"
            strokeWidth="var(--node-stroke-width)"
          />
          <g
            style={{
              transform: "scale(var(--icon-scale)) translate(-12px, -12px)",
            }}
            fill="none"
            // stroke={`url(#${n.gradient})`}
            // strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS[n.id]}
          </g>
        </g>
      ))}
    </svg>
  );
}
