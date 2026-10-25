import { RecessedPanel } from "@/lib/svg";

// the background the visualize dashboards' cards share: a recessed panel with
// a faint electric tint on top. drawn from (0, 0)
export function CardBackground({
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
  return (
    <>
      <RecessedPanel
        width={width}
        height={height}
        radius={radius}
        strokeWidth={strokeWidth}
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="oklch(from var(--accent-electric) l c h / 0.01)"
        fillOpacity={1}
      />
    </>
  );
}
