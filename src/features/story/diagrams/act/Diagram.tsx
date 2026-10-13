import { useId, type ComponentProps } from "react";

import {
  accentGlow,
  alignCenter,
  AppWindow,
  deepAccentSeries,
  FilledTube,
  paddedBox,
  stackWithGaps,
  WindowDots,
  windowStackLayout,
  type Point,
  type WindowStyle,
} from "@/lib/svg";
import { ChartRow } from "./dashboard/ChartRow";

export function ActDiagram() {
  const viewboxWidth = 600;
  const viewboxHeight = 350;
  // same unit ThreeBoxDiagram handed out: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);
  // the stack's width: same as the old left box
  const stackWidth = viewboxWidth * 0.7;

  const stackLayout = windowStackLayout({
    groupWidth: stackWidth,
    // heightToWidthRatio: 0.7,
    angle: -8,
    count: 3,
    gapX: unit * 0.35,
    gapY: unit * 0.35,
    side: "left",
  });

  // corner radius of the app windows
  const radius = 8;

  const { offset: translateY } = alignCenter(
    viewboxHeight,
    stackLayout.stackHeight,
  );

  const contentBox = paddedBox(
    stackLayout.item.width,
    stackLayout.item.height,
    0.75,
    0.6,
  );

  // header: the strip at the window's top that holds the dots
  const header = (() => {
    const height = unit * 0.6;
    const dotRadius = unit * 0.135;
    const dotGap = dotRadius * 2;

    return { height, dotRadius, dotGap };
  })();

  const rowGap = unit * 0.4;
  const rowSpace = contentBox.contentHeight - header.height - rowGap;
  const rowSizes = [rowSpace * 0.48, rowSpace * 0.52];
  const rows = stackWithGaps(rowSizes, rowGap);

  // background for the chart and the boxes: --accent-ink, a bit darker
  const stackFill = "oklch(from var(--accent-ink) calc(l - 0.025) 0.04 h)";

  // the app windows' look, passed to WindowStack
  const appWindowStyle = {
    fill: stackFill,
    stroke: "var(--accent-electric)",
    strokeWidth: 0.8,
    radius: radius,
  };

  // chart background: accent at the top, fading to transparent at the bottom
  const chartGradientId = useId();

  const rowContent = [
    <ChartRow
      width={contentBox.contentWidth}
      height={rowSizes[0]}
      gap={rowGap}
      unit={unit}
    />,

    <List
      width={contentBox.contentWidth}
      height={rowSizes[1]}
      unit={unit}
      radius={radius}
    />,
  ];

  // drawn inside the front window
  const frontContent = (
    <>
      {/* dots: centered in everything above the chart */}
      <g transform={`translate(${contentBox.contentX}, 0)`}>
        <WindowDots
          height={contentBox.contentY + header.height}
          radius={header.dotRadius}
          gap={header.dotGap}
        />
      </g>

      {/* padding around the chart, which starts under the header */}
      <g
        transform={`translate(${contentBox.contentX}, ${contentBox.contentY})`}
      >
        <g transform={`translate(0, ${header.height})`}>
          {rows.starts.map((rowY, i) => {
            return (
              <g transform={`translate(0, ${rowY})`}>
                <rect
                  className="svg-debug"
                  x={0}
                  y={0}
                  width={contentBox.contentWidth}
                  height={rowSizes[i]}
                  fill="none"
                  stroke="#aab4e6" // lavender
                  strokeWidth={0.75}
                  strokeDasharray="6 4"
                />
                {rowContent[i]}
              </g>
            );
          })}
        </g>
      </g>
    </>
  );

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      overflow="visible"
      // 600 units × (800px / 650 units, Connect's scale) ≈ 740px, centered
      className="block max-w-185 mx-auto"
    >
      <defs>
        {/* top to bottom */}
        <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity={1} />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
        </linearGradient>
      </defs>

      <rect
        className="svg-debug"
        x={0}
        y={0}
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      {(() => {
        const { count, gapY, gapX, item, angle, windowX, toTop } = stackLayout;

        // front to back
        const windowStyles: WindowStyle[] = [
          {},
          {
            width: item.width * 0.7,
            height: item.height * 1.1,
            x: gapX * 3,
            y: gapY + item.height - item.height * 1.1,
          }, // first window
          { width: item.width * 0.875 }, // front: nudged right
        ];

        return (
          <g
            transform={`translate(0, ${translateY}) skewY(${angle}) translate(0, ${toTop})`}
          >
            {Array.from({ length: count }).map((_, i) => {
              // 0 at the back → 1 at the front
              const depth = count > 1 ? i / (count - 1) : 1;
              // ghost panes are already see-through, so fade them less overall
              // to keep their borders readable
              const opacity = 0.6 + depth * 0.4;
              const isFront = i === count - 1;
              // layout values are the defaults; this window's style wins
              const window = {
                x: windowX(i),
                y: i * gapY,
                width: item.width,
                height: item.height,
                ghost: !isFront,
                ...appWindowStyle,
                // drawn back to front, but windowStyles is listed front to back
                ...windowStyles[count - 1 - i],
              };

              return (
                <g
                  key={i}
                  opacity={opacity}
                  // front: quiet halo to lift it off the rest. back: big faint haze
                  style={{
                    filter: isFront ? accentGlow(4, 12) : accentGlow(2, 6),
                  }}
                >
                  <AppWindow
                    {...window}
                    viewboxWidth={window.width}
                    viewboxHeight={window.height}
                  >
                    {isFront && frontContent}
                  </AppWindow>
                </g>
              );
            })}
          </g>
        );
      })()}
    </svg>
  );
}

