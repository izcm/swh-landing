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

// grid inside a 4-corner shape: joins matching points on opposite sides.
// `across` splits the left→back / front→right sides, `along` splits the
// left→front / back→right sides. returns each line's two ends.
// 4 × 6 → 3 lines one way + 5 the other
export function gridLines(
  corners: { left: Point; back: Point; right: Point; front: Point },
  divisions: { across: number; along: number },
): [Point, Point][] {
  const { left, back, right, front } = corners;

  // where the lines go along a side: 4 → [0.25, 0.5, 0.75]
  const stepsFor = (count: number) =>
    Array.from({ length: Math.max(0, count - 1) }, (_, i) => (i + 1) / count);

  const acrossLines = stepsFor(divisions.across).map((t): [Point, Point] => [
    pointOnLine(left, back, t),
    pointOnLine(front, right, t),
  ]);
  const alongLines = stepsFor(divisions.along).map((t): [Point, Point] => [
    pointOnLine(left, front, t),
    pointOnLine(back, right, t),
  ]);

  return [...acrossLines, ...alongLines];
}

// how far down you go when you walk `along` (0–1) of an edge that slopes at
// `angle` degrees. run = the edge's full horizontal length
export function dropAlongEdge({
  run,
  along = 1,
  angle,
}: {
  run: number;
  along?: number;
  angle: number;
}) {
  const radians = angle * (Math.PI / 180);

  const adj = run * along;
  const opp = adj * Math.tan(radians);

  return opp;
}

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
