import type { Point } from "../logic";

export type PlatformShape = {
  lengthA: number; // left→bottom edge, going down to the right at angleA
  lengthB: number; // bottom→right edge, going up to the right at angleB
  angleA: number;
  angleB: number;
  thickness: number;
};

// a Platform's corners, measured from its own top-left (the x / y you give it).
// roof: the top face. floor: the same corners moved down by thickness
export function platformCorners({
  lengthA,
  lengthB,
  angleA,
  angleB,
  thickness,
}: PlatformShape) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  // the two edge vectors
  const u = {
    x: lengthA * Math.cos(rad(angleA)),
    y: lengthA * Math.sin(rad(angleA)),
  };
  const v = {
    x: lengthB * Math.cos(rad(angleB)),
    y: -lengthB * Math.sin(rad(angleB)),
  };

  // corners = sums of u and v, moved down by v's rise so nothing is above y = 0
  const lift = -v.y;
  const roof = {
    left: { x: 0, y: lift },
    bottom: { x: u.x, y: lift + u.y },
    right: { x: u.x + v.x, y: lift + u.y + v.y },
    top: { x: v.x, y: lift + v.y },
  };

  const down = (p: Point) => ({ x: p.x, y: p.y + thickness });
  const floor = {
    left: down(roof.left),
    bottom: down(roof.bottom),
    right: down(roof.right),
    top: down(roof.top),
  };

  return { roof, floor };
}
