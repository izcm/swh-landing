import {
  alignCenter,
  LineChart,
  paddedBox,
  stackWithGaps,
  ThreeBoxDiagram,
  trendAngle,
  WindowDots,
  WindowStack,
  windowStackLayout,
} from "@/lib/svg";
import { TrendRow } from "./left/TrendRow";

export function ActDiagram() {
  return (
    <ThreeBoxDiagram
      // viewbox
      viewboxWidth={650}
      viewboxHeight={300}
      // padding and gaps
      paddingUnits={0}
      gapUnits={0}
      // box ratios
      leftBoxSize={0.32}
      rightBoxSize={0.32}
      // boxs' contents
      left={({ width, height, unit }) => {
        const stackFill = "oklch(from var(--accent-ink) calc(l - 0.03) c h)";

        const stackLayout = windowStackLayout({
          groupWidth: width,
          heightToWidthRatio: 1.2,
          angle: -0, // same tilt as Connect's angleA
          count: 2,
          gapX: unit * 0.6,
          gapY: unit * 0.6,
          side: "left",
        });

        const stackItemRadius = 4;

        const { offset: translateY } = alignCenter(
          height,
          stackLayout.stackHeight,
        );

        const contentBox = paddedBox(
          stackLayout.item.width,
          stackLayout.item.height,
          0.6,
          0.6,
        );

        const rowGap = unit * 0.3;
        const rowSpace = contentBox.contentHeight - rowGap;
        const rowSizes = [rowSpace * 0.28, rowSpace * 0.28];
        const rows = stackWithGaps(rowSizes, rowGap);

        const values = [0.2, 0.4, 0.1, 0.6, 0.2, 0.5];

        // background for the chart and the boxes: --accent-ink, a bit darker
        const boxFill = "oklch(from var(--accent-ink) calc(l - 0.02) c h)";
        // border for the chart and the boxes
        const boxStroke = "var(--accent-electric)";
        const boxStrokeWidth = 0.5;

        const rowContent = [
          <>
            <rect
              x={0}
              y={0}
              width={contentBox.contentWidth}
              height={rowSizes[0]}
              fill={boxFill}
              stroke={boxStroke}
              strokeWidth={boxStrokeWidth}
              rx={stackItemRadius}
            />
            <LineChart
              width={contentBox.contentWidth}
              height={rowSizes[0]}
              values={values}
              color="var(--accent-electric)"
            />
          </>,
          <TrendRow
            width={contentBox.contentWidth}
            height={rowSizes[1]}
            gap={rowGap}
            angle={trendAngle(values, contentBox.contentWidth, rowSizes[0])}
            fill={boxFill}
            stroke={boxStroke}
            strokeWidth={boxStrokeWidth}
            radius={stackItemRadius}
          />,
        ];

        return (
          <WindowStack
            layout={stackLayout}
            y={translateY}
            fill={stackFill}
            radius={stackItemRadius}
            frontContent={
              <>
                <WindowDots headerHeight={24} />
                <g
                  transform={`translate(${contentBox.contentX}, ${contentBox.contentY + 16})`}
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
            }
          />
        );
      }}
      centerpiece={({ width, height }) => (
        <circle
          cx={width / 2}
          cy={height / 2}
          r={Math.min(width, height) / 4}
          fill="none"
          stroke="var(--accent)"
        />
      )}
      right={({ width, height }) => {
        return <g></g>;
      }}
    />
  );
}
