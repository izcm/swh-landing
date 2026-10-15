import { useId } from "react";

import {
  alignCenter,
  alignEnd,
  cardPlatformLayout,
  paddedBox,
  WindowStack,
  windowStackLayout,
  type WindowStyle,
} from "@/lib/svg";
import { DashboardContent } from "./dashboard/DashboardContent";
import { FloatingMenu } from "./platform/FloatingMenu";

export function ActDiagram() {
  // Connect's scale (784px / 650 units) at our 672px: 672 × 650 / 784 ≈ 557 units,
  // so strokes and radii come out as thick as Connect's. height keeps the 400 × 250 shape
  const viewboxWidth = 540;
  const viewboxHeight = 370;
  // same unit ThreeBoxDiagram handed out: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);
  // corner radius of the windows
  const radius = 3;

  // chart background: accent at the top, fading to transparent at the bottom
  const chartGradientId = useId();

  // left: the dashboard, a stack of tilted windows
  const dashboard = (() => {
    const stackLayout = windowStackLayout({
      // the stack's width: same as the old left box
      groupWidth: viewboxWidth * 0.68,
      heightToWidthRatio: 0.72,
      angle: -15,
      count: 3,
      gapX: unit * 0.35,
      gapY: unit * 0.35,
      side: "left",
    });

    // per-window tweaks on top of the layout, front first ([0] = front)
    const windowStyles: WindowStyle[] = (() => {
      const { gapX, gapY, item } = stackLayout;
      return [
        {},
        {
          width: item.width * 0.875,
          height: item.height * 1.06,
          x: gapX * 3,
          y: gapY + item.height - item.height * 1.06,
        }, // middle window
      ];
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

    return { stackLayout, windowStyles, translateY, frontContent };
  })();

  // right: the platform with the card, placed by its real bounding box
  const floatingMenu = (() => {
    const layout = cardPlatformLayout({
      size: viewboxWidth * 0.25,
      angleA: 22,
      // same tilt as the windows: the platform's front edge runs parallel to them
      angleB: -dashboard.stackLayout.angle,
      thickness: 6,
      cardSize: { width: 1, height: 1.3 },
      spanBToARatio: 0.85,
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
      overflow="visible"
      // 557 units at up to 672px ≈ 1.2px per unit, same as Connect. centered
      className="block max-w-2xl mx-auto"
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

      <WindowStack
        layout={dashboard.stackLayout}
        y={dashboard.translateY}
        radius={radius}
        strokeWidth={0.8}
        backOpacity={0.6}
        windowStyles={dashboard.windowStyles}
        frontContent={dashboard.frontContent}
      />

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
