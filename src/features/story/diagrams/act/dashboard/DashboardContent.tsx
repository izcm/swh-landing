import { layoutUnit, stackWithGaps } from "@/lib/svg";
import { ChartRow } from "./ChartRow";
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
    <List
      width={width * 0.65}
      height={rowSizes[1]}
      unit={unit}
      radius={radius}
      rowCount={4}
      rowGap={rowGap * 0.5}
    />,
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
