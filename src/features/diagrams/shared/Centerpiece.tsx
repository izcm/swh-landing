import { useId } from "react";
import {
  ISOCube,
  accentGlow,
  glassCube,
  isoCubeMetrics,
  type Point,
} from "@/lib/svg";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

// the centerpiece's colors, exported so other parts of a diagram can match them.
// the big cube: the automate gear's dark look, half see-through so the small
// cube shows. the small cube: accent, a bit see-through, electric edges
export const cubeFill =
  "oklch(from var(--accent-ink) calc(l - 0.02) calc(c - 0.01) h / 0.55)";
export const innerFill = "oklch(from var(--accent) calc(l + 0.08) c h / 0.45)"; // knob: + 0.08
// the big cube's back edges, seen through its faces (the gear's faint edge)
const faintEdge = "oklch(from var(--accent-electric) l c h / 0.35)";

// the big glass cube with a small cube floating inside. shared by every diagram
// that draws it, so it looks the same everywhere. sizes come from
// centerpieceLayout, the caller places it at x, y
export function Centerpiece({
  x,
  y,
  cube,
  innerCube,
  innerCubePos,
  floatLift,
  angles,
  cubeStrokeWeight,
  innerCubeStrokeWeight,
}: {
  x: number;
  y: number;
  cube: IsoMetrics;
  innerCube: IsoMetrics;
  innerCubePos: Point;
  floatLift: number; // how far the small cube floats above the floor
  angles: { angleA: number; angleB: number };
  cubeStrokeWeight: number; // the big cube's edges, in viewBox units at any cube size
  innerCubeStrokeWeight: number; // the small cube's edges, same
}) {
  const { size, height, depth, thickness } = cube;

  const bluerAccent = "oklch(from var(--accent) calc(l - 0.2) c h)";
  const whiterAccent = "oklch(from var(--accent) calc(l + 0.2) c h)";

  const wallLightId = useId();

  const bigCube = {
    size,
    thickness,
    showMiddleEdge: true,

    // the walls lit from the middle. no roof or floor fill
    faces: {
      roof: "none",
      left: `url(#${wallLightId})`,
      right: `url(#${wallLightId})`,
      floor: "none",
    },
    showFloor: true,
    // electric edges. faint ones at the back, like the gear
    // stroke: "var(-accent-electric)",
    stroke: whiterAccent,
    floorTopStroke: faintEdge,
    strokeWeight: cubeStrokeWeight,
    radius: 0,
    ...angles,
  };

  return (
    // one soft halo around the whole centerpiece
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <radialGradient
          id={wallLightId}
          gradientUnits="userSpaceOnUse"
          cx={size / 2}
          cy={height / 2}
          r={size * 0.7}
        >
          <stop
            offset="0%"
            stopColor="var(--accent-electric)"
            stopOpacity={0}
          />
          <stop offset="45%" stopColor={bluerAccent} stopOpacity={0.15} />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
        </radialGradient>
        <linearGradient
          id="somethingwhocares"
          gradientUnits="userSpaceOnUse"
        ></linearGradient>
      </defs>

      {/* big cube, under half: floor-top edges + floor */}
      <ISOCube {...bigCube} part="under" showFloorTopEdges />

      {/* the small cube's light on the floor, under it. iso-flattened ellipse */}
      <ellipse
        className="float-shadow"
        cx={size / 2}
        cy={height - depth}
        rx={innerCube.size * 0.4}
        ry={innerCube.size * 0.4 * Math.tan(Math.PI / 6)}
        fill="var(--accent-electric)"
        fillOpacity={0.18}
        style={{ filter: "blur(6px)" }}
      />
      {/* the small cube's own slight glow, on top of the centerpiece's */}
      <g className="float-bob" style={{ filter: accentGlow(1.5, 8) }}>
        <ISOCube
          {...glassCube}
          x={innerCubePos.x}
          y={innerCubePos.y - floatLift}
          size={innerCube.size}
          thickness={innerCube.thickness}
          faces={{
            roof: innerFill,
            floor: "none",
            left: "oklch(from var(--accent) calc(l - 0.2) c h / 0.6)", // knob: - 0.25
            right: "oklch(from var(--accent) calc(l - 0.1) c h / 0.6)", // knob: - 0.1
          }}
          showFloor
          stroke={whiterAccent}
          strokeWeight={innerCubeStrokeWeight}
          {...angles}
        />
      </g>

      {/* big cube, over half: walls + edges + roof, over the small cube */}
      <ISOCube {...bigCube} part="over" />
    </g>
  );
}
