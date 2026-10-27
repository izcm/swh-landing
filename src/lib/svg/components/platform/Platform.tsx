import { useId } from "react";
import { EdgeGradient } from "../../styles";
import { BoxBody } from "../iso";
import { accentGlow, gridLines, type Point } from "../../logic";
import { platformCorners, type PlatformShape } from "../../layouts";
import { platformGridStyle, platformStyle } from "./platformStyle";

type PlatformProps = Partial<Point> &
  PlatformShape & {
    // grid on the roof: how many equal parts each direction is split into
    grid: { across: number; along: number };
  };

// a platform like IsoPlatform, but each roof edge has its own length.
// drawn in real units (no 100-wide box, no scale)
export function Platform({
  x = 0,
  y = 0,
  grid,
  ...shape
}: PlatformProps) {
  const { thickness } = shape;
  const { roof } = platformCorners(shape);

  // faces / strokeWeight / glow are handled here; the rest goes to BoxBody as is
  const { faces, strokeWeight, glow, ...boxLook } = platformStyle;
  const gradientId = useId();
  const lines = gridLines(roof, grid);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ filter: accentGlow(glow.blur, glow.strength) }}
    >
      <BoxBody
        roof={roof}
        height={thickness}
        strokeWidth={strokeWeight}
        fills={{
          roof: faces.roof,
          left: faces.left,
          right: faces.left,
          floor: faces.left,
        }}
        {...boxLook}
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
          strokeWidth={strokeWeight}
          {...platformGridStyle}
        />
      ))}
    </g>
  );
}
