import { deg } from "@/lib/svg";

import { Centerpiece, innerFill } from "@/features/diagrams/shared/Centerpiece";

import { DataGrid } from "./DataGrid";
import { connectLayout } from "./layout";
import { Nodes } from "./nodes/Nodes";
import { SyncArrows } from "./SyncArrows";

export function ConnectDiagram() {
  const viewboxWidth = 615;
  const viewboxHeight = 270;
  // edge slopes in radians: A down to the right, B up to the right
  const angles = { angleA: deg(15), angleB: deg(10) };

  const { nodes, dataGrid, centerpiece, syncArrows, connectors } =
    connectLayout({
      viewboxWidth,
      viewboxHeight,
      angles,
    });

  // debug: where each section starts and ends, left to right
  const sectionEdges = [
    0,
    centerpiece.translateX,
    dataGrid.translateX,
    viewboxWidth,
  ];

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      overflow="visible"
      className="block max-w-3xl w-full mx-auto"
    >
      {/* debug: the sections' edges as plain lines, all drawn the same way
          (verticals top → bottom, horizontals left → right) */}
      <g
        className="svg-debug"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      >
        <line x1={0} y1={0} x2={viewboxWidth} y2={0} />
        <line x1={0} y1={viewboxHeight} x2={viewboxWidth} y2={viewboxHeight} />
        {sectionEdges.map((x, i) => (
          <line key={i} x1={x} y1={0} x2={x} y2={viewboxHeight} />
        ))}
      </g>

      {/* the connectors: a straight line from each node to the centerpiece's
          left wall, the same style as the hero's */}
      {connectors.nodeConnectors.map((path, i) => (
        <path
          key={i}
          d={path}
          stroke="var(--connector-color)"
          strokeWidth={1}
          fill="none"
          strokeDasharray="8 12"
        />
      ))}

      {/* the second connector: from the centerpiece's right wall down to the data grid */}
      <path
        d={`M ${connectors.centerpieceOut.x} ${connectors.centerpieceOut.y} L ${connectors.dataGridIn.x} ${connectors.dataGridIn.y}`}
        stroke="var(--connector-color)"
        strokeWidth={1}
        fill="none"
        strokeDasharray="8 12"
      />

      {/* left: the nodes */}
      <Nodes layout={nodes} />

      {/* debug: the connectors' ends: where each line leaves and arrives */}
      {[
        ...connectors.nodesOut,
        ...connectors.innerCubeIns,
        connectors.centerpieceOut,
        connectors.dataGridIn,
      ].map((p, i) => (
        <circle
          key={i}
          className="svg-debug"
          cx={p.x}
          cy={p.y}
          r={2}
          fill="#ff4fa3" // pink
        />
      ))}
      {/* middle: the centerpiece */}
      <Centerpiece
        x={centerpiece.x}
        y={centerpiece.y}
        {...centerpiece.layout}
        angles={centerpiece.angles}
        cubeStrokeWeight={0.4} // knob
        innerCubeStrokeWeight={0.4} // knob
      />

      {/* under the centerpiece: two arrows spinning round a circle */}
      <SyncArrows
        {...syncArrows}
        duration={12}
        // the inner cube's color, more opaque
        color={`oklch(from ${innerFill} l c h / 0.55)`}
      />

      {/* right: the data grid */}
      <DataGrid layout={dataGrid} />
    </svg>
  );
}
