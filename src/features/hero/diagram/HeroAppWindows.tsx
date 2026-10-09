import {
  accentSeries,
  alignCenter,
  alignEnd,
  paddedBox,
  spaceBetween,
} from "@/lib/svg/helpers";
import { WindowDots } from "@/lib/svg/window/AppWindow";
import { WindowStack } from "@/lib/svg/window/WindowStack";
import { windowStackLayout } from "@/lib/svg/window/windowStackLayout";
import { BarRow } from "./BarRow";

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
  const gapX = 25;
  const gapY = 35;
  const heightToWidthRatio = 0.8;
  const dotsHeaderHeight = 24;

  const windowStack = windowStackLayout({
    groupWidth: width,
    groupHeight: height,
    angle,
    count,
    gapX,
    gapY,
    side: "right",
    heightToWidthRatio,
  });

  // stack's bottom on the box's bottom
  const { offset: stackY } = alignEnd(height, windowStack.stackHeight);

  const contentBox = paddedBox(
    windowStack.item.width,
    windowStack.item.height - dotsHeaderHeight,
    1,
  );

  const horizontalBars = (() => {
    const groupWidth = contentBox.contentWidth * 0.48;
    const groupHeight = contentBox.contentHeight;

    const { offset: translateY } = alignCenter(
      contentBox.contentHeight,
      groupHeight,
    );

    // const { offset: translateX } = alignCenter(
    //   contentBox.contentWidth,
    //   groupWidth,
    // );

    return {
      groupWidth,
      groupHeight,
      translateY,
      translateX: 0,
    };
  })();

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        className="svg-debug-haw"
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
        y={stackY}
        layout={windowStack}
        frontContent={
          <>
            <WindowDots headerHeight={dotsHeaderHeight} />
            {/* todo: dont hardcode - 10 do this instead: paddedbox should accept both paddingX and paddingY  */}
            <g
              transform={`translate(${contentBox.contentX}, ${contentBox.contentY + dotsHeaderHeight - 8})`}
            >
              <rect
                className="svg-debug-haw"
                x={0}
                y={0}
                width={contentBox.contentWidth}
                height={contentBox.contentHeight}
                fill="none"
                stroke="#aab4e6" // lavender
                strokeWidth={0.75}
                strokeDasharray="6 4"
              />

              {/* horizontal bars: everything inside starts at the bars box's top-left */}
              <g
                transform={`translate(${horizontalBars.translateX}, ${horizontalBars.translateY})`}
              >
                {(() => {
                  const rowHeight = contentBox.unit;

                  // how full each tube is (0..1), one array per group
                  const amounts = [0.6, 0.85, 0, 0.7, 0.5];
                  const groups = [amounts.slice(0, 3), amounts.slice(3)];

                  const rowGap = rowHeight * 0.9; // same gap as now
                  const groupGap = rowHeight * 2; // space between the groups

                  // a group's height: its rows + the gaps between them
                  const groupHeight = (rows: number) =>
                    rows * rowHeight + (rows - 1) * rowGap;

                  // each group's top y, and how many rows come before it
                  // (so the tube colors keep going across groups)
                  const groupStarts = groups.map((_, g) => {
                    const before = groups.slice(0, g);
                    return {
                      y: before.reduce(
                        (sum, rows) =>
                          sum + groupHeight(rows.length) + groupGap,
                        0,
                      ),
                      firstRow: before.reduce(
                        (sum, rows) => sum + rows.length,
                        0,
                      ),
                    };
                  });

                  return groups.map((amounts, g) => (
                    <g key={g} transform={`translate(0, ${groupStarts[g].y})`}>
                      {/* divider, in the middle of the gap above this group */}
                      {g > 0 && (
                        <line
                          x1={0}
                          y1={-groupGap / 2}
                          x2={horizontalBars.groupWidth}
                          y2={-groupGap / 2}
                          stroke="var(--accent-faint)"
                          strokeWidth={1}
                        />
                      )}
                      {amounts.map((amount, r) => {
                        const i = groupStarts[g].firstRow + r;
                        return (
                          <g
                            key={r}
                            // spread the group's rows from its top to its bottom
                            transform={`translate(0, ${spaceBetween({
                              index: r,
                              itemCount: amounts.length,
                              itemSize: rowHeight,
                              start: 0,
                              end: groupHeight(amounts.length),
                            })})`}
                          >
                            <BarRow
                              rowHeight={rowHeight}
                              width={horizontalBars.groupWidth}
                              fill={amount}
                              trackColor="var(--accent-faint)"
                              trackOpacity={1}
                              fillColor={accentSeries[i % accentSeries.length]}
                              fillOpacity={0.75}
                              radius={2}
                            />
                          </g>
                        );
                      })}
                    </g>
                  ));
                })()}
                <rect
                  className="svg-debug-haw"
                  x={0}
                  y={0}
                  width={horizontalBars.groupWidth}
                  height={horizontalBars.groupHeight}
                  fill="none"
                  stroke="#aab4e6" // lavender
                  strokeWidth={0.75}
                  strokeDasharray="6 4"
                />
              </g>
            </g>
          </>
        }
      />
    </g>
  );
}
