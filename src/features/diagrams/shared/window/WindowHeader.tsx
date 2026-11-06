import { alignCenter, alignEnd } from "@/lib/svg";
import { WindowDots } from "./WindowDots";

// a window's header strip: an outlined tube on the left, window
// dots on the right, and a line along its bottom. drawn from (0, 0)
export function WindowHeader({
  width,
  height,
  itemHeight,
  contentX,
}: {
  width: number;
  height: number;
  itemHeight: number; // how tall the tube and dots are
  contentX: number; // gap from the left and right edges
}) {
  const { offset: itemY } = alignCenter(height, itemHeight);

  const tube = {
    x: contentX,
    width: width * 0.2,
  };

  const dots = (() => {
    const radius = itemHeight * 0.5;
    const gap = radius * 2;
    const dotsWidth = radius * 2 * 3 + gap * 2;
    const { offset: x } = alignEnd(width - contentX, dotsWidth);

    return { radius, gap, x };
  })();

  return (
    <g>
      <rect
        x={tube.x}
        y={itemY}
        width={tube.width}
        height={itemHeight}
        rx={itemHeight * 0.5}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={0.5}
      />

      <g transform={`translate(${dots.x}, ${itemY})`}>
        <WindowDots height={itemHeight} radius={dots.radius} gap={dots.gap} />
      </g>

      <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke="var(--accent-faint)"
        strokeWidth={1}
      />
    </g>
  );
}
