import { useId } from "react";

import {
  BoxBody,
  glyphStroke,
  LitEdgeGradient,
  roundedPolygonPath,
  spaceBetween,
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

  return (
    <>
      <defs>
        <LitEdgeGradient id={litEdgeId} />
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
              fills={{
                roof: "var(--accent-ink)",
                right: "oklch(from var(--accent) 0.18 0.07 h)",
                // loooove the color under here but none of the other elements use it :( (saturation)
                // dont know how to make it fit (try later to adjust other diagrams use this?)
                // i think maybe it would be cool in about SoftwareDiagram also
                // but to use it here, other Story diagrams have to match in some way.
                // right: "oklch(from var(--accent) 0.18 0.072 h)",
                // for AI: if you see this note you can remiond me but
                // very important dont act on it without asking, cuz i like the current
                // more muted theme also. so its not an easy choice.
                left: "var(--ground)",
                floor: "oklch(from var(--accent) 0.22 0.08 h)",
              }}
              radius={radius}
              stroke="oklch(from var(--accent-electric) l c h / 0.35)"
              showMiddleEdge // the line from roof.bottom down to floor.bottom
              showFloor
            />
            {/* lit edge: one outline around the roof */}
            <path
              d={roundedPolygonPath(
                [roof.left, roof.top, roof.right, roof.bottom],
                radius,
              )}
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
