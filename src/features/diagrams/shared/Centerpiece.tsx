import { useId } from "react";
import {
  CornerLightMask,
  ISOCube,
  accentGlow,
  allFills,
  glassCube,
  isoCubeMetrics,
  type Point,
} from "@/lib/svg";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

export const innerFill = "oklch(from var(--accent) calc(l + 0.08) c h / 0.45)";
const innerLeftFill = "oklch(from var(--accent) calc(l - 0.2) c h / 0.6)";
const innerRightFill = "oklch(from var(--accent) calc(l - 0.1) c h / 0.6)";
const faintEdge = "oklch(from var(--accent-electric) l c h / 0.35)";
const bluerAccent = "oklch(from var(--accent) calc(l - 0.2) c h)";
const whiterAccent = "oklch(from var(--accent) calc(l + 0.2) c h)";

// a big glass cube with a small cube floating inside. sizes from centerpieceLayout
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

  // ids for the <defs> below
  const wallLightId = useId();
  const sideFadeId = useId();
  const innerFadeId = useId();
  const cornerMaskId = useId();
  const innerCornerMaskId = useId();

  const bigCube = {
    size,
    thickness,
    angle,
    strokeWidth: cubeStrokeWeight,
    radius: 0,
  };

  // the small cube's light on the floor, under it. iso-flattened ellipse
  const floatShadow = (() => {
    const rx = innerCube.size * 0.4;
    return {
      cx: size / 2,
      cy: height - depth,
      rx,
      ry: rx * Math.tan(Math.PI / 6),
    };
  })();

  // where a box's corner light sits, in the box's own coordinates
  const cornerLightCenter = (box: IsoMetrics) => {
    // the y where the left and right edges end (floor.left / floor.right)
    const sideEdgeBottom = box.depth + box.thickness;
    return { x: sideEdgeBottom * 0.5, y: box.size * 0.5 };
  };

  // a box's Y of front edges: roof.left → roof.bottom → roof.right, then
  // roof.bottom down to floor.bottom. in the box's own coordinates
  const frontY = (box: IsoMetrics) => {
    const half = box.size * 0.5;
    return `M 0 ${box.depth} l ${half} ${box.depth} l ${half} ${-box.depth} M ${half} ${box.depth * 2} l 0 ${box.thickness}`;
  };

  // whiterAccent at a box's side-edge top, fading to accent at its bottom
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
      <stop offset="100%" stopColor="var(--accent)" stopOpacity={1} />
    </linearGradient>
  );

  // both cubes' edges: faded sides, bright roof and middle
  const edgeStrokes = (fadeId: string) => ({
    roof: whiterAccent,
    left: `url(#${fadeId})`,
    right: `url(#${fadeId})`,
    middle: whiterAccent,
    floor: "var(--accent)",
  });

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        {/* wall light: a faint blue ring around the middle, for the big cube's faces */}
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

        {/* corner light masks, one per cube */}
        <CornerLightMask
          id={cornerMaskId}
          box={cube}
          center={cornerLightCenter(cube)}
          radius={size * 0.5} // knob
          opacity={[0.75, 0.5]} // knob
        />
        <CornerLightMask
          id={innerCornerMaskId}
          box={innerCube}
          center={cornerLightCenter(innerCube)}
          radius={innerCube.size * 0.5} // knob
          opacity={[0.75, 0.5]} // knob
        />

        {/* side-edge fades, one per cube */}
        {edgeFade(sideFadeId, cube)}
        {edgeFade(innerFadeId, innerCube)}
      </defs>

      {/* big cube, under half: its back edges, faint like the gear's */}
      <ISOCube
        {...bigCube}
        strokes={{ back: faintEdge, floorTop: faintEdge }}
      />

      {/* float shadow: the small cube's light on the floor */}
      <ellipse
        className="float-shadow"
        {...floatShadow}
        fill="var(--accent-electric)"
        fillOpacity={0.18}
        style={{ filter: "blur(6px)" }}
      />

      {/* small cube, with its own slight glow */}
      <g className="float-bob" style={{ filter: accentGlow(1.5, 8) }}>
        <g
          transform={`translate(${innerCubePos.x}, ${innerCubePos.y - floatLift})`}
        >
          <ISOCube
            {...glassCube}
            size={innerCube.size}
            thickness={innerCube.thickness}
            angle={angle}
            fills={{
              roof: innerFill,
              left: innerLeftFill,
              right: innerRightFill,
            }}
            strokes={{
              ...edgeStrokes(innerFadeId),
              floorTop: "var(--accent)",
              floor: "var(--accent)",
            }}
            strokeWidth={innerCubeStrokeWeight}
          />
          {/* its Y of front edges, seen through its corner light mask */}
          <path
            d={frontY(innerCube)}
            fill="none"
            stroke="white"
            strokeWidth={innerCubeStrokeWeight} // knob
            mask={`url(#${innerCornerMaskId})`}
          />
        </g>
      </g>

      {/* big cube, over half: faces and edges, over the small cube */}
      <ISOCube
        {...bigCube}
        fills={{ ...allFills(`url(#${wallLightId})`), floor: [] }}
        strokes={edgeStrokes(sideFadeId)}
      />

      {/* the big cube's Y of front edges, seen through its corner light mask */}
      <path
        d={frontY(cube)}
        fill="none"
        stroke="white"
        strokeWidth={cubeStrokeWeight} // knob
        mask={`url(#${cornerMaskId})`}
      />
    </g>
  );
}
