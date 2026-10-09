// a rounded track with a filled part, like a progress bar.
// wider than tall: fills from the left. taller than wide: fills from the bottom
export function FilledTube({
  x,
  y,
  width,
  height,
  fill,
  // defaults: the EditorCode look (faint accent track, solid accent fill)
  trackColor = "var(--accent)",
  trackOpacity = 0.15,
  fillColor = "var(--accent)",
  fillOpacity = 1,
  radius = Math.min(width, height) / 2, // default: fully round ends
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: number; // 0–1, how full
  trackColor?: string;
  trackOpacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  radius?: number; // corner radius
}) {
  const horizontal = width >= height;

  const filled = horizontal
    ? { x, y, width: width * fill, height }
    : { x, y: y + height * (1 - fill), width, height: height * fill };

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
      {/* filled part */}
      <rect {...filled} rx={radius} fill={fillColor} opacity={fillOpacity} />
    </g>
  );
}
