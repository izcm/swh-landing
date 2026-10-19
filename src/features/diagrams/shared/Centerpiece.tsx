import { ISOCube, glassCube, isoCubeMetrics, type Point } from "@/lib/svg";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

// the big glass cube with a small cube floating inside. shared by every diagram
// that draws it, so it looks the same everywhere. sizes come from
// centerpieceLayout, the caller places it at x, y
export function Centerpiece({
  x,
  y,
  cube,
  innerCube,
  innerCubePos,
  angles,
}: {
  x: number;
  y: number;
  cube: IsoMetrics;
  innerCube: IsoMetrics;
  innerCubePos: Point;
  angles: { angleA: number; angleB: number };
}) {
  const { size, height, depth, thickness } = cube;

  // how far the small cube floats above the floor, as a share of its size
  const floatLift = innerCube.size * 0.16;

  // const innerFill = "oklch(from var(--accent-electric) 0.6 0.16 h / 0.6)";
  // const innerFill = "oklch(from var(--accent) 0.1 c h / 1)";
  const innerFill = "oklch(from var(--accent-electric) l c h / 0.25)";
  const cubeFill = "oklch(from var(--accent-ink) l c h / 0.2)";

  const bigCube = {
    size,
    thickness,
    showMiddleEdge: true,

    faces: { roof: cubeFill, left: cubeFill },
    // floor + glow: what ISOCube's defaults used to be, before they became glassCube
    showFloor: true,
    stroke: "var(--accent-electric)",
    strokeWeight: 0.6,
    glow: { blur: 2, strength: 18 },
    radius: 2,
    ...angles,
  };

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* big cube, under half: floor-top edges + floor */}
      <ISOCube {...bigCube} part="under" showFloorTopEdges />

      {/* shadow on the floor, under the floating cube. iso-flattened ellipse */}
      <ellipse
        className="float-shadow"
        cx={size / 2}
        cy={height - depth}
        rx={innerCube.size * 0.4}
        ry={innerCube.size * 0.4 * Math.tan(Math.PI / 6)}
        fill="black"
        opacity={0.4}
        style={{ filter: "blur(4px)" }}
      />
      <g className="float-bob">
        <ISOCube
          {...glassCube}
          x={innerCubePos.x}
          y={innerCubePos.y - floatLift}
          size={innerCube.size}
          thickness={innerCube.thickness}
          faces={{ roof: innerFill, left: innerFill }}
          strokeWeight={1}
          showFloorTopEdges
          {...angles}
        />
      </g>

      {/* big cube, over half: walls + edges + roof, over the small cube */}
      <ISOCube {...bigCube} part="over" />
    </g>
  );
}
