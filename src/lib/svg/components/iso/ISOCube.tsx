import {
  accentGlow,
  glyphStroke,
  isoCubePoints,
  type IsoCubeBaseProps,
} from "../../logic";
import { BoxBody } from "./BoxBody";

// one color per face. right and floor default to left
type ISOCubeFaces = {
  roof?: string;
  left?: string;
  right?: string;
  floor?: string;
};

type ISOCubeProps = IsoCubeBaseProps & {
  // colors, stroke, roundedness
  faces?: ISOCubeFaces;
  // edge thickness in viewbox units. lower it in svgs the page zooms in more
  strokeWeight?: number;
  radius?: number;

  // color of the floor-top edges (showFloorTopEdges). defaults to the normal edge color
  floorTopStroke?: string;
  // edge gradient stop opacities (start, middle, end). see EdgeGradient
  edgeOpacity?: [number, number, number];
  // soft accent glow around the whole cube
  glow?: { blur: number; strength: number };

  // show knobs
  // false: no floor fill and no floor-top edges, only the floor's two
  // lower edges. useful when the walls are see-through
  showFloor?: boolean;
  // draw only half the cube, so something can sit inside it:
  // "under" = floor-top edges + floor, "over" = walls + edges + roof. leave out = whole cube
  part?: "under" | "over";
};

// the look of the old ISOCube: sharp dark glass at 80%, middle edge on.
// ISOCube drew every edge twice (face outline + edge line) and its edge
// gradient is see-through, so the doubled edges were brighter: two layers of
// 50% / 100% / 35% stack up to 75% / 100% / 58%, which is what edgeOpacity is here
const glassFill = "oklch(from var(--accent) 0.18 0.06 h / 0.5)";

// more electric maybe later with some retouches?
// const glassFill = "oklch(from var(--accent) 0.32 0.2 h / 0.35)";

export const glassCube = {
  radius: 0,
  faces: { roof: glassFill, left: glassFill } as ISOCubeFaces,
  showFloor: false,
  showMiddleEdge: true,
  strokeWeight: 0.85,
  edgeOpacity: [1, 1, 1] as [number, number, number],
  glow: { blur: 4, strength: 12 },
};

export function ISOCube({
  // position
  x = 0,
  y = 0,

  // sizing dims
  size = 100,
  thickness,
  angleA = 30,
  angleB = angleA,

  // colors, stroke, roundedness. defaults: the glassCube look
  faces = glassCube.faces,
  strokeWeight = glassCube.strokeWeight,
  radius = glassCube.radius,
  edgeOpacity = glassCube.edgeOpacity,
  glow = glassCube.glow,

  stroke,
  floorTopStroke,
  // show knobs
  showMiddleEdge = glassCube.showMiddleEdge,
  showFloorTopEdges = false,
  showFloor = glassCube.showFloor,
  part,
}: ISOCubeProps) {
  const {
    roof: roofFill = glassFill,
    left: leftFill = glassFill,
    right: rightFill = leftFill,
    floor: floorFill = leftFill,
  } = faces;

  const { scale, verticalHeight, roofTop, roofLeft, roofRight, roofBottom } =
    isoCubePoints(size, thickness, angleA, angleB);
  const roof = { left: roofLeft, top: roofTop, right: roofRight, bottom: roofBottom };

  // in real units (undo the scale) so edges match ISOCube's at any size
  const strokeWidth = glyphStroke(size, strokeWeight, 100);

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{ filter: accentGlow(glow.blur, glow.strength) }}
    >
      <BoxBody
        roof={roof}
        height={verticalHeight}
        strokeWidth={strokeWidth}
        fills={{
          roof: roofFill,
          left: leftFill,
          right: rightFill,
          floor: floorFill,
        }}
        radius={radius}
        stroke={stroke}
        floorTopStroke={floorTopStroke}
        edgeOpacity={edgeOpacity}
        showMiddleEdge={showMiddleEdge}
        showFloorTopEdges={showFloorTopEdges}
        showFloor={showFloor}
        part={part}
      />
    </g>
  );
}
