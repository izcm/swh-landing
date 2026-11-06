import { pointOnLine, type Point } from "@/lib/svg";

// the angle of the line across `panel` at fraction t down its sides
export function skewAtT(panel: Point[], t: number) {
  const [topLeft, topRight, bottomRight, bottomLeft] = panel;

  // Find endpoints at fraction t along both vertical sides
  const left = pointOnLine(topLeft, bottomLeft, t);
  const right = pointOnLine(topRight, bottomRight, t);

  // Calculate the angle between those endpoints
  const dx = right.x - left.x;
  const dy = right.y - left.y;

  return Math.atan2(dy, dx);
}
