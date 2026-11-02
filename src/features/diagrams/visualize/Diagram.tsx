import { useId } from "react";
import {
  alignEnd,
  DebugLines,
  DebugPoints,
  InkFadeGradient,
  layoutUnit,
  LitEdgeGradient,
  parallelogramMatrix,
  roundedPolygonPath,
  splitWithGaps,
} from "@/lib/svg";

import { ScandinaviaOrthographic } from "../shared/maps/ScandinaviaOrthographic";
import { CornerDecorator } from "./CornerDecorator";
import { mapLayout } from "./mapLayout";

export function VisualizeDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 360;

  const unit = layoutUnit(viewboxHeight);

  // ids for the board's gradients in <defs>
  const inkId = useId();
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
              fill={`url(#${inkId})`}
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
    const board = boards.layouts[0];

    const layout = mapLayout({
      boardCorners: board.corners,
      boardWidth: board.width,
      boardHeight: board.height,
      radius: boards.radius,
      unit,
    });

    const drawing = () => {
      const { header, underHeader, innerTrapezoid, cornerDecorators, map } =
        layout;
      const fill = `url(#${inkId})`;

      return (
        <>
          <path d={underHeader.d} fill="var(--ground)" opacity={0.75} />

          <line
            x1={header.start.x}
            y1={header.start.y}
            x2={header.end.x}
            y2={header.end.y}
            stroke="var(--accent-faint)"
            strokeWidth={1}
          />

          {cornerDecorators.map((arms, i) => (
            <CornerDecorator
              key={i}
              {...arms}
              stroke="var(--accent)"
              strokeWidth={1.5}
              radius={3}
            />
          ))}

          <DebugPoints
            points={innerTrapezoid.corners}
            radius={3}
            color="#aab4e6"
          />

          <g transform={board.transform}>
            <ScandinaviaOrthographic
              x={map.x}
              y={map.y}
              height={map.height}
              fills={{
                norway: fill,
                sweden: fill,
                denmark: fill,
                finland: fill,
              }}
              transform={`rotate(${map.rotation}, ${map.width * 0.5}, ${map.height * 0.5})`}
              stroke="var(--accent)"
              strokeWidth={0.5}
            />
          </g>
        </>
      );
    };

    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="block max-w-2xl w-full mx-auto"
      overflow={"visible"}
    >
      <defs>
        <InkFadeGradient id={inkId} />
        <LitEdgeGradient id={edgeId} />
      </defs>
      {boards.drawing()}

      {map.drawing()}

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
