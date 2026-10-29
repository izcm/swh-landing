import { useId } from "react";
import type { IsoBox, Point } from "../../logic";

// a mask that shows only around center, fading out at radius
export function CornerLightMask({
  id,
  box,
  center,
  radius,
  opacity,
}: {
  id: string;
  box: IsoBox;
  center: Point;
  radius: number;
  opacity: [number, number]; // center, halfway
}) {
  const lightId = useId();

  return (
    <>
      <radialGradient
        id={lightId}
        gradientUnits="userSpaceOnUse"
        cx={center.x}
        cy={center.y}
        r={radius}
      >
        <stop offset="0%" stopColor="white" stopOpacity={opacity[0]} />
        <stop offset="50%" stopColor="white" stopOpacity={opacity[1]} />
        <stop offset="100%" stopColor="white" stopOpacity={0} />
      </radialGradient>
      <mask
        id={id}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={box.size}
        height={box.height}
      >
        <rect
          x={0}
          y={0}
          width={box.size}
          height={box.height}
          fill={`url(#${lightId})`}
        />
      </mask>
    </>
  );
}
