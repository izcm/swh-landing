import {
  boxCorners,
  dropAlongEdge,
  pointOnLine,
  type Point,
} from "@/lib/svg";
import type { heroLayout } from "./layout";

type Layout = ReturnType<typeof heroLayout>;
type Angles = { angleA: number; angleB: number };

// the platform sits right above/below the cube: its center is within the cube's width
export function isAboveOrBelowCube(
  platformCenter: Point,
  centerpiece: Layout["centerpiece"],
) {
  return (
    platformCenter.x > centerpiece.x &&
    platformCenter.x < centerpiece.x + centerpiece.cube.size
  );
}

// one line per platform, from the platform to the centerpiece.
// isAboveOrBelow = the platform sits right above/below the cube, so none of its
// edges can reach the cube in a straight iso line: it goes straight up/down instead
// endGap = space left between an above/below line's end and the cube's edge
export function heroConnectors(
  { orbit, centerpiece }: Layout,
  angles: Angles,
  endGap = 0,
) {
  const { platform } = orbit;
  const { cube } = centerpiece;

  const cubeMiddleY = centerpiece.y + cube.height / 2;
  const cubeLeftMiddle = { x: centerpiece.x, y: cubeMiddleY };

  // the cube's topmost and bottommost corners
  const cubeTop = { x: centerpiece.x + cube.b.run, y: centerpiece.y };
  const cubeBottom = {
    x: centerpiece.x + cube.a.run,
    y: centerpiece.y + cube.height,
  };

  // the platform's roof corners, measured from its own top-left
  const { roof } = boxCorners({
    lengthA: platform.a.edgeLength,
    lengthB: platform.b.edgeLength,
    angleA: platform.a.angle,
    angleB: platform.b.angle,
    thickness: platform.thickness,
  });

  return orbit.platformPoints.map((platformBox, i) => {
    const platformCenter = orbit.platformCenterPoints[i];
    const isLower = platformCenter.y > cubeMiddleY;
    const isAboveOrBelow = isAboveOrBelowCube(platformCenter, centerpiece);

    // ...this platform's corners, moved to its spot
    const at = (p: Point) => ({
      x: platformBox.x + p.x,
      y: platformBox.y + p.y,
    });
    const roofTop = at(roof.top);
    const roofRight = at(roof.right);
    const roofLeft = at(roof.left);
    const roofBottom = at(roof.bottom);

    const atTopRight = (t: number) => pointOnLine(roofTop, roofRight, t);
    const atBottomRight = (t: number) => pointOnLine(roofRight, roofBottom, t);
    const atBottomLeft = (t: number) => pointOnLine(roofLeft, roofBottom, t);

    // above/below: leave from near the corner facing the cube.
    // the rest: leave from the middle of the right edge
    const out = isAboveOrBelow
      ? isLower
        ? atTopRight(0.25)
        : atBottomLeft(0.85)
      : isLower
        ? atTopRight(0.5)
        : atBottomRight(0.5);

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

    const into = isAboveOrBelow
      ? {
          x: out.x,
          y: isLower
            ? yOnOutline(cubeBottom, cube.a.angle, cube.b.angle, -1) + endGap
            : yOnOutline(cubeTop, cube.b.angle, cube.a.angle, 1) - endGap,
        }
      : cubeLeftMiddle;

    const dx = into.x - out.x;

    // normal: follow the iso angle. lower go up (B), upper go down (A).
    // up is minus in SVG
    const drop = dropAlongEdge({
      run: dx,
      angle: isLower ? angles.angleB : angles.angleA,
    });
    const dy = isAboveOrBelow ? into.y - out.y : isLower ? -drop : drop;

    return {
      out,
      into,
      isLower,
      isAboveOrBelow,
      d: `M ${out.x} ${out.y} l ${dx} ${dy}`,
    };
  });
}
