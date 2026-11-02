import type { Point } from "../../logic";

// a line for each [start, end] pair, hidden with the other svg-debug marks.
// one color for all lines, or one per line
export function DebugLines({
  lines,
  strokeWidth = 1,
  color,
}: {
  lines: [Point, Point][];
  strokeWidth?: number;
  color: string | string[];
}) {
  return (
    <g className="svg-debug">
      {lines.map(([start, end], i) => (
        <line
          key={i}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={Array.isArray(color) ? color[i % color.length] : color}
          strokeWidth={strokeWidth}
        />
      ))}
    </g>
  );
}
