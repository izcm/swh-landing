import type { LucideIcon } from "lucide-react";
import {
  deg,
  glyphStroke,
  roundedPolygonPath,
  panelPoints,
  toDegrees,
  type ShapeProps,
} from "@/lib/svg";

type Props = Omit<ShapeProps, "fill" | "stroke"> & {
  size?: number;
  thickness?: number;
  // slope of the top edge in radians. deg(30) = true isometric
  angle?: number;
  // corner rounding, in the same units as size
  radius?: number;
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
  angle = deg(30),
  radius = 4,
  icon: Icon,
  iconStroke = "var(--accent)",
}: Props) {
  const {
    depth,
    corners: { topLeft, topRight, bottomRight, bottomLeft },
  } = panelPoints({ size, thickness, angle });

  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={roundedPolygonPath(
          [topLeft, topRight, bottomRight, bottomLeft],
          radius,
        )}
        fill="var(--accent-ink)"
        stroke="var(--accent-dim)"
        strokeWidth={1}
      />

      {Icon &&
        (() => {
          const iconSize = size * 0.6;
          // middle of the panel = middle of its diagonal
          const center = { x: size / 2, y: (thickness + depth) / 2 };

          return (
            <g
              transform={`translate(${center.x}, ${center.y}) skewY(${toDegrees(angle)})`}
            >
              <Icon
                x={-iconSize / 2}
                y={-iconSize / 2}
                size={iconSize}
                strokeWidth={glyphStroke(iconSize, 1.25)}
                stroke={iconStroke}
              />
            </g>
          );
        })()}
    </g>
  );
}
