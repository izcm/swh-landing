// a box's background: faint electric fill + electric border.
// everything inside starts at (0, 0) = the box's top-left
export function BoxBackground({
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
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="var(--accent-electric)"
        fillOpacity={0.02}
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke="var(--accent-electric)"
        strokeWidth={strokeWidth}
      />
    </>
  );
}
