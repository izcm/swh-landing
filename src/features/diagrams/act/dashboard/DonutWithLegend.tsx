import { DonutChart, Legend, spaceBetween, Tube } from "@/lib/svg";

// placeholder slices: value, color, and how long its legend tube is
// (share of the legend's label width)
const placeholders = [
  { value: 5, color: "var(--accent)", tubeLength: 1 },
  { value: 3, color: "var(--accent-electric)", tubeLength: 0.75 },
  {
    value: 2,
    color: "oklch(from var(--accent-deep) l c h)",
    tubeLength: 0.65,
  },
];

// a donut with its legend to its right, filling width × height: the ring as
// tall as the box, the legend's rows spread over the same height.
// a plain <g> drawn from (0, 0)
export function DonutWithLegend({
  width,
  height,
  unit,
}: {
  width: number; // the area to fill
  height: number; // also the ring's diameter
  unit: number; // the dashboard's ruler: ring thickness and the legend's sizes
}) {
  // left: the ring, as tall as the box
  const ring = (() => {
    const radius = height / 2;
    const thickness = unit * 0.2;
    return { radius, thickness };
  })();

  // right: the legend, spread over the ring's height
  const legend = (() => {
    const rowHeight = unit * 0.5;
    const tubeHeight = rowHeight * 0.35; // knob

    // the rows: the first at the top, the last at the bottom
    const rowStarts = placeholders.map((_, index) =>
      spaceBetween({
        index,
        itemCount: placeholders.length,
        itemSize: rowHeight,
        start: 0,
        end: height,
      }),
    );

    // in each row: the dot on the row's middle, then the label one row after it
    const dotRadius = (rowHeight * 0.45) / 2; // knob: 0.45 of the row's height
    const dot = { cx: dotRadius, cy: rowHeight / 2, radius: dotRadius };
    const labelX = dotRadius * 2 + rowHeight; // knob: one row's gap

    const translateX = ring.radius * 2 + unit * 0.5; // right of the ring
    // what's left for each label, after the ring, the gap and the dot
    const labelWidth = width - translateX - labelX;

    return {
      rowHeight,
      tubeHeight,
      rowStarts,
      dot,
      labelX,
      translateX,
      labelWidth,
    };
  })();

  // each legend label is a filled tube, centered in its row
  const slices = placeholders.map(({ value, color, tubeLength }) => ({
    value,
    color,
    label: (
      <Tube
        y={(legend.rowHeight - legend.tubeHeight) * 0.5}
        width={legend.labelWidth * tubeLength}
        height={legend.tubeHeight}
        fill="var(--accent-electric)"
        fillOpacity={0.3} // same as the subtitle in the List rows
      />
    ),
  }));

  return (
    <>
      <DonutChart
        slices={slices}
        radius={ring.radius}
        thickness={ring.thickness}
        gapAngle={0.085}
      />
      <g transform={`translate(${legend.translateX}, 0)`}>
        <Legend
          rowStarts={legend.rowStarts}
          dot={legend.dot}
          labelX={legend.labelX}
          items={slices}
        />
      </g>
    </>
  );
}
