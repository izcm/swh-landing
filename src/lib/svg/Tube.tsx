// a rounded track, optionally with a filled part, like a progress bar.

import type { ShapeProps } from "./logic";

// wider than tall: fills from the left. taller than wide: fills from the bottom
export function Tube({
  x = 0,
  y = 0,
  width,
  height,
  level = 1, // full unless given: a plain tube is styled with fill / fillOpacity
  trackColor = "var(--accent)",
  trackOpacity = 0, // no track unless given (e.g. for a progress bar)
  fill = "var(--accent)",
  fillOpacity = 1,
  radius = Math.min(width, height) / 2, // default: fully round ends
}: {
  width: number;
  height: number;
  level?: number; // 0–1, how full
  trackColor?: string;
  trackOpacity?: number;
  fill?: string;
  fillOpacity?: number;
  radius?: number; // corner radius
} & Partial<ShapeProps>) {
  const horizontal = width >= height;

  const filled = horizontal
    ? { x, y, width: width * level, height }
    : { x, y: y + height * (1 - level), width, height: height * level };

  return (
    <g>
      {/* track: the empty tube */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        fill={trackColor}
        opacity={trackOpacity}
      />
      {/* filled part: none when empty */}
      {level > 0 && (
        <rect {...filled} rx={radius} fill={fill} opacity={fillOpacity} />
      )}
    </g>
  );
}
