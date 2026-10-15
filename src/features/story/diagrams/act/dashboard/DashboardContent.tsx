import { stackWithGaps } from "@/lib/svg";
import { ChartRow } from "./ChartRow";
import { List } from "./List";

// what's inside the dashboard window: charts on top, a list below.
// fills exactly the width × height it's given (the caller decides the padding
// around it). a plain <g> drawn from (0, 0)
export function DashboardContent({
  width,
  height,
  unit,
  radius,
}: {
  width: number; // the area to fill
  height: number;
  unit: number; // gaps and dot sizes
  radius: number; // the list rows' corner radius
}) {
  const rowGap = unit * 0.3;
  const rowSpace = height - rowGap;
  const rowSizes = [rowSpace * 0.45, rowSpace * 0.55];
  const rows = stackWithGaps(rowSizes, rowGap);

  const rowContent = [
    <ChartRow
      width={width}
      height={rowSizes[0]}
      gap={rowGap}
      unit={unit}
      boxRadius={radius}
      boxStrokeWidth={1}
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
