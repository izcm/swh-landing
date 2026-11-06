import { useId } from "react";
import {
  accentGlow,
  BoxBody,
  boxCorners,
  gridLines,
  type BoxSize,
  type Point,
} from "@/lib/svg";
import { EdgeGradient } from "../shared/gradients";
import { platformGridStyle, platformStyle } from "./platformStyle";

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
