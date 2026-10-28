import { ChevronRight } from "lucide-react";

import {
  deepShades,
  Tube,
  glyphStrokeLucide,
  listItemLayout,
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

// list rows filling a width × height box. each row: a small circle marker, a
// label with a subtitle under it, and a chevron on the right
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

  // left to middle: the marker, then the label with the subtitle under it,
  // both centered in the row's height
  const item = (() => {
    const dotRadius = rowHeight * 0.1875;
    const lineHeight = dotRadius * 0.55; // knob

    return listItemLayout({
      height: rowHeight,
      leadingInset: unit * 0.45,
      leadingRadius: dotRadius,
      gap: rowHeight * 0.28,
      lineHeights: [lineHeight, lineHeight], // label, subtitle
      lineGap: dotRadius * 0.8,
    });
  })();

  // right: a chevron, as far in from the right edge as the marker is from the left
  const chevron = (() => {
    const size = rowHeight * 0.4; // knob
    const x = width - unit * 0.45 - size; // unit * 0.45 = the marker's leadingInset
    return { x, y: (rowHeight - size) / 2, size };
  })();

  // the text's width: from where it starts to a little before the chevron
  const textWidth = chevron.x - rowHeight * 0.25 - item.text.x;

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

      {/* marker: a small circle in the leading circle's box */}
      <circle
        cx={item.leading.cx}
        cy={item.leading.cy}
        r={item.leading.radius * 0.7} // knob: smaller than the leading circle
        fill={dotColors[i]}
        fillOpacity={0.8}
      />

      {/* text box: everything inside starts at its top-left */}
      {(() => {
        const { x, y, lineHeights, lineStarts } = item.text;
        const width = textWidth;
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

      {/* chevron at the end */}
      <ChevronRight
        x={chevron.x}
        y={chevron.y}
        size={chevron.size}
        stroke="var(--accent-electric)"
        strokeOpacity={0.6}
        strokeWidth={glyphStrokeLucide(chevron.size, 1.2)}
      />
    </g>
  ));
}
