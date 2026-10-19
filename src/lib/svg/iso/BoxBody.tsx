import { useId } from "react";
import { EdgeGradient } from "../EdgeGradient";
import { roundCorner, roundedPolygonPath, type Point } from "../logic";

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

  // the floor's two lower edges only (left tip → bottom → right tip), same rounded
  // bottom corner as the full floor would have
  const floorBottom = roundCorner(
    floor.left,
    floor.bottom,
    floor.right,
    radius,
  );
  const leftFloorTip = down(tip.left);
  const rightFloorTip = down(tip.right);

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
      {/* without the floor, the floor's two upper edges still show through the glass */}
      {drawUnder && showFloorTopEdges && !showFloor && (
        <path
          d={`M ${floor.left.x} ${floor.left.y} L ${floor.top.x} ${floor.top.y} L ${floor.right.x} ${floor.right.y}`}
          fill="none"
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
          stroke={edgeStroke}
          strokeWidth={strokeWidth}
        />
      )}
      {/* the floor's two lower edges. with a floor they're already in the floor's outline,
          except when drawing the over half on its own */}
      {drawOver && (!showFloor || part === "over") && (
        <path
          d={`M ${leftFloorTip.x} ${leftFloorTip.y}
              L ${floorBottom.before.x} ${floorBottom.before.y}
              Q ${floorBottom.corner.x} ${floorBottom.corner.y} ${floorBottom.after.x} ${floorBottom.after.y}
              L ${rightFloorTip.x} ${rightFloorTip.y}`}
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
