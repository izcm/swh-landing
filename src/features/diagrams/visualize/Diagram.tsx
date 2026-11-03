import { useId } from "react";
import {
  addVector,
  alignEnd,
  DebugLines,
  DebugPoints,
  deg,
  InkFadeGradient,
  layoutUnit,
  LitEdgeGradient,
  padVerticalSides,
  parallelogramMatrix,
  pointOnLine,
  roundedPolygonPath,
  splitWithGaps,
} from "@/lib/svg";

import { Map } from "./Map";
import { Floor } from "../shared/floor/Floor";
import { floorLayout } from "../shared/floor/layout";

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
    const drawing = () => (
      <Map
        board={boards.layouts[0]}
        radius={boards.radius}
        unit={unit}
        mapFill={`url(#${inkId})`}
      />
    );

    return { drawing };
  })();

  const floor = (() => {
    const layout = floorLayout({
      center: { x: viewboxWidth * 0.5, y: viewboxHeight * 0.95 },
      tilesPerEdge: 11,
      angle: deg(11.25),
      tileLength: unit * 2.5,
    });

    const drawing = () => (
      <Floor
        layout={layout}
        tileOpacity={0.15}
        fadeStretchX={1}
        fadeStretchY={1}
        fadeStart={0.25}
        tileStyle="insetTiles"
      />
    );

    return { drawing };
  })();

  const dashboard = (() => {
    const board = boards.layouts[1];
    // const [topLeft, topRight] = board.corners;

    const innerTrapezoid = padVerticalSides(board.corners, unit * 0.5);

    const v = {
      x: innerTrapezoid[3].x - innerTrapezoid[0].x,
      y: innerTrapezoid[3].y - innerTrapezoid[0].y,
    };

    const height = innerTrapezoid[3].y - innerTrapezoid[0].y;

    const { sizes, starts } = splitWithGaps(
      height,
      [0.12, 0.55, 0.33],
      unit * 0.25,
    );

    // const corners = (i: number) => {
    //   const top = starts[i];
    //   const bottom = starts[i] + sizes[i];

    //   return [
    //     { x: innerTrapezoid[0].x, y: innerTrapezoid[0].y + top }, // top-left
    //     { x: innerTrapezoid[1].x, y: innerTrapezoid[1].y + top }, // top-right
    //     { x: innerTrapezoid[1].x, y: innerTrapezoid[1].y + bottom }, // bottom-right
    //     { x: innerTrapezoid[0].x, y: innerTrapezoid[0].y + bottom }, // bottom-left
    //   ];
    // };

    const [topLeft, topRight, bottomRight, bottomLeft] = innerTrapezoid;

    const corners = (i: number) => {
      const top = starts[i] / height;
      const bottom = (starts[i] + sizes[i]) / height;

      return [
        pointOnLine(topLeft, bottomLeft, top),
        pointOnLine(topRight, bottomRight, top),
        pointOnLine(topRight, bottomRight, bottom),
        pointOnLine(topLeft, bottomLeft, bottom),
      ];
    };

    const drawing = () => (
      <>
        {sizes.map((_, i) => (
          <path
            key={i}
            d={roundedPolygonPath(corners(i), 4)}
            fill="none"
            stroke="var(--accent)"
          />
        ))}
        <DebugPoints
          points={starts.map((start) => ({
            x: innerTrapezoid[0].x,
            y: innerTrapezoid[0].y + start,
          }))}
          color="white"
        />
        <DebugLines
          lines={[[innerTrapezoid[0], addVector(innerTrapezoid[0], v)]]}
          color="#e0457b"
        />
        <DebugPoints points={innerTrapezoid} color={"white"} />
        <DebugPoints points={board.corners} color={"white"} />
        <rect />;
      </>
    );
    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="block w-full"
      overflow={"visible"}
    >
      <defs>
        <InkFadeGradient id={inkId} />
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
