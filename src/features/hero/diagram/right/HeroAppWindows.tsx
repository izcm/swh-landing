import {
  accentSeries,
  alignEnd,
  paddedBox,
  spaceBetween,
  stackWithGaps,
} from "@/lib/svg/helpers";
import { WindowDots } from "@/lib/svg/window/AppWindow";
import { WindowStack } from "@/lib/svg/window/WindowStack";
import { windowStackLayout } from "@/lib/svg/window/windowStackLayout";
import { BarRow } from "./BarRow";
import { BarChart } from "@/features/story/diagrams/visualize/BarChart";
import { LineChart } from "@/features/story/diagrams/visualize/LineChart";

// the right box: three app windows, tilted along the A edges, sitting on the
// box's bottom. x / y / width / height = the right box, from Diagram.tsx
export function HeroAppWindows({
  x,
  y,
  width,
  height,
  angle,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number; // the hero's angle A
}) {
  // knobs
  const count = 3;
  const gapX = 25;
  const gapY = 35;
  const heightToWidthRatio = 0.8;
  const dotsHeaderHeight = 24;

  const windowStack = windowStackLayout({
    groupWidth: width,
    groupHeight: height,
    angle,
    count,
    gapX,
    gapY,
    side: "right",
    heightToWidthRatio,
  });

  // stack's bottom on the box's bottom
  const { offset: stackY } = alignEnd(height, windowStack.stackHeight);

  const contentBox = paddedBox(
    windowStack.item.width,
    windowStack.item.height - dotsHeaderHeight,
    1.2,
    1,
  );

  const groupGap = contentBox.unit * 1.2;
  // same value BarGroups gets today (line 109: contentBox.unit * 2), named so
  // the charts on the right can use it too
  const rowGroupGap = contentBox.unit * 2;

  // two columns side by side: bars on the left, charts take the rest
  const barsWidth = contentBox.contentWidth * 0.48;
  const chartWidth = contentBox.contentWidth - barsWidth - groupGap;
  const columns = stackWithGaps([barsWidth, chartWidth], groupGap);

  // right column: bar chart on top (2/3), line chart below (1/3)
  const chartsSpace = contentBox.contentHeight - rowGroupGap;
  const barChartHeight = (chartsSpace * 2) / 3;
  const lineChartHeight = chartsSpace / 3;
  const charts = stackWithGaps([barChartHeight, lineChartHeight], rowGroupGap);

  // smooth wave: 32 heights along a sine curve, e.g. [0.5, 0.60, 0.70, …, 0.5],
  // all between 0.5 - 0.35 and 0.5 + 0.35
  const waveCycles = 3; // how many ups and downs
  const waveAmplitude = 0.2; // how tall, out of half the chart
  const wavePoints = 32; // more points = smoother
  const wave = Array.from(
    { length: wavePoints },
    (_, i) =>
      0.5 +
      waveAmplitude *
        Math.sin((i / (wavePoints - 1)) * waveCycles * 2 * Math.PI),
  );

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        className="svg-debug-haw"
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      <WindowStack
        y={stackY}
        layout={windowStack}
        frontContent={
          <>
            <WindowDots headerHeight={dotsHeaderHeight} />
            <g
              transform={`translate(${contentBox.contentX}, ${contentBox.contentY + dotsHeaderHeight - contentBox.unit / 4})`}
            >
              <rect
                className="svg-debug-haw"
                x={0}
                y={0}
                width={contentBox.contentWidth}
                height={contentBox.contentHeight}
                fill="none"
                stroke="#aab4e6" // lavender
                strokeWidth={0.75}
                strokeDasharray="6 4"
              />

              {/* horizontal bars: everything inside starts at the bars box's top-left */}
              <g transform={`translate(${columns.starts[0]})`}>
                <BarGroups
                  width={barsWidth}
                  rowHeight={contentBox.unit}
                  // how full each tube is (0..1), one array per group
                  groups={[
                    [0.6, 0.85, 0],
                    [0.7, 0.5],
                  ]}
                  rowGap={contentBox.unit * 0.9}
                  groupGap={rowGroupGap} // space between the groups
                />
                <rect
                  className="svg-debug-haw"
                  x={0}
                  y={0}
                  width={barsWidth}
                  height={contentBox.contentHeight}
                  fill="none"
                  stroke="#aab4e6" // lavender
                  strokeWidth={0.75}
                  strokeDasharray="6 4"
                />
              </g>

              {/* divider, in the middle of the gap between the columns */}
              <line
                x1={columns.dividers[0]}
                y1={0}
                x2={columns.dividers[0]}
                y2={contentBox.contentHeight}
                stroke="var(--accent-faint)"
                strokeWidth={1}
              />

              {/* right column: bar chart on top, line chart below */}
              <g transform={`translate(${columns.starts[1]})`}>
                <BarChart
                  x={contentBox.unit / 8}
                  y={charts.starts[0]}
                  values={[0.5, 0.65, 0.4, 0.8]}
                  width={chartWidth - contentBox.unit / 4}
                  height={barChartHeight}
                />

                {/* divider, in the middle of the gap between the charts */}
                <line
                  x1={0}
                  y1={charts.dividers[0]}
                  x2={chartWidth}
                  y2={charts.dividers[0]}
                  stroke="var(--accent-faint)"
                  strokeWidth={1}
                />

                <LineChart
                  x={contentBox.unit / 8}
                  y={charts.starts[1]}
                  values={wave}
                  width={chartWidth - contentBox.unit / 4}
                  height={lineChartHeight}
                  color="var(--accent-electric)"
                />

                <rect
                  className="svg-debug-haw"
                  x={contentBox.unit / 8}
                  y={0}
                  width={chartWidth - contentBox.unit / 4}
                  height={contentBox.contentHeight}
                  fill="none"
                  stroke="purple" // lavender
                  strokeWidth={0.75}
                  strokeDasharray="6 4"
                />
              </g>
            </g>
          </>
        }
      />
    </g>
  );
}

