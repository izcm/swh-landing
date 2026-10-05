import { ISOCube, glassCube } from "@/lib/svg/ISOCube";
import { isoBottomCenter, isoCubeMetrics, standOn } from "@/lib/svg/helpers";

// the big glass cube in the middle, with a small cube floating inside
export function Centerpiece({
  contentRing,
  unit,
  angles,
}: {
  contentRing: { radius: number; centerX: number; centerY: number };
  unit: number;
  angles: { angleA: number; angleB: number };
}) {
  const { size, height, depth, thickness } = isoCubeMetrics(
    150,
    150 * 0.577,
    angles,
  );

  // small cube standing in the middle of the big cube's floor,
  // same as SoftwareDiagram's bottom-left group
  const innerSize = size / 2;
  const innerCube = isoCubeMetrics(innerSize, innerSize * 0.577, angles);
  const innerCubePos = standOn(
    isoBottomCenter({ size, height, depth }),
    innerCube,
  );

  // how far the small cube floats above the floor
  const floatLift = 12;

  const x = contentRing.centerX - unit;
  const y = contentRing.centerY - height * 0.5;

  // the big cube, drawn in two halves so the small cube can sit inside it
  const bigCube = {
    size,
    thickness,
    showFrontEdge: true,
    faces: {
      top: "var(--hero-center-cube-fill)",
      left: "var(--hero-center-cube-fill)",
      right: "var(--hero-center-cube-fill)",
    },
    showBottom: true,
    stroke: "oklch(from var(--accent) 0.85 0.16 h)",
    strokeWeight: 0.6,
    // accentGlow(blur, strength%): a bit stronger than the default (2, 18)
    glow: { blur: 2, strength: 18 },
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
          faces={{
            top: "var(--hero-inner-cube-fill)",
            left: "var(--hero-inner-cube-fill)",
            right: "var(--hero-inner-cube-fill)",
          }}
          strokeWeight={0.32}
          showBackEdges
          {...angles}
        />
      </g>

      {/* big cube, front half: walls + edges + top, over the small cube */}
      <ISOCube {...bigCube} part="front" />
    </g>
  );
}
