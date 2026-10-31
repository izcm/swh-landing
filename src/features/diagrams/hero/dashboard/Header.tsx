import { alignCenter, alignEnd, WindowDots } from "@/lib/svg";

// an outlined pill on the left and the window dots on the right, paddingX in
// from the sides, and a line along the bottom across the whole width.
// drawn from (0, 0)
export function Header({
  width,
  height,
  paddingX,
}: {
  width: number; // the header row's width
  height: number; // the header row's height
  paddingX: number; // the pill's and the dots' distance from the sides
}) {
  const pillHeight = height * 0.2;
  const { offset: pillY } = alignCenter(height, pillHeight);

  const content = {
    x: paddingX,
    y: pillY,
    width: width - paddingX * 2,
    height: pillHeight,
  };

  const tubeWidth = content.width * 0.15;
  const dotRadius = content.height / 2;
  const dotGap = dotRadius * 2;
  const dotsWidth = dotRadius * 2 * 3 + dotGap * 2; // WindowDots draws three
  const { offset: dotsX } = alignEnd(content.width, dotsWidth);

  return (
    <>
      <g transform={`translate(${content.x}, ${content.y})`}>
        <rect
          width={tubeWidth}
          height={content.height}
          rx={content.height / 2}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={0.5}
        />
        <g transform={`translate(${dotsX}, 0)`}>
          <WindowDots height={content.height} radius={dotRadius} gap={dotGap} />
        </g>
      </g>

      {/* border bottom, the whole width */}
      <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke="var(--accent-dim)"
        strokeWidth={0.5}
      />
    </>
  );
}
