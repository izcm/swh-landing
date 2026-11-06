import { alignCenter, deg, Gear, gearLayout } from "@/lib/svg";

export function GearPair() {
  const viewboxWidth = 320;
  const viewboxHeight = 240;

  const gear = (radiusRatio: number) => {
    const radius = viewboxHeight * radiusRatio;
    const teethCount = 8;
    const holeRadius = radius * 0.65;
    return gearLayout({
      radius,
      teethCount,
      // a gear's "module" (2 · radius / teethCount), made taller
      toothHeight: ((2 * radius) / teethCount) * 1,
      toothShare: 0.6,
      toothLean: deg(15),
      holeRadius,
      holeRingRadius: holeRadius * 1.2,
      depth: radius * 0.2,
      tilt: deg(-10),
    });
  };

  const bigGear = (() => {
    const layout = gear(0.25);
    const translateX = 0;
    const translateY = 0;
    const drawing = () => (
      <g transform={`translate(${translateX}, ${translateY})`}>
        <Gear layout={layout} />
      </g>
    );
    return { layout, translateX, translateY, drawing };
  })();

  // over the big gear's right side, so the teeth mesh
  const smallGear = (() => {
    const layout = gear(0.22);
    const translateX = bigGear.translateX + bigGear.layout.groupWidth * 0.625;
    const translateY = -40;
    const drawing = () => (
      <g transform={`translate(${translateX}, ${translateY})`}>
        <Gear layout={layout} />
      </g>
    );
    return { layout, translateX, translateY, drawing };
  })();

  // both gears, centered in the viewbox
  const gearPair = (() => {
    const groupWidth = smallGear.translateX + smallGear.layout.groupWidth;
    const groupHeight = bigGear.layout.groupHeight;

    const { offset: translateX } = alignCenter(viewboxWidth, groupWidth);
    const { offset: translateY } = alignCenter(viewboxHeight, groupHeight);

    return { translateX, translateY };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      width="100%"
      height="100%"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform={`translate(${gearPair.translateX}, ${gearPair.translateY})`}
      >
        {smallGear.drawing()}
        {bigGear.drawing()}
      </g>
    </svg>
  );
}
