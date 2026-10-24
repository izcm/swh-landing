import { useId } from "react";
import { toPoints, type Point } from "../../logic";

type LineChartProps = {
  width: number;
  height: number;
  values: number[]; // each 0-1, normalized — swap for animated values later
  color: string;
  dotRadius?: number; // a dot on each point. no dots if left out
  areaOpacity?: number; // fill under the line: this opacity at the top, 0 at the bottom. no fill if left out
  areaRadius?: number; // the fill's corners, rounded off by a clip the size of the chart
  selectedIdx?: number; // the picked point: a line from it down to the bottom. none if left out
} & Partial<Point>;

export function LineChart({
  x = 0,
  y = 0,
  width,
  height,
  values,
  color,
  dotRadius,
  areaOpacity,
  areaRadius = 0,
  selectedIdx,
}: LineChartProps) {
  const glowId = useId();
  const areaId = useId();
  const areaClipId = useId();
  // the glow behind peak dots: its own circle, blurred as far as its radius
  const glowRadius = (dotRadius ?? 0) * 2;
  const glowBlur = glowRadius * 0.5;

  const points = toPoints(values, width, height);
  // the picked point, if there is one
  const selected = selectedIdx !== undefined ? points[selectedIdx] : undefined;

  const lineD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // the area under the line: the line, then down to the bottom, back along
  // the bottom to the first point's x, and closed
  const last = points[points.length - 1];
  const areaD = `${lineD} L ${last.x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        {/* soft blur for the glow behind the peak dots */}
        {/* room for the blur: it reaches ~3× its stdDeviation past the
            circle, so the box is 4× the circle's width, centered on it */}
        <filter id={glowId} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation={glowBlur} />
        </filter>
        {/* area: areaOpacity at the top, fully transparent at the bottom */}
        <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={areaOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        {/* the area is only shown inside this: the chart's box, corners rounded */}
        <clipPath id={areaClipId}>
          <rect width={width} height={height} rx={areaRadius} />
        </clipPath>
      </defs>
      {/* 2. Transparent blue */}
      {areaOpacity !== undefined && (
        <path
          d={areaD}
          fill={`url(#${areaId})`}
          // fill={"var(--accent)"}
          // fillOpacity={0.25}
          stroke="none"
          clipPath={`url(#${areaClipId})`}
        />
      )}

      {/* the picked point: a thin line down to the bottom, under the curve and the dots */}
      {selected && (
        <line
          x1={selected.x}
          y1={selected.y}
          x2={selected.x}
          y2={height}
          stroke="var(--accent-electric)"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
      )}

      <path
        d={lineD}
        fill="none"
        stroke={color}
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* dots on the turning points: red on a peak, blue in a dip */}
      {dotRadius !== undefined &&
        values.map((value, i) => {
          const prev = values[i - 1];
          const next = values[i + 1];
          // the first and last point have no neighbor on one side
          if (prev === undefined || next === undefined) return null;

          const isMax = value > prev && value > next;
          const isMin = value < prev && value < next;
          if (!isMax && !isMin) return null;

          const fill = isMax ? "var(--accent-electric)" : "var(--accent-deep)";

          return (
            <g key={i}>
              {/* peaks glow: a big blurred circle under the dot
                  (color_tricks.svg panel 6, "glowing point") */}
              {isMax && (
                <circle
                  cx={points[i].x}
                  cy={points[i].y}
                  r={glowRadius}
                  fill={fill}
                  fillOpacity={0.35}
                  filter={`url(#${glowId})`}
                />
              )}
              <circle
                cx={points[i].x}
                cy={points[i].y}
                r={isMax ? dotRadius * 1.5 : dotRadius}
                fill={fill}
              />
            </g>
          );
        })}
    </g>
  );
}

// angle (radians) of the line from first to last point, as drawn in a chart of
// this size — 0 is flat, negative points up, positive points down
export function trendAngle(values: number[], width: number, height: number) {
  const points = toPoints(values, width, height);
  const first = points[0];
  const last = points[points.length - 1];
  return Math.atan2(last.y - first.y, last.x - first.x);
}
