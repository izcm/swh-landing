import {
  boxCorners,
  diamondPath,
  isoCubeMetrics,
  isoFloorCenter,
  type Point,
} from "@/lib/svg";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

// a floor of diamond tiles under a cube: the floor's middle is the cube's floor
// center, and the cube's floor edges sit on grid lines.
// cubePos: where the cube is drawn (its top-left)
export function floorLayout({
  cube,
  cubePos,
  angle,
  tilesPerCubeEdge,
  tilesPerFloorEdge,
}: {
  cube: IsoMetrics;
  cubePos: Point;
  angle: number;
  tilesPerCubeEdge: number;
  tilesPerFloorEdge: number;
}) {
  // one floor tile: a diamond at the cube's angle
  const tile = (() => {
    const length = cube.edgeLength / tilesPerCubeEdge;
    const { roof: corners } = boxCorners({
      lengthA: length,
      lengthB: length,
      angleA: angle,
      angleB: angle,
      thickness: 0,
    });
    const d = diamondPath(corners);
    return { corners, d, length };
  })();

  // the floor: a big diamond of tiles, centered under the cube
  const length = tile.length * tilesPerFloorEdge;
  const { roof } = boxCorners({
    lengthA: length,
    lengthB: length,
    angleA: angle,
    angleB: angle,
    thickness: 0,
  });
  const { left, right, bottom } = roof;
  const d = diamondPath(roof);

  // the floor's middle on the cube's floor center
  const cubeFloor = isoFloorCenter(cube);
  const translateX = cubePos.x + cubeFloor.x - right.x / 2;
  const translateY = cubePos.y + cubeFloor.y - left.y;

  // a tile's left corner on the cube's floor left corner, so the cube's floor
  // edges sit on grid lines. in the floor's own coordinates
  const cubeFloorLeft = {
    x: cubePos.x - translateX,
    y: cubePos.y + cubeFloor.y - translateY,
  };
  const patternX = cubeFloorLeft.x;
  const patternY = cubeFloorLeft.y - tile.corners.left.y;

  // the fade: the circle that fits inside the floor, flattened like the floor.
  // it ends where the floor's edges are, so they never show
  const fade = {
    cx: right.x / 2,
    cy: left.y,
    r: right.x / 2 / Math.SQRT2,
    squash: Math.tan(angle),
  };

  return {
    tile,
    d,
    width: right.x,
    height: bottom.y,
    translateX,
    translateY,
    patternX,
    patternY,
    fade,
  };
}
