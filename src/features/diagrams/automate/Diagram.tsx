import {
  alignCenter,
  cascadeLayout,
  deg,
  Gear,
  gearLayout,
  paddedBox,
} from "@/lib/svg";
import { AutomationRulesBoard } from "./AutomationRulesBoard";

export function AutomateDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 360;

  // 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);

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
      depth: radius * 0.25, // knob
      tilt: deg(-20), // knob
    });
  };

  const bigGear = (() => {
    const layout = gear(0.2);
    const translateX = 0; // flush with the left edge
    const translateY = 0; // flush with the top edge
    return { layout, translateX, translateY };
  })();

  const smallGear = (() => {
    const layout = gear(0.16);
    const translateX = bigGear.translateX + bigGear.layout.groupWidth * 0.625;
    const translateY = 0;
    return { layout, translateX, translateY };
  })();

  const gearGroupOffsetY = alignCenter(
    viewboxHeight,
    bigGear.layout.groupHeight,
  ).offset;

  const gearGroupWidth =
    smallGear.translateX + smallGear.layout.groupWidth - bigGear.translateX;

  const ruleBoard = (() => {
    const groupWidth = Math.min(
      viewboxWidth - gearGroupWidth,
      viewboxWidth * 0.4,
    );
    // const groupHeight = viewboxHeight * 0.6;

    const translateX = viewboxWidth - groupWidth;
    const translateY = 0;

    const boardLayout = cascadeLayout({
      groupWidth,
      heightToWidthRatio: 0.875,
      angle: deg(11.25),
      count: 2,
      gapX: 10,
      gapY: 8,
      side: "right",
    });

    const radius = 4; // knob: the boards' and rows' corners
    // the front board's padding, in the diagram's unit (about 28, so keep it small)
    const paddingXUnits = 0.5; // knob
    const paddingYUnits = 0.25; // knob

    return {
      groupWidth,
      // groupHeight,
      translateX,
      translateY,
      boardLayout,
      radius,
      paddingXUnits,
      paddingYUnits,
    };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="block max-w-2xl w-full mx-auto"
    >
      {/* debug: the viewbox's edges */}
      <rect
        className="svg-debug"
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      <g transform={`translate(0, ${gearGroupOffsetY})`}>
        <g
          transform={`translate(${smallGear.translateX}, ${smallGear.translateY})`}
        >
          <Gear layout={smallGear.layout} />
        </g>
        <g
          transform={`translate(${bigGear.translateX}, ${bigGear.translateY})`}
        >
          <Gear layout={bigGear.layout} />
        </g>
      </g>

      <g
        transform={`translate(${smallGear.translateX + smallGear.layout.groupWidth}, ${gearGroupOffsetY + bigGear.layout.groupHeight * 0.5})`}
      >
        <circle className="svg-debug" cx={0} cy={0} fill="hotpink" r={4} />
      </g>

      {/* the rule board */}
      <g
        transform={`translate(${ruleBoard.translateX}, ${ruleBoard.translateY})`}
      >
        <AutomationRulesBoard
          layout={ruleBoard.boardLayout}
          radius={ruleBoard.radius}
          unit={unit}
          paddingXUnits={ruleBoard.paddingXUnits}
          paddingYUnits={ruleBoard.paddingYUnits}
        />
        {/* debug: the rule board's box */}
        <rect
          className="svg-debug"
          width={ruleBoard.groupWidth}
          height={ruleBoard.boardLayout.stackHeight}
          fill="none"
          stroke="#aab4e6" // lavender
          strokeWidth={0.75}
          strokeDasharray="6 4"
        />
      </g>
    </svg>
  );
}
