import { useId } from "react";

import { placeItemCenter, Tube } from "@/lib/svg";
import { RadialGauge } from "@/lib/svg/components/analytics/RadialGauge";

// a gauge, as big as fits in the box, with a tube in its open bottom.
// drawn from (0, 0)
export function Gauge({
  width,
  height,
  values,
  value,
}: {
  width: number; // the box the gauge is centered in
  height: number;
  values: number[]; // the segments (one tick where each starts)
  value: number; // how full it is, out of their total
}) {
  const gaugeGradientId = useId();
  const tubeGradientId = useId();

  const gauge = (() => {
    const radius = Math.min(width, height) * 0.4;
    const thickness = radius * 0.2;
    const { offsetX: translateX, offsetY: translateY } = placeItemCenter({
      parentWidth: width,
      parentHeight: height,
      itemWidth: radius * 2,
      itemHeight: radius * 2,
    });

    const total = values.reduce((sum, size) => sum + size, 0);

    // the tube: half as wide as the gauge, centered under it, filled up to value
    const tube = {
      x: radius * 0.5,
      y: radius * 1.8,
      width: radius,
      height: thickness * 0.5,
      level: value / total,
    };

    const emptyOpacity = 0.25; // the gauge's and the tube's empty part

    return { radius, thickness, translateX, translateY, tube, emptyOpacity };
  })();

  const { radius, thickness, translateX, translateY, tube, emptyOpacity } =
    gauge;

  return (
    <>
      <defs>
        {/* the gauge's: in the gauge's own coordinates (RadialGauge draws inside its translate(x, y)) */}
        <linearGradient
          id={gaugeGradientId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={radius * 2}
        >
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-faint)" />
        </linearGradient>
        {/* the tube's: the same, moved over by translateX, because the tube is drawn in the box's coordinates */}
        <linearGradient
          id={tubeGradientId}
          gradientUnits="userSpaceOnUse"
          x1={translateX}
          x2={translateX + radius * 2}
        >
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-faint)" />
        </linearGradient>
      </defs>
      <RadialGauge
        x={translateX}
        y={translateY}
        radius={radius}
        thickness={thickness}
        values={values}
        value={value}
        fill={`url(#${gaugeGradientId})`}
        segmentOpacity={emptyOpacity}
      />
      <Tube
        {...tube}
        x={translateX + tube.x}
        y={translateY + tube.y}
        fill={`url(#${tubeGradientId})`}
        trackOpacity={emptyOpacity}
      />
    </>
  );
}
