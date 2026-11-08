import { deg, isoCubeMetrics, type Point } from "../../logic";
import { BoxBody, type BoxLook } from "./BoxBody";

type ISOCubeProps = Partial<Point> &
  BoxLook & {
    size?: number;
    thickness?: number;
    angle?: number;
  };

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
