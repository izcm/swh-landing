export const spaceBetween = (
  index: number,
  itemCount: number,
  start: number,
  end: number,
) => {
  if (itemCount <= 1) return start;
  return start + (index * (end - start)) / (itemCount - 1);
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

// Lucide icons are drawn on a fixed 0 0 24 24 viewBox; the `size` prop
// scales that whole box (and strokeWidth along with it) up to the
// rendered size. Dividing by 24/size undoes that stretch in advance, so
// `weight` is the visual thickness you actually see, at any icon size.
export function glyphStroke(size: number, weight = 1) {
  return weight * (24 / size);
}
