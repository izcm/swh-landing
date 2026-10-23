import {
  alignEnd,
  ChartGuides,
  contentBoxLayout,
  LineChart,
  listItemLayout,
  paddedBox,
  RecessedPanel,
  stackWithGaps,
  Tube,
} from "@/lib/svg";
import type { ChartData } from "../data";
import { CardBackground } from "./CardBackground";
import { OutlineButton, TitleTube } from "./header-elements";

// what's on the upper-left dashboard: a side panel on the left, a line chart on
// the right. fills exactly the width × height it's given (no padding around the
// outside). a plain <g> drawn from (0, 0); the diagram bends it onto the roof
export function UpperLeft({
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
  // left: the side panel, flush with the edges
  const sidePanel = (() => {
    const groupWidth = width * 0.25;
    const groupHeight = height;
    return { groupWidth, groupHeight };
  })();

  // right: the rest of the width, split into rows: the header, the line chart,
  // the KPI cards
  const contentBox = contentBoxLayout({
    width: width - sidePanel.groupWidth,
    height,
    translateX: sidePanel.groupWidth, // right after the side panel
    unit,
    paddingXUnits,
    paddingYUnits,
    rowShares: [0.025, 0.65, 0.325],
  });

  const { content, rows, paddingX, paddingY } = contentBox;

  return (
    <g>
      <SidePanel
        width={sidePanel.groupWidth}
        height={sidePanel.groupHeight}
        radius={radius}
        unit={unit}
        strokeWidth={strokeWidth}
        paddingX={paddingX * 0.75}
        paddingY={paddingY * 0.75}
      />

      {/* the content box: the header, the line chart, the KPI cards */}
      <g
        transform={`translate(${contentBox.translateX + content.x}, ${content.y})`}
      >
        {[
          <Header width={content.width} height={rows.sizes[0]} />,
          <LineChartBox
            width={content.width}
            height={rows.sizes[1]}
            radius={radius}
            unit={unit}
            strokeWidth={strokeWidth}
            values={chartData.trend}
          />,
          <KpiCards
            width={content.width}
            height={rows.sizes[2]}
            gap={paddingX}
            radius={radius}
            strokeWidth={strokeWidth}
            colorSelection={colorSelection}
          />,
        ].map((group, i) => (
          <g key={i} transform={`translate(0, ${rows.starts[i]})`}>
            {group}
          </g>
        ))}
      </g>
    </g>
  );
}

// the side panel: a deeper tint of the dashboard's ink, a faint electric line
// where it meets the rest, and a menu. drawn from (0, 0)
function SidePanel({
  width,
  height,
  radius,
  unit,
  strokeWidth,
  paddingX,
  paddingY,
}: {
  width: number; // the panel's width
  height: number;
  radius: number; // the dashboard's corner radius, also the selected item's
  unit: number; // the diagram's ruler
  strokeWidth: number; // the edge line's and the selected item's border
  paddingX: number; // around the menu, left and right
  paddingY: number; // above the menu
}) {
  // the panel's outline: only its left corners are rounded: they sit on the
  // dashboard's own rounded corners. its right side meets the rest of the
  // dashboard, so it stays sharp
  const outline = (() => {
    const r = radius;
    // clockwise from the top edge, the same curve as roundedPolygonPath's corners
    const path = `M ${r} 0 H ${width} V ${height} H ${r} Q 0 ${height} 0 ${height - r} V ${r} Q 0 0 ${r} 0 Z`;

    return { path };
  })();

  // the menu: a column of items from the top, each a dot and one label line.
  // the selected item sits in a recessed panel like the dashboard's boxes,
  // with a brighter dot and label
  const menu = (() => {
    const rowWidth = (width - paddingX * 2) * 0.85;
    const rowHeight = unit * 0.35;
    const rowGap = unit * 0.1;
    const insetX = rowHeight * 0.5; // from the row's left and right edges

    // each item's label length, as a share of the text's width, top to bottom
    const labelLengths = [0.7, 0.65, 0.8, 0.6, 0.85, 0.7];
    // const labelLengths = [1, 1, 1, 1, 1, 1];
    const selectedIdx = 2;

    const rows = stackWithGaps(
      labelLengths.map(() => rowHeight),
      rowGap,
    );
    const { leading: dot, text } = listItemLayout({
      height: rowHeight,
      leadingInset: insetX,
      leadingRadius: rowHeight * 0.22,
      gap: insetX,
      lineHeights: [rowHeight * 0.2], // the label
    });
    const textWidth = rowWidth - text.x - insetX;

    return (
      <g transform={`translate(${paddingX}, ${paddingY})`}>
        {rows.starts.map((rowY, i) => {
          const isSelected = i === selectedIdx;
          return (
            <g key={i} transform={`translate(0, ${rowY})`}>
              {isSelected && (
                <RecessedPanel
                  width={rowWidth}
                  height={rowHeight}
                  radius={radius}
                  strokeWidth={strokeWidth}
                />
              )}
              <circle
                cx={dot.cx}
                cy={dot.cy}
                r={dot.radius}
                fill="var(--accent-electric)"
                fillOpacity={isSelected ? 0.85 : 0.35}
              />
              <Tube
                x={text.x}
                y={text.y + text.lineStarts[0]}
                width={textWidth * labelLengths[i]}
                height={text.lineHeights[0]}
                fill="var(--accent-electric)"
                fillOpacity={isSelected ? 0.85 : 0.15}
              />
            </g>
          );
        })}
      </g>
    );
  })();

  return (
    <g>
      {/* the panel: a deeper tint of the dashboard's ink (--accent-ink is
          0.17 lightness), and a faint electric line where it meets the rest */}
      <path
        d={outline.path}
        // fill="oklch(from var(--accent) 0.16 0.05 h)"
        fill="oklch(from var(--accent) 0.15 0.042 h)"
      />
      <line
        x1={width}
        y1={0}
        x2={width}
        y2={height}
        stroke="var(--accent-electric)"
        strokeOpacity={0.5}
        strokeWidth={strokeWidth}
      />
      {menu}
    </g>
  );
}

// the header: an outlined title on the left and a dim button on the right,
// both rects as tall as the header row, with fully round ends. drawn from (0, 0)
function Header({
  width,
  height,
}: {
  width: number; // the header row's width
  height: number; // the header row's height
}) {
  const titleWidth = width * 0.25;
  const buttonWidth = width * 0.1;
  const { offset: buttonX } = alignEnd(width, buttonWidth);

  return (
    <g>
      <TitleTube width={titleWidth} height={height} />
      <OutlineButton x={buttonX} width={buttonWidth} height={height} />
    </g>
  );
}

// the line chart's box: same look as act's ChartRow, its own curve, nothing
// selected, with a title + subtitle in its top-left corner. drawn from (0, 0)
function LineChartBox({
  width,
  height,
  radius,
  unit,
  strokeWidth,
  values,
}: {
  width: number; // the box's width
  height: number;
  radius: number; // the box's corner radius
  unit: number; // the diagram's ruler, for the dots and the labels
  strokeWidth: number; // the box's border thickness
  values: number[]; // the line's points, each 0-1
}) {
  // title + subtitle lines in the box's top-left corner, like act's ChartRow.
  // sized from this diagram's unit
  const chartLabels = (() => {
    const inset = unit * 0.2; // from the box's top and left edges
    const titleWidth = unit * 0.85;
    const lineHeight = unit * 0.05;
    const lineHeights = [lineHeight, lineHeight]; // title, subtitle
    const lines = stackWithGaps(lineHeights, lineHeight);

    return { inset, titleWidth, lineHeights, lineStarts: lines.starts };
  })();

  return (
    <g>
      <RecessedPanel
        width={width}
        height={height}
        radius={radius}
        strokeWidth={strokeWidth}
      />
      <ChartGuides
        width={width}
        height={height}
        count={3}
        insetX={width * 0.04}
        color="var(--accent-deep)"
      />
      <LineChart
        width={width}
        height={height}
        values={values}
        color="var(--accent-deep)"
        dotRadius={unit * 0.035}
        areaOpacity={0.1}
        areaRadius={radius} // same corners as the box
      />
      {/* title + subtitle */}
      {(() => {
        const { inset, titleWidth, lineHeights, lineStarts } = chartLabels;
        return (
          <g transform={`translate(${inset}, ${inset})`}>
            <Tube
              y={lineStarts[0]}
              width={titleWidth}
              height={lineHeights[0]}
              fill="var(--accent)"
              fillOpacity={0.5}
            />
            <Tube
              y={lineStarts[1]}
              width={titleWidth * 0.5}
              height={lineHeights[1]}
              fill="var(--accent-faint)"
            />
          </g>
        );
      })()}
    </g>
  );
}

// the KPI cards: recessed panels side by side, equal widths after the gaps.
// drawn from (0, 0)
function KpiCards({
  width,
  height,
  gap,
  radius,
  strokeWidth,
  colorSelection,
}: {
  width: number; // the row's width
  height: number; // the cards' height
  gap: number; // between the cards
  radius: number; // the cards' corner radius
  strokeWidth: number; // the cards' border thickness
  colorSelection: string[]; // the dots' colors, picked in order
}) {
  const columnCount = 3;
  const columnSpace = width - gap * (columnCount - 1);
  const cardWidth = columnSpace / columnCount;

  const columns = stackWithGaps(
    Array.from({ length: columnCount }, () => cardWidth),
    gap,
  );

  // inside each card: padded 2 card units, a soft dot, then a title and a
  // dimmer, shorter subtitle beside it, and a thin threshold bar along the bottom
  const card = (() => {
    const box = paddedBox(cardWidth, height, 2);
    const { unit: cardUnit } = box;
    const lineHeight = cardUnit * 0.7;

    const { leading: dot, text } = listItemLayout({
      height: cardUnit * 3.2, // the dot's row, the lines centered on it
      leadingInset: 0, // the padding already keeps it off the card's edge
      leadingRadius: cardUnit,
      gap: cardUnit * 2,
      lineHeights: [lineHeight, lineHeight], // title, subtitle
      lineGap: cardUnit * 0.9,
    });
    const textWidth = box.contentWidth - text.x; // to the inner box's right edge

    // the threshold bar: along the bottom of the inner box, its whole width
    const bar = {
      y: box.contentHeight - lineHeight,
      width: box.contentWidth,
      height: lineHeight,
    };

    return { x: box.contentX, y: box.contentY, dot, text, textWidth, bar };
  })();

  // how full each card's threshold bar is, left to right
  const barLevels = [0.65, 0.4, 0.8];

  return columns.starts.map((start, i) => (
    <g key={i} transform={`translate(${start}, 0)`}>
      <CardBackground
        width={cardWidth}
        height={height}
        radius={radius}
        strokeWidth={strokeWidth * 0.5}
      />

      {/* dot, title and subtitle, and the threshold bar, inside the card's padding */}
      {(() => {
        const { x, y, dot, text, textWidth, bar } = card;
        return (
          <g transform={`translate(${x}, ${y})`}>
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r={dot.radius}
              fill={colorSelection[i % colorSelection.length]}
              fillOpacity={0.95}
            />
            {/* title: brighter, longer */}
            <Tube
              x={text.x}
              y={text.y + text.lineStarts[0]}
              width={textWidth}
              height={text.lineHeights[0]}
              level={0.85}
              fill="var(--accent-electric)"
              fillOpacity={0.6}
            />
            {/* subtitle: dim, shorter */}
            <Tube
              x={text.x}
              y={text.y + text.lineStarts[1]}
              width={textWidth}
              height={text.lineHeights[1]}
              level={0.5}
              fill="var(--accent-electric)"
              fillOpacity={0.38}
            />
            {/* threshold bar: a faint accent track, partly filled */}
            <Tube
              y={bar.y}
              width={bar.width}
              height={bar.height}
              level={barLevels[i]}
              fill="var(--accent)"
              fillOpacity={0.58}
              trackColor="var(--accent)"
              trackOpacity={0.16}
            />
          </g>
        );
      })()}
    </g>
  ));
}
