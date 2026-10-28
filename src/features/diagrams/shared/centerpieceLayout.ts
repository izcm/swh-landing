import { isoCubeMetrics, isoFloorCenter, standOn } from "@/lib/svg";

// the centerpiece's proportions: a big cube with a small cube standing in the
// middle of its floor. the caller picks the big cube's size and the camera angle
export function centerpieceLayout({
  size,
  angle,
}: {
  size: number;
  angle: number;
}) {
  const angles = { angleA: angle, angleB: angle };
  const thicknessRatio = 0.625;
  const cube = isoCubeMetrics(size, size * thicknessRatio, angles);

  // small cube standing in the middle of the big cube's floor,
  // same as SoftwareDiagram's bottom-left group
  const innerCubeSize = cube.size / 2;
  const innerCube = isoCubeMetrics(
    innerCubeSize,
    innerCubeSize * thicknessRatio,
    angles,
  );
  const innerCubePos = standOn(isoFloorCenter(cube), innerCube);

  // how far the small cube floats above the floor, as a share of its size
  const floatLift = innerCube.size * 0.16;

  return { cube, innerCube, innerCubePos, floatLift };
}
