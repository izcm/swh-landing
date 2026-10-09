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
// (1/12 of its height), padding of `paddingUnits` units on every side, and
// the content box inside that padding
export function paddedBox(width: number, height: number, paddingUnits = 1) {
  const unit = height / 12;
  const outerPadding = unit * paddingUnits;

  const contentX = outerPadding;
  const contentY = outerPadding;
  const contentWidth = width - outerPadding * 2;
  const contentHeight = height - outerPadding * 2;

  return {
    unit,
    outerPadding,
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
  // typically the same outerPadding used to translate the wrapping <g>,
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
