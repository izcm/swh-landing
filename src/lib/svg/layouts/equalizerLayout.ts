// an equalizer: the width split into one equal slot per value, with a column
// standing in each, columnRatio of its slot wide, centered in it, on the
// bottom edge, and as tall as its value
export function equalizerLayout({
  width,
  height,
  values,
  columnRatio,
}: {
  width: number;
  height: number;
  values: number[]; // each 0-1, the column's height as a share of the box
  columnRatio: number; // how much of its slot each column fills
}) {
  const slotWidth = width / values.length;
  const columnWidth = slotWidth * columnRatio;

  const columns = values.map((value, i) => {
    const columnHeight = height * value;
    return {
      x: i * slotWidth + (slotWidth - columnWidth) / 2,
      y: height - columnHeight,
      width: columnWidth,
      height: columnHeight,
    };
  });

  return { columns };
}
