import type { ReactNode } from "react";

import type { legendLayout } from "../../layouts";

// one legend row: a dot in `color`, then `label`
export type LegendItem = {
  color: string; // the dot (and, in a chart, the thing it names)
  label?: ReactNode; // drawn after the dot
};

// one row per item: a dot in the item's color, then its label, drawn with
// its top-left at the label slot's top-left (the slot is rowHeight tall).
// drawn with the legend's top-left at (0, 0)
export function Legend({
  layout,
  items,
}: {
  layout: ReturnType<typeof legendLayout>;
  items: LegendItem[];
}) {
  const { rowStarts, dot, labelX } = layout;

  return (
    <>
      {rowStarts.map((rowY, i) => (
        <g key={i} transform={`translate(0, ${rowY})`}>
          <circle
            cx={dot.cx}
            cy={dot.cy}
            r={dot.radius}
            fill={items[i].color}
          />
          <g transform={`translate(${labelX}, 0)`}>{items[i].label}</g>
        </g>
      ))}
    </>
  );
}
