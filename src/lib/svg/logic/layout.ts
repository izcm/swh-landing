// one item's position along a line, for the CSS-like spacing helpers below
export type SpacingInput = {
  index: number; // which item (0 = first)
  itemCount: number;
  itemSize: number; // every item is the same size
  start: number; // where the line begins
  end: number; // where the line ends
};

// like CSS justify-content: space-between — first item flush with start,
// last item flush with end, equal gaps in between
export const spaceBetween = ({
  index,
  itemCount,
  itemSize,
  start,
  end,
}: SpacingInput) => {
  if (itemCount <= 1) return start;

  const contentSize = end - start;
  const itemsSize = itemCount * itemSize;
  const freeSpace = contentSize - itemsSize;

  const gap = freeSpace / (itemCount - 1);

  return start + index * (itemSize + gap);
};

export const spaceEvenly = ({
  index,
  itemCount,
  itemSize,
  start,
  end,
}: SpacingInput) => {
  const contentSize = end - start;
  const itemsSize = itemCount * itemSize;
  const freeSpace = contentSize - itemsSize;

  const gap = freeSpace / (itemCount + 1);

  return start + gap + index * (itemSize + gap);
};

export const spaceAround = ({
  index,
  itemCount,
  itemSize,
  start,
  end,
}: SpacingInput) => {
  const contentSize = end - start;
  const itemsSize = itemCount * itemSize;
  const freeSpace = contentSize - itemsSize;

  const gap = freeSpace / itemCount;

  return start + gap / 2 + index * (itemSize + gap);
};

// any width × height box (a whole diagram's viewBox, a group, …): a base unit
// (1/12 of its height), padding of `paddingXUnits` units left/right and
// `paddingYUnits` units top/bottom (same as X if not passed), and the content
// box inside that padding
export function paddedBox(
  width: number,
  height: number,
  paddingXUnits = 1,
  paddingYUnits = paddingXUnits,
) {
  const unit = height / 12;
  const paddingX = unit * paddingXUnits;
  const paddingY = unit * paddingYUnits;

  const contentX = paddingX;
  const contentY = paddingY;
  const contentWidth = width - paddingX * 2;
  const contentHeight = height - paddingY * 2;

  return {
    unit,
    paddingX,
    paddingY,
    contentX,
    contentY,
    contentWidth,
    contentHeight,
  };
}

// Centers an item inside a parent along one axis (works for heights or
// widths), and gives its center point in absolute coordinates — useful as a
// connector-line anchor point. offset = from the parent's start to the item's start
export function alignCenter(
  parentSize: number,
  itemSize: number,
  // typically the same padding used to translate the wrapping <g>,
  // since that shifts the item's on-screen position by that much too
  parentOffset = 0,
) {
  const offset = (parentSize - itemSize) / 2;
  const relativeCenter = itemSize / 2;
  const absoluteCenter = relativeCenter + offset + parentOffset;

  return { offset, relativeCenter, absoluteCenter };
}

// puts an item's end on its parent's end (bottom for heights, right for
// widths). same { offset } as alignCenter, so the two can be swapped
export function alignEnd(parentSize: number, itemSize: number) {
  const offset = parentSize - itemSize;

  return { offset };
}

// puts items one after another along one axis (x or y) with `gap` between
// neighbours. starts = where each item begins, dividers = the middle of each
// gap (where a divider line goes). both are plain numbers along that axis
export function stackWithGaps(sizes: number[], gap: number) {
  const starts = sizes.map((_, i) =>
    sizes.slice(0, i).reduce((sum, size) => sum + size + gap, 0),
  );
  const dividers = starts.slice(1).map((start) => start - gap / 2);

  return { starts, dividers };
}
