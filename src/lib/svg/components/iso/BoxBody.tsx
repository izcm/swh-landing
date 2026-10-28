import {
  pointOnLine,
  roundCorner,
  roundedPolygonPath,
  type Point,
} from "../../logic";

// the 4 corners of a box's roof (its top face). left is at x = 0
export type BoxRoof = { left: Point; top: Point; right: Point; bottom: Point };

// one color, or a list drawn as layers, bottom first
export type Paint = string | string[];

export type BoxFills = {
  roof: Paint;
  left: Paint;
  right: Paint;
  floor: Paint;
};

export type BoxStrokes = {
  roof: Paint;
  left: Paint;
  right: Paint;
  middle: Paint;
  back: Paint;
  floor: Paint;
  floorTop: Paint;
};

// where the box is
export type BoxShape = {
  roof: BoxRoof;
  thickness: number; // wall height: the floor is the roof moved down by this
};

// how it looks. faces and edges left out aren't drawn
export type BoxLook = {
  fills?: Partial<BoxFills>;
  strokes?: Partial<BoxStrokes>;
  strokeWidth: number; // in the corners' units
  radius: number; // rounded corners on the roof and floor
};

// the middle of a rounded corner's curve
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
// no position, scale or glow: the caller wraps it in its own <g>.
// to draw half (something sitting inside): render the floor + back edges in
// one BoxBody, the rest in a second one over it
export function BoxBody({
  roof,
  thickness,
  strokeWidth,
  fills = {},
  strokes = {},
  radius,
}: BoxShape & BoxLook) {
  const down = (p: Point) => ({ x: p.x, y: p.y + thickness });
  const floor = {
    left: down(roof.left),
    top: down(roof.top),
    right: down(roof.right),
    bottom: down(roof.bottom),
  };

  // the roof's and floor's outlines, for their fill layers (and the roof's stroke)
  const roofPath = roundedPolygonPath(
    [roof.left, roof.top, roof.right, roof.bottom],
    radius,
  );
  const floorPath = roundedPolygonPath(
    [floor.left, floor.top, floor.right, floor.bottom],
    radius,
  );

  // where each rounded roof corner really turns. walls and side edges start here.
  // (old ISOCube worked these out from angleA alone, which is only exact when
  // both angles are the same. same numbers when they are)
  const tip = {
    left: curveMiddle(roof.bottom, roof.left, roof.top, radius),
    right: curveMiddle(roof.top, roof.right, roof.bottom, radius),
    bottom: curveMiddle(roof.left, roof.bottom, roof.right, radius),
    top: curveMiddle(roof.right, roof.top, roof.left, radius),
  };

  // the curve at floor.bottom: its 3 points (before, corner, after), for the front edges
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
  // draws its half of that curve: the back edges the half toward floor.top,
  // the front edges the half toward floor.bottom. these are the halves' bend points
  const leftHalfTop = pointOnLine(floorLeft.corner, floorLeft.after, 0.5);
  const leftHalfBottom = pointOnLine(floorLeft.before, floorLeft.corner, 0.5);
  const rightHalfTop = pointOnLine(floorRight.before, floorRight.corner, 0.5);
  const rightHalfBottom = pointOnLine(floorRight.corner, floorRight.after, 0.5);

  return (
    <>
      {/* the back edge, down to floor.top: drawn first so the glass sits over it */}
      {[strokes.back ?? []].flat().map((stroke, i) => (
        <line
          key={i}
          x1={tip.top.x}
          y1={tip.top.y}
          x2={tip.top.x}
          y2={tip.top.y + thickness}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
      {/* a fill is one color or a list: [fill].flat() makes it a list either way */}
      {[fills.floor ?? []].flat().map((fill, i) => (
        <path key={i} d={floorPath} fill={fill} />
      ))}
      {/* the floor's back edges: floor.left → floor.top → floor.right */}
      {[strokes.floorTop ?? []].flat().map((stroke, i) => (
        <path
          key={i}
          d={`M ${leftFloorTip.x} ${leftFloorTip.y}
              Q ${leftHalfTop.x} ${leftHalfTop.y} ${floorLeft.after.x} ${floorLeft.after.y}
              L ${floorTop.before.x} ${floorTop.before.y}
              Q ${floorTop.corner.x} ${floorTop.corner.y} ${floorTop.after.x} ${floorTop.after.y}
              L ${floorRight.before.x} ${floorRight.before.y}
              Q ${rightHalfTop.x} ${rightHalfTop.y} ${rightFloorTip.x} ${rightFloorTip.y}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
      {/* the floor's front edges: floor.left → floor.bottom → floor.right */}
      {[strokes.floor ?? []].flat().map((stroke, i) => (
        <path
          key={i}
          d={`M ${leftFloorTip.x} ${leftFloorTip.y}
              Q ${leftHalfBottom.x} ${leftHalfBottom.y} ${floorLeft.before.x} ${floorLeft.before.y}
              L ${floorBottom.before.x} ${floorBottom.before.y}
              Q ${floorBottom.corner.x} ${floorBottom.corner.y} ${floorBottom.after.x} ${floorBottom.after.y}
              L ${floorRight.after.x} ${floorRight.after.y}
              Q ${rightHalfBottom.x} ${rightHalfBottom.y} ${rightFloorTip.x} ${rightFloorTip.y}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}

      {/* walls: left and right faces meeting at the middle edge */}
      {[fills.left ?? []].flat().map((fill, i) => (
        <polygon
          key={i}
          points={`${tip.left.x},${tip.left.y} ${roof.bottom.x},${roof.bottom.y} ${floor.bottom.x},${floor.bottom.y} ${leftFloorTip.x},${leftFloorTip.y}`}
          fill={fill}
        />
      ))}
      {[fills.right ?? []].flat().map((fill, i) => (
        <polygon
          key={i}
          points={`${roof.bottom.x},${roof.bottom.y} ${tip.right.x},${tip.right.y} ${rightFloorTip.x},${rightFloorTip.y} ${floor.bottom.x},${floor.bottom.y}`}
          fill={fill}
        />
      ))}

      {/* side edges */}
      {[strokes.left ?? []].flat().map((stroke, i) => (
        <line
          key={i}
          x1={tip.left.x}
          y1={tip.left.y}
          x2={leftFloorTip.x}
          y2={leftFloorTip.y}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
      {[strokes.right ?? []].flat().map((stroke, i) => (
        <line
          key={i}
          x1={tip.right.x}
          y1={tip.right.y}
          x2={rightFloorTip.x}
          y2={rightFloorTip.y}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
      {/* the middle edge: roof.bottom down to floor.bottom */}
      {[strokes.middle ?? []].flat().map((stroke, i) => (
        <line
          key={i}
          x1={tip.bottom.x}
          y1={tip.bottom.y}
          x2={tip.bottom.x}
          y2={tip.bottom.y + thickness}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}

      {/* roof */}
      {[fills.roof ?? []].flat().map((fill, i) => (
        <path key={i} d={roofPath} fill={fill} />
      ))}
      {[strokes.roof ?? []].flat().map((stroke, i) => (
        <path
          key={i}
          d={roofPath}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
    </>
  );
}
