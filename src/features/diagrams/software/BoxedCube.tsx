import { useId } from "react";

import {
  accentGlow,
  allFills,
  allStrokes,
  BoxBody,
  CornerLightMask,
  ISOCube,
  isoCubeMetrics,
  type BoxRoof,
  type Point,
} from "@/lib/svg";
import { EdgeGradient } from "../shared/gradients";
import { glassCube, glassGlow } from "./glass";
import { platformStyle } from "./Platform";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

// a big see-through box with a small glass cube floating inside
export function BoxedCube({
  x,
  y,
  bigCube,
  bigCubeRoof,
  smallCube,
  smallCubePos,
  floatLift,
}: {
  x: number;
  y: number;
  bigCube: IsoMetrics;
  bigCubeRoof: BoxRoof;
  smallCube: IsoMetrics;
  smallCubePos: Point;
  floatLift: number;
}) {
  const bigCubeEdgeId = useId();
  const bigCubeEdge = `url(#${bigCubeEdgeId})`;
  const bigCubeGlow = accentGlow(
    platformStyle.glow.blur,
    platformStyle.glow.strength,
  );

  // was / 0.8 drawn twice; one layer at 0.96 looks the same
  const floatingCubeEdge = "var(--accent-bright)";

  const cornerMaskId = useId();

  // roof.left → roof.bottom → roof.right, then roof.bottom down to floor.bottom
  const frontY = (() => {
    const { left, bottom, right } = bigCubeRoof;
    return `M ${left.x} ${left.y} L ${bottom.x} ${bottom.y} L ${right.x} ${right.y} M ${bottom.x} ${bottom.y} l 0 ${bigCube.thickness}`;
  })();

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <EdgeGradient
          id={bigCubeEdgeId}
          width={bigCube.size}
          height={bigCube.height}
          opacity={platformStyle.edgeOpacity}
        />

        <CornerLightMask
          id={cornerMaskId}
          box={bigCube}
          center={bigCubeRoof.bottom}
          radius={bigCube.size * 0.5}
          opacity={[0.4, 0.25]}
        />
      </defs>

      {/* big cube, under half: floor + its back edges */}
      <g style={{ filter: bigCubeGlow }}>
        <BoxBody
          roof={bigCubeRoof}
          thickness={bigCube.thickness}
          strokeWidth={platformStyle.strokeWidth}
          radius={2}
          fills={{ floor: "var(--pane-fill)" }}
          strokes={{ floorTop: bigCubeEdge }}
        />
      </g>

      {/* shadow on the floor, under the floating cube. iso-flattened ellipse */}
      <ellipse
        className="float-shadow"
        cx={bigCube.size / 2}
        cy={bigCube.thickness + bigCube.depth}
        rx={smallCube.size * 0.4}
        ry={smallCube.size * 0.4 * Math.tan(Math.PI / 6)}
        fill="var(--accent-glow)"
        fillOpacity={0.25}
        style={{ filter: "blur(6px)" }}
      />

      <g className="float-bob">
        <g style={{ filter: accentGlow(glassGlow.blur, glassGlow.strength) }}>
          <ISOCube
            {...glassCube}
            x={smallCubePos.x}
            y={smallCubePos.y - floatLift}
            size={smallCube.size}
            fills={{
              ...allFills("var(--accent-dim)"),
              floor: [],
            }}
            strokes={allStrokes(floatingCubeEdge)}
          />
        </g>
      </g>

      {/* big cube, over half: walls, roof and front edges, over the small cube */}
      <g style={{ filter: bigCubeGlow }}>
        <BoxBody
          roof={bigCubeRoof}
          thickness={bigCube.thickness}
          strokeWidth={platformStyle.strokeWidth}
          radius={2}
          fills={{
            ...allFills(
              "color-mix(in oklab, var(--accent-dim) 6%, transparent)",
            ),
            floor: [],
          }}
          strokes={{ ...allStrokes(bigCubeEdge), back: [], floorTop: [] }}
        />
      </g>

      {/* the big cube's front Y, lit around its front corner */}
      <path
        d={frontY}
        fill="none"
        stroke="white"
        strokeWidth={platformStyle.strokeWidth}
        mask={`url(#${cornerMaskId})`}
      />
    </g>
  );
}
