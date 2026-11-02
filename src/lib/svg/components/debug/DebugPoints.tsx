import type { Point } from "../../logic";

// a dot on each point, hidden with the other svg-debug marks.
// one color for all points, or one per point
export function DebugPoints({
  points,
  radius = 4,
  color,
}: {
  points: Point[];
  radius?: number;
  color: string | string[];
}) {
  return (
    <g className="svg-debug">
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={radius}
          fill={Array.isArray(color) ? color[i % color.length] : color}
        />
      ))}
    </g>
  );
}
