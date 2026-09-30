import { isoCubePoints, type ISOCubeProps } from "@/lib/svg/ISOCube";
import {
  accentGlow,
  pointOnLine,
  roundedPolygonPath,
} from "@/lib/svg/helpers";

// function RoundedCorner({ r }: { r: number }) {
//   const c = r * 0.5522847498;

//   return (
//     <path
//       d={`
//         M 0 ${r}
//         C 0 ${r - c}
//           ${r - c} 0
//           ${r} 0
//       `}
//       fill="none"
//       stroke="black"
//     />
//   );
// }

export function Platform({
  size = 100,
  x = 0,
  y = 0,
  thickness,
  angle = 30,
}: ISOCubeProps) {
  const {
    scale,
    verticalHeight,
    topBack,
    topLeft,
    topRight,
    topFront,
    bottomBack,
    bottomLeft,
    bottomRight,
    bottomFront,
  } = isoCubePoints(size, thickness, angle);

  // in the 100-wide box, so it scales with size like the rest of the shape
  const radius = 4;

  // leftmost / rightmost point of the top face's rounded corners
  // (middle of the corner curve: radius × cos(angle) / 2 in from the edge)
  const tipInset = (radius * Math.cos((angle * Math.PI) / 180)) / 2;
  const leftTip = { x: topLeft.x + tipInset, y: topLeft.y };
  const rightTip = { x: topRight.x - tipInset, y: topRight.y };

  const strokeWidth = 0.2;

  // glassy accent-tinted fills: top face a touch lighter than the walls
  const topFill = "oklch(from var(--accent) 0.22 0.08 h)";
  const wallFill = "oklch(from var(--accent) 0.15 0.06 h / 0.9)";

  // faint grid on the top face: lines between opposite edges at 1/4, 1/2, 3/4
  const gridSteps = [0.25, 0.5, 0.75];
  const gridLines = gridSteps.flatMap((t) => [
    [pointOnLine(topLeft, topBack, t), pointOnLine(topFront, topRight, t)],
    [pointOnLine(topLeft, topFront, t), pointOnLine(topBack, topRight, t)],
  ]);

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{ filter: accentGlow(2, 18) }}
    >
      <path
        d={roundedPolygonPath(
          [bottomLeft, bottomBack, bottomRight, bottomFront],
          radius,
        )}
        fill={wallFill}
        stroke="var(--accent)"
        strokeWidth={strokeWidth}
      />
      {/* walls: filled rectangle between the tips, then the two side edges */}
      <rect
        x={leftTip.x}
        y={leftTip.y}
        width={rightTip.x - leftTip.x}
        height={verticalHeight}
        fill={wallFill}
      />

      <line
        x1={leftTip.x}
        y1={leftTip.y}
        x2={leftTip.x}
        y2={leftTip.y + verticalHeight}
        stroke="var(--accent)"
        strokeWidth={strokeWidth}
      />
      <line
        x1={rightTip.x}
        y1={rightTip.y}
        x2={rightTip.x}
        y2={rightTip.y + verticalHeight}
        stroke="var(--accent)"
        strokeWidth={strokeWidth}
      />

      <path
        d={roundedPolygonPath([topLeft, topBack, topRight, topFront], radius)}
        fill={topFill}
        stroke="var(--accent)"
        strokeWidth={strokeWidth}
      />

      {gridLines.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="var(--accent)"
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
      ))}
    </g>
  );
}
