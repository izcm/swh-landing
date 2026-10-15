import { useId } from "react";

import {
  alignCenter,
  boundingBox,
  BoxShadow,
  paddedBox,
  Platform,
  platformCorners,
  pointOnLine,
  stackWithGaps,
  WindowStack,
  windowStackLayout,
  type WindowStyle,
} from "@/lib/svg";
import { ChartRow } from "./dashboard/ChartRow";
import { ElectricGlass } from "./ElectricGlass";
import { List } from "./dashboard/List";

export function ActDiagram() {
  // Connect's scale (784px / 650 units) at our 672px: 672 × 650 / 784 ≈ 557 units,
  // so strokes and radii come out as thick as Connect's. height keeps the 400 × 250 shape
  const viewboxWidth = 540;
  const viewboxHeight = 350;
  // same unit ThreeBoxDiagram handed out: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);
  // the stack's width: same as the old left box
  const stackWidth = viewboxWidth * 0.68;

  const stackLayout = windowStackLayout({
    groupWidth: stackWidth,
    // heightToWidthRatio: 0.7,
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

  // right: a platform with a glass card standing on it
  const rightBox = (() => {
    const rad = (deg: number) => (deg * Math.PI) / 180;

    // the platform: side edge first, front edge follows the windows' tilt
    const platform = (() => {
      // angleA: the side edges
      const angleA = 22;
      // same tilt as the windows: the front edge runs parallel to them
      const angleB = -stackLayout.angle;
      const lengthA = viewboxWidth * 0.22;
      // how far the side edge goes in x
      const sideX = lengthA * Math.cos(rad(angleA));
      // make the front edge long enough to go that same x
      const lengthB = sideX / Math.cos(rad(angleB));

      return { lengthA, lengthB, angleA, angleB, thickness: 6 };
    })();
    const corners = platformCorners(platform);
    const center = pointOnLine(corners.top.left, corners.top.right, 0.5);

    // the card: standing on the center, slanted along the side edge (angleA)
    const card = (() => {
      const angle = platform.angleA;
      const slope = Math.tan(rad(angle));
      const width = platform.lengthA * 1.12 * Math.cos(rad(angle));
      const height = platform.lengthA * 1.4;
      const nudge = 15; // pushes the card a bit back from the center

      // its top-left, so that its bottom middle (after skewY) lands on the center
      const x = center.x - width / 2 + nudge;
      const y = center.y - (height + (width / 2) * slope) + nudge;

      // its 4 corners after skewY, in the platform's coordinates
      const outline = [
        { x, y },
        { x: x + width, y: y + width * slope },
        { x: x + width, y: y + width * slope + height },
        { x, y: y + height },
      ];

      // padding inside the card: the rows go in the content box
      const box = paddedBox(width, height, 0.8, 1.2);

      return { x, y, width, height, angle, outline, box };
    })();

    // the real box around platform + card (the soft shadow stays outside it)
    const bounds = boundingBox([
      ...Object.values(corners.top),
      ...Object.values(corners.bottom),
      ...card.outline,
    ]);

    const groupWidth = bounds.width;
    const groupHeight = bounds.height;
    const translateX = viewboxWidth - groupWidth; // flush with the right edge
    const { offset: translateY } = alignCenter(viewboxHeight, groupHeight);

    return {
      groupWidth,
      groupHeight,
      translateX,
      translateY,
      // shifts the content so the bounding box's top-left is (0, 0)
      originX: -bounds.x,
      originY: -bounds.y,
      platform,
      corners,
      center,
      card,
    };
  })();

  // rows that show `act` actions, filling the card's content box
  const cardRows = (() => {
    const { contentX, contentY, contentWidth, contentHeight } =
      rightBox.card.box;
    const count = 3;
    const gap = unit * 0.3;
    // count rows + (count - 1) gaps fill the content height
    const rowHeight = (contentHeight - gap * (count - 1)) / count;
    const items = stackWithGaps(
      Array.from({ length: count }, () => rowHeight),
      gap,
    );

    return {
      translateX: contentX,
      translateY: contentY,
      width: contentWidth,
      rowHeight,
      items,
    };
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
        layout={stackLayout}
        y={translateY}
        radius={radius}
        strokeWidth={0.8}
        backOpacity={0.6}
        windowStyles={windowStyles}
        frontContent={frontContent}
      />
      {/* right box: placed by its real bounding box */}
      <g
        transform={`translate(${rightBox.translateX}, ${rightBox.translateY})`}
      >
        {(() => {
          const {
            groupWidth,
            groupHeight,
            originX,
            originY,
            platform,
            corners,
            center,
            card,
          } = rightBox;
          const { bottom } = corners;

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
              {/* content shifted so the bounding box's top-left is (0, 0) */}
              <g transform={`translate(${originX}, ${originY})`}>
                {/* drawn first, so the platform sits on top of it */}
                <BoxShadow
                  corners={[
                    bottom.left,
                    bottom.back,
                    bottom.right,
                    bottom.front,
                  ]}
                  drop={40}
                />
                {/* bobs up and down; the shadow stays put and shrinks in step
                    (both default to 4s, no delay) */}
                <g className="float-bob">
                  <Platform {...platform} grid={{ across: 5, along: 5 }} />
                  {/* the card: glass, slanted by skewY */}
                  <g
                    transform={`translate(${card.x}, ${card.y}) skewY(${card.angle})`}
                  >
                    <ElectricGlass
                      width={card.width}
                      height={card.height}
                      radius={radius}
                      strokeWidth={1}
                    />
                    {(() => {
                      const {
                        translateX,
                        translateY,
                        width,
                        rowHeight,
                        items,
                      } = cardRows;

                      return (
                        <g
                          transform={`translate(${translateX}, ${translateY})`}
                        >
                          {items.starts.map((rowY, i) => (
                            <g key={i} transform={`translate(0, ${rowY})`}>
                              <ElectricGlass
                                width={width}
                                height={rowHeight}
                                radius={radius}
                                strokeWidth={0.8}
                              />
                            </g>
                          ))}
                        </g>
                      );
                    })()}
                  </g>
                  {/* debug: the platform's center */}
                  <circle
                    className="svg-debug"
                    cx={center.x}
                    cy={center.y}
                    r={3}
                    fill="hotpink"
                  />
                </g>
              </g>
            </>
          );
        })()}
      </g>
    </svg>
  );
}
