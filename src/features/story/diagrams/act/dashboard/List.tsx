import { deepShades, FilledTube, stackWithGaps } from "@/lib/svg";

// how much of the row a label takes, like a word or two of text: somewhere
// between 25% and 60%. looks random but is the same number for the same row
// every render (no Math.random, so nothing jumps around)
function labelLength(i: number) {
  const noise = Math.sin(i * 13 + 4) * 43759;
  const zeroToOne = noise - Math.floor(noise);
  return 0.25 + zeroToOne * 0.35;
}

// list rows filling a width × height box, each a background + dot + tube
export function List({
  width,
  height,
  unit,
  radius,
  rowCount,
}: {
  width: number;
  height: number;
  unit: number;
  radius: number; // the rows' corner radius, capped so short rows don't turn into pills
  rowCount: number;
}) {
  const rowGap = unit * 0.2;
  // rowCount rows + (rowCount - 1) gaps fill the height
  const rowHeight = (height - rowGap * (rowCount - 1)) / rowCount;

  const rows = stackWithGaps(
    Array.from({ length: rowCount }, () => rowHeight),
    rowGap,
  );

  // what's inside each row: a dot, then a tube filling the rest
  const content = (() => {
    const insetX = unit * 0.25; // from the row's left edge
    const size = rowHeight * 0.75;
    const dotRadius = size * 0.25;
    const gap = size * 0.5; // between the dot and the tube

    const tubeX = insetX + dotRadius * 2 + gap;
    const tubeHeight = dotRadius * 1.2;

    return { insetX, dotRadius, tubeX, tubeHeight };
  })();

  const dotColors = deepShades(rowCount);

  return rows.starts.map((rowY, i) => (
    <g key={i} transform={`translate(0, ${rowY})`}>
      {/* background */}
      <rect
        width={width}
        height={rowHeight}
        fill="oklch(from var(--accent) 0.4 0.15 h / 0.1)"
        rx={Math.min(radius, rowHeight / 4)}
      />
      <circle
        cx={content.insetX + content.dotRadius}
        cy={rowHeight / 2}
        r={content.dotRadius}
        fill={dotColors[i]}
        fillOpacity={0.8}
      />
      <FilledTube
        x={content.tubeX}
        y={(rowHeight - content.tubeHeight) / 2}
        width={width - content.tubeX}
        height={content.tubeHeight}
        level={labelLength(i)}
        fillColor="var(--accent-electric)"
        trackOpacity={0}
      />
    </g>
  ));
}
