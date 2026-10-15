import { useId } from "react";

// a glassy surface: dark see-through tint, a soft electric sheen from the
// top-left, a border that's bright at the top and fades downward, and a thin
// highlight along the top edge. everything starts at (0, 0) = its top-left
export function ElectricGlass({
  width,
  height,
  radius,
  strokeWidth,
}: {
  width: number;
  height: number;
  radius: number; // corner radius
  strokeWidth: number; // border thickness
}) {
  const sheenId = useId();
  const borderId = useId();
  const inkId = useId();

  return (
    <>
      <defs>
        {/* ink: 80% at the top, fully transparent at the bottom */}
        <linearGradient id={inkId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-ink)" stopOpacity={0.8} />
          <stop offset="100%" stopColor="var(--accent-ink)" stopOpacity={0} />
        </linearGradient>
        {/* sheen: electric in the top-left corner, gone by the bottom-right */}
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="1">
          <stop
            offset="0%"
            stopColor="var(--accent-electric)"
            stopOpacity={0.22}
          />
          <stop
            offset="60%"
            stopColor="var(--accent-electric)"
            stopOpacity={0.04}
          />
          <stop
            offset="100%"
            stopColor="var(--accent-electric)"
            stopOpacity={0}
          />
        </linearGradient>
        {/* border: bright at the top, fading toward the bottom */}
        <linearGradient id={borderId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--accent-electric)"
            stopOpacity={0.9}
          />
          <stop
            offset="100%"
            stopColor="var(--accent-electric)"
            stopOpacity={0.25}
          />
        </linearGradient>
      </defs>

      {/* 1. the dashboard's ink at the back, so it sits with the darker windows */}
      <rect width={width} height={height} rx={radius} fill={`url(#${inkId})`} />
      {/* 1b. tinted glass on top: dark and see-through */}
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="oklch(from var(--accent) 0.18 0.072 h)"
        fillOpacity={0.55}
      />
      {/* 2. sheen */}
      <rect
        width={width}
        height={height}
        rx={radius}
        fill={`url(#${sheenId})`}
        fillOpacity={0.22}
      />
      {/* 3. border */}
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke={`url(#${borderId})`}
        strokeWidth={strokeWidth}
      />
      {/* 4. highlight just inside the top edge */}
      <line
        x1={radius}
        y1={strokeWidth * 1.5}
        x2={width - radius}
        y2={strokeWidth * 1.5}
        stroke="var(--accent-electric)"
        strokeOpacity={0.5}
        strokeWidth={strokeWidth * 0.75}
      />
    </>
  );
}
