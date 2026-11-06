import {
  ChartGuides,
  LineChart,
  stackWithGaps,
  Tube,
} from "@/lib/svg";

// the line chart's box: its own curve, nothing selected, with a title +
// subtitle in its top-left corner. drawn from (0, 0)
export function LineChartBox({
  width,
  height,
  radius,
  unit,
  strokeWidth,
  values,
}: {
  width: number; // the box's width
  height: number;
  radius: number; // the box's corner radius
  unit: number; // the diagram's ruler, for the dots and the labels
  strokeWidth: number; // the box's border thickness
  values: number[]; // the line's points, each 0-1
}) {
  // title + subtitle lines in the box's top-left corner.
  // sized from this diagram's unit
  const chartLabels = (() => {
    const inset = unit * 0.5; // from the box's top and left edges
    const titleWidth = unit * 2;
    const lineHeight = unit * 0.15;
    const lineHeights = [lineHeight, lineHeight]; // title, subtitle
    const lines = stackWithGaps(lineHeights, lineHeight);

    return { inset, titleWidth, lineHeights, lineStarts: lines.starts };
  })();

  return (
    <g>
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="var(--ground)"
        stroke="var(--accent-faint)"
        strokeWidth={strokeWidth}
      />
      <ChartGuides
        width={width}
        height={height}
        count={3}
        insetX={width * 0.04}
        color="var(--accent-deep)"
      />
      <LineChart
        width={width}
        height={height}
        values={values}
        color="var(--accent-deep)"
        dotRadius={unit * 0.1}
        areaOpacity={0.15}
        areaRadius={radius} // same corners as the box
      />
      {/* title + subtitle */}
      {(() => {
        const { inset, titleWidth, lineHeights, lineStarts } = chartLabels;
        return (
          <g transform={`translate(${inset}, ${inset})`}>
            <Tube
              y={lineStarts[0]}
              width={titleWidth}
              height={lineHeights[0]}
              fill="var(--accent)"
              fillOpacity={0.5}
            />
            <Tube
              y={lineStarts[1]}
              width={titleWidth * 0.5}
              height={lineHeights[1]}
              fill="var(--accent-faint)"
            />
          </g>
        );
      })()}
    </g>
  );
}
