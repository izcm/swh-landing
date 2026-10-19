import { Centerpiece } from "@/features/diagrams/shared/Centerpiece";
import { DataGrid } from "./DataGrid";
import { connectLayout } from "./layout";
import { Nodes } from "./nodes/Nodes";

export function ConnectDiagram() {
  const viewboxWidth = 617;
  const viewboxHeight = 270;
  // edge slopes in degrees: A down to the right, B up to the right
  const angles = { angleA: 15, angleB: 10 };

  const { nodes, dataGrid, centerpiece } = connectLayout({
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

      {/* debug: a dot in the middle of each section: nodes, centerpiece, windows */}
      {[
        "#d9c79c" /* sand */,
        "#9cc5a8" /* sage */,
        "#aab4e6" /* lavender */,
      ].map((fill, i) => (
        <circle
          key={i}
          className="svg-debug"
          cx={(sectionEdges[i] + sectionEdges[i + 1]) / 2}
          cy={viewboxHeight / 2}
          r={2}
          fill={fill}
        />
      ))}

      {/* left: the nodes */}
      <Nodes height={nodes.groupHeight} layout={nodes} />

      {/* middle: the centerpiece */}
      <Centerpiece
        x={centerpiece.x}
        y={centerpiece.y}
        {...centerpiece.layout}
        angles={centerpiece.angles}
      />

      {/* right: the data grid */}
      <DataGrid layout={dataGrid} />
    </svg>
  );
}
