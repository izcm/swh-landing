import { alignEnd, cascadeLayout, paddedBox, WindowPane } from "@/lib/svg";
import { DashboardContent } from "@/features/diagrams/act/dashboard/DashboardContent";

// the right box: three app windows, tilted along the A edges, sitting on the
// box's bottom. x / y / width / height = the right box, from Diagram.tsx
export function HeroAppWindows({
  x,
  y,
  width,
  height,
  angle,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number; // the hero's angle A
}) {
  // knobs
  const count = 3;
  const gapX = 25; // unsure these or ones below
  const gapY = 35;

  // const gapX = 20; // unsure these or ones below
  // const gapY = 25;

  const heightToWidthRatio = 0.8;

  const windowStack = cascadeLayout({
    groupWidth: width,
    angle,
    count,
    gapX,
    gapY,
    side: "right",
    heightToWidthRatio,
  });

  // stack's bottom on the box's bottom
  const { offset: stackY } = alignEnd(height, windowStack.stackHeight);

  // act's dashboard in the front window, sized from the window itself
  const frontContent = (() => {
    const { width, height } = windowStack.item;
    const box = paddedBox(width, height, 0.65, 1);

    return (
      // doing 1.25 looks nicer with padding being top heavy
      <g transform={`translate(${box.contentX}, ${box.contentY * 1.25})`}>
        <DashboardContent
          width={box.contentWidth}
          height={box.contentHeight}
          radius={3}
        />
      </g>
    );
  })();

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        className="svg-debug"
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      {/* the windows: back to front, fading from 0.6 at the back */}
      <g transform={`translate(0, ${stackY}) ${windowStack.transform}`}>
        {windowStack.items.map((win, i) => (
          <g
            key={i}
            transform={`translate(${win.x}, ${win.y})`}
            opacity={0.6 + win.depth * 0.4}
          >
            <WindowPane width={win.width} height={win.height} radius={3} strokeWidth={0.8} />
            {win.isFront && frontContent}
          </g>
        ))}
      </g>
    </g>
  );
}
