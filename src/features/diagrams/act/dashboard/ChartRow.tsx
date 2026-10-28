import {
  ChartGuides,
  layoutUnit,
  paddedBox,
  Tube,
  LineChart,
  RecessedPanel,
  stackWithGaps,
} from "@/lib/svg";
import { Gauge } from "../../shared/Gauge";

// first row: two boxes side by side, line chart in the left one, radial gauge in the right
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

  // right box: like visualize's gauge card, the gauge with its label,
  // padded in the box's own unit
  const gaugeCard = (() => {
    const box = paddedBox(columnSizes[1], height, 1, 0.5, layoutUnit(height)); // knob: 1 across, 0.5 down
    const labelShare = 0.2; // knob: the label row's share
    // placeholder: the segments (one tick where each starts) and how full it is
    const data = { values: [1, 1, 1, 1, 1, 1], value: 1.2 };
    return { box, labelShare, data };
  })();

  // left box: line chart
  const lineChart = (() => {
    // the curve: a gentle rise with two bumps
    const wave = (x: number) =>
      0.3 + 0.22 * x + 0.16 * Math.sin(4 * Math.PI * x);
    const values = Array.from({ length: 85 }, (_, i) => wave(i / 100));

    return (
      <>
        <ChartGuides
          width={columnSizes[0]}
          height={height}
          count={3}
          insetX={columnSizes[0] * 0.04}
          color="var(--accent-deep)"
        />
        <LineChart
          width={columnSizes[0]}
          height={height}
          values={values}
          color="var(--accent-deep)"
          dotRadius={unit * 0.1}
          areaOpacity={0.064}
          areaRadius={boxRadius} // same corners as the box behind it
          selectedIdx={drilldown ? 63 : undefined} // 63 = the highest bump (placeholder), or none without drilldown
        />
      </>
    );
  })();

  // title + subtitle lines in the top-left corner of each chart box.
  // only the layout: each box decides how long and full its lines are
  const chartLabelsLayout = (() => {
    const inset = unit * 0.6; // from the box's top and left edges
    const width = unit * 2.5; // the title's width, the same in both boxes
    const lineHeight = unit * 0.12;
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
              fill="var(--accent-electric)"
              fillOpacity={0.6}
            />
            <Tube
              y={lineStarts[1]}
              width={width * 0.5}
              height={lineHeights[1]}
              fill="var(--accent)"
              fillOpacity={0.2}
            />
          </g>
        );
      })()}
    </>,
    <>
      {(() => {
        const { box, labelShare, data } = gaugeCard;
        return (
          <g transform={`translate(${box.contentX}, ${box.contentY})`}>
            <Gauge
              width={box.contentWidth}
              height={box.contentHeight}
              labelShare={labelShare}
              values={data.values}
              value={data.value}
            />
          </g>
        );
      })()}
    </>,
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
