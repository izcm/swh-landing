import { listItemLayout, stackWithGaps, Tube } from "@/lib/svg";

// the side panel: a menu. drawn from (0, 0)
export function SidePanel({
  width,
  rowHeight,
  rowGap,
}: {
  width: number; // the panel's width
  rowHeight: number; // each menu item's height
  rowGap: number; // between two menu items
}) {
  const insetX = rowHeight * 0.5; // between the dot and the label

  // each item's label length, as a share of the text's width, top to bottom
  const labelLengths = [0.8, 0.65, 0.8, 0.7, 0.85];
  const selectedIdx = 0;

  const rows = stackWithGaps(
    labelLengths.map(() => rowHeight),
    rowGap,
  );
  const { leading: dot, text } = listItemLayout({
    height: rowHeight,
    leadingInset: 0,
    leadingRadius: rowHeight * 0.2,
    gap: insetX,
    lineHeights: [rowHeight * 0.25], // the label
  });
  const textWidth = width - text.x;

  return rows.starts.map((rowY, i) => {
    const isSelected = i === selectedIdx;
    return (
      <g key={i} transform={`translate(0, ${rowY})`}>
        <circle
          cx={dot.cx}
          cy={dot.cy}
          r={dot.radius}
          fill="var(--accent)"
          fillOpacity={isSelected ? 0.85 : 0.35}
        />
        <Tube
          x={text.x}
          y={text.y + text.lineStarts[0]}
          width={textWidth * labelLengths[i]}
          height={text.lineHeights[0]}
          fill="var(--accent)"
          fillOpacity={isSelected ? 0.85 : 0.15}
        />
      </g>
    );
  });
}
