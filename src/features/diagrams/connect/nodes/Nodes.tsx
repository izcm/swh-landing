import { useId } from "react";

import {
  allFills,
  allStrokes,
  BoxBody,
  pointOnLine,
  type BoxRoof,
  type BoxStrokes,
  type Point,
} from "@/lib/svg";
import { nodeData } from "./data";
import {
  nodesAngles,
  nodesLayout,
  type NodesLayout,
  type NodesShares,
} from "./layout";

const wallFill = "oklch(from var(--accent-ink) l c h / 0.45)";
const edge = "var(--accent-bright)";
const faintEdge = "oklch(from var(--accent-bright) l c h / 0.3)";

export function Nodes({
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
  shares: NodesShares;
}) {
  const { nodes, cube, connectors } = nodesLayout({
    width: viewboxWidth,
    height: viewboxHeight,
    angles: nodesAngles,
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

      <NodeBoxes layout={nodes} strokeWidth={strokeWidth} />

      <g transform={`translate(${cube.x}, ${cube.y})`}>
        <GlassBox
          roof={cube.roof}
          floor={cube.floor}
          thickness={cube.metrics.thickness}
          radius={cube.radius}
          strokeWidth={strokeWidth}
          width={cube.metrics.size}
          height={cube.metrics.height}
          strokes={{
            ...allStrokes(edge),
            back: faintEdge,
            floorTop: faintEdge,
          }}
        />
      </g>
    </svg>
  );
}

// one box per node, spread top to bottom over the left box's height.
// each box: icon + label bent onto its right wall
function NodeBoxes({
  layout,
  strokeWidth,
}: {
  layout: NodesLayout["nodes"];
  strokeWidth: number;
}) {
  const { box, content, groupWidth } = layout;
  // const { rightFace, leftFace } = box;

  return (
    <>
      {nodeData.map(({ label, icon: Icon, color }, i) => {
        // top of the whole box (the roof's top corner)
        const itemY = layout.boxYs[i];

        return (
          <g key={label} transform={`translate(0, ${itemY})`}>
            <GlassBox
              roof={box.roof}
              floor={box.floor}
              thickness={box.thickness}
              radius={box.radius}
              strokeWidth={strokeWidth}
              width={groupWidth}
              height={box.height}
              strokes={{ ...allStrokes(edge), back: [], floorTop: [] }}
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

function GlassBox({
  roof,
  floor,
  thickness,
  radius,
  strokeWidth,
  width,
  height,
  strokes,
}: {
  roof: BoxRoof;
  floor: BoxRoof;
  thickness: number;
  radius: number;
  strokeWidth: number;
  width: number;
  height: number;
  strokes: Partial<BoxStrokes>;
}) {
  const wallId = useId();
  const shape = { roof, thickness, strokeWidth, radius };

  const walls = (() => {
    const wall = (face: "roof" | "left" | "right", a: Point, b: Point) => ({
      face,
      center: pointOnLine(a, b, 0.5),
      reach: Math.hypot(b.x - a.x, b.y - a.y) * 0.5,
    });

    return [
      wall("roof", roof.left, roof.right),
      wall("left", roof.left, floor.bottom),
      wall("right", roof.bottom, floor.right),
    ];
  })();

  return (
    <>
      {walls.map(({ face, center, reach }) => {
        const lightId = `${wallId}-light-${face}`;
        const maskId = `${wallId}-mask-${face}`;

        return (
          <g key={face}>
            <defs>
              <radialGradient
                id={lightId}
                gradientUnits="userSpaceOnUse"
                cx={center.x}
                cy={center.y}
                r={reach}
              >
                <stop offset="0%" stopColor="white" stopOpacity={0} />
                <stop offset="60%" stopColor="white" stopOpacity={0.05} />
                <stop offset="100%" stopColor="white" stopOpacity={0.2} />
              </radialGradient>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={width}
                height={height}
              >
                <rect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fill={`url(#${lightId})`}
                />
              </mask>
            </defs>
            <g mask={`url(#${maskId})`}>
              <BoxBody {...shape} fills={{ [face]: "var(--accent-bright)" }} />
            </g>
          </g>
        );
      })}

      <BoxBody
        {...shape}
        fills={{ ...allFills(wallFill), floor: [] }}
        strokes={strokes}
      />
    </>
  );
}
