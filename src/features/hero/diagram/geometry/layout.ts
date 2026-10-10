import {
  isoBottomCenter,
  isoCubeMetrics,
  isoTopCenter,
  pointOnCircle,
  standOn,
} from "@/lib/svg/helpers";

type Ring = { radius: number; centerX: number; centerY: number };
type Angles = { angleA: number; angleB: number };

// every position in the hero diagram, worked out once so the centerpiece,
// the orbit and the connectors between them all use the same numbers
export function heroLayout({
  contentRing,
  unit,
  contentHeight,
  angles,
}: {
  contentRing: Ring;
  unit: number;
  contentHeight: number;
  angles: Angles;
}) {
  // the big glass cube in the middle, with a small cube floating inside
  const centerpiece = (() => {
    const cubeSize = unit * 3.6;
    const cube = isoCubeMetrics(cubeSize, cubeSize * 0.577, angles);

    // small cube standing in the middle of the big cube's floor,
    // same as SoftwareDiagram's bottom-left group
    const innerCubeSize = cube.size / 2;
    const innerCube = isoCubeMetrics(
      innerCubeSize,
      innerCubeSize * 0.577,
      angles,
    );
    const innerCubePos = standOn(isoBottomCenter(cube), innerCube);

    return {
      x: contentRing.centerX - unit * 0.75,
      // y: contentRing.centerY - cube.height * 0.5,
      y: contentRing.centerY - cube.height * 0.5,
      cube,
      innerCube,
      innerCubePos,
    };
  })();

  // dots on the ring, each with a platform + standing surface
  const orbit = (() => {
    const platformSize = unit * 3;
    const platform = isoCubeMetrics(platformSize, contentHeight / 35, angles);

    const pointOnContentRing = (degrees: number) =>
      pointOnCircle({
        angle: (degrees * Math.PI) / 180,
        circle: contentRing,
      });
    // knob: turns all dots around the ring together, in degrees.
    // the gaps between them stay the same
    const orbitRotation = 0;
    const nodeAngles = [85, 150, 210, 275];
    const nodes = nodeAngles.map((degrees) =>
      pointOnContentRing(degrees + orbitRotation),
    );

    // stands along the platform's front-left edge, so it uses angle A
    // const surfaceSize = platform.b.edgeLength;
    const surfaceSize = platform.b.edgeLength;
    const surfaceThickness = surfaceSize * 1.1;

    const standingSurface = {
      size: surfaceSize,
      thickness: surfaceThickness,
      depth: surfaceSize * Math.tan((angles.angleA * Math.PI) / 180),
    };

    // corners of the platform's outline, measured from the point it's pinned
    // by (the middle of its top face)
    const corners = [
      { x: 0, y: -platform.depth }, // top tipop
      { x: -platform.size / 2, y: 0 }, // left
      { x: platform.size / 2, y: 0 }, // right
      { x: -platform.size / 2, y: platform.thickness }, // left, bottom
      { x: platform.size / 2, y: platform.thickness }, // right, bottom
      { x: 0, y: platform.depth + platform.thickness }, // front tip, bottom
      { x: -platform.size / 4, y: -standingSurface.thickness }, // surface top-left
      {
        x: -platform.size / 4 + standingSurface.size,
        y: -standingSurface.thickness + standingSurface.depth,
      }, // surface top-right
    ];

    // each platform: start at its dot, then step back toward the center by
    // as much as it sticks out past the ring. the dots and ring don't move
    const platformCenterPoints = nodes.map((node) => {
      // direction from the center to the dot, one step long
      const out = {
        x: (node.x - contentRing.centerX) / contentRing.radius,
        y: (node.y - contentRing.centerY) / contentRing.radius,
      };

      // how far the corner that sticks out most is past the dot, along `out`
      const overflow = Math.max(
        ...corners.map((c) => c.x * out.x + c.y * out.y),
      );

      return {
        x: node.x - out.x * overflow,
        y: node.y - out.y * overflow,
      };
    });

    // the step from the platform's box top-left corner to the middle of its
    // top face. not a position on its own: add it to / subtract it from one
    const toDiamondCenter = isoTopCenter(platform);

    const platformPoints = platformCenterPoints.map((centerPoint) => ({
      x: centerPoint.x - toDiamondCenter.x,
      y: centerPoint.y - toDiamondCenter.y,
    }));

    return {
      platform,
      nodes,
      standingSurface,
      platformCenterPoints,
      toDiamondCenter,
      platformPoints,
    };
  })();

  return { centerpiece, orbit };
}
