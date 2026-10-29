import { useId } from "react";
import { Eye, Plus, User, Zap } from "lucide-react";

import {
  alignCenter,
  alignEnd,
  cascadeLayout,
  deg,
  LitPane,
  paddedBox,
} from "@/lib/svg";
import { MenuBoard, type MenuBoardRow } from "../shared/MenuBoard";
import { MenuBoardHeader } from "../shared/MenuBoardHeader";
import { DashboardContent } from "./dashboard/DashboardContent";

// the menu board's rows: one per action
const actions: MenuBoardRow[] = [
  { icon: Plus, lines: ["Create task"] },
  { icon: User, lines: ["Assign to"] },
  { icon: Eye, lines: ["Track item"] },
];

export function ActDiagram() {
  // 540 units at our 672px ≈ 1.24px per unit, close to Connect's 784px / 650 units
  // ≈ 1.2px per unit, so strokes and radii come out about as thick as Connect's
  const viewboxWidth = 540;
  const viewboxHeight = 340; // we have overflow visible btw

  // same unit as Connect: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);
  // corner radius of the windows
  const radius = 3;

  // chart background: accent at the top, fading to transparent at the bottom
  const chartGradientId = useId();

  // left: the dashboard, a stack of tilted windows
  const dashboard = (() => {
    const stackLayout = cascadeLayout({
      // the stack's width: same as the old left box
      groupWidth: viewboxWidth * 0.65,
      heightToWidthRatio: 0.72,
      angle: deg(-15),
      count: 3,
      gapX: unit * 0.35,
      gapY: unit * 0.35,
      side: "left",
    });

    // the windows to draw, back to front: the cascade's, with the middle one
    // ([1]) a bit narrower and taller
    const windows = (() => {
      const { gapX, gapY, item } = stackLayout;
      return stackLayout.items.map((win, i) =>
        i === 1
          ? {
              ...win,
              width: item.width * 0.875,
              height: item.height * 1.06,
              x: gapX * 3,
              y: gapY + item.height - item.height * 1.06,
            }
          : win,
      );
    })();

    const { offset: translateY } = alignCenter(
      viewboxHeight,
      stackLayout.stackHeight,
    );

    // drawn inside the front window: charts on top, list below
    const frontContent = (() => {
      const { width, height } = stackLayout.item;
      const box = paddedBox(width, height, 0.65, 0.8);

      return (
        <g transform={`translate(${box.contentX}, ${box.contentY * 1.25})`}>
          <DashboardContent
            width={box.contentWidth}
            height={box.contentHeight}
            radius={radius}
            drilldown={true} // mock selection state
          />
        </g>
      );
    })();

    return { stackLayout, windows, translateY, frontContent };
  })();

  // right: the menu board, where the floating menu was
  const menuBoard = (() => {
    const groupWidth = viewboxWidth * 0.31; // knob
    const boardLayout = cascadeLayout({
      groupWidth,
      heightToWidthRatio: 0.96, // knob
      // tilted the other way from the windows, facing them
      angle: -dashboard.stackLayout.angle,
      count: 2, // knob
      gapX: unit * 0.2, // knob: the windows' steps
      gapY: unit * 0.2, // knob
      side: "right",
    });

    const translateX = viewboxWidth - groupWidth; // flush with the right edge
    const { offset: centerY } = alignCenter(
      viewboxHeight,
      boardLayout.stackHeight,
    );
    const { offset: endY } = alignEnd(viewboxHeight, boardLayout.stackHeight);
    const translateY = (centerY + endY) / 2; // halfway between centered and at the bottom

    // automate's values, so the two boards match
    const paddingXUnits = 0.5; // knob
    const paddingYUnits = 0.25; // knob
    const headerShare = 0.15; // knob: the header's share of the board's content
    const headerGapUnits = 0.2; // knob: header → rows
    const rowGapUnits = 0.24; // knob: between two rows
    const fontSizeUnits = 0.36; // knob: the rows' text size
    const headerFontSize = unit * 0.32; // knob: the header's text size

    return {
      boardLayout,
      translateX,
      translateY,
      paddingXUnits,
      paddingYUnits,
      headerShare,
      headerGapUnits,
      rowGapUnits,
      fontSizeUnits,
      headerFontSize,
    };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      // 540 units at up to 672px ≈ 1.24px per unit, close to Connect. centered
      className="block max-w-2xl w-full mx-auto"
      overflow={"visible"}
    >
      <defs>
        {/* top to bottom */}
        <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity={1} />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
        </linearGradient>
      </defs>

      <rect
        className="svg-debug"
        x={0}
        y={0}
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />

      {/* the dashboard: tilted windows, back to front, fading from 0.6 at the back */}
      <g
        transform={`translate(0, ${dashboard.translateY}) ${dashboard.stackLayout.transform}`}
      >
        {dashboard.windows.map((win, i) => (
          <g
            key={i}
            transform={`translate(${win.x}, ${win.y})`}
            opacity={0.6 + win.depth * 0.4}
          >
            {/* the lit pane, then a faint highlight along the top edge */}
            <LitPane width={win.width} height={win.height} radius={radius} />
            <line
              x1={radius}
              y1={1}
              x2={win.width - radius}
              y2={1}
              stroke="var(--accent-electric)"
              strokeOpacity={1}
              strokeWidth={0.5}
            />
            {win.isFront && dashboard.frontContent}
          </g>
        ))}
      </g>

      {/* the menu board, where the floating menu was */}
      {(() => {
        const {
          translateX,
          translateY,
          boardLayout,
          paddingXUnits,
          paddingYUnits,
          headerShare,
          headerGapUnits,
          rowGapUnits,
          fontSizeUnits,
          headerFontSize,
        } = menuBoard;
        return (
          <MenuBoard
            x={translateX}
            y={translateY}
            layout={boardLayout}
            radius={radius}
            unit={unit}
            paddingXUnits={paddingXUnits}
            paddingYUnits={paddingYUnits}
            headerShare={headerShare}
            headerGapUnits={headerGapUnits}
            rowGapUnits={rowGapUnits}
            fontSizeUnits={fontSizeUnits}
            header={({ height }) => (
              <MenuBoardHeader
                height={height}
                fontSize={headerFontSize}
                icon={Zap}
                title="Actions"
              />
            )}
            rows={actions}
          />
        );
      })()}
    </svg>
  );
}
