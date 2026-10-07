import {
  dropAlongEdge,
  isoCubePoints,
  pointOnLine,
  type Point,
} from "@/lib/svg/helpers";
import type { heroLayout } from "./layout";

type Layout = ReturnType<typeof heroLayout>;
type Angles = { angleA: number; angleB: number };

// one line per platform, from the platform to the centerpiece.
// special = the top/bottom platforms (first + last), which go straight up/down
export function heroConnectors({ orbit, centerpiece }: Layout, angles: Angles) {
  const { platform } = orbit;
  const { cube } = centerpiece;

  const cubeMiddleY = centerpiece.y + cube.height / 2;
  const cubeLeftMiddle = { x: centerpiece.x, y: cubeMiddleY };

  // the cube's top-back and bottom-front corners
  const cubeTop = { x: centerpiece.x + cube.b.run, y: centerpiece.y };
  const cubeBottom = {
    x: centerpiece.x + cube.a.run,
    y: centerpiece.y + cube.height,
  };

  // the platform's corners, from isoCubePoints (drawn in a 100-wide box)
  const pts = isoCubePoints(
    platform.size,
    platform.thickness,
    platform.a.angle,
    platform.b.angle,
  );

  return orbit.platformPoints.map((platformBox, i) => {
    const platformCenter = orbit.platformCenterPoints[i];
    const isLower = platformCenter.y > cubeMiddleY;
    const isSpecial = i === 0 || i === orbit.nodes.length - 1;

    // ...this platform's corners: scaled + moved to its spot
    const at = (p: Point) => ({
      x: platformBox.x + p.x * pts.scale,
      y: platformBox.y + p.y * pts.scale,
    });
    const topBack = at(pts.topBack);
    const topRight = at(pts.topRight);
    const topLeft = at(pts.topLeft);
    const topFront = at(pts.topFront);

    const atTopBackRight = (t: number) => pointOnLine(topBack, topRight, t);
    const atTopFrontRight = (t: number) => pointOnLine(topRight, topFront, t);
    const atTopFrontLeft = (t: number) => pointOnLine(topLeft, topFront, t);

    // special: leave from near the corner facing the cube.
    // the rest: leave from the middle of the right edge
    const out = isSpecial
      ? isLower
        ? atTopBackRight(0.25)
        : atTopFrontLeft(0.85)
      : isLower
        ? atTopBackRight(0.5)
        : atTopFrontRight(0.5);

    // the cube outline's y straight above/below out.x, walking from `tip`
    const yOnOutline = (
      tip: Point,
      leftAngle: number,
      rightAngle: number,
      direction: 1 | -1, // 1 = slopes down, -1 = slopes up
    ) => {
      const fromTip = out.x - tip.x;
      const drop = dropAlongEdge({
        run: Math.abs(fromTip),
        angle: fromTip < 0 ? leftAngle : rightAngle,
      });
      return tip.y + direction * drop;
    };

    const into = isSpecial
      ? {
          x: out.x,
          y: isLower
            ? yOnOutline(cubeBottom, cube.a.angle, cube.b.angle, -1)
            : yOnOutline(cubeTop, cube.b.angle, cube.a.angle, 1),
        }
      : cubeLeftMiddle;

    const dx = into.x - out.x;

    // normal: follow the iso angle. lower go up (B), upper go down (A).
    // up is minus in SVG
    const drop = dropAlongEdge({
      run: dx,
      angle: isLower ? angles.angleB : angles.angleA,
    });
    const dy = isSpecial ? into.y - out.y : isLower ? -drop : drop;

    return { out, into, isLower, d: `M ${out.x} ${out.y} l ${dx} ${dy}` };
  });
}
