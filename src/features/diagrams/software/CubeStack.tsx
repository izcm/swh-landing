import { accentGlow, ISOCube, isoCubeMetrics, type BoxLook } from "@/lib/svg";
import { CubeBase } from "./CubeBase";
import { glassCube, glassGlow } from "./glass";

export function cubeStackLayout(size: number) {
  const cube = isoCubeMetrics(size);
  // width = 2 cubes across. each cube's width is the long side of the
  // triangle you get by splitting its floor diamond in half — that's cubeSize
  const groupWidth = size * 2;
  const groupHeight = cube.height * 2 - cube.depth / 2;

  return { cube, groupWidth, groupHeight };
}

// a 2x2 base of glass cubes with one more floating on top
export function CubeStack({
  x,
  y,
  size,
  strokes,
  bob,
}: {
  x: number;
  y: number;
  size: number;
  strokes: BoxLook["strokes"];
  bob: { dist: string; duration: string; delay: string };
}) {
  const cube = isoCubeMetrics(size);
  const half = size * 0.5;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <CubeBase
        size={size}
        y={cube.edgeLength - cube.depth / 2}
        strokes={strokes}
      />

      {/* TOP CUBE — straddles the top seam, lifts a little off the base */}
      <g
        className="float-bob"
        style={
          {
            "--float-dist": bob.dist,
            "--float-duration": bob.duration,
            "--float-delay": bob.delay,
          } as React.CSSProperties
        }
      >
        <g style={{ filter: accentGlow(glassGlow.blur, glassGlow.strength) }}>
          <ISOCube
            {...glassCube}
            strokes={strokes}
            size={size}
            x={half * 1.5}
            y={0}
          />
        </g>
      </g>
    </g>
  );
}
