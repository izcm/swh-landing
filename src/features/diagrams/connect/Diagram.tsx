import { innerRoofFill } from "@/features/diagrams/shared/centerpiece/Centerpiece";

import { ConnectingNodes } from "./ConnectingNodes";
import { connectingNodesAngles } from "./connectingNodesLayout";
import { DataGrid } from "./DataGrid";
import { connectLayout } from "./connectLayout";
import { SyncArrows } from "./SyncArrows";

export function ConnectDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 360;
  const angles = connectingNodesAngles;

  const { connectingNodes, dataGrid, centerpiece, syncArrows, connectors } =
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
      className="block w-full"
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

      {/* the second connector: from the centerpiece's right wall down to the data grid */}
      <path
        d={`M ${connectors.centerpieceOut.x} ${connectors.centerpieceOut.y} L ${connectors.dataGridIn.x} ${connectors.dataGridIn.y}`}
        stroke="var(--accent-dim)"
        strokeWidth={1}
        fill="none"
        strokeDasharray="8 12"
      />

      {/* left + middle: the nodes, their connectors and the centerpiece */}
      <ConnectingNodes
        x={connectingNodes.translateX}
        y={connectingNodes.translateY}
        width={connectingNodes.width}
        height={connectingNodes.height}
        viewboxWidth={connectingNodes.width}
        viewboxHeight={connectingNodes.height}
        strokeWidth={1}
        shares={connectingNodes.shares}
      />

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

      {/* under the centerpiece: two arrows spinning round a circle */}
      {/* <SyncArrows
        {...syncArrows}
        duration={12}
        // the inner cube's color, more opaque
        color={`oklch(from ${innerRoofFill} l c h / 0.55)`}
      /> */}

      {/* right: the data grid */}
      <DataGrid layout={dataGrid} />
    </svg>
  );
}
