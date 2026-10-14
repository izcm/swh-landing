import { useId } from "react";
import { EdgeGradient } from "../EdgeGradient";
import { BoxBody } from "../iso";
import { accentGlow, gridLines, type Point } from "../logic";
import { platformGridStyle, platformStyle } from "./platformStyle";

type PlatformShape = {
  lengthA: number; // front-left edge, going down to the right at angleA
  lengthB: number; // front-right edge, going up to the right at angleB
  angleA: number;
  angleB: number;
  thickness: number;
};

type PlatformProps = Partial<Point> &
  PlatformShape & {
    // grid on the top face: how many equal parts each direction is split into
    grid: { across: number; along: number };
  };

// a Platform's corners, measured from its own top-left (the x / y you give it).
// top: the top face. bottom: the same corners moved down by thickness
export function platformCorners({
  lengthA,
  lengthB,
  angleA,
  angleB,
  thickness,
}: PlatformShape) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  // the two edge vectors
  const u = {
    x: lengthA * Math.cos(rad(angleA)),
    y: lengthA * Math.sin(rad(angleA)),
  };
  const v = {
    x: lengthB * Math.cos(rad(angleB)),
    y: -lengthB * Math.sin(rad(angleB)),
  };

  // corners = sums of u and v, moved down by v's rise so nothing is above y = 0
  const lift = -v.y;
  const top = {
    left: { x: 0, y: lift },
    front: { x: u.x, y: lift + u.y },
    right: { x: u.x + v.x, y: lift + u.y + v.y },
    back: { x: v.x, y: lift + v.y },
  };

  const down = (p: Point) => ({ x: p.x, y: p.y + thickness });
  const bottom = {
    left: down(top.left),
    front: down(top.front),
    right: down(top.right),
    back: down(top.back),
  };

  return { top, bottom };
}

// a platform like IsoPlatform, but each top edge has its own length.
// drawn in real units (no 100-wide box, no scale)
export function Platform({
  x = 0,
  y = 0,
  grid,
  ...shape
}: PlatformProps) {
  const { thickness } = shape;
  const { top } = platformCorners(shape);

  // faces / strokeWeight / glow are handled here; the rest goes to BoxBody as is
  const { faces, strokeWeight, glow, ...boxLook } = platformStyle;
  const gradientId = useId();
  const lines = gridLines(top, grid);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ filter: accentGlow(glow.blur, glow.strength) }}
    >
      <BoxBody
        top={top}
        height={thickness}
        strokeWidth={strokeWeight}
        fills={{
          top: faces.top,
          left: faces.left,
          right: faces.left,
          bottom: faces.left,
        }}
        {...boxLook}
      />

      <defs>
        <EdgeGradient
          id={gradientId}
          width={top.right.x}
          height={top.front.y + thickness}
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
