import { pointOnLine } from "../math/geometry";
import { layoutUnit } from "./units";
import type { Point } from "../types";

// box inside that padding
export function paddedBox(
  width: number,
  height: number,
  paddingXUnits = 1,
  paddingYUnits = paddingXUnits,
  unit = layoutUnit(height),
) {
  const paddingX = unit * paddingXUnits;
  const paddingY = unit * paddingYUnits;

  const contentX = paddingX;
  const contentY = paddingY;
  const contentWidth = width - paddingX * 2;
  const contentHeight = height - paddingY * 2;

  return {
    unit,
    paddingX,
    paddingY,
    contentX,
    contentY,
    contentWidth,
    contentHeight,
  };
}

// for eg. a trapezoid where its vertical edges are parallell
// pass padding as an absolute value
// note: for trapezoid where the parallell sides are the horizontal ones, a more general solution is needed
export function padVerticalSides(corners: Point[], padding: number): Point[] {
  const [topLeft, topRight, bottomRight, bottomLeft] = corners;
  const t = padding / (topRight.x - topLeft.x);

  const tl = pointOnLine(topLeft, topRight, t);
  const tr = pointOnLine(topRight, topLeft, t);
  const br = pointOnLine(bottomRight, bottomLeft, t);
  const bl = pointOnLine(bottomLeft, bottomRight, t);

  return [
    { x: tl.x, y: tl.y + padding },
    { x: tr.x, y: tr.y + padding },
    { x: br.x, y: br.y - padding },
    { x: bl.x, y: bl.y - padding },
  ];
}
