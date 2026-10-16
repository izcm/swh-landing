import { alignCenter, layoutUnit, stackWithGaps } from "@/lib/svg";
import { ChartRow } from "./ChartRow";
import { DonutWithLegend } from "./DonutWithLegend";
import { List } from "./List";

// what's inside the dashboard window: charts on top, a list below.
// fills exactly the width × height it's given (the caller decides the padding
// around it). a plain <g> drawn from (0, 0)
export function DashboardContent({
  width,
  height,
  radius,
  drilldown,
}: {
  width: number; // the area to fill
  height: number;
  radius: number; // corner radius of the chart boxes and the list rows
  drilldown?: boolean; // consumer decides if dashboard displays highlighted areas on graphs for the "drilldown" look
}) {
  // the dashboard's own ruler for gaps and dot sizes, from its own height.
  // shared by the charts row and the list so their sizes match
  const unit = layoutUnit(height);

  const rowGap = unit * 0.5;
  const rowSpace = height - rowGap;
  const rowSizes = [rowSpace * 0.45, rowSpace * 0.55];
  const rows = stackWithGaps(rowSizes, rowGap);

  const columnGap = unit * 0.75;

  // the list takes the left 65% of the second row
  const listWidth = width * 0.65;

  // right of the list: the donut and its legend, in a box as tall as the
  // ring, centered on the row's height
  const donut = (() => {
    const boxHeight = unit * 2; // the ring's diameter (radius = unit, as now)
    const translateX = listWidth + columnGap;
    const boxWidth = width - translateX; // to the row's right edge
    const { offset: translateY } = alignCenter(rowSizes[1], boxHeight);

    return { boxWidth, boxHeight, translateX, translateY };
  })();

  const rowContent = [
    <ChartRow
      width={width}
      height={rowSizes[0]}
      gap={columnGap}
      unit={unit}
      boxRadius={radius}
      boxStrokeWidth={1}
      drilldown={drilldown}
    />,
    <>
      <List
        width={listWidth}
        height={rowSizes[1]}
        unit={unit}
        radius={radius}
        rowCount={4}
        rowGap={rowGap * 0.5}
        selectedIdx={drilldown ? 1 : undefined} // the picked row, or none without drilldown
      />
      <g transform={`translate(${donut.translateX}, ${donut.translateY})`}>
        <DonutWithLegend
          width={donut.boxWidth}
          height={donut.boxHeight}
          unit={unit}
        />
      </g>
    </>,
  ];

  return (
    <g>
      {rows.starts.map((rowY, i) => (
        <g key={i} transform={`translate(0, ${rowY})`}>
          {/* debug: the row's box */}
          <rect
            className="svg-debug"
            x={0}
            y={0}
            width={width}
            height={rowSizes[i]}
            fill="none"
            stroke="#aab4e6" // lavender
            strokeWidth={0.75}
            strokeDasharray="6 4"
          />
          {rowContent[i]}
        </g>
      ))}
    </g>
  );
}
