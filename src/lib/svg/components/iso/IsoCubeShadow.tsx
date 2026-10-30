import { isoCubeMetrics, type Point } from "../../logic";
import { boxCorners } from "../../layouts";
import { BoxShadow } from "./BoxShadow";

type IsoCubeMetrics = ReturnType<typeof isoCubeMetrics>;

// soft shadow under an iso cube / platform: its floor, moved `drop`
// lower and blurred. stays put while the cube bobs (float-bob), and shrinks +
// fades in step with it when given the same duration / delay.
// pass the cube's metrics + the same x / y as its <ISOCube>
export function IsoCubeShadow({
  x = 0,
  y = 0,
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
  // the cube's floor corners
  const { floor } = boxCorners({
    lengthA: a.edgeLength,
    lengthB: b.edgeLength,
    angleA: a.angle,
    angleB: b.angle,
    thickness,
  });

  return (
    <BoxShadow
      x={x}
      y={y}
      corners={[floor.left, floor.top, floor.right, floor.bottom]}
      drop={drop}
      duration={duration}
      delay={delay}
    />
  );
}
