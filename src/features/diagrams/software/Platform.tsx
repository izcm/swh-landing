import { useId } from "react";
import {
  accentGlow,
  allFills,
  BoxBody,
  boxCorners,
  gridLines,
  type BoxSize,
  type Point,
} from "@/lib/svg";
import { EdgeGradient } from "../shared/gradients";

// the platform look: solid accent roof, dark walls, a floor, soft glow.
// (what ISOCube's defaults used to be, before they became glassCube)
export const platformStyle = {
  fills: {
    ...allFills("var(--platform-wall-fill)"),
    roof: "var(--pane-fill)",
  },
  strokeWidth: 1,
  radius: 4,
  edgeOpacity: [0.5, 1, 0.35] as [number, number, number],
  glow: { blur: 2, strength: 18 },
};

// the grid lines on a platform's roof (stroked with an edge gradient)
const platformGridStyle = {
  opacity: 0.2,
};

type PlatformProps = Partial<Point> &
  BoxSize & {
    // grid on the roof: how many equal parts each direction is split into
    grid: { across: number; along: number };
  };

// a platform where each roof edge has its own length.
// drawn in real units (no 100-wide box, no scale)
export function Platform({
  x = 0,
  y = 0,
  grid,
  ...shape
}: PlatformProps) {
  const { thickness } = shape;
  const { roof } = boxCorners(shape);

  // the platform look
  const { fills, strokeWidth, glow, radius } = platformStyle;
  const gradientId = useId();
  const edge = `url(#${gradientId})`;
  const lines = gridLines(roof, grid);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ filter: accentGlow(glow.blur, glow.strength) }}
    >
      <BoxBody
        roof={roof}
        thickness={thickness}
        strokeWidth={strokeWidth}
        fills={fills}
        radius={radius}
        strokes={{
          roof: edge,
          left: edge,
          right: edge,
          floor: edge,
          floorTop: edge,
        }}
      />

      <defs>
        <EdgeGradient
          id={gradientId}
          width={roof.right.x}
          height={roof.bottom.y + thickness}
          opacity={platformStyle.edgeOpacity}
        />
      </defs>
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          {...platformGridStyle}
        />
      ))}
    </g>
  );
}
