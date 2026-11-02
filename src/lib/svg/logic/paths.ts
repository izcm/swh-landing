import { pointOnCircle, pointOnLine } from "./math/geometry";
import type { Point } from "./types";

// smooth curve through every point, as an svg path `d` string.
// the / 6 turns a Catmull-Rom curve into Bézier control points
export function smoothPath(points: Point[]) {
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const c1 = {
      x: p1.x + (p2.x - p0.x) / 6,
      y: p1.y + (p2.y - p0.y) / 6,
    };

    const c2 = {
      x: p2.x - (p3.x - p1.x) / 6,
      y: p2.y - (p3.y - p1.y) / 6,
    };

    d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }

  return d;
}

// a piece of a circle from startAngle to endAngle (radians, clockwise), as an
// svg path `d` string. stroke it to draw a piece of a ring
export function arcPath(
  circle: { centerX: number; centerY: number; radius: number },
  startAngle: number,
  endAngle: number,
): string {
  // a whole turn ends on its own start point, and svg draws nothing for that:
  // draw it as two half turns instead
  if (endAngle - startAngle >= 2 * Math.PI) {
    const middle = (startAngle + endAngle) / 2;
    return `${arcPath(circle, startAngle, middle)} ${arcPath(circle, middle, endAngle)}`;
  }

  const start = pointOnCircle({ angle: startAngle, circle });
  const end = pointOnCircle({ angle: endAngle, circle });
  // more than half a turn: tell svg to go the long way round
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  const { radius } = circle;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

// a diamond's outline through its 4 corners, as an svg path `d` string
export function diamondPath({
  left,
  bottom,
  right,
  top,
}: {
  left: Point;
  bottom: Point;
  right: Point;
  top: Point;
}) {
  return `M ${left.x} ${left.y} L ${bottom.x} ${bottom.y} L ${right.x} ${right.y} L ${top.x} ${top.y} Z`;
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

// open path from `prev` to `next` through `corner`, the corner rounded by
// `radius` (0 keeps it sharp)
export function roundedCornerPath(
  prev: Point,
  corner: Point,
  next: Point,
  radius: number,
) {
  const { before, after } = roundCorner(prev, corner, next, radius);

  return `M ${prev.x} ${prev.y} L ${before.x} ${before.y} Q ${corner.x} ${corner.y} ${after.x} ${after.y} L ${next.x} ${next.y}`;
}

// closed shape through `points`, each corner rounded by its own radius in
// `radii` (0 keeps that corner sharp)
export function polygonPath(points: Point[], radii: number[]) {
  const n = points.length;

  const corners = points.map((corner, i) =>
    roundCorner(points[(i - 1 + n) % n], corner, points[(i + 1) % n], radii[i]),
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

// closed shape through `points` with every corner rounded
export function roundedPolygonPath(points: Point[], radius: number) {
  return polygonPath(
    points,
    points.map(() => radius),
  );
}
