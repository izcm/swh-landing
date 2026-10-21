import {
  isoCubeMetrics,
  isoFloorCenter,
  platformCorners,
  standOn,
} from "@/lib/svg";

type Angles = { angleA: number; angleB: number };

// the centerpiece's proportions: a big cube with a small cube standing in the
// middle of its floor. the caller picks the big cube's size and the camera angles
export function centerpieceLayout({
  size,
  angles,
}: {
  size: number;
  angles: Angles;
}) {
  const cube = isoCubeMetrics(size, size * 0.577, angles);

  // small cube standing in the middle of the big cube's floor,
  // same as SoftwareDiagram's bottom-left group
  const innerCubeSize = cube.size / 2;
  const innerCube = isoCubeMetrics(
    innerCubeSize,
    innerCubeSize * 0.577,
    angles,
  );
  const innerCubePos = standOn(isoFloorCenter(cube), innerCube);

  return { cube, innerCube, innerCubePos };
}
