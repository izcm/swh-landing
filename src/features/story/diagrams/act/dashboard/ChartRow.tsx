import {
  BarChart,
  Tube,
  LineChart,
  RecessedPanel,
  stackWithGaps,
} from "@/lib/svg";

// first row: two boxes side by side, line chart in the left one, bar chart in the right
export function ChartRow({
  width,
  height,
  gap,
  unit,
  boxRadius,
  boxStrokeWidth,
  drilldown,
}: {
  width: number;
  height: number;
  gap: number; // space between the two boxes
  unit: number;
  boxRadius: number; // the two boxes' corner radius
  boxStrokeWidth: number; // the two boxes' border thickness
  drilldown?: boolean; // consumer decides if dashboard displays highlighted areas on graphs for the "drilldown" look
}) {
  // the row's width, shared 62 / 38 after the gap
  const columnSpace = width - gap;
  const columnSizes = [columnSpace * 0.65, columnSpace * 0.35];
  const columns = stackWithGaps(columnSizes, gap);

  // right box: bar chart, pulled in a little so the bars don't touch the box
  const barChart = (() => {
    const boxWidth = columnSizes[1];
    const insetX = boxWidth * 0.06; // each side
    const insetY = height * 0.12; // top and bottom
    const chartWidth = boxWidth - insetX * 2;
    const chartHeight = height - insetY * 2;

    // bar heights (0..1)
    const values = [0.42, 0.58, 0.47, 1, 0.66, 0.79].map((v) => v * 0.65);

    return (
      <BarChart
        x={insetX}
        y={insetY}
        width={chartWidth}
        height={chartHeight}
        values={values}
        color="var(--accent-deep)"
        opacity={0.7}
        selectedIdx={drilldown ? 3 : undefined} // the picked bar, or none without drilldown
        barRatio={0.45}
      />
    );
  })();

  // left box: line chart
  const lineChart = (() => {
    // the curve: a gentle rise with two bumps
    const wave = (x: number) =>
      0.3 + 0.22 * x + 0.16 * Math.sin(4 * Math.PI * x);
    const values = Array.from({ length: 85 }, (_, i) => wave(i / 100));

    return (
      <LineChart
        width={columnSizes[0]}
        height={height}
        values={values}
        color="var(--accent-deep)"
        dotRadius={unit * 0.1}
        areaOpacity={0.04}
        areaRadius={boxRadius} // same corners as the box behind it
        selectedIdx={drilldown ? 63 : undefined} // 63 = the highest bump (placeholder), or none without drilldown
      />
    );
  })();

  // title + subtitle lines in the top-left corner of each chart box.
  // only the layout: each box decides how long and full its lines are
  const chartLabelsLayout = (() => {
    const inset = unit * 0.6; // from the box's top and left edges
    const width = unit * 2.5; // the title's width, the same in both boxes
    const lineHeight = unit * 0.15;
    const lineHeights = [lineHeight, lineHeight]; // title, subtitle
    const lines = stackWithGaps(lineHeights, lineHeight);

    return { inset, width, lineHeights, lineStarts: lines.starts };
  })();

  // what goes in each box, left to right
  const columnContent = [
    <>
      {lineChart}
      {/* title + subtitle */}
      {(() => {
        const { inset, width, lineHeights, lineStarts } = chartLabelsLayout;
        return (
          <g transform={`translate(${inset}, ${inset})`}>
            <Tube
              y={lineStarts[0]}
              width={width}
              height={lineHeights[0]}
              fill="var(--accent)"
              fillOpacity={0.5}
            />
            <Tube
              y={lineStarts[1]}
              width={width * 0.5}
              height={lineHeights[1]}
              fill="var(--accent-faint)"
            />
          </g>
        );
      })()}
    </>,
    <>{barChart}</>,
  ];

  return (
    <>
      {columns.starts.map((columnX, i) => (
        <g key={i} transform={`translate(${columnX}, 0)`}>
          <RecessedPanel
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
