import { useId } from "react";
import {
  ISOCube,
  accentGlow,
  glassCube,
  isoCubeMetrics,
  isoCubePoints,
  type Point,
} from "@/lib/svg";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

// the centerpiece's colors, exported so other parts of a diagram can match them.
// the big cube: the automate gear's dark look, half see-through so the small
// cube shows. the small cube: accent, a bit see-through, electric edges
export const cubeFill =
  "oklch(from var(--accent-ink) calc(l - 0.02) calc(c - 0.01) h / 0.55)";
export const innerFill = "oklch(from var(--accent) l c h / 0.45)";
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
}: {
  x: number;
  y: number;
  cube: IsoMetrics;
  innerCube: IsoMetrics;
  innerCubePos: Point;
  floatLift: number; // how far the small cube floats above the floor
  angles: { angleA: number; angleB: number };
}) {
  const { size, height, depth, thickness } = cube;
  const wallGradientId = useId();
  const roofGradientId = useId();

  // the big cube's border gradient, laid out in the 100-wide box ISOCube draws
  // in (so it also paints the straight side edges): roof's top corner to floor's bottom
  const edgeGradientId = useId();
  const box = isoCubePoints(size, thickness, angles.angleA, angles.angleB);
  const edgeHeight = box.roofBottom.y + box.verticalHeight;

  const bigCube = {
    size,
    thickness,
    showMiddleEdge: true,

    // dark glass: roof and walls lit at the top (the roof a touch lighter), the floor darker
    faces: {
      roof: `url(#${roofGradientId})`,
      left: `url(#${wallGradientId})`,
      right: `url(#${wallGradientId})`,
      floor: "oklch(from var(--accent) 0.12 0.02 h / 0.6)",
    },
    showFloor: true,
    // electric edges, brightest at the top. faint ones at the back, like the gear
    stroke: `url(#${edgeGradientId})`,
    floorTopStroke: faintEdge,
    strokeWeight: 0.75,
    radius: 2,
    ...angles,
  };

  return (
    // one soft halo around the whole centerpiece
    <g
      transform={`translate(${x}, ${y})`}
      style={{ filter: accentGlow(4, 10) }}
    >
      <defs>
        {/* the big cube's border: electric, brightest at the top and still
            clearly there at the bottom */}
        <linearGradient
          id={edgeGradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={edgeHeight}
        >
          <stop
            offset="0%"
            stopColor="var(--accent-electric)"
            stopOpacity={0.95}
          />
          <stop
            offset="100%"
            stopColor="var(--accent-electric)"
            stopOpacity={0.4}
          />
        </linearGradient>
        {/* the big cube's walls: lit at the top, darker toward the floor */}
        <linearGradient id={wallGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(from var(--accent) 0.24 0.10 h / 0.5)"
          />
          <stop
            offset="100%"
            stopColor="oklch(from var(--accent) 0.14 0.05 h / 0.6)"
          />
        </linearGradient>
        {/* the big cube's roof: like the walls but a touch lighter, so the
            faces stay apart where they meet. back corner lit, front corner darker */}
        <linearGradient id={roofGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(from var(--accent) 0.28 0.11 h / 0.5)"
          />
          <stop
            offset="100%"
            stopColor="oklch(from var(--accent) 0.18 0.08 h / 0.55)"
          />
        </linearGradient>
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
          // light: the roof brightest, the walls a step darker each
          faces={{
            roof: innerFill,
            left: "oklch(from var(--accent) calc(l - 0.14) c h / 0.6)",
            right: "oklch(from var(--accent) calc(l - 0.07) c h / 0.6)",
          }}
          stroke="var(--accent-electric)"
          strokeWeight={1}
          {...angles}
        />
      </g>

      {/* big cube, over half: walls + edges + roof, over the small cube */}
      <ISOCube {...bigCube} part="over" />
    </g>
  );
}
