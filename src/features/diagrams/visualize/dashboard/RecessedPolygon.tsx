import { useId } from "react";
import { polygonPath, type Point } from "@/lib/svg";
import { LitEdgeGradient } from "../../shared/gradients";

export const recessedFills = [
  { fill: "var(--ground)", opacity: 1 },
  { fill: "var(--accent-faint)", opacity: 0.5 },
  { fill: "var(--accent)", opacity: 0.25 },
];

// a recessed shape: corners in order, each with its own radius
export function RecessedPolygon({
  points,
  radii,
  strokeWidth,
  fillOpacity = 1,
}: {
  points: Point[];
  radii: number[];
  strokeWidth: number;
  fillOpacity?: number;
}) {
  const borderId = useId();
  const d = polygonPath(points, radii);

  return (
    <>
      <defs>
        <LitEdgeGradient id={borderId} opacity={[0.9, 0.25]} />
      </defs>
      <g opacity={fillOpacity}>
        {recessedFills.map(({ fill, opacity }, i) => (
          <path key={i} d={d} fill={fill} fillOpacity={opacity} />
        ))}
      </g>
      <path
        d={d}
        fill="none"
        stroke={`url(#${borderId})`}
        strokeWidth={strokeWidth}
      />
    </>
  );
}
