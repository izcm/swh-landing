import { useId } from "react";
import { EdgeGradient } from "../EdgeGradient";
import {
  pointOnLine,
  roundCorner,
  roundedPolygonPath,
  type Point,
} from "../logic";

// the 4 corners of a box's roof (its top face). left is at x = 0
export type BoxRoof = { left: Point; top: Point; right: Point; bottom: Point };

// one color per face, already resolved (no defaults here: the caller picks the look)
export type BoxFills = {
  roof: string;
  left: string;
  right: string;
  floor: string;
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

// draws a box from its roof corners: floor, walls, edges, rounded roof.
// works in whatever units the corners are in (ISOCube: a 100-wide box).
// no position, scale or glow: the caller wraps it in its own <g>
export function BoxBody({
  roof,
  height,
  strokeWidth,
  fills,
  radius,
  stroke,
  floorTopStroke,
  edgeOpacity,
  showMiddleEdge = false,
  showFloorTopEdges = false,
  showFloor = false,
  part,
}: {
  roof: BoxRoof;
  height: number; // wall height: the floor is the roof moved down by this
  strokeWidth: number; // in the corners' units
  fills: BoxFills;
  radius: number; // rounded corners on the roof and floor
  stroke?: string; // edge color. defaults to an edge gradient
  floorTopStroke?: string; // the floor-top edges (showFloorTopEdges). defaults to stroke
  edgeOpacity?: [number, number, number]; // edge gradient stops, see EdgeGradient
  showMiddleEdge?: boolean;
  // edges meeting at floor.top, seen through the faces
  showFloorTopEdges?: boolean;
  // false: no floor fill and no floor-top edges, only the floor's two
  // lower edges. useful when the walls are see-through
  showFloor?: boolean;
  // draw only half, so something can sit inside:
  // "under" = floor-top edges + floor, "over" = walls + edges + roof. leave out = whole box
  part?: "under" | "over";
}) {
  const edgeGradientId = useId();
  const edgeStroke = stroke ?? `url(#${edgeGradientId})`;
  const floorTopEdgeStroke = floorTopStroke ?? edgeStroke;
  const drawUnder = part !== "over";
  const drawOver = part !== "under";

  const down = (p: Point) => ({ x: p.x, y: p.y + height });
  const floor = {
    left: down(roof.left),
    top: down(roof.top),
    right: down(roof.right),
    bottom: down(roof.bottom),
  };

  // where each rounded roof corner really turns. walls and side edges start here.
  // (old ISOCube worked these out from angleA alone, which is only exact when
  // both angles are the same. same numbers when they are)
  const tip = {
    left: curveMiddle(roof.bottom, roof.left, roof.top, radius),
    right: curveMiddle(roof.top, roof.right, roof.bottom, radius),
    bottom: curveMiddle(roof.left, roof.bottom, roof.right, radius),
    top: curveMiddle(roof.right, roof.top, roof.left, radius),
  };

  // the curve at floor.bottom: its 3 points (before, corner, after), for the over path
  // (floor.left → floor.bottom → floor.right). made with the same radius as the floor's
  // color shape (roundedPolygonPath), so the line's curve lands on that shape's edge
  const floorBottom = roundCorner(
    floor.left,
    floor.bottom,
    floor.right,
    radius,
  );
  // same for the floor's other 3 corners
  const floorTop = roundCorner(floor.left, floor.top, floor.right, radius);
  const floorLeft = roundCorner(floor.bottom, floor.left, floor.top, radius);
  const floorRight = roundCorner(floor.top, floor.right, floor.bottom, radius);
  const leftFloorTip = down(tip.left);
  const rightFloorTip = down(tip.right);
  // the tips sit in the middle of the left / right corner's curve. each path
  // draws its half of that curve: the under path the half toward floor.top,
  // the over path the half toward floor.bottom. these are the halves' bend points
  const leftHalfTop = pointOnLine(floorLeft.corner, floorLeft.after, 0.5);
  const leftHalfBottom = pointOnLine(floorLeft.before, floorLeft.corner, 0.5);
  const rightHalfTop = pointOnLine(floorRight.before, floorRight.corner, 0.5);
  const rightHalfBottom = pointOnLine(floorRight.corner, floorRight.after, 0.5);

  return (
    <>
      <defs>
        <EdgeGradient
          id={edgeGradientId}
          width={roof.right.x}
          height={floor.bottom.y}
          opacity={edgeOpacity}
        />
      </defs>

      {/* the edge down to floor.top: drawn first so the glass sits over it */}
      {drawUnder && showFloorTopEdges && (
        <line
          x1={tip.top.x}
          y1={tip.top.y}
          x2={tip.top.x}
          y2={tip.top.y + height}
          stroke={floorTopEdgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {drawUnder && showFloor && (
        <path
          d={roundedPolygonPath(
            [floor.left, floor.top, floor.right, floor.bottom],
            radius,
          )}
          fill={fills.floor}
          stroke={part === "under" ? "none" : edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {/* the floor's lines floor.left → floor.top → floor.right. a whole cube with `showFloor` 
          gets them from the floor's outline. with showFloor false (no floor at all) or for the under half (its
          outline is turned off) there's no outline, so they're drawn here */}
      {drawUnder && showFloorTopEdges && (!showFloor || part === "under") && (
        <path
          d={`M ${leftFloorTip.x} ${leftFloorTip.y}
              Q ${leftHalfTop.x} ${leftHalfTop.y} ${floorLeft.after.x} ${floorLeft.after.y}
              L ${floorTop.before.x} ${floorTop.before.y}
              Q ${floorTop.corner.x} ${floorTop.corner.y} ${floorTop.after.x} ${floorTop.after.y}
              L ${floorRight.before.x} ${floorRight.before.y}
              Q ${rightHalfTop.x} ${rightHalfTop.y} ${rightFloorTip.x} ${rightFloorTip.y}`}
          fill="none"
          stroke={floorTopEdgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {/* the floor's two lower edges. with a floor they're already in the floor's outline,
          except when drawing the over half on its own */}
      {drawOver && (!showFloor || part === "over") && (
        <path
          d={`M ${leftFloorTip.x} ${leftFloorTip.y}
              Q ${leftHalfBottom.x} ${leftHalfBottom.y} ${floorLeft.before.x} ${floorLeft.before.y}
              L ${floorBottom.before.x} ${floorBottom.before.y}
              Q ${floorBottom.corner.x} ${floorBottom.corner.y} ${floorBottom.after.x} ${floorBottom.after.y}
              L ${floorRight.after.x} ${floorRight.after.y}
              Q ${rightHalfBottom.x} ${rightHalfBottom.y} ${rightFloorTip.x} ${rightFloorTip.y}`}
          fill="none"
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}

      {drawOver && (
        <>
          {/* walls: left and right faces meeting at the middle edge */}
          <polygon
            points={`${tip.left.x},${tip.left.y} ${roof.bottom.x},${roof.bottom.y} ${floor.bottom.x},${floor.bottom.y} ${leftFloorTip.x},${leftFloorTip.y}`}
            fill={fills.left}
          />
          <polygon
            points={`${roof.bottom.x},${roof.bottom.y} ${tip.right.x},${tip.right.y} ${rightFloorTip.x},${rightFloorTip.y} ${floor.bottom.x},${floor.bottom.y}`}
            fill={fills.right}
          />

          {/* side edges */}
          <line
            x1={tip.left.x}
            y1={tip.left.y}
            x2={leftFloorTip.x}
            y2={leftFloorTip.y}
            stroke={edgeStroke}
            strokeWidth={strokeWidth}
          />
          <line
            x1={tip.right.x}
            y1={tip.right.y}
            x2={rightFloorTip.x}
            y2={rightFloorTip.y}
            stroke={edgeStroke}
            strokeWidth={strokeWidth}
          />
          {showMiddleEdge && (
            <line
              x1={tip.bottom.x}
              y1={tip.bottom.y}
              x2={tip.bottom.x}
              y2={tip.bottom.y + height}
              stroke={edgeStroke}
              strokeWidth={strokeWidth}
            />
          )}

          {/* roof */}
          <path
            d={roundedPolygonPath(
              [roof.left, roof.top, roof.right, roof.bottom],
              radius,
            )}
            fill={fills.roof}
            stroke={edgeStroke}
            strokeWidth={strokeWidth}
          />
        </>
      )}
    </>
  );
}
