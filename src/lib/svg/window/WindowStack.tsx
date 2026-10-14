import type { ReactNode } from "react";
import type { Point } from "../logic";
import type { WindowStyle } from "./AppWindow";
import { WindowBackground } from "./WindowBackground";
import type { windowStackLayout } from "./windowStackLayout";

// windows stacked back to front, skewed, fading from backOpacity at the back
// up to 1 at the front. frontContent is drawn inside the front window.
// x / y: where the stack's top-left goes in the parent
export function WindowStack({
  x = 0,
  y = 0,
  layout,
  radius,
  strokeWidth,
  backOpacity,
  windowStyles = [],
  frontContent,
}: Partial<Point> & {
  layout: ReturnType<typeof windowStackLayout>;
  radius: number; // every window's corner radius
  strokeWidth: number; // every window's border thickness
  backOpacity: number; // the back window's opacity; fades up to 1 at the front
  // one style per window, front first ([0] = front). overrides x / y / width /
  // height / radius / strokeWidth. empty = all windows as the layout says
  windowStyles?: WindowStyle[];
  frontContent?: ReactNode;
}) {
  const { count, gapY, item, angle, windowX, toTop } = layout;

  return (
    <g
      transform={`translate(${x}, ${y}) skewY(${angle}) translate(0, ${toTop})`}
    >
      {Array.from({ length: count }).map((_, i) => {
        // 0 at the back → 1 at the front
        const depth = count > 1 ? i / (count - 1) : 1;
        const isFront = i === count - 1;
        // layout values are the defaults; this window's style wins
        const win = {
          x: windowX(i),
          y: i * gapY,
          width: item.width,
          height: item.height,
          radius,
          strokeWidth,
          // drawn back to front, but windowStyles is listed front first
          ...windowStyles[count - 1 - i],
        };

        return (
          <g
            key={i}
            opacity={backOpacity + depth * (1 - backOpacity)}
            transform={`translate(${win.x}, ${win.y})`}
          >
            <WindowBackground
              width={win.width}
              height={win.height}
              radius={win.radius}
              strokeWidth={win.strokeWidth}
            />
            {isFront && frontContent}
          </g>
        );
      })}
    </g>
  );
}
