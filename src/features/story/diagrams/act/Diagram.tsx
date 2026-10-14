import { useId } from "react";

import {
  alignCenter,
  BoxShadow,
  paddedBox,
  Platform,
  platformCorners,
  stackWithGaps,
  WindowStack,
  windowStackLayout,
  type WindowStyle,
} from "@/lib/svg";
import { ChartRow } from "./dashboard/ChartRow";
import { List } from "./dashboard/List";

export function ActDiagram() {
  // Connect's scale (784px / 650 units) at our 672px: 672 × 650 / 784 ≈ 557 units,
  // so strokes and radii come out as thick as Connect's. height keeps the 400 × 250 shape
  const viewboxWidth = 560;
  const viewboxHeight = 350;
  // same unit ThreeBoxDiagram handed out: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);
  // the stack's width: same as the old left box
  const stackWidth = viewboxWidth * 0.7;

  const stackLayout = windowStackLayout({
    groupWidth: stackWidth,
    // heightToWidthRatio: 0.7,
    angle: -11.5,
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

  // corner radius of the windows
  const radius = 3;

  const { offset: translateY } = alignCenter(
    viewboxHeight,
    stackLayout.stackHeight,
  );

  const contentBox = paddedBox(
    stackLayout.item.width,
    stackLayout.item.height,
    0.65,
    1,
  );

  const rowGap = unit * 0.4;
  const rowSpace = contentBox.contentHeight - rowGap;
  const rowSizes = [rowSpace * 0.48, rowSpace * 0.52];
  const rows = stackWithGaps(rowSizes, rowGap);

  // chart background: accent at the top, fading to transparent at the bottom
  const chartGradientId = useId();

  const rowContent = [
    <ChartRow
      width={contentBox.contentWidth}
      height={rowSizes[0]}
      gap={rowGap}
      unit={unit}
      boxRadius={4}
      boxStrokeWidth={0.4}
    />,

    <List
      width={contentBox.contentWidth * 0.6}
      height={rowSizes[1]}
      unit={unit}
      radius={radius}
      rowCount={4}
    />,
  ];

  // drawn inside the front window
  const frontContent = (
    <>
      {/* padding around the rows */}
      <g
        transform={`translate(${contentBox.contentX}, ${contentBox.contentY})`}
      >
        {rows.starts.map((rowY, i) => {
          return (
            <g transform={`translate(0, ${rowY})`}>
              <rect
                className="svg-debug"
                x={0}
                y={0}
                width={contentBox.contentWidth}
                height={rowSizes[i]}
                fill="none"
                stroke="#aab4e6" // lavender
                strokeWidth={0.75}
                strokeDasharray="6 4"
              />
              {rowContent[i]}
            </g>
          );
        })}
      </g>
    </>
  );

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
        layout={stackLayout}
        y={translateY}
        radius={radius}
        strokeWidth={0.8}
        backOpacity={0.6}
        windowStyles={windowStyles}
        frontContent={frontContent}
      />
      {(() => {
        const groupWidth = viewboxWidth * 0.4;

        // const groupWidth = viewboxWidth * 0.4;
        const groupHeight = viewboxHeight;

        const shape = (() => {
          const rad = (deg: number) => (deg * Math.PI) / 180;
          const angleA = 22;
          // the edge going up to the right follows the windows' tilt
          const angleB = -stackLayout.angle;
          const lengthB = viewboxWidth * 0.22;
          // same sideways reach as lengthB, so the front corner sits in the
          // middle and the platform faces us
          const lengthA =
            (lengthB * Math.cos(rad(angleB))) / Math.cos(rad(angleA));

          return { lengthA, lengthB, angleA, angleB, thickness: 6 };
        })();
        const { bottom } = platformCorners(shape);

        return (
          <>
            <rect
              className="svg-debug"
              x={0}
              y={0}
              width={groupWidth}
              height={groupHeight}
              fill="none"
              stroke="#aab4e6" // lavender
              strokeWidth={0.75}
              strokeDasharray="6 4"
            />
            <g
              transform={`translate(${viewboxWidth * 0.5 + 30}, ${groupHeight * 0.6})`}
            >
              {/* drawn first, so the platform sits on top of it */}
              <BoxShadow
                corners={[bottom.left, bottom.back, bottom.right, bottom.front]}
                drop={40}
              />
              {/* bobs up and down; the shadow stays put and shrinks in step
                  (both default to 4s, no delay) */}
              <g className="float-bob">
                <Platform {...shape} grid={{ across: 5, along: 5 }} />
              </g>
            </g>
          </>
        );
      })()}
    </svg>
  );
}
