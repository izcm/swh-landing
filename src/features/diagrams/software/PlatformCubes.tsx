import {
  accentGlow,
  ISOCube,
  IsoCubeShadow,
  isoCubeMetrics,
  type BoxLook,
} from "@/lib/svg";
import { CubeBase } from "./CubeBase";
import { glassCube, glassGlow } from "./glass";
import { Platform } from "./Platform";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

// a platform with a 2x2 base of glass cubes and two more on top, drifting together
export function PlatformCubes({
  x,
  y,
  platform,
  platformY,
  cubeOffsetX,
  cubeSize,
  strokes,
  grid,
  bob,
  shadowDrop,
}: {
  x: number;
  y: number;
  platform: IsoMetrics;
  platformY: number;
  cubeOffsetX: number;
  cubeSize: number;
  strokes: BoxLook["strokes"];
  grid: { across: number; along: number };
  bob: { dist: string; duration: string; delay: string };
  shadowDrop: number;
}) {
  const { depth, edgeLength: rise } = isoCubeMetrics(cubeSize);
  const half = cubeSize * 0.5;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* shadow under the platform, in step with the bob below */}
      <IsoCubeShadow
        {...platform}
        y={platformY}
        drop={shadowDrop}
        duration={bob.duration}
        delay={bob.delay}
      />

      {/* platform + its cubes drift together, slow and small */}
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
        {/* PLATFORM */}
        <g transform={`translate(0, ${platformY})`}>
          <Platform
            lengthA={platform.a.edgeLength}
            lengthB={platform.b.edgeLength}
            angleA={platform.a.angle}
            angleB={platform.b.angle}
            thickness={platform.thickness}
            grid={grid}
          />
        </g>

        {/* GROUP OF CUBES */}
        <g transform={`translate(${cubeOffsetX})`}>
          <CubeBase size={cubeSize} y={rise} strokes={strokes} />

          {/* TOP ROW — two cubes on the top cells */}
          <g style={{ filter: accentGlow(glassGlow.blur, glassGlow.strength) }}>
            <ISOCube
              {...glassCube}
              strokes={strokes}
              size={cubeSize}
              x={half}
              y={0}
            />
            <ISOCube
              {...glassCube}
              strokes={strokes}
              size={cubeSize}
              x={cubeSize}
              y={depth}
            />
          </g>
        </g>
      </g>
    </g>
  );
}
