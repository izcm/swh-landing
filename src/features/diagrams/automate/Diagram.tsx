import { deg, Gear, gearLayout } from "@/lib/svg";

export function AutomateDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 340;

  // the gear, in the top-left corner
  const gear = (widthRatio: number) => {
    const radius = viewboxHeight * widthRatio; // knob
    const teethCount = 8; // knob
    const holeRadius = radius * 0.55; // knob
    return gearLayout({
      radius,
      teethCount,
      // a gear's "module" (2 · radius / teethCount), made taller
      toothHeight: ((2 * radius) / teethCount) * 1.2, // knob
      toothShare: 0.6, // knob
      toothLean: deg(15), // knob
      holeRadius,
      holeRingRadius: holeRadius * 1.2, // knob
      depth: radius * 0.2, // knob
      tilt: deg(-15), // knob
    });
  };

  const bigGear = (() => {
    const layout = gear(0.22);
    const translateX = 0; // flush with the left edge
    const translateY = 0; // flush with the top edge
    return { layout, translateX, translateY };
  })();

  const smallGear = (() => {
    const layout = gear(0.18);
    const translateX = bigGear.translateX + bigGear.layout.groupWidth * 0.65;
    const translateY = 0;
    return { layout, translateX, translateY };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="block max-w-2xl w-full mx-auto"
    >
      {/* debug: the viewbox's edges */}
      <rect
        className="svg-debugd"
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      <g
        transform={`translate(${smallGear.translateX}, ${smallGear.translateY})`}
      >
        <Gear layout={smallGear.layout} />
      </g>
      <g transform={`translate(${bigGear.translateX}, ${bigGear.translateY})`}>
        <Gear layout={bigGear.layout} />
      </g>
    </svg>
  );
}
