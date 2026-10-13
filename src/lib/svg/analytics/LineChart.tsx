import { useId } from "react";
import { type Point } from "../logic";

type LineChartProps = {
  width: number;
  height: number;
  values: number[]; // each 0-1, normalized — swap for animated values later
  color: string;
  dotRadius?: number; // a dot on each point. no dots if left out
} & Partial<Point>;

// points evenly spread across the width, 0 at the bottom, 1 at the top
function toPoints(values: number[], width: number, height: number) {
  const step = width / (values.length - 1);
  return values.map((value, i) => ({
    x: i * step,
    y: height - height * value,
  }));
}

export function LineChart({
  x = 0,
  y = 0,
  width,
  height,
  values,
  color,
  dotRadius,
}: LineChartProps) {
  const glowId = useId();
  // the glow behind peak dots: its own circle, blurred as far as its radius
  const glowRadius = (dotRadius ?? 0) * 2;
  const glowBlur = glowRadius * 0.5;

  const wave = (x: number) => 0.3 + 0.22 * x + 0.16 * Math.sin(4 * Math.PI * x);

  const valuesTmp = Array.from({ length: 160 }, (_, i) => wave(i / 99));

  const points = toPoints(valuesTmp, width, height);

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const separatorCount = 3;
  const separators = Array.from({ length: separatorCount }).map((_, i) => ({
    x1: width * 0.04,
    x2: width * 0.96,
    // evenly spaced: 1/5, 2/5, 3/5, 4/5 of the height
    y: (height * (i + 1)) / (separatorCount + 1),
  }));

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        {/* soft blur for the glow behind the peak dots */}
        {/* room for the blur: it reaches ~3× its stdDeviation past the
            circle, so the box is 4× the circle's width, centered on it */}
        <filter id={glowId} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation={glowBlur} />
        </filter>
      </defs>
      {/* 2. Transparent blue */}

      {separators.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y}
          x2={s.x2}
          y2={s.y}
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.04}
          strokeDasharray="6 4"
        />
      ))}

      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* dots on the turning points: red on a peak, blue in a dip */}
      {dotRadius !== undefined &&
        valuesTmp.map((value, i) => {
          const prev = valuesTmp[i - 1];
          const next = valuesTmp[i + 1];
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

// angle (deg) of the line from first to last point, as drawn in a chart of
// this size — 0 is flat, negative points up, positive points down
export function trendAngle(values: number[], width: number, height: number) {
  const points = toPoints(values, width, height);
  const first = points[0];
  const last = points[points.length - 1];
  return (Math.atan2(last.y - first.y, last.x - first.x) * 180) / Math.PI;
}
