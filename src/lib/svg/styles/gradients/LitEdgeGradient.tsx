// a lit edge: electric, bright at the top and fading down. act's window border.
// usage: const id = useId(); put <LitEdgeGradient id={id} /> inside <defs>,
// then stroke={`url(#${id})`} on the shape. fits each shape's own box, so it
// needs a shape with a width and a height (a rect or an outline path).
// height: measure it in the shapes' own units instead, from y = 0 down to
// height, so it also works on straight lines (whose box has no width)
export function LitEdgeGradient({
  id,
  height,
}: {
  id: string;
  height?: number;
}) {
  return (
    <linearGradient
      id={id}
      gradientUnits={height === undefined ? undefined : "userSpaceOnUse"}
      x1="0"
      y1="0"
      x2="0"
      y2={height ?? 1}
    >
      <stop offset="0%" stopColor="var(--accent-electric)" stopOpacity={0.6} />
      <stop
        offset="100%"
        stopColor="var(--accent-electric)"
        stopOpacity={0.15}
      />
    </linearGradient>
  );
}
