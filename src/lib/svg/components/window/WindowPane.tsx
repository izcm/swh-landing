import { useId } from "react";

// one window's pane, the look hero and connect use: a dark surface with a soft
// gradient, a faint electric tint, a border and an electric line along the top
// edge. everything inside starts at (0, 0) = the window's top-left
export function WindowPane({
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
  const gradientId = useId();

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--node-color-deep)" />
          <stop offset="55%" stopColor="var(--node-color-deep)" />
          <stop offset="100%" stopColor="var(--accent-ink)" />
        </linearGradient>
      </defs>

      {/* base surface with subtle gradient */}
      <rect
        width={width}
        height={height}
        rx={radius}
        fill={`url(#${gradientId})`}
      />

      {/* tiny electric tint */}
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="var(--accent-electric)"
        fillOpacity={0.01}
      />

      {/* border */}
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke="var(--node-border-color)"
        strokeWidth={strokeWidth}
      />

      {/* top edge */}
      <line
        x1={radius + 8}
        y1={strokeWidth / 2}
        x2={width - radius - 8}
        y2={strokeWidth / 2}
        stroke="var(--accent-electric)"
        strokeWidth={strokeWidth * 1.5}
      />
    </>
  );
}
