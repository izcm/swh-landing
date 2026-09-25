type LineChartProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  values: number[]; // each 0-1, normalized — swap for animated values later
};

// points evenly spread across the width, 0 at the bottom, 1 at the top
function toPoints(values: number[], width: number, height: number) {
  const step = width / (values.length - 1);
  return values.map((value, i) => ({ x: i * step, y: height - height * value }));
}

export function LineChart({ x, y, width, height, values }: LineChartProps) {
  const points = toPoints(values, width, height);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="var(--connector-weight)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

// angle (deg) of the line from first to last point, as drawn in a chart of
// this size — 0 is flat, negative points up, positive points down
export function trendAngle(values: number[], width: number, height: number) {
  const points = toPoints(values, width, height);
  const first = points[0];
  const last = points[points.length - 1];
  return (Math.atan2(last.y - first.y, last.x - first.x) * 180) / Math.PI;
}
