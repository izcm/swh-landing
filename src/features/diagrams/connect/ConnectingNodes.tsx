import { useId } from "react";

import { allStrokes, BoxBody, roundedPolygonPath } from "@/lib/svg";
import { Centerpiece } from "../shared/centerpiece/Centerpiece";
import { AccentFadeGradient, LitEdgeGradient } from "../shared/gradients";
import { connectNodes } from "./connectNodes";
import {
  connectingNodesAngles,
  connectingNodesLayout,
  type ConnectingNodesLayout,
  type ConnectingNodesShares,
} from "./connectingNodesLayout";

export function ConnectingNodes({
  x = 0,
  y = 0,
  width,
  height,
  viewboxWidth,
  viewboxHeight,
  strokeWidth,
  shares,
}: {
  x?: number;
  y?: number;
  width: number | string;
  height: number | string;
  viewboxWidth: number;
  viewboxHeight: number;
  strokeWidth: number;
  shares: ConnectingNodesShares;
}) {
  const { nodes, centerpiece, connectors } = connectingNodesLayout({
    width: viewboxWidth,
    height: viewboxHeight,
    angles: connectingNodesAngles,
    shares,
  });

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
    >
      {connectors.nodeConnectors.map((path, i) => (
        <path
          key={i}
          d={path}
          stroke="var(--accent-dim)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray="8 12"
        />
      ))}

      <Nodes layout={nodes} strokeWidth={strokeWidth} />

      <Centerpiece
        x={centerpiece.x}
        y={centerpiece.y}
        {...centerpiece.layout}
        angle={centerpiece.angle}
        cubeStrokeWeight={strokeWidth * 0.5}
        innerCubeStrokeWeight={strokeWidth * 0.4}
      />
    </svg>
  );
}

// one box per node, spread top to bottom over the left box's height.
// each box: icon + label bent onto its right wall
function Nodes({
  layout,
  strokeWidth,
}: {
  layout: ConnectingNodesLayout["nodes"];
  strokeWidth: number;
}) {
  const { box, content } = layout;
  const { roof, radius, rightFace, leftFace } = box;
  // the roof's border: bright at the top and fading down
  const litEdgeId = useId();
  // the right wall's accent fade, over its fill
  const accentFadeId = useId();
  // the extra layer on every face: a dark accent, see-through
  const layer = "oklch(from var(--accent) 0.12 0.04 h / 0.2)"; // knob
  // every edge of the box
  const edge = "oklch(from var(--accent) l c h / 0.35)"; // knob
  // the roof's outline, for its lit edge
  const roofOutline = roundedPolygonPath(
    [roof.left, roof.top, roof.right, roof.bottom],
    radius,
  );

  return (
    <>
      <defs>
        <LitEdgeGradient id={litEdgeId} />
        <AccentFadeGradient id={accentFadeId} />
      </defs>

      {connectNodes.map(({ label, icon: Icon, color }, i) => {
        // top of the whole box (the roof's top corner)
        const itemY = layout.boxYs[i];

        return (
          <g key={label} transform={`translate(0, ${itemY})`}>
            <BoxBody
              roof={roof}
              thickness={box.thickness}
              strokeWidth={strokeWidth}
              // each face: its base color + one dark, see-through accent layer
              fills={{
                roof: ["var(--accent-ink)", layer],
                right: [
                  "oklch(from var(--accent) 0.18 0.05 h)",
                  layer,
                  `url(#${accentFadeId})`,
                ],
                left: ["var(--ground)", layer],
                floor: "oklch(from var(--accent) 0.22 0.08 h)",
              }}
              radius={radius}
              strokes={{ ...allStrokes(edge), back: [] }}
            />
            {/* lit edge: one outline around the roof */}
            <path
              d={roofOutline}
              fill="none"
              stroke={`url(#${litEdgeId})`}
              strokeWidth={strokeWidth}
            />

            {/* icon + label: padding in from roof.bottom, halfway down the
                right wall, bent onto it */}
            {/* {(() => {
              const { iconSize, fontSize } = content;
              return (
                <>
                  <g transform={leftFace.transform}>
                    <Icon
                      x={leftFace.width * 0.5 - iconSize * 0.5}
                      y={leftFace.height * 0.5 - iconSize * 0.5}
                      size={iconSize}
                      stroke={color}
                      strokeWidth={glyphStrokeLucide(iconSize, 1.5)}
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
            })()} */}
          </g>
        );
      })}
    </>
  );
}
