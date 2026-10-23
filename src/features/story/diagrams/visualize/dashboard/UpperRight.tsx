import {
  alignEnd,
  contentBoxLayout,
  layoutUnit,
  LineChart,
  listItemLayout,
  stackWithGaps,
  Tube,
  WindowDots,
} from "@/lib/svg";
import type { ChartData } from "../data";
import { CardBackground } from "./CardBackground";
import { TitleTube } from "./header-elements";

// what's on the upper-right dashboard: a header, then two rows of chart cards,
// one card per series in chartData. fills exactly the width × height it's
// given (no padding around the outside). a plain <g> drawn from (0, 0); the
// diagram bends it onto the roof
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

  // the chart cards' grid: the two card rows from contentBox, each split into
  // two columns of equal width, paddingX apart. one card per series, left to
  // right, then the next row
  const cardGrid = (() => {
    const columnCount = 2;
    const gap = paddingX; // between the two columns
    const cardWidth = (content.width - gap * (columnCount - 1)) / columnCount;

    const columns = stackWithGaps(
      Array.from({ length: columnCount }, () => cardWidth),
      gap,
    );

    const cards = chartData.series.map(({ values }, i) => {
      const row = 1 + Math.floor(i / columnCount); // row 0 is the header
      return {
        color: colorSelection[i % colorSelection.length],
        values,
        x: columns.starts[i % columnCount],
        y: rows.starts[row],
        width: cardWidth,
        height: rows.sizes[row],
      };
    });

    return { cards };
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

      {/* the content box: the header, then the chart cards */}
      <g
        transform={`translate(${contentBox.translateX + content.x}, ${content.y})`}
      >
        <g transform={`translate(0, ${rows.starts[0]})`}>
          <Header width={content.width} height={rows.sizes[0]} />
        </g>
        <ChartCards
          cards={cardGrid.cards}
          radius={radius}
          strokeWidth={strokeWidth}
        />
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

// the chart cards, each at its own x / y: a rounded square and a title at the
// top, and a line chart in the card's color below. drawn from (0, 0)
function ChartCards({
  cards,
  radius,
  strokeWidth,
}: {
  // where each card goes, how big it is, its color and its chart's points
  cards: {
    color: string;
    values: number[];
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  radius: number; // the cards' corner radius
  strokeWidth: number; // the dashboard's border thickness
}) {
  // inside a card: padded in the card's own unit (1/12 of its height) and
  // split into the title row and the chart
  const cardInside = (width: number, height: number) => {
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
      lineHeights: [cardUnit * 0.8], // the title
    });
    const titleWidth = (inner.content.width - text.x) * 0.6;

    return { inner, icon, text, titleWidth };
  };

  return cards.map(({ color, values, x, y, width, height }, i) => {
    const { inner, icon, text, titleWidth } = cardInside(width, height);

    return (
      <g key={i} transform={`translate(${x}, ${y})`}>
        <CardBackground
          width={width}
          height={height}
          radius={radius}
          strokeWidth={strokeWidth * 0.5}
        />
        <g transform={`translate(${inner.content.x}, ${inner.content.y})`}>
          {/* title row: a rounded square in the card's color, then the title */}
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
                  fill={color}
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
          {/* the chart, in the card's color */}
          <LineChart
            y={inner.rows.starts[1]}
            width={inner.content.width}
            height={inner.rows.sizes[1]}
            values={values}
            color={color}
            areaOpacity={0.08}
            areaRadius={radius}
          />
        </g>
      </g>
    );
  });
}
