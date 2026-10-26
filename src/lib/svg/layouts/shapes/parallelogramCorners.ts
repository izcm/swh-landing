import type { Point } from "../../logic";

// a parallelogram from one corner (origin) and its two edges, both starting there.
// angles: 0 points right, bigger turns clockwise (like pointOnCircle)
export function parallelogramCorners({
  origin,
  lengthA,
  angleA,
  lengthB,
  angleB,
}: {
  origin: Point;
  lengthA: number;
  angleA: number;
  lengthB: number;
  angleB: number;
}) {
  // the two edge vectors
  const u = { x: lengthA * Math.cos(angleA), y: lengthA * Math.sin(angleA) };
  const v = { x: lengthB * Math.cos(angleB), y: lengthB * Math.sin(angleB) };

  // origin, origin + u, origin + u + v, origin + v
  return [
    origin,
    { x: origin.x + u.x, y: origin.y + u.y },
    { x: origin.x + u.x + v.x, y: origin.y + u.y + v.y },
    { x: origin.x + v.x, y: origin.y + v.y },
  ];
}
