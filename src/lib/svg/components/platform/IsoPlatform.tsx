import { useId, type ComponentProps } from "react";
import { EdgeGradient } from "../../styles";
import { ISOCube } from "../iso";
import {
  accentGlow,
  deg,
  glyphStroke,
  gridLines,
  isoCubePoints,
} from "../../logic";
import { platformGridStyle, platformStyle } from "./platformStyle";

type IsoPlatformProps = ComponentProps<typeof ISOCube> & {
  // grid on the roof: how many equal parts each direction is split into
  // ({ across: 4, along: 4 } = a line every 25% both ways)
  grid: { across: number; along: number };
};

// an ISOCube with the platform look, and a grid drawn on its roof.
// any ISOCube prop still works as an override (e.g. strokeWeight, radius)
export function IsoPlatform({ grid, ...cube }: IsoPlatformProps) {
  const style = { ...platformStyle, ...cube };
  const {
    x = 0,
    y = 0,
    size = 100,
    thickness,
    angleA = deg(30),
    angleB = angleA,
    strokeWeight,
    stroke,
    edgeOpacity,
    glow,
  } = style;

  // the same corners ISOCube draws with: a 100-wide box, scaled to size
  const { scale, verticalHeight, roofLeft, roofTop, roofRight, roofBottom } =
    isoCubePoints(size, thickness, angleA, angleB);
  const lines = gridLines(
    { left: roofLeft, top: roofTop, right: roofRight, bottom: roofBottom },
    grid,
  );

  const gradientId = useId();

  return (
    <>
      <ISOCube {...style} />

      {/* same transform as ISOCube, so the grid lands on its roof */}
      <g
        transform={`translate(${x}, ${y}) scale(${scale})`}
        style={{ filter: accentGlow(glow.blur, glow.strength) }}
      >
        <defs>
          <EdgeGradient
            id={gradientId}
            width={100}
            height={roofBottom.y + verticalHeight}
            opacity={edgeOpacity}
          />
        </defs>
        {lines.map(([a, b], i) => (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={stroke ?? `url(#${gradientId})`}
            strokeWidth={glyphStroke(size, strokeWeight, 100)}
            {...platformGridStyle}
          />
        ))}
      </g>
    </>
  );
}
