import { ChevronDown, Layers } from "lucide-react";

import { glyphStrokeLucide, toDegrees, type Point } from "@/lib/svg";
import { skewAtT } from "./skewAtT";

// the region dropdown: an icon, the region's name and a chevron, slanted like
// the panel's middle line
export function RegionSelect({
  panel,
  unit,
}: {
  panel: Point[];
  unit: number;
}) {
  const panelWidth = panel[1].x - panel[0].x;
  const panelHeight = panel[3].y - panel[0].y;

  const paddingX = unit * 0.35;
  const iconSize = panelHeight * 0.45;

  const icon = { x: paddingX, size: iconSize };
  const label = { x: paddingX + iconSize * 1.5, fontSize: panelHeight * 0.4 };
  const chevron = { x: panelWidth - paddingX - iconSize, size: iconSize };

  const rowTransform = `translate(0, ${panelHeight * 0.5}) skewY(${toDegrees(skewAtT(panel, 0.5))})`;

  return (
    <g transform={`translate(${panel[0].x}, ${panel[0].y})`}>
      <g transform={rowTransform}>
        {/* icon */}
        <Layers
          x={icon.x}
          y={-icon.size * 0.5}
          size={icon.size}
          stroke="var(--accent)"
          strokeWidth={glyphStrokeLucide(icon.size, 1)}
        />
        {/* label */}
        <text
          x={label.x}
          fill="var(--fg)"
          dominantBaseline="central"
          fontSize={label.fontSize}
          fontWeight={500}
        >
          Nordics
        </text>
        {/* chevron */}
        <ChevronDown
          x={chevron.x}
          y={-chevron.size * 0.5}
          size={chevron.size}
          stroke="var(--accent)"
          strokeOpacity={0.6}
          strokeWidth={glyphStrokeLucide(chevron.size, 1.2)}
        />
      </g>
    </g>
  );
}
