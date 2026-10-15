import { BarChart, deepShades, LineChart, stackWithGaps } from "@/lib/svg";
import { BoxBackground } from "./BoxBackground";

// first row: two boxes side by side, line chart in the left one, bar chart in the right
export function ChartRow({
  width,
  height,
  gap,
  unit,
  boxRadius,
  boxStrokeWidth,
}: {
  width: number;
  height: number;
  gap: number; // space between the two boxes
  unit: number;
  boxRadius: number; // the two boxes' corner radius
  boxStrokeWidth: number; // the two boxes' border thickness
}) {
  // the row's width, shared 62 / 38 after the gap
  const columnSpace = width - gap;
  const columnSizes = [columnSpace * 0.65, columnSpace * 0.35];
  const columns = stackWithGaps(columnSizes, gap);

  // right box: bar chart, pulled in a little so the bars don't touch the box
  const barChart = (() => {
    const boxWidth = columnSizes[1];
    const insetX = boxWidth * 0.05; // each side
    const insetY = height * 0.1; // top and bottom
    const chartWidth = boxWidth - insetX * 2;
    const chartHeight = height - insetY * 2;

    // bar chart: heights (0..1), one shade of --accent-deep per bar
    const bars = (() => {
      const values = [0.26, 0.37, 0.44, 0.75, 0.4, 0.53];
      const colors = deepShades(values.length);
      const barRatio = 0.4; // thin bars, calmer than a packed block

      return { values, colors, barRatio };
    })();

    return (
      <BarChart
        x={insetX}
        y={insetY}
        width={chartWidth}
        height={chartHeight}
        values={bars.values}
        colors={bars.colors}
        barRatio={bars.barRatio}
      />
    );
  })();

  const lineValues = [0.2, 0.4, 0.1, 0.6, 0.2, 0.5];

  // what goes in each box, left to right
  const columnContent = [
    <LineChart
      width={columnSizes[0]}
      height={height}
      values={lineValues}
      color="var(--accent-deep)"
      dotRadius={unit * 0.08}
      areaOpacity={0.04}
      areaRadius={boxRadius} // same corners as the box behind it
    />,
    barChart,
  ];

  return (
    <>
      {columns.starts.map((columnX, i) => (
        <g key={i} transform={`translate(${columnX}, 0)`}>
          <BoxBackground
            width={columnSizes[i]}
            height={height}
            radius={boxRadius}
            strokeWidth={boxStrokeWidth}
          />
          {columnContent[i]}
        </g>
      ))}
    </>
  );
}
