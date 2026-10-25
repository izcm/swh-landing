import { TriangleAlert } from "lucide-react";

import {
  alignCenter,
  alignEnd,
  ChartGuides,
  contentBoxLayout,
  glyphStrokeLucide,
  layoutUnit,
  LineChart,
  listItemLayout,
  paddedBox,
  stackWithGaps,
  Tube,
  WindowDots,
} from "@/lib/svg";
import type { ChartData } from "../data";
import { CardBackground } from "./CardBackground";
import { TitleTube } from "./header-elements";

// what's on the upper-right dashboard: a header, then a trend chart and a table
// side by side, and a warning card under them. fills exactly the width × height
// it's given (no padding around the outside). a plain <g> drawn from (0, 0);
// the diagram bends it onto the roof
export function UpperRight({
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
  // the whole width, split into rows: the header, then two rows of chart cards
  const contentBox = contentBoxLayout({
    width,
    height,
    unit,
    paddingXUnits,
    paddingYUnits,
    rowShares: [0.025, 0.4875, 0.4875],
  });

  const { content, rows, paddingX } = contentBox;

  // the cards: the trend chart and the table side by side in the first card
  // row, paddingX apart, and the warning card across the second
  const cards = (() => {
    const gap = paddingX; // between the two top cards
    const topWidth = (content.width - gap) / 2;
    const { starts } = stackWithGaps([topWidth, topWidth], gap);

    const table = {
      x: starts[1],
      y: rows.starts[1],
      width: topWidth,
      height: rows.sizes[1],
    };
    const trend = {
      x: starts[0],
      y: rows.starts[1],
      width: topWidth,
      height: rows.sizes[1],
    };
    const alert = {
      x: 0,
      y: rows.starts[2],
      width: content.width,
      height: rows.sizes[2],
    };

    // the trend chart's line(s): one per series, in the dashboard's colors
    const lines = chartData.series.map(({ values }, i) => ({
      values,
      color: colorSelection[i % colorSelection.length],
    }));

    return { table, trend, alert, lines };
  })();

  return (
    <g>
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

      {/* the content box: the header, the table and trend cards, the warning card */}
      <g
        transform={`translate(${contentBox.translateX + content.x}, ${content.y})`}
      >
        <g transform={`translate(0, ${rows.starts[0]})`}>
          <Header width={content.width} height={rows.sizes[0]} />
        </g>
        <g transform={`translate(${cards.table.x}, ${cards.table.y})`}>
          <TableCard
            width={cards.table.width}
            height={cards.table.height}
            radius={radius}
            strokeWidth={strokeWidth}
          />
        </g>
        <g transform={`translate(${cards.trend.x}, ${cards.trend.y})`}>
          <TrendCard
            width={cards.trend.width}
            height={cards.trend.height}
            radius={radius}
            strokeWidth={strokeWidth}
            lines={cards.lines}
          />
        </g>
        <g transform={`translate(${cards.alert.x}, ${cards.alert.y})`}>
          <AlertCard
            width={cards.alert.width}
            height={cards.alert.height}
            radius={radius}
            strokeWidth={strokeWidth}
          />
        </g>
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
  width: number; // the header row's width
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

// the trend card: a rounded square and a title at the top, and its line(s) on
// one chart below, each with a faint fill under it. padded and split like the
// old chart cards. drawn from (0, 0)
function TrendCard({
  width,
  height,
  radius,
  strokeWidth,
  lines,
}: {
  width: number; // the card's width
  height: number;
  radius: number; // the card's corner radius
  strokeWidth: number; // the dashboard's border thickness
  lines: { values: number[]; color: string }[]; // one line each, drawn in order
}) {
  const inside = (() => {
    const cardUnit = layoutUnit(height);
    const inner = contentBoxLayout({
      width,
      height,
      unit: cardUnit,
      paddingXUnits: 1.5,
      paddingYUnits: 1.5,
      rowShares: [0.25, 0.75], // the title row, the chart
    });
    const titleRowHeight = inner.rows.sizes[0];

    // the title row: a rounded square as tall as the row, then the title
    const { leading: icon, text } = listItemLayout({
      height: titleRowHeight,
      leadingInset: 0,
      leadingRadius: titleRowHeight / 2,
      gap: cardUnit,
      lineHeights: [cardUnit * 0.5], // the title
    });
    const titleWidth = (inner.content.width - text.x) * 0.6;

    return { inner, icon, text, titleWidth };
  })();

  const { inner, icon, text, titleWidth } = inside;
  const chart = {
    y: inner.rows.starts[1],
    width: inner.content.width,
    height: inner.rows.sizes[1],
  };

  return (
    <>
      <CardBackground
        width={width}
        height={height}
        radius={radius}
        strokeWidth={strokeWidth * 0.5}
      />
      <g transform={`translate(${inner.content.x}, ${inner.content.y})`}>
        {/* title row: a rounded square in the first line's color, then the title */}
        {(() => {
          const { cx, cy, radius: r } = icon;
          return (
            <>
              <rect
                x={cx - r}
                y={cy - r}
                width={r * 2}
                height={r * 2}
                rx={r * 0.4}
                fill={lines[0].color}
              />
              <Tube
                x={text.x}
                y={text.y + text.lineStarts[0]}
                width={titleWidth}
                height={text.lineHeights[0]}
                fill="var(--accent-electric)"
                fillOpacity={0.5}
              />
            </>
          );
        })()}
        {/* the guides once, then the lines on top */}
        <ChartGuides
          y={chart.y}
          width={chart.width}
          height={chart.height}
          count={3}
          insetX={chart.width * 0.04}
          color={lines[0].color}
        />
        {lines.map(({ values, color }, i) => (
          <LineChart
            key={i}
            y={chart.y}
            width={chart.width}
            height={chart.height}
            values={values}
            color={color}
            areaOpacity={0.08}
            areaRadius={radius}
          />
        ))}
      </g>
    </>
  );
}

// the table card: 3 columns × 5 rows, a pill in every cell, with faint lines
// between the rows and the columns. the first row is the header, a little
// brighter. a quieter version of connect's DataGrid. drawn from (0, 0)
function TableCard({
  width,
  height,
  radius,
  strokeWidth,
}: {
  width: number; // the card's width
  height: number;
  radius: number; // the card's corner radius
  strokeWidth: number; // the dashboard's border thickness
}) {
  const table = (() => {
    const cardUnit = layoutUnit(height);
    const box = paddedBox(width, height, 1.2, 1.2, cardUnit);

    const columnCount = 3;
    const rowCount = 5;
    const columnWidth = box.contentWidth / columnCount;
    const rowHeight = box.contentHeight / rowCount;
    const columns = stackWithGaps(
      Array.from({ length: columnCount }, () => columnWidth),
      0,
    );
    const rows = stackWithGaps(
      Array.from({ length: rowCount }, () => rowHeight),
      0,
    );

    // each cell's pill: centered on the row's height, inset from the column's left
    const pillHeight = cardUnit * 0.45;
    const pillInset = cardUnit * 0.5;
    const pillMaxWidth = columnWidth - pillInset * 2;
    const pillY = (rowHeight - pillHeight) / 2;

    return { box, columns, rows, pillHeight, pillInset, pillMaxWidth, pillY };
  })();

  // how wide each pill is (0..1 of pillMaxWidth), one array per column, top to bottom
  const pillWidths = [
    [0.55, 0.8, 0.6, 0.75, 0.65],
    [0.45, 0.6, 0.7, 0.5, 0.65],
    [0.5, 0.4, 0.55, 0.45, 0.6],
  ];

  const { box, columns, rows, pillHeight, pillInset, pillMaxWidth, pillY } =
    table;

  return (
    <>
      <CardBackground
        width={width}
        height={height}
        radius={radius}
        strokeWidth={strokeWidth * 0.5}
      />
      <g transform={`translate(${box.contentX}, ${box.contentY})`}>
        {/* row lines, between the rows */}
        {rows.dividers.map((y, i) => (
          <line
            key={i}
            x1={0}
            y1={y}
            x2={box.contentWidth}
            y2={y}
            stroke="var(--accent-faint)"
            strokeOpacity={0.15}
            strokeWidth={0.5}
          />
        ))}
        {/* column lines, between the columns */}
        {columns.dividers.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={0}
            x2={x}
            y2={box.contentHeight}
            stroke="var(--accent-faint)"
            strokeOpacity={0.15}
            strokeWidth={0.5}
          />
        ))}
        {/* the pills: the header row brighter, the rest dim */}
        {columns.starts.map((columnX, c) =>
          rows.starts.map((rowY, r) => (
            <Tube
              key={`${c}-${r}`}
              x={columnX + pillInset}
              y={rowY + pillY}
              width={pillMaxWidth}
              height={pillHeight}
              level={pillWidths[c][r]}
              fill={r === 0 ? "var(--accent-electric)" : "var(--accent-deep)"}
              fillOpacity={r === 0 ? 0.5 : 0.35}
            />
          )),
        )}
      </g>
    </>
  );
}

// the warning card: a title and a subtitle at the top, and the alert under
// them: a tinted tile with a warning triangle, a message and a detail line
// beside it, and a nearly full threshold bar below.
// padded and split like the trend card, so the label sits where its title
// does. drawn from (0, 0)
function AlertCard({
  width,
  height,
  radius,
  strokeWidth,
}: {
  width: number; // the card's width
  height: number;
  radius: number; // the card's corner radius
  strokeWidth: number; // the dashboard's border thickness
}) {
  const inside = (() => {
    const cardUnit = layoutUnit(height);
    const inner = contentBoxLayout({
      width,
      height,
      unit: cardUnit,
      paddingXUnits: 1.5,
      paddingYUnits: 1.5,
      rowShares: [0.3, 0.7], // the label, the alert
    });
    const alertRowHeight = inner.rows.sizes[1];

    // the content takes this much of the card's width from the left; the rest
    // is empty space at the end
    const contentWidth = inner.content.width * 0.6;

    // the label: a title stacked on a subtitle, centered in the label row
    const label = (() => {
      const rowHeight = inner.rows.sizes[0];
      const lineHeight = rowHeight * 0.15;
      const lineGap = rowHeight * 0.1;
      const lineHeights = [lineHeight, lineHeight]; // title, subtitle
      const { starts: lineStarts } = stackWithGaps(lineHeights, lineGap);
      const { offset } = alignCenter(rowHeight, lineHeight * 2 + lineGap);

      return { y: inner.rows.starts[0] + offset, lineHeights, lineStarts };
    })();

    // the tile with the triangle, then the message and the detail beside it,
    // centered on the tile's height
    const tileSize = alertRowHeight * 0.7;
    const message = listItemLayout({
      height: tileSize,
      leadingInset: 0,
      leadingRadius: tileSize / 2,
      gap: cardUnit,
      lineHeights: [cardUnit * 0.45, cardUnit * 0.45], // the message, the detail
      lineGap: cardUnit * 0.8,
    });
    const iconSize = tileSize * 0.8;

    const messageWidth = contentWidth - message.text.x;

    // the threshold bar: under the tile, the whole width, nearly full
    const bar = {
      y: tileSize + cardUnit * 1.5,
      width: contentWidth,
      height: cardUnit * 0.2,
      level: 0.85,
    };

    // the tile, the lines and the bar together, centered in the alert row
    const { offset } = alignCenter(alertRowHeight, bar.y + bar.height);
    const alertY = inner.rows.starts[1] + offset;

    return {
      inner,
      contentWidth,
      label,
      message,
      messageWidth,
      iconSize,
      bar,
      alertY,
    };
  })();

  const { inner, contentWidth, label } = inside;

  return (
    <>
      <CardBackground
        width={width}
        height={height}
        radius={radius}
        strokeWidth={strokeWidth * 0.5}
      />
      <g transform={`translate(${inner.content.x}, ${inner.content.y})`}>
        the label: a title stacked on a subtitle
        <g transform={`translate(0, ${label.y})`}>
          {/* title: bright, shorter */}
          <Tube
            y={label.lineStarts[0]}
            width={contentWidth}
            height={label.lineHeights[0]}
            level={0.5}
            fill="var(--accent-electric)"
            fillOpacity={0.6}
          />
          {/* subtitle: dim, longer */}
          <Tube
            y={label.lineStarts[1]}
            width={contentWidth}
            height={label.lineHeights[1]}
            level={0.8}
            fill="var(--accent-electric)"
            fillOpacity={0.3}
          />
        </g>
        {/* the alert: the tile with the triangle, the message, the bar */}
        {(() => {
          const {
            message: { leading: tile, text },
            messageWidth,
            iconSize,
            bar,
            alertY,
          } = inside;
          return (
            <g transform={`translate(0, ${alertY})`}>
              <rect
                x={tile.cx - tile.radius}
                y={tile.cy - tile.radius}
                width={tile.radius * 2}
                height={tile.radius * 2}
                rx={tile.radius * 0.4}
                fill="var(--accent)"
                fillOpacity={0.15}
              />
              <TriangleAlert
                x={tile.cx - iconSize / 2}
                y={tile.cy - iconSize / 2}
                size={iconSize}
                stroke="var(--accent)"
                strokeWidth={glyphStrokeLucide(iconSize, 0.8)}
              />
              {/* message: brighter, longer */}
              <Tube
                x={text.x}
                y={text.y + text.lineStarts[0]}
                width={messageWidth}
                height={text.lineHeights[0]}
                level={0.75}
                fill="var(--accent-electric)"
                fillOpacity={0.6}
              />
              {/* detail: dim, shorter */}
              <Tube
                x={text.x}
                y={text.y + text.lineStarts[1]}
                width={messageWidth}
                height={text.lineHeights[1]}
                level={0.5}
                fill="var(--accent-electric)"
                fillOpacity={0.25}
              />
              {/* threshold bar: a faint accent track, nearly full */}
              <Tube
                y={bar.y}
                width={bar.width}
                height={bar.height}
                level={bar.level}
                fill="var(--accent)"
                trackOpacity={0.15}
              />
            </g>
          );
        })()}
      </g>
    </>
  );
}
