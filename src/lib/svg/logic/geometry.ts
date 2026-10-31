import { stackWithGaps } from "./layout";
import type { Point } from "./types";

// an angle written in degrees, as radians: deg(15)
export const deg = (degrees: number) => (degrees * Math.PI) / 180;

// radians back to degrees, for SVG transforms like skewY() that only take degrees
export const toDegrees = (radians: number) => (radians * 180) / Math.PI;

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

// the smallest axis-aligned box around some points: its top-left + size
export function boundingBox(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

// points evenly spread across the width, 0 at the bottom, 1 at the top
export function toPoints(values: number[], width: number, height: number) {
  const step = width / (values.length - 1);
  return values.map((value, i) => ({
    x: i * step,
    y: height - height * value,
  }));
}

// grid inside a 4-corner shape: joins matching points on opposite sides.
// `across` splits the left→top / bottom→right sides, `along` splits the
// left→bottom / top→right sides. returns each line's two ends.
// 4 × 6 → 3 lines one way + 5 the other
export function gridLines(
  corners: { left: Point; top: Point; right: Point; bottom: Point },
  divisions: { across: number; along: number },
): [Point, Point][] {
  const { left, top, right, bottom } = corners;

  // where the lines go along a side: 4 → [0.25, 0.5, 0.75]
  const stepsFor = (count: number) =>
    Array.from({ length: Math.max(0, count - 1) }, (_, i) => (i + 1) / count);

  const acrossLines = stepsFor(divisions.across).map((t): [Point, Point] => [
    pointOnLine(left, top, t),
    pointOnLine(bottom, right, t),
  ]);
  const alongLines = stepsFor(divisions.along).map((t): [Point, Point] => [
    pointOnLine(left, bottom, t),
    pointOnLine(top, right, t),
  ]);

  return [...acrossLines, ...alongLines];
}

// how far down you go when you walk `along` (0–1) of an edge that slopes at
// `angle` (in radians). run = the edge's full horizontal length
export function dropAlongEdge({
  run,
  along = 1,
  angle,
}: {
  run: number;
  along?: number;
  angle: number;
}) {
  const adj = run * along;
  const opp = adj * Math.tan(angle);

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

// each value's slice of a full turn (2π radians): its share of the total,
// placed one after another so each starts where the previous one ends.
// radians, 0 = 3 o'clock, growing clockwise (svg's y points down).
// gapAngle: empty turn between slices; the slices shrink so all still fit in 2π
export function donutArcs(values: number[], startAngle = 0, gapAngle = 0) {
  const total = values.reduce((sum, value) => sum + value, 0);
  const turn = 2 * Math.PI - gapAngle * values.length;
  const sweeps = values.map((value) => (value / total) * turn);
  const { starts } = stackWithGaps(sweeps, gapAngle);

  return sweeps.map((sweep, i) => ({
    startAngle: startAngle + starts[i],
    endAngle: startAngle + starts[i] + sweep,
  }));
}
