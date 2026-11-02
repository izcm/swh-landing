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

// splits `length` by `shares` after taking out the gaps between them
export function splitWithGaps(length: number, shares: number[], gap: number) {
  const space = length - gap * (shares.length - 1);
  const sizes = shares.map((share) => space * share);

  return { sizes, ...stackWithGaps(sizes, gap) };
}
