import { useId } from "react";

import {
  alignCenter,
  alignEnd,
  cardPlatformLayout,
  cascadeLayout,
  paddedBox,
} from "@/lib/svg";
import { DashboardContent } from "./dashboard/DashboardContent";
import { FloatingMenu } from "./floating-menu/FloatingMenu";

export function ActDiagram() {
  // 540 units at our 672px ≈ 1.24px per unit, close to Connect's 784px / 650 units
  // ≈ 1.2px per unit, so strokes and radii come out about as thick as Connect's
  const viewboxWidth = 540;
  const viewboxHeight = 370;
  // same unit ThreeBoxDiagram handed out: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);
  // corner radius of the windows
  const radius = 3;

  // chart background: accent at the top, fading to transparent at the bottom
  const chartGradientId = useId();
  // the dashboard windows' look: an ink fade from the top, and a border that's
  // bright at the top and fades down
  const paneInkId = useId();
  const paneEdgeId = useId();

  // left: the dashboard, a stack of tilted windows
  const dashboard = (() => {
    const stackLayout = cascadeLayout({
      // the stack's width: same as the old left box
      groupWidth: viewboxWidth * 0.68,
      heightToWidthRatio: 0.72,
      angle: -15,
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

  // right: the platform with the card, placed by its real bounding box
  const floatingMenu = (() => {
    const angleA = 22; // the platform's side edge
    const layout = cardPlatformLayout({
      size: viewboxWidth * 0.25,
      angleA,
      // same tilt as the windows: the platform's front edge runs parallel to them
      angleB: -dashboard.stackLayout.angle,
      thickness: 6,
      cardSize: { width: 1, height: 1.3 },
      spanBToARatio: 0.8,
      cardAngle: angleA - 8, // a bit flatter than the A edge, so the card faces us more
      cardAt: { alongA: 0.5 + 0.15, alongB: 0.5 + 0.15 }, // one gridline further in the B direction
    });

    const translateX = viewboxWidth - layout.groupWidth; // flush with the right edge
    const { offset: centerY } = alignCenter(viewboxHeight, layout.groupHeight);
    const { offset: endY } = alignEnd(viewboxHeight, layout.groupHeight);
    const translateY = (centerY + endY) / 2; // halfway between centered and at the bottom

    return { layout, translateX, translateY };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      // 540 units at up to 672px ≈ 1.24px per unit, close to Connect. centered
      // overflow={"visible"}
      className="block max-w-2xl w-full mx-auto"
    >
      <defs>
        {/* top to bottom */}
        <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity={1} />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
        </linearGradient>
        {/* window fill: ink at the top, fading out toward the bottom */}
        <linearGradient id={paneInkId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-ink)" stopOpacity={0.9} />
          <stop offset="100%" stopColor="var(--accent-ink)" stopOpacity={0} />
        </linearGradient>
        {/* window border: electric, bright at the top and fading down */}
        <linearGradient id={paneEdgeId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--accent-electric)"
            stopOpacity={0.6}
          />
          <stop
            offset="100%"
            stopColor="var(--accent-electric)"
            stopOpacity={0.15}
          />
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
            {/* dark ground, the ink fade, a faint highlight along the top edge */}
            <rect
              width={win.width}
              height={win.height}
              rx={radius}
              fill="var(--ground)"
            />
            <rect
              width={win.width}
              height={win.height}
              rx={radius}
              fill={`url(#${paneInkId})`}
            />
            <line
              x1={radius}
              y1={1}
              x2={win.width - radius}
              y2={1}
              stroke="var(--accent-electric)"
              strokeOpacity={0.25}
              strokeWidth={0.6}
            />
            {/* lit edge: a 1px hairline, bright at the top and fading down */}
            <rect
              width={win.width}
              height={win.height}
              rx={radius}
              fill="none"
              stroke={`url(#${paneEdgeId})`}
              strokeWidth={1}
            />
            {win.isFront && dashboard.frontContent}
          </g>
        ))}
      </g>

      <g
        transform={`translate(${floatingMenu.translateX}, ${floatingMenu.translateY})`}
      >
        <FloatingMenu
          layout={floatingMenu.layout}
          radius={radius}
          rowGap={unit * 0.25}
        />
      </g>
    </svg>
  );
}
