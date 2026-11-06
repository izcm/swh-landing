import { useId } from "react";
import {
  alignEnd,
  deg,
  layoutUnit,
  parallelogramMatrix,
  roundedPolygonPath,
  splitWithGaps,
} from "@/lib/svg";

import { Map } from "./map/Map";
import { Dashboard } from "./dashboard/Dashboard";
import { Floor, tileStyleNames } from "../shared/floor/Floor";
import {
  serviceFloorLayout,
  serviceFloorLook,
} from "../shared/floor/serviceFloorLayout";
import { AccentFadeGradient, LitEdgeGradient } from "../shared/gradients";

export function VisualizationsDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 360;

  const unit = layoutUnit(viewboxHeight);

  // ids for the board's gradients in <defs>
  const accentFadeId = useId();
  const edgeId = useId();

  const boards = (() => {
    const boardsConfig = [
      { height: 1, insetLeft: 0, insetRight: 0.08 },
      { height: 0.92, insetLeft: 0.08, insetRight: 0 },
    ];
    const radius = 12;

    const { sizes, starts } = splitWithGaps(
      viewboxWidth,
      [0.6, 0.4],
      unit * 0.75,
    );

    const layouts = sizes.map((boxWidth, i) => {
      const { height, insetLeft, insetRight } = boardsConfig[i];
      const boxHeight = viewboxHeight * height;
      const { offset: boxY } = alignEnd(viewboxHeight, boxHeight);
      const boxX = starts[i];

      const left = boxHeight * insetLeft;
      const right = boxHeight * insetRight;

      // top-left, top-right, bottom-right, bottom-left
      const corners = [
        { x: boxX, y: boxY + left },
        { x: boxX + boxWidth, y: boxY + right },
        { x: boxX + boxWidth, y: boxY + boxHeight - right },
        { x: boxX, y: boxY + boxHeight - left },
      ];

      // content gets a parallelogram along the board's top edge, as tall as its
      // shorter side, so it stays inside the trapezoid
      const inner = Math.max(left, right);

      return {
        corners,
        ...parallelogramMatrix({
          origin: corners[0],
          xEnd: corners[1],
          yEnd: { x: boxX, y: corners[0].y + boxHeight - inner * 2 },
        }),
      };
    });

    const drawing = () =>
      layouts.map(({ corners }, i) => {
        const outline = roundedPolygonPath(corners, radius);

        return (
          <g key={i}>
            <path
              d={outline}
              fill="var(--ground)"
              stroke="var(--accent-faint)"
              strokeWidth={1}
            />
            <path
              d={outline}
              fill="var(--ground)"
              // fill={`url(#${accentFadeId})`}
              stroke={`url(#${edgeId})`}
              strokeWidth={1}
            />
          </g>
        );
      });

    return {
      sizes,
      starts,
      layouts,
      radius,
      drawing,
    };
  })();

  // the four framing items around map
  // const framing _= () =>

  const map = (() => {
    const drawing = () => (
      <Map board={boards.layouts[0]} radius={boards.radius} unit={unit} />
    );

    return { drawing };
  })();

  const floor = (() => {
    const layout = serviceFloorLayout({
      viewboxWidth,
      viewboxHeight,
      angle: deg(11.25),
    });

    const drawing = () => (
      <Floor
        layout={layout}
        {...serviceFloorLook}
        tileStyle={tileStyleNames[4]}
      />
    );

    return { drawing };
  })();

  const dashboard = (() => {
    const drawing = () => <Dashboard board={boards.layouts[1]} unit={unit} />;

    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="block w-full"
      overflow={"visible"}
    >
      <defs>
        <AccentFadeGradient id={accentFadeId} />
        <LitEdgeGradient id={edgeId} />
      </defs>

      {floor.drawing()}

      {boards.drawing()}

      {map.drawing()}

      {dashboard.drawing()}

      {/* debug: the viewbox's edges */}
      <rect
        className="svg-debug"
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
    </svg>
  );
}
