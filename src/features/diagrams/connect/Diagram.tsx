import { deg, SyncArrows } from "@/lib/svg";

import { Floor, tileStyleNames } from "../shared/floor/Floor";
import {
  serviceFloorLayout,
  serviceFloorLook,
} from "../shared/floor/serviceFloorLayout";
import { Nodes } from "./nodes/Nodes";
import { nodesAngles } from "./nodes/layout";
import { DataGrid } from "./DataGrid";
import { connectLayout } from "./layout";

export function ConnectDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 360;
  const angles = nodesAngles;

  const { nodes, dataGrid, cube, syncArrows, connectors } = connectLayout({
    viewboxWidth,
    viewboxHeight,
    angles,
  });

  // debug: where each section starts and ends, left to right
  const sectionEdges = [0, cube.translateX, dataGrid.translateX, viewboxWidth];

  const floor = (() => {
    const layout = serviceFloorLayout({
      viewboxWidth,
      viewboxHeight,
      angle: deg(15),
    });

    const drawing = () => (
      <Floor
        layout={layout}
        {...serviceFloorLook}
        tileStyle={tileStyleNames[5]}
      />
    );

    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      overflow="visible"
      className="block w-full"
    >
      {floor.drawing()}

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

      {/* the second connector: from the cube's right wall down to the data grid */}
      <path
        d={`M ${connectors.cubeOut.x} ${connectors.cubeOut.y} L ${connectors.dataGridIn.x} ${connectors.dataGridIn.y}`}
        stroke="var(--accent-dim)"
        strokeWidth={1}
        fill="none"
        strokeDasharray="8 12"
      />

      {/* left + middle: the nodes, their connectors and the cube */}
      <Nodes
        x={nodes.translateX}
        y={nodes.translateY}
        width={nodes.width}
        height={nodes.height}
        viewboxWidth={nodes.width}
        viewboxHeight={nodes.height}
        strokeWidth={1}
        shares={nodes.shares}
      />

      {/* debug: the connectors' ends: where each line leaves and arrives */}
      {[
        ...connectors.nodesOut,
        ...connectors.cubeIns,
        connectors.cubeOut,
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

      {/* under the cube: two arrows spinning round a circle */}
      {/* <SyncArrows
        {...syncArrows}
        duration={12}
        color="oklch(from var(--accent-ink) l c h / 0.55)"
      /> */}

      {/* right: the data grid */}
      <DataGrid layout={dataGrid} />
    </svg>
  );
}
