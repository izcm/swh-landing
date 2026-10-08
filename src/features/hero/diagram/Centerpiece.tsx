import { ISOCube, glassCube } from "@/lib/svg/ISOCube";
import { isoCubeMetrics, type Point } from "@/lib/svg/helpers";

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
  //   showFrontEdge: true,
  //   faces: {
  //     top: "var(--hero-center-cube-fill)",
  //     left: "var(--hero-center-cube-fill)",
  //     right: "var(--hero-center-cube-fill)",
  //   },
  //   showBottom: true,
  //   stroke: "oklch(from var(--accent) 0.85 0.16 h)",
  //   strokeWeight: 0.6,
  //   // accentGlow(blur, strength%): a bit stronger than the default (2, 18)
  //   glow: { blur: 2, strength: 18 },
  //   radius: 3,
  //   ...angles,
  // };
  // light electris:
  // const lightElectric = "oklch(from var(--accent) 0.6 0.2 h / 0.5)";

  const innerFill = "oklch(from var(--accent) 0.6 0.20 h / 0.4)";
  const cubeFill = "oklch(from var(--accent) 0.25 0.15 h / 0.15)";

  const bigCube = {
    size,
    thickness,
    showFrontEdge: true,
    faces: { top: cubeFill, left: cubeFill },
    showBottom: true,
    stroke: "oklch(from var(--accent) 0.85 0.16 h)",
    strokeWeight: 0.5,
    // accentGlow(blur, strength%): a bit stronger than the default (2, 18)
    // glow: { blur: 2, strength: 18 },
    radius: 3,
    ...angles,
  };

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* big cube, back half: back edges + floor */}
      <ISOCube {...bigCube} part="back" />

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
          faces={{ top: innerFill, left: innerFill }}
          strokeWeight={0.6}
          showBackEdges
          {...angles}
        />
      </g>

      {/* big cube, front half: walls + edges + top, over the small cube */}
      <ISOCube {...bigCube} part="front" />
    </g>
  );
}
