import { useId } from "react";

import { listItemLayout, placeItemCenter, Tube } from "@/lib/svg";
import { RadialGauge } from "@/lib/svg/components/analytics/RadialGauge";

// a gauge with its label: a dot with a title and subtitle on top, then the
// gauge, as big as fits in the rest, with a tube in its open bottom.
// drawn from (0, 0)
export function Gauge({
  width,
  height,
  labelShare,
  values,
  value,
}: {
  width: number; // the whole box: the label row, then the gauge row
  height: number;
  labelShare: number; // the label row's share of the height, the gauge gets the rest
  values: number[]; // the segments (one tick where each starts)
  value: number; // how full it is, out of their total
}) {
  const gaugeGradientId = useId();
  const tubeGradientId = useId();

  // top to bottom: the label row, then the gauge row
  const rows = (() => {
    const labelHeight = height * labelShare;
    const gaugeHeight = height - labelHeight;
    return { labelHeight, gaugeHeight, gaugeY: labelHeight };
  })();

  const gauge = (() => {
    const radius = Math.min(width, rows.gaugeHeight) * 0.42;
    const thickness = radius * 0.13;
    const { offsetX: translateX, offsetY: translateY } = placeItemCenter({
      parentWidth: width,
      parentHeight: rows.gaugeHeight,
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
      <Label width={width} height={rows.labelHeight} />
      <g transform={`translate(0, ${rows.gaugeY})`}>
        <defs>
          {/* the gauge's: in the gauge's own coordinates (RadialGauge draws inside its translate(x, y)) */}
          <linearGradient
            id={gaugeGradientId}
            gradientUnits="userSpaceOnUse"
            x1={0}
            x2={radius * 2}
          >
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-deep)" />
          </linearGradient>
          {/* the tube's: the same, moved over by translateX, because the tube is drawn in the row's coordinates */}
          <linearGradient
            id={tubeGradientId}
            gradientUnits="userSpaceOnUse"
            x1={translateX}
            x2={translateX + radius * 2}
          >
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-deep)" />
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
      </g>
    </>
  );
}

// the label: a dot, then a title with a subtitle under it, centered in the
// row's height. drawn from (0, 0)
function Label({
  width,
  height,
}: {
  width: number; // the label row's width
  height: number; // the label row's height
}) {
  const item = (() => {
    const dotRadius = height * 0.16;
    const lineHeight = dotRadius * 0.6;

    return listItemLayout({
      height,
      leadingInset: 0,
      leadingRadius: dotRadius,
      gap: lineHeight * 3,
      lineHeights: [lineHeight, lineHeight], // title, subtitle
      lineGap: lineHeight,
    });
  })();

  const { leading, text } = item;
  const textWidth = width - text.x;

  return (
    <>
      <circle
        cx={leading.cx}
        cy={leading.cy}
        r={leading.radius}
        fill="var(--accent)"
        fillOpacity={0.8}
      />
      <g transform={`translate(${text.x}, ${text.y})`}>
        {/* title: bright, shorter */}
        <Tube
          x={0}
          y={text.lineStarts[0]}
          width={textWidth}
          height={text.lineHeights[0]}
          level={0.5}
          fill="var(--accent-electric)"
        />
        {/* subtitle: dim, longer */}
        <Tube
          x={0}
          y={text.lineStarts[1]}
          width={textWidth}
          height={text.lineHeights[1]}
          level={0.8}
          fill="var(--accent-electric)"
          fillOpacity={0.3}
        />
      </g>
    </>
  );
}
