// a dashboard header's button: a pill drawn with a stroke only, as tall as the
// header row. drawn from (x, 0)
export function OutlineButton({
  x = 0,
  width,
  height,
}: {
  x?: number; // from the header's left edge
  width: number;
  height: number; // the header row's height
}) {
  return (
    <rect
      x={x}
      width={width}
      height={height}
      rx={height / 2}
      fill="none"
      stroke="var(--accent)"
      strokeWidth={0.5}
    />
  );
}
