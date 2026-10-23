import {
  alignEnd,
  contentBoxLayout,
  layoutUnit,
  listItemLayout,
  paddedBox,
  placeItemCenter,
  stackWithGaps,
  Tube,
  WindowDots,
} from "@/lib/svg";
import type { ChartData } from "../data";
import { CardBackground } from "./CardBackground";
import { TitleTube } from "./header-elements";
import { Label } from "./Label";
import { RadialGauge } from "@/lib/svg/components/analytics/RadialGauge";

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
    rowShares: [0.025, 0.975],
  });

  const { content, rows } = contentBox;

  // the card: padded 1 card unit left and right and half a unit top and bottom,
  // split into two columns one padding apart. the left column is split into
  // the label row and the gauge row
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

    // the left column: the label row, then the gauge row
    const left = contentBoxLayout({
      width: columns[0].width,
      height: columns[0].height,
      unit,
      paddingXUnits: 0,
      paddingYUnits: 0,
      rowShares: [0.2, 0.8], // the label, the gauge
    });

    return { width, height, columns, left };
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

            {/* the left column: the label row, then the gauge row */}
            <g
              transform={`translate(${card.columns[0].x + card.left.content.x}, ${card.columns[0].y + card.left.content.y})`}
            >
              {[
                <Label
                  width={card.left.content.width}
                  height={card.left.rows.sizes[0]}
                />,
                <Gauge
                  width={card.left.content.width}
                  height={card.left.rows.sizes[1]}
                  values={chartData.gauge.values}
                  value={chartData.gauge.value}
                />,
              ].map((rowContent, i) => (
                <g
                  key={i}
                  transform={`translate(0, ${card.left.rows.starts[i]})`}
                >
                  {rowContent}
                </g>
              ))}
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

// the gauge: as big as fits in the row, centered in it, with a tube in its
// open bottom. drawn from (0, 0)
function Gauge({
  width,
  height,
  values,
  value,
}: {
  width: number; // the gauge row's width
  height: number; // the gauge row's height
  values: number[]; // the segments (one tick where each starts)
  value: number; // how full it is, out of their total
}) {
  const gauge = (() => {
    const radius = Math.min(width, height) * 0.44;
    const thickness = radius * 0.13;
    const { offsetX: translateX, offsetY: translateY } = placeItemCenter({
      parentWidth: width,
      parentHeight: height,
      itemWidth: radius * 2,
      itemHeight: radius * 2,
    });

    const total = values.reduce((sum, size) => sum + size, 0);

    // the tube: half as wide as the gauge, centered under it, filled up to value
    const tube = {
      x: radius * 0.5,
      y: radius * 1.8,
      width: radius,
      height: thickness * 0.5,
      level: value / total,
    };

    const emptyOpacity = 0.25; // the gauge's and the tube's empty part

    return { radius, thickness, translateX, translateY, tube, emptyOpacity };
  })();

  const { radius, thickness, translateX, translateY, tube, emptyOpacity } =
    gauge;

  return (
    <>
      <defs>
        {/* the gauge's: in the gauge's own coordinates (RadialGauge draws inside its translate(x, y)) */}
        <linearGradient
          id="gaugeGradient"
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={radius * 2}
        >
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-deep)" />
        </linearGradient>
        {/* the tube's: the same, moved over by translateX, because the tube is drawn in the row's coordinates */}
        <linearGradient
          id="gaugeTubeGradient"
          gradientUnits="userSpaceOnUse"
          x1={translateX}
          x2={translateX + radius * 2}
        >
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-deep)" />
        </linearGradient>
      </defs>
      <RadialGauge
        x={translateX}
        y={translateY}
        radius={radius}
        thickness={thickness}
        values={values}
        value={value}
        fill="url(#gaugeGradient)"
        segmentOpacity={emptyOpacity}
      />
      <Tube
        {...tube}
        x={translateX + tube.x}
        y={translateY + tube.y}
        fill="url(#gaugeTubeGradient)"
        trackOpacity={emptyOpacity}
      />
    </>
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
