import { paddedBox, stackWithGaps } from "../../logic";

// a content box: width × height, translateX in from its parent's left edge.
// its content sits paddingXUnits / paddingYUnits of `unit` in from the edges
// (see paddedBox) and is split into rows, top to bottom, rowGapUnits of unit
// apart.
// rowShares = each row's share of the height left after the gaps. there's one
// gap fewer than rows
export function contentBoxLayout({
  width,
  height,
  translateX = 0,
  unit,
  paddingXUnits,
  paddingYUnits,
  rowGapUnits,
  rowShares,
}: {
  width: number;
  height: number;
  translateX?: number; // where it starts, from its parent's left edge
  unit: number; // the ruler the padding is measured in
  paddingXUnits: number;
  paddingYUnits: number;
  rowGapUnits: number; // between two rows, in units
  rowShares: number[];
}) {
  const groupWidth = width;
  const groupHeight = height;

  // the padded area: the rows fill it
  const box = paddedBox(
    groupWidth,
    groupHeight,
    paddingXUnits,
    paddingYUnits,
    unit,
  );
  const content = {
    x: box.contentX,
    y: box.contentY,
    width: box.contentWidth,
    height: box.contentHeight,
  };

  const rowGap = unit * rowGapUnits;
  const rowSpace = content.height - rowGap * (rowShares.length - 1);
  const rowSizes = rowShares.map((share) => rowSpace * share);
  const { starts: rowStarts } = stackWithGaps(rowSizes, rowGap);

  return {
    groupWidth,
    groupHeight,
    translateX,
    paddingX: box.paddingX,
    paddingY: box.paddingY,
    content,
    rows: { sizes: rowSizes, starts: rowStarts },
  };
}
