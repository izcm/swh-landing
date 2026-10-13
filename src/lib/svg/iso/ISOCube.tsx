import {
  accentGlow,
  glyphStroke,
  isoCubePoints,
  type IsoCubeBaseProps,
} from "../logic";
import { BoxBody } from "./BoxBody";

// one color per face. right and bottom default to left
type ISOCubeFaces = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

type ISOCubeProps = IsoCubeBaseProps & {
  // colors, stroke, roundedness
  faces?: ISOCubeFaces;
  // edge thickness in viewbox units. lower it in svgs the page zooms in more
  strokeWeight?: number;
  radius?: number;

  // color of the back edges (showBackEdges). defaults to the normal edge color
  backStroke?: string;
  // edge gradient stop opacities (start, middle, end). see EdgeGradient
  edgeOpacity?: [number, number, number];
  // soft accent glow around the whole cube
  glow?: { blur: number; strength: number };

  // show knobs
  // false: no floor fill and no hidden back-bottom edges, only the two
  // front-bottom edges. useful when the walls are see-through
  showBottom?: boolean;
  // draw only half the cube, so something can sit inside it:
  // "back" = back edges + floor, "front" = walls + edges + top. leave out = whole cube
  part?: "back" | "front";
};

// the look of the old ISOCube: sharp dark glass at 80%, front edge on.
// ISOCube drew every edge twice (face outline + edge line) and its edge
// gradient is see-through, so the doubled edges were brighter: two layers of
// 50% / 100% / 35% stack up to 75% / 100% / 58%, which is what edgeOpacity is here
const glassFill = "oklch(from var(--accent) 0.18 0.06 h / 0.5)";

// more electric maybe later with some retouches?
// const glassFill = "oklch(from var(--accent) 0.32 0.2 h / 0.35)";

export const glassCube = {
  radius: 0,
  faces: { top: glassFill, left: glassFill } as ISOCubeFaces,
  showBottom: false,
  showFrontEdge: true,
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
  backStroke,
  // show knobs
  showFrontEdge = glassCube.showFrontEdge,
  showBackEdges = false,
  showBottom = glassCube.showBottom,
  part,
}: ISOCubeProps) {
  const {
    top: topFill = glassFill,
    left: leftFill = glassFill,
    right: rightFill = leftFill,
    bottom: bottomFill = leftFill,
  } = faces;

  const { scale, verticalHeight, topBack, topLeft, topRight, topFront } =
    isoCubePoints(size, thickness, angleA, angleB);
  const top = { left: topLeft, back: topBack, right: topRight, front: topFront };

  // in real units (undo the scale) so edges match ISOCube's at any size
  const strokeWidth = glyphStroke(size, strokeWeight, 100);

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{ filter: accentGlow(glow.blur, glow.strength) }}
    >
      <BoxBody
        top={top}
        height={verticalHeight}
        strokeWidth={strokeWidth}
        fills={{
          top: topFill,
          left: leftFill,
          right: rightFill,
          bottom: bottomFill,
        }}
        radius={radius}
        stroke={stroke}
        backStroke={backStroke}
        edgeOpacity={edgeOpacity}
        showFrontEdge={showFrontEdge}
        showBackEdges={showBackEdges}
        showBottom={showBottom}
        part={part}
      />
    </g>
  );
}
