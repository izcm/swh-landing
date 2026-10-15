import { ArrowRight } from "lucide-react";

import {
  alignCenter,
  deepShades,
  FilledTube,
  glyphStrokeLucide,
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
}: {
  width: number;
  height: number;
  unit: number;
  radius: number; // the rows' corner radius, capped so short rows don't turn into pills
  rowCount: number;
  rowGap: number; // space between rows
}) {
  // rowCount rows + (rowCount - 1) gaps fill the height
  const rowHeight = (height - rowGap * (rowCount - 1)) / rowCount;

  const rows = stackWithGaps(
    Array.from({ length: rowCount }, () => rowHeight),
    rowGap,
  );

  // left: the dot, from the row's left edge
  const dot = (() => {
    const insetX = unit * 0.25;
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
      <rect
        width={width}
        height={rowHeight}
        fill="oklch(from var(--accent) 0.4 0.15 h / 0.1)"
        rx={Math.min(radius, rowHeight / 4)}
      />

      <circle
        cx={dot.cx}
        cy={rowHeight / 2}
        r={dot.radius}
        fill={dotColors[i]}
        fillOpacity={0.8}
      />

      {/* text box: everything inside starts at its top-left */}
      <g transform={`translate(${text.x}, ${text.y})`}>
        {/* label: bright, shorter */}
        <FilledTube
          x={0}
          y={text.lineStarts[0]}
          width={text.width}
          height={text.lineHeights[0]}
          level={labelLength(i)}
          fillColor="var(--accent-electric)"
          trackOpacity={0}
        />
        {/* subtitle: dim, longer */}
        <FilledTube
          x={0}
          y={text.lineStarts[1]}
          width={text.width}
          height={text.lineHeights[1]}
          level={Math.min(1, labelLength(i + 7) + 0.25)}
          fillColor="var(--accent-electric)"
          fillOpacity={0.3}
          trackOpacity={0}
        />
      </g>

      {/* button: slightly rounded square with an arrow */}
      <rect
        x={button.x}
        y={button.y}
        width={button.size}
        height={button.size}
        rx={button.radius}
        fill="oklch(from var(--accent) 0.4 0.15 h / 0.15)"
      />
      <ArrowRight
        x={button.x + (button.size - button.iconSize) / 2}
        y={button.y + (button.size - button.iconSize) / 2}
        size={button.iconSize}
        stroke="var(--accent-electric)"
        strokeOpacity={0.8}
        strokeWidth={glyphStrokeLucide(button.iconSize, 0.875)}
      />
    </g>
  ));
}
