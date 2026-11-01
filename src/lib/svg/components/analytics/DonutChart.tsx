import type { SVGProps } from "react";
import { arcPath, donutArcs } from "../../logic";
import type { Slice } from "./types";

// a ring cut into slices, each starting where the previous one ends.
export function DonutChart({
  x = 0,
  y = 0,
  slices,
  radius,
  thickness,
  startAngle = -Math.PI / 2,
  gapAngle = 0,
  transform = "",
  ...groupProps
}: Omit<SVGProps<SVGGElement>, "x" | "y"> & {
  x?: number;
  y?: number;
  slices: Slice[];
  radius: number; // the ring's outer radius
  thickness: number; // the ring's width
  startAngle?: number; // radians, where the first slice starts. 12 o'clock if left out (0 = 3 o'clock)
  gapAngle?: number; // radians of empty ring between slices. none if left out
}) {
  // the circle through the ring's middle, so the stroke's outer edge is at `radius`
  const circle = {
    centerX: radius,
    centerY: radius,
    radius: radius - thickness * 0.5,
  };
  const arcs = donutArcs(
    slices.map((slice) => slice.value),
    startAngle,
    gapAngle,
  );

  return (
    <g {...groupProps} transform={`translate(${x}, ${y}) ${transform}`}>
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
