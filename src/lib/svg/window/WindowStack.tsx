import type { ReactNode } from "react";
import { accentGlow, type Point } from "@/lib/svg/helpers";
import { AppWindow } from "./AppWindow";
import type { windowStackLayout } from "./windowStackLayout";

// app windows stacked back to front, skewed. back ones ghosted + faded,
// front one solid with a glow.
// frontContent: drawn inside the front window (e.g. <EditorCode />)
// children: drawn over the stack, in the same skewed coords (use layout.front
// to place things relative to the front window)
// x / y: where the stack's top-left goes in the parent
export function WindowStack({
  x = 0,
  y = 0,
  layout,
  frontContent,
  children,
}: Partial<Point> & {
  layout: ReturnType<typeof windowStackLayout>;
  frontContent?: ReactNode;
  children?: ReactNode;
}) {
  const { count, gapY, item, angle, windowX, toTop } = layout;

  return (
    <g
      transform={`translate(${x}, ${y}) skewY(${angle}) translate(0, ${toTop})`}
    >
      {/* transform={`translate(0, ${translateY}) skewY(${angle})`}> */}
      {/* drawn back to front: i = 0 is the furthest back, the last one is in front */}
      {Array.from({ length: count }).map((_, i) => {
        // 0 at the back → 1 at the front
        const depth = count > 1 ? i / (count - 1) : 1;
        // ghost panes are already see-through, so fade them less overall
        // to keep their borders readable
        const opacity = 0.6 + depth * 0.4;
        const isFront = i === count - 1;

        return (
          <g
            key={i}
            opacity={opacity}
            // front: quiet halo to lift it off the rest. back: big faint haze
            style={{
              filter: isFront ? accentGlow(4, 12) : accentGlow(2, 6),
            }}
          >
            <AppWindow
              x={windowX(i)}
              y={i * gapY}
              width={item.width}
              height={item.height}
              viewboxWidth={item.width}
              viewboxHeight={item.height}
              ghost={!isFront}
            >
              {isFront && frontContent}
            </AppWindow>
          </g>
        );
      })}

      {children}
    </g>
  );
}