// groups of horizontal bars, stacked top to bottom with a divider line
// between groups. everything starts at (0, 0) = the groups' top-left
function BarGroups({
  width,
  rowHeight,
  groups,
  rowGap,
  groupGap,
}: {
  width: number;
  rowHeight: number;
  groups: number[][]; // how full each bar is (0..1), one array per group
  rowGap: number; // space between rows inside a group
  groupGap: number; // space between groups
}) {
  // a group's height: its rows + the gaps between them
  const groupHeight = (rows: number) => rows * rowHeight + (rows - 1) * rowGap;

  // each group's top y, stacked with groupGap between them
  const { starts } = stackWithGaps(
    groups.map((rows) => groupHeight(rows.length)),
    groupGap,
  );

  // how many rows come before each group
  // (so the tube colors keep going across groups)
  const firstRows = groups.map((_, g) =>
    groups.slice(0, g).reduce((sum, rows) => sum + rows.length, 0),
  );

  return groups.map((amounts, g) => (
    <g key={g} transform={`translate(0, ${starts[g]})`}>
      {/* divider, in the middle of the gap above this group */}
      {g > 0 && (
        <line
          x1={0}
          y1={-groupGap / 2}
          x2={width}
          y2={-groupGap / 2}
          stroke="var(--accent-faint)"
          strokeWidth={1}
        />
      )}
      {amounts.map((amount, r) => {
        const i = firstRows[g] + r;
        return (
          <g
            key={r}
            // spread the group's rows from its top to its bottom
            transform={`translate(0, ${spaceBetween({
              index: r,
              itemCount: amounts.length,
              itemSize: rowHeight,
              start: 0,
              end: groupHeight(amounts.length),
            })})`}
          >
            <BarRow
              rowHeight={rowHeight}
              width={width}
              fill={amount}
              trackColor="var(--accent-faint)"
              trackOpacity={1}
              fillColor={accentSeries[i % accentSeries.length]}
              fillOpacity={0.75}
              radius={2}
            />
          </g>
        );
      })}
    </g>
  ));
}
