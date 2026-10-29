import type { Point } from "../../../logic";
import { parallelogramCorners } from "../../shapes/parallelogramCorners";

export type BoxSize = {
  lengthA: number; // left→bottom edge, going down to the right at angleA
  lengthB: number; // bottom→right edge, going up to the right at angleB
  angleA: number;
  angleB: number;
  thickness: number;
};

// a box's corners, measured from its own top-left (the x / y you give it).
// roof: the top face. floor: the same corners moved down by thickness
export function boxCorners({
  lengthA,
  lengthB,
  angleA,
  angleB,
  thickness,
}: BoxSize) {
  // edge B rises by this much, so start this far down to keep top at y = 0
  const lift = lengthB * Math.sin(angleB);
  const [left, bottom, right, top] = parallelogramCorners({
    origin: { x: 0, y: lift },
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
