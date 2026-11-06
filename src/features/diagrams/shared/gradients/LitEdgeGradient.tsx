export function LitEdgeGradient({
  id,
  height,
  // stop opacities: top, bottom
  opacity = [0.6, 0.15],
}: {
  id: string;
  height?: number;
  opacity?: [number, number];
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
      <stop
        offset="0%"
        stopColor="var(--accent-glow)"
        stopOpacity={opacity[0]}
      />
      <stop
        offset="100%"
        stopColor="var(--accent-glow)"
        stopOpacity={opacity[1]}
      />
    </linearGradient>
  );
}
