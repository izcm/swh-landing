import { ArrowRight } from "lucide-react";

import {
  alignCenter,
  deepShades,
  Tube,
  glyphStrokeLucide,
  RecessedPanel,
  stackWithGaps,
} from "@/lib/svg";

// how much of the row a label takes, like a word or two of text: somewhere
// between 25% and 60%. looks random but is the same number for the same row
// every render (no Math.random, so nothing jumps around)
function labelLength(i: number) {
  const noise = Math.sin(i * 13 + 4) * 43759;
  const zeroToOne = noise - Math.floor(noise);
  return 0.25 + zeroToOne * 0.35;
}

// list rows filling a width × height box. each row: a dot, a label with a
// subtitle under it, and a small square button with an arrow on the right
export function List({
  width,
  height,
  unit,
  radius,
  rowCount,
  rowGap,
  selectedIdx,
}: {
  width: number;
  height: number;
  unit: number;
  radius: number; // the rows' corner radius, capped so short rows don't turn into pills
  rowCount: number;
  rowGap: number; // space between rows
  selectedIdx?: number; // the highlighted row. none if left out
}) {
  // rowCount rows + (rowCount - 1) gaps fill the height
  const rowHeight = (height - rowGap * (rowCount - 1)) / rowCount;

  const rows = stackWithGaps(
    Array.from({ length: rowCount }, () => rowHeight),
    rowGap,
  );

  // left: the dot, from the row's left edge
  const dot = (() => {
    const insetX = unit * 0.45;
    const radius = rowHeight * 0.75 * 0.25;

    return { cx: insetX + radius, radius, insetX };
  })();

  // right: a square button, as far in from the right edge as the dot is from the left
  const button = (() => {
    const size = rowHeight * 0.875;
    const x = width - size * 1.2;
    const y = (rowHeight - size) / 2;
    const iconSize = size * 0.6;

    return { size, x, y, radius: size * 0.15, iconSize };
  })();

  // middle: a box between the dot and the button, holding the label with the
  // subtitle under it, centered in the row's height
  const text = (() => {
    // the box: its own space after the dot and before the button
    const x = dot.cx + dot.radius + rowHeight * 0.375;
    const width = button.x - rowHeight * 0.25 - x;

    // the two lines inside it
    const lineHeight = dot.radius * 0.75;
    const lineHeights = [lineHeight, lineHeight]; // label, subtitle
    const lineGap = dot.radius * 0.8;

    const lines = stackWithGaps(lineHeights, lineGap);
    const linesHeight = lineHeights[0] + lineGap + lineHeights[1];

    const { offset: y } = alignCenter(rowHeight, linesHeight);

    return { x, y, width, lineHeights, lineStarts: lines.starts };
  })();

  const dotColors = deepShades(rowCount);

  return rows.starts.map((rowY, i) => (
    <g key={i} transform={`translate(0, ${rowY})`}>
      {/* background */}
      <RecessedPanel
        width={width}
        height={rowHeight}
        radius={Math.min(radius, rowHeight / 4)}
        strokeWidth={0.1}
      />
      {/* the selected row: a faint electric fill and a bright 1px border */}
      {i === selectedIdx && (
        <rect
          width={width}
          height={rowHeight}
          rx={Math.min(radius, rowHeight / 4)}
          fill="var(--accent-electric)"
          fillOpacity={0.08}
          stroke="var(--accent-electric)"
          strokeWidth={1}
        />
      )}

      <circle
        cx={dot.cx}
        cy={rowHeight / 2}
        r={dot.radius}
        fill={dotColors[i]}
        fillOpacity={0.8}
      />

      {/* text box: everything inside starts at its top-left */}
      {(() => {
        const { x, y, width, lineHeights, lineStarts } = text;
        return (
          <g transform={`translate(${x}, ${y})`}>
            {/* label: bright, shorter */}
            <Tube
              x={0}
              y={lineStarts[0]}
              width={width}
              height={lineHeights[0]}
              level={labelLength(i)}
              fill="var(--accent-electric)"
            />
            {/* subtitle: dim, longer */}
            <Tube
              x={0}
              y={lineStarts[1]}
              width={width}
              height={lineHeights[1]}
              level={Math.min(1, labelLength(i + 7) + 0.25)}
              fill="var(--accent-electric)"
              fillOpacity={0.3}
            />
          </g>
        );
      })()}

      {/* button: slightly rounded square with an arrow */}
      {(() => {
        const { x, y, size, radius: r, iconSize } = button;
        return (
          <>
            <rect
              x={x}
              y={y}
              width={size}
              height={size}
              rx={r}
              fill="oklch(from var(--accent) 0.4 0.15 h / 0.15)"
            />
            <ArrowRight
              x={x + (size - iconSize) / 2}
              y={y + (size - iconSize) / 2}
              size={iconSize}
              stroke="var(--accent-electric)"
              strokeOpacity={0.8}
              strokeWidth={glyphStrokeLucide(iconSize, 0.875)}
            />
          </>
        );
      })()}
    </g>
  ));
}
