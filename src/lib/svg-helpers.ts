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
  const centerY = itemHeight / 2;
  const resolvedCenterY = centerY + translateY + parentOffset;

  return { translateY, centerY, resolvedCenterY };
}

// Lucide icons are drawn on a fixed 0 0 24 24 viewBox; the `size` prop
// scales that whole box (and strokeWidth along with it) up to the
// rendered size. Dividing by 24/size undoes that stretch in advance, so
// `weight` is the visual thickness you actually see, at any icon size.
export function glyphStroke(size: number, weight = 1) {
  return weight * (24 / size);
}
