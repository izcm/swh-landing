import { useId } from "react";
import { EdgeGradient } from "../EdgeGradient";
import { roundCorner, roundedPolygonPath, type Point } from "../logic";

// the 4 corners of a box's top face. left is at x = 0
export type BoxTop = { left: Point; back: Point; right: Point; front: Point };

// one color per face, already resolved (no defaults here: the caller picks the look)
export type BoxFills = {
  top: string;
  left: string;
  right: string;
  bottom: string;
};

// the middle of a rounded corner's curve: where the outline really turns.
// the curve is a quadratic from `before` through `corner` to `after`, and a
// quadratic's middle point is (before + 2·corner + after) / 4
function curveMiddle(
  prev: Point,
  corner: Point,
  next: Point,
  radius: number,
): Point {
  const { before, after } = roundCorner(prev, corner, next, radius);
  return {
    x: (before.x + 2 * corner.x + after.x) / 4,
    y: (before.y + 2 * corner.y + after.y) / 4,
  };
}

// draws a box from its top corners: floor, walls, edges, rounded top.
// works in whatever units the corners are in (ISOCube: a 100-wide box).
// no position, scale or glow: the caller wraps it in its own <g>
export function BoxBody({
  top,
  height,
  strokeWidth,
  fills,
  radius,
  stroke,
  backStroke,
  edgeOpacity,
  showFrontEdge = false,
  showBackEdges = false,
  showBottom = false,
  part,
}: {
  top: BoxTop;
  height: number; // wall height: the bottom is the top moved down by this
  strokeWidth: number; // in the corners' units
  fills: BoxFills;
  radius: number; // rounded corners on the top and floor
  stroke?: string; // edge color. defaults to an edge gradient
  backStroke?: string; // back edges (showBackEdges). defaults to stroke
  edgeOpacity?: [number, number, number]; // edge gradient stops, see EdgeGradient
  showFrontEdge?: boolean;
  // edges meeting at the hidden back-bottom corner, seen through the faces
  showBackEdges?: boolean;
  // false: no floor fill and no hidden back-bottom edges, only the two
  // front-bottom edges. useful when the walls are see-through
  showBottom?: boolean;
  // draw only half, so something can sit inside:
  // "back" = back edges + floor, "front" = walls + edges + top. leave out = whole box
  part?: "back" | "front";
}) {
  const edgeGradientId = useId();
  const edgeStroke = stroke ?? `url(#${edgeGradientId})`;
  const backEdgeStroke = backStroke ?? edgeStroke;
  const drawBack = part !== "front";
  const drawFront = part !== "back";

  const down = (p: Point) => ({ x: p.x, y: p.y + height });
  const bottom = {
    left: down(top.left),
    back: down(top.back),
    right: down(top.right),
    front: down(top.front),
  };

  // where each rounded top corner really turns. walls and side edges start here.
  // (old ISOCube worked these out from angleA alone, which is only exact when
  // both angles are the same. same numbers when they are)
  const tip = {
    left: curveMiddle(top.front, top.left, top.back, radius),
    right: curveMiddle(top.back, top.right, top.front, radius),
    front: curveMiddle(top.left, top.front, top.right, radius),
    back: curveMiddle(top.right, top.back, top.left, radius),
  };

  // front-bottom edges only (left tip → front → right tip), same rounded
  // front corner as the full floor would have
  const frontBottom = roundCorner(
    bottom.left,
    bottom.front,
    bottom.right,
    radius,
  );
  const leftBottomTip = down(tip.left);
  const rightBottomTip = down(tip.right);

  return (
    <>
      <defs>
        <EdgeGradient
          id={edgeGradientId}
          width={top.right.x}
          height={bottom.front.y}
          opacity={edgeOpacity}
        />
      </defs>

      {/* back edge: drawn first so the glass sits over it */}
      {drawBack && showBackEdges && (
        <line
          x1={tip.back.x}
          y1={tip.back.y}
          x2={tip.back.x}
          y2={tip.back.y + height}
          stroke={backEdgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {/* without the floor, the floor's back edges still show through the glass */}
      {drawBack && showBackEdges && !showBottom && (
        <path
          d={`M ${bottom.left.x} ${bottom.left.y} L ${bottom.back.x} ${bottom.back.y} L ${bottom.right.x} ${bottom.right.y}`}
          fill="none"
          stroke={backEdgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {drawBack && showBottom && (
        <path
          d={roundedPolygonPath(
            [bottom.left, bottom.back, bottom.right, bottom.front],
            radius,
          )}
          fill={fills.bottom}
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {/* front-bottom edges. with a floor they're already in the floor's outline,
          except when drawing the front half on its own */}
      {drawFront && (!showBottom || part === "front") && (
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

      {/* walls: left and right faces meeting at the front edge */}
      <polygon
        points={`${tip.left.x},${tip.left.y} ${top.front.x},${top.front.y} ${bottom.front.x},${bottom.front.y} ${leftBottomTip.x},${leftBottomTip.y}`}
        fill={fills.left}
      />
      <polygon
        points={`${top.front.x},${top.front.y} ${tip.right.x},${tip.right.y} ${rightBottomTip.x},${rightBottomTip.y} ${bottom.front.x},${bottom.front.y}`}
        fill={fills.right}
      />

      {/* side edges */}
      <line
        x1={tip.left.x}
        y1={tip.left.y}
        x2={leftBottomTip.x}
        y2={leftBottomTip.y}
        stroke={edgeStroke}
        strokeWidth={strokeWidth}
      />
      <line
        x1={tip.right.x}
        y1={tip.right.y}
        x2={rightBottomTip.x}
        y2={rightBottomTip.y}
        stroke={edgeStroke}
        strokeWidth={strokeWidth}
      />
      {showFrontEdge && (
        <line
          x1={tip.front.x}
          y1={tip.front.y}
          x2={tip.front.x}
          y2={tip.front.y + height}
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}

      {/* top face */}
      <path
        d={roundedPolygonPath(
          [top.left, top.back, top.right, top.front],
          radius,
        )}
        fill={fills.top}
        stroke={edgeStroke}
        strokeWidth={strokeWidth}
      />
    </>
  );
}
