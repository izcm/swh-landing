import {
  alignEnd,
  contentBoxLayout,
  layoutUnit,
  listItemLayout,
  paddedBox,
  stackWithGaps,
  Tube,
  WindowDots,
} from "@/lib/svg";
import { Gauge } from "../../shared/Gauge";
import type { ChartData } from "../data";
import { CardBackground } from "./CardBackground";
import { TitleTube } from "./header-elements";

// what's on the lower-right dashboard: a header, then one card filling the
// rest. fills exactly the width × height it's given (no padding around the
// outside). a plain <g> drawn from (0, 0); the diagram bends it onto the roof
export function BottomRight({
  width,
  height,
  radius,
  unit,
  strokeWidth,
  paddingXUnits,
  paddingYUnits,
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
  // the whole width, split into rows: the header, then the card
  const contentBox = contentBoxLayout({
    width,
    height,
    unit,
    paddingXUnits,
    paddingYUnits,
    rowGapUnits: paddingYUnits,
    rowShares: [0.025, 0.975],
  });

  const { content, rows } = contentBox;

  // the card: padded 1 card unit left and right and half a unit top and bottom,
  // split into two columns one padding apart
  const card = (() => {
    const width = content.width;
    const height = rows.sizes[1];
    const unit = layoutUnit(height);

    const box = paddedBox(width, height, 1, 0.5, unit);

    // the two columns, side by side inside the padding
    const columns = (() => {
      const gap = box.paddingX;
      const space = box.contentWidth - gap;
      const sizes = [space * 0.65, space * 0.35]; // the left, the right
      const { starts } = stackWithGaps(sizes, gap);
      return sizes.map((size, i) => ({
        x: box.contentX + starts[i],
        y: box.contentY,
        width: size,
        height: box.contentHeight,
      }));
    })();

    return { width, height, columns };
  })();

  // the right column: six rows, each a dot and one line, as tall as the left
  // column's content
  const list = (() => {
    const rowCount = 5;
    const rowHeight = card.columns[1].height / rowCount;
    const translateX = card.columns[1].x;
    const translateY = card.columns[1].y;

    // each row: a small dot, then one line, centered in the row's height
    const item = listItemLayout({
      height: rowHeight,
      leadingInset: 4,
      leadingRadius: rowHeight * 0.15,
      gap: rowHeight * 0.3,
      lineHeights: [rowHeight * 0.15],
    });
    const lineWidth = card.columns[1].width - item.text.x;

    return { rowCount, rowHeight, translateX, translateY, item, lineWidth };
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

      {/* the content box: the header, then the card */}
      <g
        transform={`translate(${contentBox.translateX + content.x}, ${content.y})`}
      >
        {[
          <Header width={content.width} height={rows.sizes[0]} />,
          <>
            <CardBackground
              width={card.width}
              height={card.height}
              radius={radius}
              strokeWidth={strokeWidth * 0.5}
            />

            {/* the left column: the gauge with its label */}
            <g
              transform={`translate(${card.columns[0].x}, ${card.columns[0].y})`}
            >
              <Gauge
                width={card.columns[0].width}
                height={card.columns[0].height}
                labelShare={0.2} // knob
                values={chartData.gauge.values}
                value={chartData.gauge.value}
              />
            </g>

            {/* the right column: six rows, each a dot and one line */}
            {(() => {
              const {
                rowCount,
                rowHeight,
                translateX,
                translateY,
                item,
                lineWidth,
              } = list;
              return (
                <g transform={`translate(${translateX}, ${translateY})`}>
                  {Array.from({ length: rowCount }, (_, i) => (
                    <g
                      key={i}
                      transform={`translate(0, ${rowHeight * i})`}
                      fillOpacity={0.6}
                    >
                      <circle
                        cx={item.leading.cx}
                        cy={item.leading.cy}
                        r={item.leading.radius}
                        fill="var(--accent-dim)"
                      />
                      <Tube
                        x={item.text.x}
                        y={item.text.y + item.text.lineStarts[0]}
                        width={lineWidth}
                        height={item.text.lineHeights[0]}
                        fill="var(--accent-dim)"
                      />
                    </g>
                  ))}
                </g>
              );
            })()}
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
  width: number; // the header row's width
  height: number; // the header row's height
}) {
  const titleWidth = width * 0.25;

  // the window dots: 1.5 × as tall as the row, so they stick out the same
  // amount above and below it. two radii apart, flush right
  const dots = (() => {
    const scale = 2; // the dots' height against the row's
    const radius = (height / 2) * scale;
    const gap = radius * 2;
    const dotsWidth = radius * 2 * 3 + gap * 2; // WindowDots draws three
    const { offset: translateX } = alignEnd(width, dotsWidth);

    return { radius, gap, translateX };
  })();

  return (
    <g>
      <TitleTube width={titleWidth} height={height * 1.5} />
      <g transform={`translate(${dots.translateX}, 0)`}>
        <WindowDots height={height} radius={dots.radius} gap={dots.gap} />
      </g>
    </g>
  );
}
