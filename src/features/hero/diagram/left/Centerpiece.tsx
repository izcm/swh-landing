import { ISOCube, glassCube, isoCubeMetrics, type Point } from "@/lib/svg";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

// the big glass cube in the middle, with a small cube floating inside.
// positions come from heroLayout (layout.ts)
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

  // how far the small cube floats above the floor
  const floatLift = 12;

  // the big cube, drawn in two halves so the small cube can sit inside it
  // const bigCube = {
  //   size,
  //   thickness,
  //   showMiddleEdge: true,
  //   faces: {
  //     roof: "var(--hero-center-cube-fill)",
  //     left: "var(--hero-center-cube-fill)",
  //     right: "var(--hero-center-cube-fill)",
  //   },
  //   showFloor: true,
  //   stroke: "oklch(from var(--accent) 0.85 0.16 h)",
  //   strokeWeight: 0.6,
  //   // accentGlow(blur, strength%): a bit stronger than the default (2, 18)
  //   glow: { blur: 2, strength: 18 },
  //   radius: 3,
  //   ...angles,
  // };
  // light electris:
  // const lightElectric = "oklch(from var(--accent) 0.6 0.2 h / 0.5)";

  // const innerFill = "oklch(from var(--accent-electric) 0.6 0.16 h / 0.6)";

  const innerFill = "oklch(from var(--accent-ink) 0.1 c h / 1)";
  const cubeFill = "oklch(from var(--accent-electric) 0.25 0.15 h / 0.15)";

  const bigCube = {
    size,
    thickness,
    showMiddleEdge: true,

    faces: { roof: cubeFill, left: cubeFill },
    // floor + glow: what ISOCube's defaults used to be, before they became glassCube
    showFloor: true,
    stroke: "var(--accent-electric)",
    strokeWeight: 0.5,
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
          strokeWeight={0.6}
          showFloorTopEdges
          {...angles}
        />
      </g>

      {/* big cube, over half: walls + edges + roof, over the small cube */}
      <ISOCube {...bigCube} part="over" />
    </g>
  );
}
