import { listItemLayout } from "./listItemLayout";
import { spaceBetween } from "../logic";

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
  const item = listItemLayout({
    height: rowHeight,
    leadingInset: 0,
    leadingRadius: (rowHeight * dotScale) / 2,
    gap: rowHeight * labelGap,
    lineHeights: [rowHeight], // the label slot: as tall as the row
  });
  const dot = item.leading;
  const labelX = item.text.x;

  return { rowStarts, rowHeight, height, dot, labelX };
}
