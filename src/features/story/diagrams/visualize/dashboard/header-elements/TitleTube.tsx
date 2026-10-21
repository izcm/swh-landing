// a dashboard header's title: a filled pill as tall as the header row.
// drawn from (0, 0)
export function TitleTube({
  width,
  height,
}: {
  width: number;
  height: number; // the header row's height
}) {
  return (
    <rect
      width={width}
      height={height}
      rx={height / 2}
      fill="var(--accent-electric)"
      fillOpacity={0.4}
    />
  );
}
