import {
  alignEnd,
  paddedBox,
  stackWithGaps,
  WindowStack,
  windowStackLayout,
} from "@/lib/svg";
import { ChartRow } from "@/features/story/diagrams/act/dashboard/ChartRow";
import { List } from "@/features/story/diagrams/act/dashboard/List";

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

  const windowStack = windowStackLayout({
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

  // act's dashboard (ChartRow + List) in the front window.
  // sized like act's: its unit is ~1/8.5 of its window's height
  const frontContent = (() => {
    const unit = windowStack.item.height / 8.5;
    const box = paddedBox(
      windowStack.item.width,
      windowStack.item.height,
      0.65,
      1,
    );
    const rowGap = unit * 0.4;
    const rowSpace = box.contentHeight - rowGap;
    const rowSizes = [rowSpace * 0.48, rowSpace * 0.52];
    const rows = stackWithGaps(rowSizes, rowGap);

    const rowContent = [
      <ChartRow
        width={box.contentWidth}
        height={rowSizes[0]}
        gap={rowGap}
        unit={unit}
        boxRadius={4}
        boxStrokeWidth={0.4}
      />,
      <List
        width={box.contentWidth * 0.6}
        height={rowSizes[1]}
        unit={unit}
        radius={6}
        rowCount={4}
      />,
    ];

    return (
      <g transform={`translate(${box.contentX}, ${box.contentY})`}>
        {rows.starts.map((rowY, i) => (
          <g key={i} transform={`translate(0, ${rowY})`}>
            {rowContent[i]}
          </g>
        ))}
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
      <WindowStack
        layout={windowStack}
        y={stackY}
        radius={3}
        strokeWidth={0.8}
        backOpacity={0.6}
        frontContent={frontContent}
      />
    </g>
  );
}
