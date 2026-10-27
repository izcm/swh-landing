import { useId } from "react";

import {
  alignCenter,
  alignEnd,
  BarChart,
  ChartGuides,
  contentBoxLayout,
  DonutChart,
  layoutUnit,
  listItemLayout,
  placeItemCenter,
  stackWithGaps,
  Tube,
  WindowDots,
} from "@/lib/svg";
import type { ChartData } from "../data";
import { CardBackground } from "./CardBackground";
import { TitleTube } from "./header-elements";

// what's on the lower-middle dashboard: a header, then a row of two cards (2/3
// and 1/3 wide), then one card across the whole width. fills exactly the
// width × height it's given (no padding around the outside). a plain <g>
// drawn from (0, 0); the diagram bends it onto the roof
export function BottomCenter({
  width,
  height,
  radius,
  unit,
  strokeWidth,
  paddingXUnits,
  paddingYUnits,
  colorSelection,
  chartData,
}: {
  width: number; // the area to fill
  height: number;
  radius: number; // corner radius of the boxes inside
  unit: number; // the diagram's ruler, shared by all five dashboards
  strokeWidth: number; // the boxes' border thickness
  paddingXUnits: number; // around the content, left and right, in units
  paddingYUnits: number; // around the content, top and bottom, in units
  colorSelection: string[]; // colors to pick from, in order
  chartData: ChartData; // what the charts draw
}) {
  // the whole width, split into rows: the header, then two card rows of the
  // same height
  const contentBox = contentBoxLayout({
    width,
    height,
    unit,
    paddingXUnits,
    paddingYUnits,
    rowGapUnits: paddingYUnits,
    rowShares: [0.025, 0.4875, 0.4875],
  });

  const { content, rows, paddingX } = contentBox;

  // each bar's fill: a brighter accent at its top, a saturated accent at its bottom
  const barGradientId = useId();

  // the top card row: two columns, paddingX apart. the left one gets 2/3 of
  // the width left after the gap, the right one 1/3
  const topRow = (() => {
    const gap = paddingX; // between the two columns
    const space = content.width - gap;
    const sizes = [space * (2 / 3), space * (1 / 3)];
    const { starts } = stackWithGaps(sizes, gap);

    return { sizes, starts };
  })();

  const barChart = (() => {
    const boxWidth = topRow.sizes[0];
    const boxHeight = rows.sizes[1];

    const insetX = boxWidth * 0.06; // each side
    const insetY = boxHeight * 0.12; // top and bottom
    const chartWidth = boxWidth - insetX * 2;
    const chartHeight = boxHeight - insetY * 2;

    return (
      <>
        <ChartGuides
          x={insetX}
          y={insetY}
          width={chartWidth}
          height={chartHeight}
          count={3}
          insetX={chartWidth * 0.04}
          color="var(--accent)"
        />
        <BarChart
          x={insetX}
          y={insetY}
          width={chartWidth}
          height={chartHeight}
          values={chartData.bars}
          color={`url(#${barGradientId})`}
          opacity={0.875}
          // selectedIdx={drilldown ? 3 : undefined} // the picked bar, or none without drilldown
          barRatio={0.45}
        />
      </>
    );
  })();

  const donut = (() => {
    const boxWidth = topRow.sizes[1];
    const boxHeight = rows.sizes[1];

    // inside the card: padded 1 card unit (1/12 of its height) on every side,
    // then split into the label row and the donut row
    const inner = contentBoxLayout({
      width: boxWidth,
      height: boxHeight,
      unit: layoutUnit(boxHeight),
      paddingXUnits: 1,
      paddingYUnits: 1.2,
      rowGapUnits: 1.2,
      rowShares: [0.1, 0.9], // the label, the donut
    });
    const donutRowHeight = inner.rows.sizes[1];

    // the ring: as big as fits in the donut row, centered in it
    const r = Math.min(donutRowHeight, inner.content.width) * 0.45;
    const { offsetX, offsetY } = placeItemCenter({
      parentWidth: inner.content.width,
      parentHeight: donutRowHeight,
      itemWidth: r * 2,
      itemHeight: r * 2,
    });

    // the label: a faint pill, 80% of the label row's width and 0.75 of its
    // height, centered in it
    const label = (() => {
      const width = inner.content.width * 0.8;
      const height = inner.rows.sizes[0] * 0.75;
      const { offset: x } = alignCenter(inner.content.width, width);
      const { offset: y } = alignCenter(inner.rows.sizes[0], height);
      return { x, y: inner.rows.starts[0] + y, width, height };
    })();

    return (
      <g transform={`translate(${inner.content.x}, ${inner.content.y})`}>
        <rect
          {...label}
          rx={label.height / 2}
          fill="var(--accent)"
          fillOpacity={0.25}
        />
        <DonutChart
          x={offsetX}
          y={inner.rows.starts[1] + offsetY}
          slices={chartData.donut}
          radius={r}
          thickness={4}
          gapAngle={0.085}
        />
      </g>
    );
  })();

  // the bottom card: three list rows, each a soft colored dot and a title on the
  // left and a toggle on the right
  const list = (() => {
    const boxHeight = rows.sizes[2];

    // each row, top to bottom: its title's length (a share of the room for it)
    // and whether its toggle is on
    const items = [
      { titleLength: 0.6, isOn: true },
      { titleLength: 0.45, isOn: true },
      { titleLength: 0.55, isOn: false },
    ];

    // inside the card: padded 1 card unit (1/12 of its height) on every side,
    // then one row per item, all the same height
    const inner = contentBoxLayout({
      width: content.width,
      height: boxHeight,
      unit: layoutUnit(boxHeight),
      paddingXUnits: 1,
      paddingYUnits: 1,
      rowGapUnits: 1,
      rowShares: items.map(() => 1 / items.length),
    });
    const rowHeight = inner.rows.sizes[0]; // every row is the same height

    // left: the dot, then the title, centered on the row
    const { leading: dot, text } = listItemLayout({
      height: rowHeight,
      leadingInset: layoutUnit(rowHeight) * 4,
      leadingRadius: rowHeight * 0.22,
      gap: rowHeight * 0.85,
      lineHeights: [rowHeight * 0.22], // the title
    });

    // right: the toggle, flush right and centered on the row
    const toggle = (() => {
      const height = rowHeight * 0.7;
      const width = height * 1.8;

      const x =
        alignEnd(inner.content.width, width).offset - layoutUnit(rowHeight);
      const { offset: y } = alignCenter(rowHeight, height);

      return { x, y, width, height };
    })();

    // the room for a title: from where it starts to a little before the toggle
    const titleRoom = toggle.x - rowHeight * 0.5 - text.x;

    return (
      <g transform={`translate(${inner.content.x}, ${inner.content.y})`}>
        {items.map(({ titleLength, isOn }, i) => (
          <g key={i} transform={`translate(0, ${inner.rows.starts[i]})`}>
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r={dot.radius}
              fill={colorSelection[i % colorSelection.length]}
              fillOpacity={0.92}
            />
            <Tube
              x={text.x}
              y={text.y + text.lineStarts[0]}
              width={titleRoom * titleLength}
              height={text.lineHeights[0]}
              fill="var(--accent-electric)"
              fillOpacity={0.34}
            />
            <Toggle {...toggle} isOn={isOn} color="var(--accent)" />
          </g>
        ))}
      </g>
    );
  })();

  const chartRowContent = [barChart, donut];

  return (
    <g>
      <defs>
        {/* the bars' fill: top to bottom, in each bar's own box */}
        <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(from var(--accent) 0.65 c h)" />
          <stop
            offset="100%"
            stopColor="oklch(from var(--accent) 0.5 c h / 0.875)"
          />
        </linearGradient>
      </defs>

      {/* debug: the area to fill */}
      <rect
        className="svg-debug"
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />

      {/* the content box: the header, the top row of two cards, the wide card */}
      <g
        transform={`translate(${contentBox.translateX + content.x}, ${content.y})`}
      >
        {[
          <Header width={content.width} height={rows.sizes[0]} />,
          topRow.starts.map((x, i) => (
            <g key={i} transform={`translate(${x}, 0)`}>
              <CardBackground
                width={topRow.sizes[i]}
                height={rows.sizes[1]}
                radius={radius}
                strokeWidth={strokeWidth * 0.5}
              />
              {chartRowContent[i]}
            </g>
          )),
          <>
            <CardBackground
              width={content.width}
              height={rows.sizes[2]}
              radius={radius}
              strokeWidth={strokeWidth * 0.5}
            />
            {list}
          </>,
        ].map((group, i) => (
          <g key={i} transform={`translate(0, ${rows.starts[i]})`}>
            {group}
          </g>
        ))}
      </g>
    </g>
  );
}

