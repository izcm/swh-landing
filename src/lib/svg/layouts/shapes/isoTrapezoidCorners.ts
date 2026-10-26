import type { Point } from "../../logic";
import { parallelogramCorners } from "./parallelogramCorners";

// an isosceles trapezoid from the middle of its bottom edge.
// angleA: the bottom edge's direction. angleB: the left side's direction.
// angles: 0 points right, bigger turns clockwise (like pointOnCircle)
export function isoTrapezoidCorners({
  bottomCenter,
  angleA,
  angleB,
  lengthB,
  lengthA,
}: {
  bottomCenter: Point;
  angleA: number;
  angleB: number;
  lengthB: number;
  lengthA: number;
}) {
  // walk half the bottom edge back from bottomCenter
  const bottomLeft = {
    x: bottomCenter.x - (lengthA / 2) * Math.cos(angleA),
    y: bottomCenter.y - (lengthA / 2) * Math.sin(angleA),
  };

  // how far the left side leans in, measured along the bottom edge
  const inset = lengthB * Math.cos(angleB - angleA);

  // pulls the parallelogram's third corner back, so the right side leans in too
  const w = {
    x: 2 * inset * Math.cos(angleA),
    y: 2 * inset * Math.sin(angleA),
  };

  const [c0, c1, c2, c3] = parallelogramCorners({
    origin: bottomLeft,
    lengthA,
    angleA,
    lengthB,
    angleB,
  });

  return [c0, c1, { x: c2.x - w.x, y: c2.y - w.y }, c3];
}
