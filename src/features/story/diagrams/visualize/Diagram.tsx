import { useId } from "react";

import {
  BoxBody,
  paddedBox,
  platformStyle,
  pointOnLine,
  roundedPolygonPath,
} from "@/lib/svg";

export function VisualizeDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 360;
  // same unit ThreeBoxDiagram handed out: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);

  // the screens' fill: same ink fade as act's dashboard windows
  //   const screenInkId = useId();
  // cuts each screen's fill to its dashboard's rounded top face
  //   const screenClipId = useId();

  const screenRadius = 8;

  const thickness = unit * 0.25;

  const angleA = 60;
  const angleB = 11.25;
  const radA = (angleA * Math.PI) / 180;
  const radB = (angleB * Math.PI) / 180;

  // edge A: from the top of the box down to the right side
  const edgeA = (() => {
    const drop = viewboxHeight * 0.32; // how far it goes down
    const run = drop / Math.tan(radA); // how far it goes sideways
    const edgeLength = drop / Math.sin(radA);
    return { run, drop, edgeLength };
  })();
  //   const lengthB = viewboxWidth

  // edge B: from the left side up to the top, across the rest of the width
  const edgeB = (() => {
    const run = viewboxWidth - edgeA.run; // how far it goes sideways
    const rise = run * Math.tan(radB); // how far it goes up
    const edgeLength = Math.hypot(run, rise); // edge B's full length
    return { run, rise, edgeLength };
  })();

  // the two upper dashboards: side by side along edge B,
  // both as deep as edge A
  const upperDashboards = (() => {
    const groupBack = { x: edgeB.run, y: 0 }; // where edge A and edge B meet, on the top of the box
    const groupLeft = { x: 0, y: edgeB.rise }; // where edge B meets the left side of the box
    // edge A as a vector: from groupBack down to the right side of the box
    const alongA = { x: edgeA.run, y: edgeA.drop };

    // a dashboard whose back edge runs from t0 to t1 along edge B
    // (0 = groupBack, 1 = groupLeft), pushed down along edge A
    const between = (t0: number, t1: number) => {
      const back = pointOnLine(groupBack, groupLeft, t0);
      const left = pointOnLine(groupBack, groupLeft, t1);
      return {
        left,
        back,
        right: { x: back.x + alongA.x, y: back.y + alongA.y },
        front: { x: left.x + alongA.x, y: left.y + alongA.y },
      };
    };

    const split = 0.35; // the right dashboard takes this part of edge B
    const gap = unit / edgeB.edgeLength; // one unit of space between the two, as a part of edge B

    return {
      left: between(split + gap, 1),
      right: between(0, split),
    };
  })();

  const dashboardGroupsGap = unit * 0.75;

  const lowerDashboards = (() => {
    // the upper dashboards' bottom edge ends edgeA.run in from the left side.
    // followed back to the left side it keeps tilting down (edge B's slope):
    // a small right triangle, sideways edgeA.run, down = edgeA.run × slope
    const missing = edgeA.run * (edgeB.rise / edgeB.run);

    const groupBack = {
      x: 0,
      y: edgeB.rise + edgeA.drop + missing + dashboardGroupsGap + thickness,
    };
    // the back edge's other end: the same run and rise as edge B, so it's parallel to it
    const backRight = { x: edgeB.run, y: groupBack.y - edgeB.rise };

    return {
      groupBack,
      backRight,
    };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      // 615 units at up to 768px ≈ 1.25px per unit, close to Connect. centered

      className="block w-full max-w-2xl mx-auto"
    >
      <defs>
        {/* act's window fill: ink at the top, fading out toward the bottom */}
        {/* <linearGradient id={screenInkId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-ink)" stopOpacity={0.9} />
          <stop offset="100%" stopColor="var(--accent-ink)" stopOpacity={0} />
        </linearGradient> */}
      </defs>

      {/* the two upper dashboards: dark ground + act's ink fade, Platform's edge gradient */}
      {[upperDashboards.left, upperDashboards.right].map((top, i) => (
        <g key={i}>
          <BoxBody
            top={top}
            height={thickness}
            strokeWidth={1}
            fills={{
              //   top: "none",
              top: "oklch(from var(--accent) 0.22 0.08 h)",
              right: "none",
              left: "none",
              //   bottom: "oklch(from var(--accent) 0.4 0.1 h)",
              bottom: "none",
            }}
            radius={screenRadius}
            edgeOpacity={platformStyle.edgeOpacity}
            showBottom
          />
          {/* <path
            d={roundedPolygonPath(
              [top.left, top.back, top.right, top.front],
              screenRadius,
            )}
            fill={`url(#${screenInkId})`}
          /> */}
        </g>
      ))}

      {/* debug: upper dashboards */}
      <circle
        className="svg-debug-visualize"
        cx={viewboxWidth}
        cy={edgeA.drop}
        r={6}
        fill="#ffb547" // amber: edge A
        strokeWidth={0.75}
      />

      <circle
        className="svg-debug-visualize"
        cx={edgeB.run}
        cy={0}
        r={6}
        fill="#ffffff" // white: where edge A and edge B meet
        strokeWidth={0.75}
      />

      <circle
        className="svg-debug-visualize"
        cx={0}
        cy={edgeB.rise}
        r={6}
        fill="#ff4fa3" // pink: edge B
        strokeWidth={0.75}
      />

      <line
        className="svg-debug-visualize"
        x1={edgeB.run}
        y1={0}
        x2={0}
        y2={edgeB.rise}
        stroke="#ff4fa3" // pink: edge B
        strokeWidth={0.75}
      />

      <line
        className="svg-debug-visualize"
        x1={viewboxWidth - edgeA.run}
        y1={0}
        x2={viewboxWidth}
        y2={edgeA.drop}
        stroke="#ffb547" // amber: edge A
        strokeWidth={0.75}
      />

      {/* debug: lower dashboards */}
      <circle
        className="svg-debug-visualize"
        cx={0}
        cy={lowerDashboards.groupBack.y}
        r={6}
        fill="#ffffff" // white: where edge A and edge B meet
        strokeWidth={0.75}
      />

      {/* the pink line moved down: same run and rise, starting at groupBack */}
      <line
        className="svg-debug-visualize"
        x1={lowerDashboards.groupBack.x}
        y1={lowerDashboards.groupBack.y}
        x2={lowerDashboards.backRight.x}
        y2={lowerDashboards.backRight.y}
        stroke="#ff4fa3" // pink: edge B
        strokeWidth={0.75}
      />

      {/* debug: the box */}
      <rect
        className="svg-debug-visualize"
        x={0.375}
        y={0.375}
        width={viewboxWidth - 0.75}
        height={viewboxHeight - 0.75}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
    </svg>
  );
}
