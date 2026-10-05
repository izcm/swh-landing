import { useId } from "react";
import { EdgeGradient } from "@/lib/svg/EdgeGradient";
import { isoCubePoints, type ISOCubeProps } from "@/lib/svg/ISOCube";
import {
  accentGlow,
  glyphStroke,
  pointOnLine,
  roundCorner,
  roundedPolygonPath,
} from "@/lib/svg/helpers";

type RoundedIsoCubeProps = ISOCubeProps & {
  // colors, stroke, roundedness
  topFill?: string;
  wallFill?: string;
  // floor of the cube. defaults to wallFill
  bottomFill?: string;
  // edge thickness in viewbox units. lower it in svgs the page zooms in more
  strokeWeight?: number;
  radius?: number;

  // edge gradient stop opacities (start, middle, end). see EdgeGradient
  edgeOpacity?: [number, number, number];
  // soft accent glow around the whole cube
  glow?: { blur: number; strength: number };

  // show knobs
  showGrid?: boolean;
  // false: no floor fill and no hidden back-bottom edges, only the two
  // front-bottom edges. useful when the walls are see-through
  showBottom?: boolean;
};

// the look of the old ISOCube: sharp dark glass at 80%, front edge on.
// ISOCube drew every edge twice (face outline + edge line) and its edge
// gradient is see-through, so the doubled edges were brighter: two layers of
// 50% / 100% / 35% stack up to 75% / 100% / 58%, which is what edgeOpacity is here
const glassFill = "oklch(from var(--accent) 0.18 0.06 h / 0.8)";
export const glassCube = {
  radius: 0,
  topFill: glassFill,
  wallFill: glassFill,
  showBottom: false,
  showFrontEdge: true,
  strokeWeight: 0.85,
  edgeOpacity: [1, 1, 1] as [number, number, number],
  glow: { blur: 4, strength: 12 },
};

export function RoundedIsoCube({
  // position
  x = 0,
  y = 0,

  // sizing dims
  size = 100,
  thickness,
  angleFront = 30,
  angleSide = angleFront,

  // colors, stroke, roundedness
  topFill = "oklch(from var(--accent) 0.22 0.08 h)",
  wallFill = "oklch(from var(--accent) 0.15 0.06 h / 0.9)",
  bottomFill = wallFill,
  strokeWeight = 1,
  radius = 4,
  edgeOpacity,
  glow = { blur: 2, strength: 18 },

  stroke,
  // show knobs
  showGrid = false,
  showFrontEdge = false,
  showBackEdges = false,
  showBottom = true,
}: RoundedIsoCubeProps) {
  const edgeGradientId = useId();
  const edgeStroke = stroke ?? `url(#${edgeGradientId})`;

  const {
    scale,
    verticalHeight,
    topBack,
    topLeft,
    topRight,
    topFront,
    bottomBack,
    bottomLeft,
    bottomRight,
    bottomFront,
  } = isoCubePoints(size, thickness, angleFront);
  // leftmost / rightmost point of the top face's rounded corners
  // (middle of the corner curve: radius × cos(angleFront) / 2 in from the edge)
  const tipInset = (radius * Math.cos((angleFront * Math.PI) / 180)) / 2;
  const leftTip = { x: topLeft.x + tipInset, y: topLeft.y };
  const rightTip = { x: topRight.x - tipInset, y: topRight.y };
  // same for the front / back corners, but they're rounded vertically:
  // the curve's middle sits radius × sin(angleFront) / 2 in from the corner
  const tipRise = (radius * Math.sin((angleFront * Math.PI) / 180)) / 2;
  const frontTip = { x: topFront.x, y: topFront.y - tipRise };
  const backTip = { x: topBack.x, y: topBack.y + tipRise };

  // in real units (undo the scale) so edges match ISOCube's at any size
  const strokeWidth = glyphStroke(size, strokeWeight, 100);

  // front-bottom edges only (left tip → front → right tip), same rounded
  // front corner as the full floor would have
  const frontBottom = roundCorner(bottomLeft, bottomFront, bottomRight, radius);
  const leftBottomTip = { x: leftTip.x, y: leftTip.y + verticalHeight };
  const rightBottomTip = { x: rightTip.x, y: rightTip.y + verticalHeight };

  // faint grid on the top face: lines between opposite edges at 1/4, 1/2, 3/4
  const gridSteps = [0.25, 0.5, 0.75];
  const gridLines = gridSteps.flatMap((t) => [
    [pointOnLine(topLeft, topBack, t), pointOnLine(topFront, topRight, t)],
    [pointOnLine(topLeft, topFront, t), pointOnLine(topBack, topRight, t)],
  ]);

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{ filter: accentGlow(glow.blur, glow.strength) }}
    >
      <defs>
        <EdgeGradient
          id={edgeGradientId}
          width={100}
          height={topFront.y + verticalHeight}
          opacity={edgeOpacity}
        />
      </defs>
      {/* back edge: drawn first so the glass sits over it */}
      {showBackEdges && (
        <line
          x1={backTip.x}
          y1={backTip.y}
          x2={backTip.x}
          y2={backTip.y + verticalHeight}
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {/* without the floor, the floor's back edges still show through the glass */}
      {showBackEdges && !showBottom && (
        <path
          d={`M ${bottomLeft.x} ${bottomLeft.y} L ${bottomBack.x} ${bottomBack.y} L ${bottomRight.x} ${bottomRight.y}`}
          fill="none"
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {showBottom ? (
        <path
          d={roundedPolygonPath(
            [bottomLeft, bottomBack, bottomRight, bottomFront],
            radius,
          )}
          fill={bottomFill}
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      ) : (
        <path
          d={`M ${leftBottomTip.x} ${leftBottomTip.y}
              L ${frontBottom.before.x} ${frontBottom.before.y}
              Q ${frontBottom.corner.x} ${frontBottom.corner.y} ${frontBottom.after.x} ${frontBottom.after.y}
              L ${rightBottomTip.x} ${rightBottomTip.y}`}
          fill="none"
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {/* walls: left and right faces meeting at the front edge, then the two side edges */}
      <polygon
        points={`${leftTip.x},${leftTip.y} ${topFront.x},${topFront.y} ${bottomFront.x},${bottomFront.y} ${leftTip.x},${leftTip.y + verticalHeight}`}
        fill={wallFill}
      />
      <polygon
        points={`${topFront.x},${topFront.y} ${rightTip.x},${rightTip.y} ${rightTip.x},${rightTip.y + verticalHeight} ${bottomFront.x},${bottomFront.y}`}
        fill={wallFill}
      />

      <line
        x1={leftTip.x}
        y1={leftTip.y}
        x2={leftTip.x}
        y2={leftTip.y + verticalHeight}
        stroke={edgeStroke}
        strokeWidth={strokeWidth}
      />
      <line
        x1={rightTip.x}
        y1={rightTip.y}
        x2={rightTip.x}
        y2={rightTip.y + verticalHeight}
        stroke={edgeStroke}
        strokeWidth={strokeWidth}
      />
      {showFrontEdge && (
        <line
          x1={frontTip.x}
          y1={frontTip.y}
          x2={frontTip.x}
          y2={frontTip.y + verticalHeight}
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}

      <path
        d={roundedPolygonPath([topLeft, topBack, topRight, topFront], radius)}
        fill={topFill}
        stroke={edgeStroke}
        strokeWidth={strokeWidth}
      />

      {showGrid &&
        gridLines.map(([a, b], i) => (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={edgeStroke}
            strokeWidth={strokeWidth}
            opacity={0.2}
          />
        ))}
    </g>
  );
}