// the header: a title on the left, as tall as the header row, and the window
// dots on the right, a bit bigger than the row. drawn from (0, 0)
function Header({
  width,
  height,
}: {
  width: number; // the header row's width        strokeOpacity={0.4}

  height: number; // the header row's height
}) {
  const titleWidth = width * 0.25;

  // the window dots: 1.5 × as tall as the row, so they stick out the same
  // amount above and below it. two radii apart, flush right
  const dots = (() => {
    const scale = 1.5; // the dots' height against the row's
    const radius = (height / 2) * scale;
    const gap = radius * 2;
    const dotsWidth = radius * 2 * 3 + gap * 2; // WindowDots draws three
    const { offset: translateX } = alignEnd(width, dotsWidth);

    return { radius, gap, translateX };
  })();

  return (
    <g>
      <TitleTube width={titleWidth} height={height} />
      <g transform={`translate(${dots.translateX}, 0)`}>
        <WindowDots height={height} radius={dots.radius} gap={dots.gap} />
      </g>
    </g>
  );
}

// a toggle: a pill with a knob, the knob at the right end when on and the left
// end when off. drawn from (x, y)
function Toggle({
  x = 0,
  y = 0,
  width,
  height,
  isOn,
  color,
}: {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isOn: boolean; // on: knob right and bright. off: knob left and dim
  color: string; // the pill's tint and border, and the knob
}) {
  const knobRadius = height * 0.35;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        rx={height / 2}
        fill={"none"}
        stroke={color}
        strokeOpacity={0.4}
        strokeWidth={0.5}
      />
      <circle
        cx={isOn ? width - height / 2 : height / 2}
        cy={height / 2}
        r={knobRadius}
        fill={color}
        fillOpacity={isOn ? 0.9 : 0.35}
      />
    </g>
  );
}
