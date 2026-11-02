// the shared ruler: 1/12 of the size it's given
export const layoutUnit = (size: number) => size / 12;

// the same ruler, from a box's shorter side
export const shortSideUnit = (width: number, height: number) =>
  layoutUnit(Math.min(width, height));
