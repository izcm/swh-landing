import { useId } from "react";

// faint electric fill + electric border.
// everything inside starts at (0, 0) = the box's top-left
export function RecessedPanel({
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
  const borderId = useId();

  return (
    <>
      <defs>
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
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="oklch(from var(--accent) 0.08 0.025 h)"
        fillOpacity={1}
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="var(--accent-ink)"
        fillOpacity={0.65}
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="var(--accent-electric)"
        fillOpacity={0.05}
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke={`url(#${borderId})`}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </>
  );
}
