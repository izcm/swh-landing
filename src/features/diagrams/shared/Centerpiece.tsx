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
  angle,
  cubeStrokeWeight,
  innerCubeStrokeWeight,
}: {
  x: number;
  y: number;
  cube: IsoMetrics;
  innerCube: IsoMetrics;
  innerCubePos: Point;
  floatLift: number; // how far the small cube floats above the floor
  angle: number;
  cubeStrokeWeight: number; // the big cube's edges, in viewBox units at any cube size
  innerCubeStrokeWeight: number; // the small cube's edges, same
}) {
  const { size, height, depth, thickness } = cube;

  const bluerAccent = "oklch(from var(--accent) calc(l - 0.2) c h)";
  const whiterAccent = "oklch(from var(--accent) calc(l + 0.2) c h)";

  const wallLightId = useId();

  const sideFadeId = useId();
  const innerFadeId = useId();

  const bigCube = {
    size,
    thickness,
    angle,
    strokeWidth: cubeStrokeWeight,
    radius: 0,
  };

  const edgeFade = (id: string, box: IsoMetrics) => (
    <linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      x1={0}
      x2={0}
      y1={box.depth}
      y2={box.depth + box.thickness}
    >
      <stop offset="0%" stopColor={whiterAccent} stopOpacity={1} />
      <stop offset="80%" stopColor="var(--accent)" stopOpacity={0.6} />{" "}
      <stop offset="100%" stopColor={whiterAccent} stopOpacity={0.8} />{" "}
    </linearGradient>
  );

  const edgeStrokes = (fadeId: string) => ({
    roof: whiterAccent,
    left: `url(#${fadeId})`,
    right: `url(#${fadeId})`,
    middle: whiterAccent,
    floor: whiterAccent,
  });

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
        {/* stroke gradients on left and right edge of both cubes */}
        {edgeFade(sideFadeId, cube)}
        {edgeFade(innerFadeId, innerCube)}
      </defs>

      {/* big cube, under half: floor-top edges + floor */}
      <ISOCube
        {...bigCube}
        // faint edges at the back, like the gear
        strokes={{ back: faintEdge, floorTop: faintEdge }}
      />

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
          angle={angle}
          fills={{
            roof: innerFill,
            left: "oklch(from var(--accent) calc(l - 0.2) c h / 0.6)", // knob: - 0.25
            right: "oklch(from var(--accent) calc(l - 0.1) c h / 0.6)", // knob: - 0.1
          }}
          strokes={{ ...edgeStrokes(innerFadeId), floorTop: whiterAccent }}
          strokeWidth={innerCubeStrokeWeight}
        />
      </g>

      {/* big cube, over half: walls + edges + roof, over the small cube */}
      <ISOCube
        {...bigCube}
        // the walls lit from the middle. no roof or floor fill
        fills={{ left: `url(#${wallLightId})`, right: `url(#${wallLightId})` }}
        // electric edges
        // stroke: "var(-accent-electric)",
        strokes={edgeStrokes(sideFadeId)}
      />
    </g>
  );
}
