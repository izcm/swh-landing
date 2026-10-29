import { deg, isoCubeMetrics, type Point } from "../../logic";
import { allFills, BoxBody, type BoxLook } from "./BoxBody";

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
  fills: { ...allFills(glassFill), floor: [] },
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
  const { depth, a, b, edgeLength } = isoCubeMetrics(size, thickness, {
    angleA: angle,
    angleB: angle,
  });
  const roof = {
    left: { x: 0, y: depth },
    top: { x: b.run, y: 0 },
    right: { x: size, y: depth },
    bottom: { x: a.run, y: depth * 2 },
  };

  return (
    <g transform={`translate(${x}, ${y})`}>
      <BoxBody
        roof={roof}
        thickness={thickness ?? edgeLength}
        strokeWidth={strokeWidth}
        radius={radius}
        fills={fills}
        strokes={strokes}
      />
    </g>
  );
}
