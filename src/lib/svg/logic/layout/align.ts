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

// centers an item inside a parent on both axes: alignCenter across the width
// and down the height. offsetX / offsetY = from the parent's top-left to the
// item's top-left
export function placeItemCenter({
  parentWidth,
  parentHeight,
  itemWidth,
  itemHeight,
}: {
  parentWidth: number;
  parentHeight: number;
  itemWidth: number;
  itemHeight: number;
}) {
  const { offset: offsetX } = alignCenter(parentWidth, itemWidth);
  const { offset: offsetY } = alignCenter(parentHeight, itemHeight);

  return { offsetX, offsetY };
}
