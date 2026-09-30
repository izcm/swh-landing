// like CSS justify-content: space-between — first item flush with start,
// last item flush with end, equal gaps in between
export const spaceBetween = (
  index: number,
  itemCount: number,
  itemSize: number,
  start: number,
  end: number,
) => {
  if (itemCount <= 1) return start;

  const contentSize = end - start;
  const itemsSize = itemCount * itemSize;
  const freeSpace = contentSize - itemsSize;

  const gap = freeSpace / (itemCount - 1);

  return start + index * (itemSize + gap);
};

export const spaceEvenly = (
  index: number,
  itemCount: number,
  itemSize: number,
  start: number,
  end: number,
) => {
  const contentSize = end - start;
  const itemsSize = itemCount * itemSize;
  const freeSpace = contentSize - itemsSize;

  const gap = freeSpace / (itemCount + 1);

  return start + gap + index * (itemSize + gap);
};

export const spaceAround = (
  index: number,
  itemCount: number,
  itemSize: number,
  start: number,
  end: number,
) => {
  const contentSize = end - start;
  const itemsSize = itemCount * itemSize;
  const freeSpace = contentSize - itemsSize;

  const gap = freeSpace / itemCount;

  return start + gap / 2 + index * (itemSize + gap);
};

// shared diagram frame: a base unit (1/12 of the viewBox height), padding of
// `paddingUnits` units on every side, and the content box inside that padding
export function diagramLayout(
  viewboxWidth: number,
  viewboxHeight: number,
  paddingUnits = 1,
) {
  const unit = viewboxHeight / 12;
  const outerPadding = unit * paddingUnits;

  const contentX = outerPadding;
  const contentY = outerPadding;
  const contentWidth = viewboxWidth - outerPadding * 2;
  const contentHeight = viewboxHeight - outerPadding * 2;

  return {
    unit,
    outerPadding,
    contentX,
    contentY,
    contentWidth,
    contentHeight,
  };
}

// Centers an item's height within a parent, and gives its center point
// in absolute coordinates — useful as a connector-line anchor point.
export function centerInParent(
  parentHeight: number,
  itemHeight: number,
  // typically the same outerPadding used to translate the wrapping <g>,
  // since that shifts the item's on-screen position by that much too
  parentOffset = 0,
) {
  const translateY = (parentHeight - itemHeight) / 2;
  const relativeCenterY = itemHeight / 2;
  const absoluteCenterY = relativeCenterY + translateY + parentOffset;

  return { translateY, relativeCenterY, absoluteCenterY };
}