// three list rows filling a width × height box, each a background + dot + tube
function List({
  width,
  height,
  unit,
  radius,
}: {
  width: number;
  height: number;
  unit: number;
  radius: number; // the rows' corner radius, capped so short rows don't turn into pills
}) {
  const rowWidth = width * 0.75;
  const rowGap = unit * 0.32;
  // 3 rows + 2 gaps fill the height
  const rowHeight = (height - rowGap * 2) / 3;

  const rows = stackWithGaps(
    Array.from({ length: 3 }, () => rowHeight),
    rowGap,
  );

  return rows.starts.map((rowY, i) => (
    <g key={i} transform={`translate(0, ${rowY})`}>
      {/* the row's background, drawn here since ListRowContent has none */}
      <rect
        width={rowWidth}
        height={rowHeight}
        fill="oklch(from var(--accent) 0.4 0.15 h / 0.1)"
        rx={Math.min(radius, rowHeight / 4)}
      />
      <ListRowContent
        x={unit * 0.25}
        size={rowHeight * 0.875}
        width={width}
        dot={{ fill: deepAccentSeries[i] }}
        tube={{
          level: 0.4 - 0.1 * i,
          fillColor: "var(--accent-electric)",
          trackOpacity: 0,
        }}
      />
    </g>
  ));
}

type TubeProps = Omit<
  ComponentProps<typeof FilledTube>,
  "x" | "y" | "width" | "height"
>;

// one row: a dot, then a tube filling the rest. no background:
// the caller draws that behind it. each part gets its own object
export function ListRowContent({
  x = 0,
  y = 0,
  size,
  width,
  dot,
  tube,
}: Partial<Point> & {
  size: number;
  width: number; // the whole row, dot to tube end
  dot: { fill: string };
  tube: TubeProps;
}) {
  const dotRadius = size * 0.25;
  const gap = size * 0.5;

  const tubeX = dotRadius * 2 + gap;
  const tubeHeight = dotRadius * 1.2;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        cx={dotRadius}
        cy={size / 2}
        r={dotRadius}
        fill={dot.fill}
        fillOpacity={0.8}
      />
      <FilledTube
        x={tubeX}
        y={(size - tubeHeight) / 2}
        width={width - tubeX}
        height={tubeHeight}
        {...tube}
      />
    </g>
  );
}
