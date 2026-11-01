import { useId } from "react";
import {
  alignCenter,
  alignEnd,
  InkFadeGradient,
  layoutUnit,
  LitEdgeGradient,
  parallelogramMatrix,
  placeItemCenter,
  pointOnLine,
  roundedPolygonPath,
  splitWithGaps,
} from "@/lib/svg";
import {
  ScandinaviaOrthographic,
  scandinaviaOrthographicBounds,
} from "../shared/maps/ScandinaviaOrthographic";

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
      { height: 0.9, insetLeft: 0.08, insetRight: 0 },
    ];
    const radius = 12;

    const { sizes, starts } = splitWithGaps(
      viewboxWidth,
      [0.5, 0.5],
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

      // content gets the biggest rectangle that fits inside the trapezoid
      const inner = Math.max(left, right);

      return {
        corners,
        ...parallelogramMatrix({
          origin: { x: boxX, y: boxY + inner },
          xEnd: { x: boxX + boxWidth, y: boxY + inner },
          yEnd: { x: boxX, y: boxY + boxHeight - inner },
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
      drawing,
    };
  })();

  const map = (() => {
    const { height, width } = boards.layouts[0];
    const [topLeft, topRight, bottomRight, bottomLeft] =
      boards.layouts[0].corners;

    const headerStart = pointOnLine(topLeft, bottomLeft, 0.085);
    const headerEnd = pointOnLine(topRight, bottomRight, 0.085);

    const headerHeight = height * 0.1;

    const mapHeight = height - headerHeight;

    const mapWidth =
      (mapHeight * scandinaviaOrthographicBounds.width) /
      scandinaviaOrthographicBounds.height;

    const { offsetX: mapX, offsetY: mapY } = placeItemCenter({
      parentHeight: height - headerHeight,
      parentWidth: width,
      itemWidth: mapWidth,
      itemHeight: mapHeight,
    });
    const header = () => (
      <line
        x1={headerStart.x}
        y1={headerStart.y}
        x2={headerEnd.x}
        y2={headerEnd.y}
        stroke="var(--accent-faint)"
        strokeWidth={1}
      />
    );

    const drawing = () => (
      <g
        transform={`translate(${mapX}, ${mapY + headerHeight}) rotate(8, ${mapWidth * 0.5}, ${mapHeight * 0.5})`}
      >
        <ScandinaviaOrthographic
          height={mapHeight}
          fills={{
            norway: "none",
            sweden: "none",
            denmark: "none",
            finland: "none",
          }}
          stroke="var(--accent)"
          strokeWidth={0.5}
        />
      </g>
    );

    return { header, drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="block max-w-3xl w-full mx-auto"
      overflow={"visible"}
    >
      <defs>
        <InkFadeGradient id={inkId} />
        <LitEdgeGradient id={edgeId} />
      </defs>
      {boards.drawing()}

      {map.header()}
      <g transform={boards.layouts[0].transform}>{map.drawing()}</g>

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
