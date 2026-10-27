import { useId } from "react";

import {
  BoxBody,
  glyphStroke,
  InkFadeGradient,
  LitEdgeGradient,
  roundedPolygonPath,
} from "@/lib/svg";
import type { ConnectLayout } from "../layout";
import { connectNodes } from "./nodes";

// one box per node, spread top to bottom over the left box's height.
// each box: icon + label bent onto its right wall
export function Nodes({ layout }: { layout: ConnectLayout["nodes"] }) {
  const { box, content } = layout;
  const { roof, radius, rightFace, leftFace } = box;
  // the roof's border: bright at the top and fading down
  const litEdgeId = useId();
  // the right wall's ink fade, over its fill
  const inkId = useId();
  // the extra layer on every face: a dark accent, see-through
  const layer = "oklch(from var(--accent) 0.12 0.04 h / 0.2)"; // knob
  // the roof's outline, for its lit edge
  const roofOutline = roundedPolygonPath(
    [roof.left, roof.top, roof.right, roof.bottom],
    radius,
  );

  return (
    <>
      <defs>
        <LitEdgeGradient id={litEdgeId} />
        <InkFadeGradient id={inkId} />
      </defs>

      {connectNodes.map(({ label, icon: Icon, color }, i) => {
        // top of the whole box (the roof's top corner)
        const itemY = layout.boxYs[i];

        return (
          <g key={label} transform={`translate(0, ${itemY})`}>
            <BoxBody
              roof={roof}
              height={box.thickness}
              strokeWidth={1}
              // each face: its base color + one dark, see-through accent layer
              fills={{
                roof: ["var(--accent-ink)", layer],
                right: [
                  "oklch(from var(--accent) 0.18 0.05 h)",
                  layer,
                  `url(#${inkId})`,
                ],
                left: ["var(--ground)", layer],
                floor: "oklch(from var(--accent) 0.22 0.08 h)",
              }}
              radius={radius}
              stroke="oklch(from var(--accent-electric) l c h / 0.35)"
              showMiddleEdge // the line from roof.bottom down to floor.bottom
              showFloor
            />
            {/* lit edge: one outline around the roof */}
            <path
              d={roofOutline}
              fill="none"
              stroke={`url(#${litEdgeId})`}
              strokeWidth={1}
            />

            {/* icon + label: padding in from roof.bottom, halfway down the
                right wall, bent onto it */}
            {(() => {
              const { iconSize, fontSize } = content;
              return (
                <>
                  <g transform={leftFace.transform}>
                    <Icon
                      x={leftFace.width * 0.5 - iconSize * 0.5}
                      y={leftFace.height * 0.5 - iconSize * 0.5}
                      size={iconSize}
                      stroke={color}
                      strokeWidth={glyphStroke(iconSize, 1.5)}
                    />
                  </g>
                  <g transform={rightFace.transform}>
                    <text
                      x={rightFace.width / 2}
                      y={rightFace.height / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={fontSize}
                      fill="var(--accent-glow)"
                      fillOpacity={0.9}
                    >
                      {label}
                    </text>
                  </g>
                </>
              );
            })()}
          </g>
        );
      })}
    </>
  );
}
