import { arcPath, donutArcs } from "../logic";
import type { LegendItem } from "./Legend";

// one piece of the donut: a legend item (color, label) plus its value, so the
// same array goes to DonutChart and Legend
export type DonutSlice = LegendItem & {
  value: number; // any size: the slice is value / total of the ring
};

// a ring cut into slices, each starting where the previous one ends.
// fills a 2·radius × 2·radius box with its top-left at (x, y)
export function DonutChart({
  x = 0,
  y = 0,
  slices,
  radius,
  thickness,
  startAngle = -Math.PI / 2,
  gapAngle = 0,
}: {
  x?: number;
  y?: number;
  slices: DonutSlice[];
  radius: number; // the ring's outer radius
  thickness: number; // the ring's width
  startAngle?: number; // radians, where the first slice starts. 12 o'clock if left out (0 = 3 o'clock)
  gapAngle?: number; // radians of empty ring between slices. none if left out
}) {
  // the circle through the ring's middle, so the stroke's outer edge is at `radius`
  const circle = {
    centerX: radius,
    centerY: radius,
    radius: radius - thickness / 2,
  };
  const arcs = donutArcs(
    slices.map((slice) => slice.value),
    startAngle,
    gapAngle,
  );

  return (
    <g transform={`translate(${x}, ${y})`}>
      {arcs.map((arc, i) => (
        <path
          key={i}
          d={arcPath(circle, arc.startAngle, arc.endAngle)}
          fill="none"
          stroke={slices[i].color}
          strokeWidth={thickness}
        />
      ))}
    </g>
  );
}
