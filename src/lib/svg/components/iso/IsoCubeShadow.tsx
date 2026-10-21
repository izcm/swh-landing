import { isoCubeMetrics, isoCubePoints, type Point } from "../../logic";
import { BoxShadow } from "./BoxShadow";

type IsoCubeMetrics = ReturnType<typeof isoCubeMetrics>;

// soft shadow under an iso cube / platform: its floor, moved `drop`
// lower and blurred. stays put while the cube bobs (float-bob), and shrinks +
// fades in step with it when given the same duration / delay.
// pass the cube's metrics + the same x / y as its <ISOCube>
export function IsoCubeShadow({
  x = 0,
  y = 0,
  size,
  thickness,
  a,
  b,
  drop = 12, // how far below the cube the shadow sits
  duration = "4s", // match the cube's --float-duration
  delay = "0s", // match the cube's --float-delay
}: Partial<Point> &
  IsoCubeMetrics & {
    drop?: number;
    duration?: string;
    delay?: string;
  }) {
  const pts = isoCubePoints(size, thickness, a.angle, b.angle);

  return (
    <BoxShadow
      x={x}
      y={y}
      corners={[pts.floorLeft, pts.floorTop, pts.floorRight, pts.floorBottom]}
      scale={pts.scale}
      drop={drop}
      duration={duration}
      delay={delay}
    />
  );
}
