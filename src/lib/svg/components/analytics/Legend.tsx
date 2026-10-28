import type { ReactNode } from "react";

// one legend row: a dot in `color`, then `label`
export type LegendItem = {
  color: string; // the dot (and, in a chart, the thing it names)
  label?: ReactNode; // drawn after the dot
};

// one row per item: a dot in the item's color, then its label, drawn from
// labelX at the row's top. drawn with the legend's top-left at (0, 0)
export function Legend({
  rowStarts,
  dot,
  labelX,
  items,
}: {
  rowStarts: number[]; // each row's top
  dot: { cx: number; cy: number; radius: number }; // inside a row
  labelX: number; // where each label starts, inside a row
  items: LegendItem[];
}) {
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
