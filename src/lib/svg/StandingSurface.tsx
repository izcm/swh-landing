import type { LucideIcon } from "lucide-react";
import {
  glyphStroke,
  roundCorner,
  type Point,
  type ShapeProps,
} from "./helpers";

type Props = ShapeProps & {
  size?: number;
  thickness?: number;
  // slope of the top edge in degrees. 30 = true isometric
  angle?: number;
  // corner rounding, in the same units as size
  radius?: number;
  points?: Point[];
  // drawn in the middle of the panel, skewed to sit flat on it
  icon?: LucideIcon;
  // icon color, e.g. "url(#some-gradient)"
  iconStroke?: string;
};

export function StandingSurface({
  size = 30,
  thickness = size,
  x = 0,
  y = 0,
  angle = 30,
  radius = 4,
  icon: Icon,
  iconStroke = "var(--accent)",
  fill = "none",
  stroke = "var(--accent)",
}: Props) {
  const radians = (angle * Math.PI) / 180;
  //   const edgeLength = size / Math.cos(radians);
  // tan(angle) = opp / adj | opp = depth && adj = size
  // tan(angle) = depth / size -> tan(angle) * size = depth
  const depth = Math.tan(radians) * size;

  const topLeft = { x: 0, y: 0 };
  const topRight = { x: size, y: depth };

  const bottomLeft = { x: 0, y: thickness };
  const bottomRight = { x: size, y: thickness + depth };

  const points = [topLeft, topRight, bottomRight, bottomLeft];
  const n = points.length;
  //   const corners = points ?? [];
  const corners = points.map((corner, i) =>
    roundCorner(points[(i - 1 + n) % n], corner, points[(i + 1) % n], radius),
  );
  //   const { before, corner, after } = roundCorner(start, { x: 0, y: 0 }, end, 4);

  const path =
    corners
      .map(
        ({ before, corner, after }, i) =>
          `${i === 0 ? "M" : "L"} ${before.x} ${before.y} Q ${corner.x} ${corner.y} ${after.x} ${after.y}`,
      )
      .join(" ") + " Z";

  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={
          corners
            .map(
              ({ before, corner, after }, i) =>
                `${i === 0 ? "M" : "L"} ${before.x} ${before.y} Q ${corner.x} ${corner.y} ${after.x} ${after.y}`,
            )
            .join(" ") + " Z"
        }
        fill={fill}
        stroke={stroke}
        strokeWidth={0.65}
      />

      {Icon &&
        (() => {
          const iconSize = size * 0.6;
          // middle of the panel = middle of its diagonal
          const center = { x: size / 2, y: (thickness + depth) / 2 };

          return (
            <g
              transform={`translate(${center.x}, ${center.y}) skewY(${angle})`}
            >
              <Icon
                x={-iconSize / 2}
                y={-iconSize / 2}
                size={iconSize}
                strokeWidth={glyphStroke(iconSize, 2)}
                stroke={iconStroke}
              />
            </g>
          );
        })()}
    </g>
  );
}
