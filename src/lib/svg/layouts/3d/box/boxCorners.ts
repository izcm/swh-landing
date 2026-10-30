import type { Point } from "../../../logic";
import { parallelogramCorners } from "../../shapes/parallelogramCorners";

export type BoxSize = {
  lengthA: number; // left→bottom edge, going down to the right at angleA
  lengthB: number; // bottom→right edge, going up to the right at angleB
  angleA: number;
  angleB: number;
  thickness: number;
};

// a box's corners, with its top-left at (x, y).
// roof: the top face. floor: the same corners moved down by thickness
export function boxCorners({
  lengthA,
  lengthB,
  angleA,
  angleB,
  thickness,
  x = 0,
  y = 0,
}: BoxSize & {
  x?: number; // where the box's top-left goes
  y?: number;
}) {
  // edge B rises by this much, so start this far down to keep top at y
  const lift = lengthB * Math.sin(angleB);
  const [left, bottom, right, top] = parallelogramCorners({
    origin: { x, y: y + lift },
    lengthA,
    angleA,
    lengthB,
    angleB: -angleB, // a box's angleB turns up, parallelogramCorners turns down
  });
  const roof = { left, bottom, right, top };

  const down = (p: Point) => ({ x: p.x, y: p.y + thickness });
  const floor = {
    left: down(roof.left),
    bottom: down(roof.bottom),
    right: down(roof.right),
    top: down(roof.top),
  };

  return { roof, floor };
}
