import type { Point } from "./types";

// bends a flat drawing onto a parallelogram given by 3 of its corners.
// draw the content from (0, 0) in a width × height area and wrap it in
// <g transform={transform}>: (0, 0) lands on origin, the width runs to xEnd,
// the height to yEnd
export const parallelogramMatrix = ({
  origin,
  xEnd,
  yEnd,
}: {
  origin: Point;
  xEnd: Point;
  yEnd: Point;
}) => {
  // the edge vectors, starting from origin
  const u = { x: xEnd.x - origin.x, y: xEnd.y - origin.y }; // horizontal movement
  const v = { x: yEnd.x - origin.x, y: yEnd.y - origin.y }; // vertical movement

  const width = Math.hypot(u.x, u.y);
  const height = Math.hypot(v.x, v.y);

  // matrix transformation needs the unit vectors
  // a = x unit vector's x coordinate
  const a = u.x / width;
  // b = x unit vector's y coordinate
  const b = u.y / width;

  // c = y unit vector's x coordinate
  const c = v.x / height;
  // d = y unit vector's y coordinate
  const d = v.y / height;

  // e, f = the origin of the transformed coordinate system
  const e = origin.x;
  const f = origin.y;

  return {
    width,
    height,
    transform: `matrix(${a} ${b} ${c} ${d} ${e} ${f})`,
  };
};
