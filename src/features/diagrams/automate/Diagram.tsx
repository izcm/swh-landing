import { Box, FileText, User } from "lucide-react";

import {
  alignCenter,
  cascadeLayout,
  deg,
  dropAlongEdge,
  Gear,
  gearLayout,
  paddedBox,
} from "@/lib/svg";
import { MenuBoard, type MenuBoardRow } from "../shared/MenuBoard";
import { ActionCards } from "./ActionCards";
import { AutomationRulesHeader } from "./AutomationRulesHeader";

// one row per rule: its icon and its text, one string per line
const rules: MenuBoardRow[] = [
  { icon: FileText, lines: ["When a new invoice", "is created"] },
  { icon: User, lines: ["Sync employee data", "across systems"] },
  { icon: Box, lines: ["Create follow-up task"] },
];

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
      toothHeight: ((2 * radius) / teethCount) * 1.25, // knob
      toothShare: 0.65, // knob
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
    const drawing = (
      <g transform={`translate(${translateX}, ${translateY})`}>
        <Gear layout={layout} />
      </g>
    );
    return { layout, translateX, translateY, drawing };
  })();

  const smallGear = (() => {
    const layout = gear(0.16);
    const translateX = bigGear.translateX + bigGear.layout.groupWidth * 0.625;
    const translateY = 0;
    const drawing = (
      <g transform={`translate(${translateX}, ${translateY})`}>
        <Gear layout={layout} />
      </g>
    );
    return { layout, translateX, translateY, drawing };
  })();

  const gearGroupOffsetY = alignCenter(
    viewboxHeight,
    bigGear.layout.groupHeight,
  ).offset;

  // const gearGroupWidth =
  //   smallGear.translateX + smallGear.layout.groupWidth - bigGear.translateX;

  // the rule board's and the action cards' cascade: the same slant and steps,
  // each with its own width and shape
  const cascade = (groupWidth: number, heightToWidthRatio: number) =>
    cascadeLayout({
      groupWidth,
      heightToWidthRatio,
      angle: deg(11.25), // knob
      count: 2, // knob
      gapX: 8, // knob
      gapY: 6, // knob
      side: "right",
    });

  const ruleBoard = (() => {
    const groupWidth = viewboxWidth * 0.4;

    // const groupHeight = viewboxHeight * 0.6;

    const translateX = viewboxWidth - groupWidth;
    const translateY = 0;

    const boardLayout = cascade(groupWidth, 0.85);

    const radius = 4; // knob: the boards' and rows' corners
    // the front board's padding, in the diagram's unit (about 28, so keep it small)
    const paddingXUnits = 0.5; // knob
    const paddingYUnits = 0.25; // knob
    const headerShare = 0.15; // knob: the header's share of the board's content
    const headerGapUnits = 0.2; // knob: header → rules
    const rowGapUnits = 0.24; // knob: between two rules
    const fontSizeUnits = 0.32; // knob: the rules' text size
    const headerFontSize = unit * 0.35; // knob: the header's text size

    const drawing = (
      <g transform={`translate(${translateX}, ${translateY})`}>
        <MenuBoard
          layout={boardLayout}
          radius={radius}
          unit={unit}
          paddingXUnits={paddingXUnits}
          paddingYUnits={paddingYUnits}
          headerShare={headerShare}
          headerGapUnits={headerGapUnits}
          rowGapUnits={rowGapUnits}
          fontSizeUnits={fontSizeUnits}
          header={({ width, height }) => (
            <AutomationRulesHeader
              width={width}
              height={height}
              fontSize={headerFontSize}
            />
          )}
          rows={rules}
        />
        {/* debug: the rule board's box */}
        <rect
          className="svg-debug"
          width={groupWidth}
          height={boardLayout.stackHeight}
          fill="none"
          stroke="#aab4e6" // lavender
          strokeWidth={0.75}
          strokeDasharray="6 4"
        />
      </g>
    );

    return {
      groupWidth,
      // groupHeight,
      translateX,
      translateY,
      boardLayout,
      radius,
      drawing,
    };
  })();

  const actionCards = (() => {
    const groupWidth = viewboxWidth * 0.275;
    // the front board's bottom-left corner: the stack's bottom, minus the
    // triangle under the board's slanted bottom edge (its width · tan(angle))
    const { item, angle } = ruleBoard.boardLayout;
    const translateX = viewboxWidth - groupWidth - unit; // lined up with the board's left edge
    const translateY =
      ruleBoard.translateY +
      ruleBoard.boardLayout.stackHeight -
      dropAlongEdge({ run: item.width, angle }) * 0.5;
    const groupHeight = viewboxHeight - translateY; // down to the viewbox's bottom

    // its  a box but we want the rounded rurface to face us.
    // could we use boxbody for this ? cuz i want it to look like a box... but i want the roof to be facing us

    const itemLayout = cascade(groupWidth, 0.24);

    const drawing = (
      <g transform={`translate(${translateX}, ${translateY})`}>
        <ActionCards
          layout={itemLayout}
          height={groupHeight}
          radius={ruleBoard.radius}
        />
        {/* debug: the actions' box */}
        <rect
          className="svg-debug"
          width={groupWidth}
          height={groupHeight}
          fill="none"
          stroke="#aab4e6" // lavender
          strokeWidth={0.75}
          strokeDasharray="6 4"
        />
      </g>
    );

    return {
      groupWidth,
      groupHeight,
      translateX,
      translateY,
      itemLayout,
      drawing,
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
        {smallGear.drawing}
        {bigGear.drawing}
      </g>

      <g
        transform={`translate(${smallGear.translateX + smallGear.layout.groupWidth}, ${gearGroupOffsetY + bigGear.layout.groupHeight * 0.5})`}
      >
        <circle className="svg-debug" cx={0} cy={0} fill="hotpink" r={4} />
      </g>

      {/* the rule board */}
      {ruleBoard.drawing}

      {/* the actions, under the rule board */}
      {actionCards.drawing}
    </svg>
  );
}
