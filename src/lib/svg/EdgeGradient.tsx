// EditorWindow's border gradient, for glowing accent edges.
// usage: const id = useId(); put <EdgeGradient id={id} ... /> inside <defs>,
// then stroke={`url(#${id})`} on the shapes.
// userSpaceOnUse because straight vertical lines have a zero-width bounding box,
// so width/height are the size of the shape in its own units.
export function EdgeGradient({
  id,
  width,
  height,
}: {
  id: string;
  width: number;
  height: number;
}) {
  return (
    <linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      x1={0}
      y1={0}
      x2={width}
      y2={height}
    >
      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
      <stop
        offset="55%"
        style={{ stopColor: "var(--accent-deep)" }}
        stopOpacity="1"
      />
      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
    </linearGradient>
  );
}
