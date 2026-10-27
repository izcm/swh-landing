import { useId } from "react";
import { LitEdgeGradient } from "../gradients";

// a box sunk into a window (act's chart boxes and list): faint electric fill +
// electric border. everything inside starts at (0, 0) = the box's top-left
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
        <LitEdgeGradient id={borderId} opacity={[0.9, 0.25]} />
      </defs>
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="oklch(from var(--accent) 0.12 0.02 h)"
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
        fill="oklch(from var(--accent) 0.32 0.14 h)"
        fillOpacity={0.2}
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke={`url(#${borderId})`}
        strokeWidth={strokeWidth}
      />
    </>
  );
}
