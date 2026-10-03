import type { Point } from "./types";

// const K = 0.5522847498;

// function corner(r: number) {
//   const c = r * K;

//   return {
//     radius: r,
//     control: c,
//   };
// }

export const pointOnCircle = ({
  angle,
  circle,
}: {
  angle: number;
  circle: {
    centerX: number;
    centerY: number;
    radius: number;
  };
}) => ({
  x: circle.centerX + circle.radius * Math.cos(angle),
  y: circle.centerY + circle.radius * Math.sin(angle),
});

export const pointOnLine = (A: Point, B: Point, t: number) => ({
  x: A.x + (B.x - A.x) * t,
  y: A.y + (B.y - A.y) * t,
});

// the two points a rounded corner curves between: `radius` back along the edge towards
// `prev`, and `radius` forward along the edge towards `next`. draw it as
// `… L before Q corner after …`. radius is in the same units as the points
export function roundCorner(
  prev: Point,
  corner: Point,
  next: Point,
  radius: number,
) {
  // pointOnLine wants a fraction of the edge, so divide the distance by the edge's length
  const tIn = radius / Math.hypot(prev.x - corner.x, prev.y - corner.y);
  const tOut = radius / Math.hypot(next.x - corner.x, next.y - corner.y);

  return {
    before: pointOnLine(corner, prev, tIn),
    corner,
    after: pointOnLine(corner, next, tOut),
  };
}

// closed shape through `points` with every corner rounded
export function roundedPolygonPath(points: Point[], radius: number) {
  const n = points.length;

  const corners = points.map((corner, i) =>
    roundCorner(points[(i - 1 + n) % n], corner, points[(i + 1) % n], radius),
  );

  return (
    corners
      .map(
        ({ before, corner, after }, i) =>
          `${i === 0 ? "M" : "L"} ${before.x} ${before.y} Q ${corner.x} ${corner.y} ${after.x} ${after.y}`,
      )
      .join(" ") + " Z"
  );
}
