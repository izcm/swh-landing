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
  radius?: number;
  topFill?: string;
  wallFill?: string;
  // floor of the cube. defaults to wallFill
  bottomFill?: string;
  showGrid?: boolean;
  // false: no floor fill and no hidden back-bottom edges, only the two
  // front-bottom edges. useful when the walls are see-through
  showBottom?: boolean;
  // edge thickness in viewbox units. lower it in svgs the page zooms in more
  strokeWeight?: number;
};

export function RoundedIsoCube({
  size = 100,
  x = 0,
  y = 0,
  thickness,
  angle = 30,
  radius = 4,
  // glassy accent-tinted fills: top face a touch lighter than the walls
  topFill = "oklch(from var(--accent) 0.22 0.08 h)",
  wallFill = "oklch(from var(--accent) 0.15 0.06 h / 0.9)",
  bottomFill = wallFill,
  stroke,
  showGrid = false,
  showFrontEdge = false,
  showBackEdges = false,
  showBottom = true,
  strokeWeight = 1,
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
  } = isoCubePoints(size, thickness, angle);
  // leftmost / rightmost point of the top face's rounded corners
  // (middle of the corner curve: radius × cos(angle) / 2 in from the edge)
  const tipInset = (radius * Math.cos((angle * Math.PI) / 180)) / 2;
  const leftTip = { x: topLeft.x + tipInset, y: topLeft.y };
  const rightTip = { x: topRight.x - tipInset, y: topRight.y };
  // same for the front / back corners, but they're rounded vertically:
  // the curve's middle sits radius × sin(angle) / 2 in from the corner
  const tipRise = (radius * Math.sin((angle * Math.PI) / 180)) / 2;
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
      style={{ filter: accentGlow(2, 18) }}
    >
      <defs>
        <EdgeGradient
          id={edgeGradientId}
          width={100}
          height={topFront.y + verticalHeight}
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
