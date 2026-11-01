import {
  contentBoxLayout,
  DonutChart,
  layoutUnit,
  paddedBox,
  placeItemCenter,
  RecessedPanel,
  stackWithGaps,
} from "@/lib/svg";

import { KPICardContent } from "./content/KPICardContent";
import { LineChartBox } from "./content/LineChartBox";
import { SidePanel } from "./content/SidePanel";

// the line chart's curve: a gentle rise with two bumps
const wave = (x: number) => 0.3 + 0.22 * x + 0.16 * Math.sin(4 * Math.PI * x);

// what the line chart draws
const trend = Array.from({ length: 85 }, (_, i) => wave(i / 100));

// the side panel on the left, the line chart and the KPI cards on the right.
// fills exactly the width × height it's given, no padding. drawn from (0, 0)
export function Dashboard({
  width,
  height,
  radius,
  strokeWidth,
}: {
  width: number;
  height: number;
  radius: number; // corner radius of the boxes inside
  strokeWidth: number; // the boxes' border thickness
}) {
  const unit = layoutUnit(height);
  // between the two columns, the two rows and the KPI cards
  const gapUnits = 0.5; // gap will be this% of unit
  const gap = unit * gapUnits;

  // left column
  const sidePanel = (() => {
    const groupWidth = width * 0.175;
    const drawing = (
      <SidePanel width={groupWidth} rowHeight={unit} rowGap={unit * 0.35} />
    );
    return { groupWidth, drawing };
  })();

  // right column: line chart, KPI cards
  const contentBox = (() => {
    const translateX = sidePanel.groupWidth + gap * 2;
    const layout = contentBoxLayout({
      width: width - translateX,
      height,
      translateX,
      unit,
      paddingXUnits: 0,
      paddingYUnits: 0,
      rowGapUnits: gapUnits,
      rowShares: [0.65, 0.35],
    });
    const { content, rows } = layout;

    // the KPI cards: the first 1/2 wide, the other two 1/4. each a box with
    // three tubes inside its padding
    const cards = (() => {
      const shares = [0.5, 0.25, 0.25];
      const height = rows.sizes[1];
      const space = content.width - gap * (shares.length - 1);
      const widths = shares.map((share) => space * share);
      const { starts } = stackWithGaps(widths, gap);
      // how full each card's bottom tube is, left to right
      const levels = [0.65, 0.4, 0.8];

      const drawing = starts.map((start, i) => {
        const {
          contentX,
          contentY,
          contentWidth,
          contentHeight,
          unit: cardUnit,
        } = paddedBox(widths[i], height, 2);

        // centered in the room right of the squeezed tubes
        const donut = (() => {
          const radius = contentHeight * 0.45;
          const roomX = contentX + contentWidth * 0.4;
          const { offsetX, offsetY } = placeItemCenter({
            parentWidth: contentWidth * (1 - 0.32),
            parentHeight: contentHeight,
            itemWidth: radius * 2,
            itemHeight: radius * 2,
          });

          return { x: roomX + offsetX, y: contentY + offsetY, radius };
        })();

        return (
          <g key={i} transform={`translate(${start}, 0)`}>
            <RecessedPanel
              width={widths[i]}
              height={height}
              radius={radius}
              strokeWidth={strokeWidth * 0.5}
            />
            <g
              transform={`translate(${contentX}, ${contentY}) ${i === 0 ? "scale(0.4, 1)" : ""}`}
            >
              <KPICardContent
                width={contentWidth}
                height={contentHeight}
                lineHeight={cardUnit * 0.7}
                lineGap={cardUnit * 0.9}
                level={levels[i]}
              />
            </g>
            {i === 0 && (
              <DonutChart
                x={donut.x}
                y={donut.y}
                slices={[
                  { value: 0.25, color: "var(--accent)" },
                  { value: 0.5, color: "var(--accent-electric)" },
                  {
                    value: 0.25,
                    color: "var(--accent-deep)",
                  },
                ]}
                radius={donut.radius}
                thickness={cardUnit * 0.75}
                gapAngle={0.15}
                opacity={0.5}
              />
            )}
          </g>
        );
      });

      return { drawing };
    })();

    const drawing = (
      <g
        transform={`translate(${layout.translateX + content.x}, ${content.y})`}
      >
        {[
          <LineChartBox
            width={content.width}
            height={rows.sizes[0]}
            radius={radius}
            unit={unit}
            strokeWidth={strokeWidth}
            values={trend}
          />,
          cards.drawing,
        ].map((group, i) => (
          <g key={i} transform={`translate(0, ${rows.starts[i]})`}>
            {group}
          </g>
        ))}
      </g>
    );

    return { drawing };
  })();

  return (
    <>
      {sidePanel.drawing}
      {contentBox.drawing}
    </>
  );
}
