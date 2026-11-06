import type { Point } from "@/lib/svg";

export function connectorPaths(starts: Point[], ends: Point[]) {
  return starts.map((start, i) => {
    const end = ends[i];
    const dx = end.x - start.x;

    // each flat piece before and after the curve, as a share of dx
    const straight = dx * 0.3;

    // where the curve starts and ends
    const curveStart = { x: start.x + straight, y: start.y };
    const curveEnd = { x: end.x - straight, y: end.y };

    const c1 = {
      x: start.x + dx * 0.6,
      y: start.y,
    };

    const c2 = {
      x: start.x + dx * 0.3,
      y: end.y,
    };

    return [
      `M ${start.x} ${start.y}`,
      `L ${curveStart.x} ${curveStart.y}`,
      `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${curveEnd.x} ${curveEnd.y}`,
      `L ${end.x} ${end.y}`,
    ].join(" ");
  });
}
