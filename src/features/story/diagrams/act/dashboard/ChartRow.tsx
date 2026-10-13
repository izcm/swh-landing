import { BarChart, deepShades, LineChart, stackWithGaps } from "@/lib/svg";
import { BoxBackground } from "./BoxBackground";

// first row: two boxes side by side, line chart in the left one, bar chart in the right
export function ChartRow({
  width,
  height,
  gap,
  unit,
}: {
  width: number;
  height: number;
  gap: number; // space between the two boxes
  unit: number;
}) {
  // corner radius + border thickness of the two boxes
  const boxRadius = 8;
  const boxStrokeWidth = 0.4;

  // the row's width, shared 62 / 38 after the gap
  const columnSpace = width - gap;
  const columnSizes = [columnSpace * 0.62, columnSpace * 0.38];
  const columns = stackWithGaps(columnSizes, gap);

  // right box: bar chart, pulled in a little so the bars don't touch the box
  const barChart = (() => {
    const boxWidth = columnSizes[1];
    const insetX = boxWidth * 0.05; // each side
    const insetY = height * 0.1; // top and bottom

    // bar chart: heights (0..1) + one color per bar
    const bars = (() => {
      const values = [0.26, 0.37, 0.44, 0.75, 0.4, 0.53];
      // which bar looks picked: mint (--accent-teal) instead of blue
      const selected = 3;
      // the rest: shades of --accent-deep
      const colors = deepShades(values.length).map((shade, i) =>
        i === selected ? "var(--accent-teal)" : shade,
      );

      return { values, colors };
    })();

    return (
      <BarChart
        x={insetX}
        y={insetY}
        width={boxWidth - insetX * 2}
        height={height - insetY * 2}
        values={bars.values}
        colors={bars.colors}
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
      color="var(--accent-electric)"
      dotRadius={unit * 0.08}
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
