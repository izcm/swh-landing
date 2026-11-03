import { useId } from "react";
import { polygonPath, type Point } from "../../logic";
import { LitEdgeGradient } from "../gradients";

export const recessedFills = [
  { fill: "oklch(from var(--accent) 0.12 0.02 h)", opacity: 1 },
  { fill: "var(--accent-ink)", opacity: 0.65 },
  { fill: "oklch(from var(--accent) 0.32 0.12 h)", opacity: 0.2 },
];

// RecessedPanel's look on any shape: corners in order, each with its own radius
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
