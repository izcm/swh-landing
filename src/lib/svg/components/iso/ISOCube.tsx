import { deg, glyphStroke, isoCubePoints, type Point } from "../../logic";
import { BoxBody, type BoxLook } from "./BoxBody";

type ISOCubeProps = Partial<Point> &
  BoxLook & {
    size?: number;
    thickness?: number;
    angle?: number;
  };

// the look of the old ISOCube: sharp dark glass at 80%, middle edge on.
const glassFill = "oklch(from var(--accent) 0.18 0.06 h / 0.5)";

// more electric maybe later with some retouches?
// const glassFill = "oklch(from var(--accent) 0.32 0.2 h / 0.35)";

export const glassCube = {
  radius: 0,
  fills: { roof: glassFill, left: glassFill, right: glassFill },
  strokeWidth: 0.85,
};

// ISOCube drew every edge twice (face outline + edge line) and its edge
// gradient is see-through, so the doubled edges were brighter: two layers of
// 50% / 100% / 35% stack up to 75% / 100% / 58%, which is what this is
export const glassEdgeOpacity: [number, number, number] = [1, 1, 1];

// the glass look's halo, for the caller's wrapping <g>: ISOCube draws no glow
export const glassGlow = { blur: 4, strength: 12 };

// no glow: the caller wraps it in its own <g>
export function ISOCube({
  // position
  x = 0,
  y = 0,

  // sizing dims
  size = 100,
  thickness,
  angle = deg(30),

  fills,
  strokes,
  strokeWidth,
  radius,
}: ISOCubeProps) {
  const { scale, verticalHeight, roofTop, roofLeft, roofRight, roofBottom } =
    isoCubePoints(size, thickness, angle, angle);
  const roof = {
    left: roofLeft,
    top: roofTop,
    right: roofRight,
    bottom: roofBottom,
  };

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <BoxBody
        roof={roof}
        thickness={verticalHeight}
        // in real units (undo the scale) so edges match ISOCube's at any size
        strokeWidth={glyphStroke(size, strokeWidth, 100)}
        radius={radius}
        fills={fills}
        strokes={strokes}
      />
    </g>
  );
}
