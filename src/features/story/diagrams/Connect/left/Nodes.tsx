import {
  glyphStroke,
  ISOCube,
  roundedPolygonPath,
  spaceBetween,
} from "@/lib/svg";
import type { ConnectLayout } from "../geometry/layout";
import { connectNodes } from "../nodes";

// one card per node, spread top to bottom over the left box's height.
// each card: a platform with a panel standing on it, icon + label on the panel
export function Nodes({
  height,
  layout,
}: {
  height: number;
  layout: ConnectLayout;
}) {
  const { card, content } = layout;
  const { platform, panel, panelStart, panelThickness, angles, sticksUp } =
    card;
  const { topLeft, topRight, bottomRight, bottomLeft } = panel.corners;

  return connectNodes.map(({ label, icon: Icon, color }, i) => {
    // top of the whole card (the panel's top)
    const itemY = spaceBetween({
      index: i,
      itemCount: connectNodes.length,
      itemSize: card.height, // the whole card, panel included
      start: 0,
      end: height,
    });

    return (
      // itemY = the card's top; we draw from the platform's top, sticksUp lower
      <g key={label} transform={`translate(0, ${itemY + sticksUp})`}>
        <ISOCube
          x={0}
          y={0}
          size={platform.size}
          thickness={platform.thickness}
          {...angles}
          gridDivisions={card.gridDivisions}
          radius={2}
        />

        {/* panel: its bottom-left stands on panelStart */}
        <path
          transform={`translate(${panelStart.x}, ${panelStart.y - panelThickness})`}
          d={roundedPolygonPath(
            [topLeft, topRight, bottomRight, bottomLeft],
            10, // radius standing panel
          )}
          fill="var(--accent-ink)"
          stroke="var(--accent)"
          strokeWidth={0.4}
        />

        {/* icon + label: start at the panel's left edge, halfway up,
            then skew so everything follows the panel's slope */}
        <g
          transform={`translate(${panelStart.x + content.padding}, ${panelStart.y - panelThickness / 2}) skewY(${card.panelAngle})`}
        >
          <Icon
            x={0}
            y={-content.iconSize / 2}
            size={content.iconSize}
            stroke={color}
            strokeWidth={glyphStroke(content.iconSize, 1.5)}
          />
          <text
            x={content.iconSize + content.gap}
            y={0}
            dominantBaseline="central"
            fontSize={content.fontSize}
            fill="var(--node-text-color)"
          >
            {label}
          </text>
        </g>
      </g>
    );
  });
}
