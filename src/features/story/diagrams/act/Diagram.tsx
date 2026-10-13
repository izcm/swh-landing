import { useId } from "react";

import {
  alignCenter,
  BarChart,
  deepShades,
  LineChart,
  paddedBox,
  stackWithGaps,
  WindowDots,
  WindowStack,
  windowStackLayout,
} from "@/lib/svg";

// a box's background: faint electric fill + electric border.
// everything inside starts at (0, 0) = the box's top-left
function BoxBackground({
  width,
  height,
  radius,
  strokeWidth,
}: {
  width: number;
  height: number;
  radius: number; // corner radius
  strokeWidth: number; // border thickness
}) {
  return (
    <>
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="var(--accent-electric)"
        fillOpacity={0.02}
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke="var(--accent-electric)"
        strokeWidth={strokeWidth}
      />
    </>
  );
}

export function ActDiagram() {
  const viewboxWidth = 600;
  const viewboxHeight = 390;
  // same unit ThreeBoxDiagram handed out: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);
  // the stack's width: same as the old left box
  const stackWidth = viewboxWidth * 0.7;

  const stackLayout = windowStackLayout({
    groupWidth: stackWidth,
    // heightToWidthRatio: 0.7,
    angle: -8,
    count: 2,
    gapX: unit * 0.6,
    gapY: unit * 0.6,
    side: "left",
  });

  // corner radius of the app windows
  const windowRadius = 10;
  // corner radius of the boxes inside the front window (chart background)
  const boxRadius = 8;

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

  const lineValues = [0.2, 0.4, 0.1, 0.6, 0.2, 0.5];
  // bar chart: heights (0..1) + one color per bar
  const bars = (() => {
    const values = [0.26, 0.37, 0.44, 0.49, 0.75, 0.4, 0.53];
    // which bar looks picked: mint (--accent-teal) instead of blue
    const selected = 4;
    // the rest: shades of --accent-deep
    const colors = deepShades(values.length).map((shade, i) =>
      i === selected ? "var(--accent-teal)" : shade,
    );

    return { values, colors };
  })();

  // background for the chart and the boxes: --accent-ink, a bit darker
  const stackFill = "oklch(from var(--accent-ink) calc(l - 0.025) 0.04 h)";

  // the app windows' look, passed to WindowStack
  const appWindowStyle = {
    fill: stackFill,
    stroke: "var(--accent-electric)",
    strokeWidth: 0.8,
    radius: windowRadius,
  };

  // chart background: accent at the top, fading to transparent at the bottom
  const chartGradientId = useId();

  const boxStrokeWidth = 0.4;

  // first row: two boxes side by side, line chart in the left one
  const charts = (() => {
    const columnGap = rowGap;
    // the row's width, shared 75 / 25 after the gap
    const columnSpace = contentBox.contentWidth - columnGap;
    const columnSizes = [columnSpace * 0.62, columnSpace * 0.38];
    const columns = stackWithGaps(columnSizes, columnGap);
    const height = rowSizes[0];

    // right box: bar chart, pulled in a little so the bars don't touch the box
    const barChart = (() => {
      const boxWidth = columnSizes[1];
      const insetX = boxWidth * 0.05; // each side
      const insetY = height * 0.1; // top and bottom

      return (
        <BarChart
          x={insetX}
          y={insetY}
          width={boxWidth - insetX * 2}
          height={height - insetY * 2}
          values={bars.values}
          colors={bars.colors}
        />
      );
    })();

    // what goes in each box, left to right
    const columnContent = [
      <LineChart
        width={columnSizes[0]}
        height={height}
        values={lineValues}
        color="var(--accent-electric)"
        dotRadius={unit * 0.08}
      />,
      barChart,
    ];

    return (
      <>
        {columns.starts.map((columnX, i) => (
          <g key={i} transform={`translate(${columnX}, 0)`}>
            <BoxBackground
              width={columnSizes[i]}
              height={height}
              radius={boxRadius}
              strokeWidth={boxStrokeWidth}
            />
            {columnContent[i]}
          </g>
        ))}
      </>
    );
  })();

  const rowContent = [
    <>
      {/* chart background: four layers stacked */}
      {charts}
    </>,
  ];

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
      <WindowStack
        layout={stackLayout}
        y={translateY}
        {...appWindowStyle}
        frontContent={
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
        }
      />
    </svg>
  );
}

//  <g transform="translate(40, 40)">
//         {/* 1. Dark base */}
//         <rect width={200} height={120} rx={12} fill="#081120" />

//         {/* 2. Transparent blue */}
//         <rect
//           width={200}
//           height={120}
//           rx={12}
//           fill="#2B6CFF"
//           fillOpacity={0.18}
//         />

//         {/* 3. Soft blue glow */}
//         <rect
//           width={200}
//           height={120}
//           rx={12}
//           fill="#4DA3FF"
//           fillOpacity={0.12}
//         />

//         {/* 4. Border */}
//         <rect
//           width={200}
//           height={120}
//           rx={12}
//           fill="none"
//           stroke="#4A8DFF"
//           strokeOpacity={0.45}
//         />
//       </g>
