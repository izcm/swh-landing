import type { ReactNode } from "react";

import { spaceBetween } from "../logic";

// one legend row: a dot in `color`, then `label`
export type LegendItem = {
  color: string; // the dot (and, in a chart, the thing it names)
  label: ReactNode; // drawn after the dot
};

// where the legend's rows, dots and labels go: `count` rows spread over
// `height`, the first at the top and the last at the bottom. its own function
// so the caller knows the legend's size before placing it
export function legendLayout({
  count,
  height,
  rowHeight,
  dotScale = 1,
  labelGap = 1,
}: {
  count: number; // one row per item
  height: number; // the box all rows fit in: first row at its top, last at its bottom
  rowHeight: number; // each row; the dot sits on its middle
  dotScale?: number; // the dot's height as a share of rowHeight. as tall as the row if left out
  labelGap?: number; // from the dot to its label, in rowHeights. one row if left out
}) {
  const rowStarts = Array.from({ length: count }, (_, index) =>
    spaceBetween({
      index,
      itemCount: count,
      itemSize: rowHeight,
      start: 0,
      end: height,
    }),
  );

  // inside one row: the dot on the row's middle, then the label slot
  const dotRadius = (rowHeight * dotScale) / 2;
  const dot = { cx: dotRadius, cy: rowHeight / 2, radius: dotRadius };
  const labelX = dotRadius * 2 + rowHeight * labelGap;

  return { rowStarts, rowHeight, height, dot, labelX };
}

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
