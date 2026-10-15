import { Shuffle, type LucideIcon } from "lucide-react";

import {
  alignCenter,
  Tube,
  glyphStrokeLucide,
  paddedBox,
  stackWithGaps,
  ThreeBoxDiagram,
  WindowStack,
  windowStackLayout,
} from "@/lib/svg";
import { connectLayout } from "./geometry/layout";
import { Nodes } from "./nodes/Nodes";

export function ConnectorIcon({
  r,
  x,
  y,
  icon: Icon,
}: {
  r: number;
  x: number;
  y: number;
  icon: LucideIcon;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        cx={0}
        cy={0}
        r={r}
        fill="var(--accent-ink)"
        stroke="var(--accent-electric)"
        strokeWidth={0.5}
      />
      <Icon
        x={-(r * 0.5)}
        y={-(r * 0.5)}
        size={r}
        strokeWidth={glyphStrokeLucide(r, 1.5)}
        stroke="var(--accent-glow)"
      />
    </g>
  );
}
export function ConnectDiagram() {
  // const layout =
  return (
    <ThreeBoxDiagram
      // viewbox
      viewboxWidth={650}
      viewboxHeight={250}
      // padding and gaps
      paddingUnits={0}
      gapUnits={0}
      // box ratios
      leftBoxSize={0.3}
      rightBoxSize={0.35}
      // boxs' contents
      left={({ width, height, unit }) => (
        <Nodes height={height} layout={connectLayout({ width, unit })} />
      )}
      centerpiece={({ width, height, unit }) => (
        <ConnectorIcon
          r={unit * 1.5}
          x={width * 0.55}
          y={height * 0.5}
          icon={Shuffle}
        />
      )}
      right={({ width, height, unit }) => {
        const layout = connectLayout({ width, unit });

        const stackLayout = windowStackLayout({
          groupWidth: width,
          heightToWidthRatio: 0.8,
          angle: layout.card.angles.angleA,
          count: 2,
          gapX: 15,
          gapY: 15,
          side: "right",
        });

        const { offset: translateY } = alignCenter(
          height,
          stackLayout.stackHeight,
        );

        const contentBox = paddedBox(
          stackLayout.item.width,
          stackLayout.item.height,
          1,
          1,
        );

        const columnCount = 3;
        const columnSize = contentBox.contentWidth / columnCount;

        const columns = stackWithGaps(
          Array.from({ length: columnCount }, () => columnSize),
          0,
        );

        // rows: contentHeight is 10 units, 6 × 0.8 + 5 × 1 = 9.8 fits
        const rowCount = 7;
        const pillHeight = contentBox.unit * 0.45;
        const rowGap = contentBox.unit;
        const rows = stackWithGaps(
          Array.from({ length: rowCount }, () => pillHeight),
          rowGap,
        );

        // space between a column's left edge and its pills
        const pillInset = contentBox.unit * 0.25;
        const pillMaxWidth = columnSize - pillInset * 2;
        // how wide each pill is (0..1 of pillMaxWidth), one array per column
        const pillWidths = [
          [0.6, 0.8, 0.55, 0.7, 0.8, 0.6, 0.75],
          [0.65, 0.65, 0.8, 0.6, 0.8, 0.6, 0.7],
          [0.6, 0.8, 0.6, 0.65, 0.8, 0.6, 0.8],
        ];
        // shades of --accent-electric and --accent-deep, brightest first.
        // l = lightness, c = chroma (how colorful), h = hue
        const pillColors = [
          // 0: electric, lighter + a bit toward cyan
          "oklch(from var(--accent-electric) calc(l + 0.08) calc(c - 0.06) calc(h - 10))",
          // 1: electric as is
          "oklch(from var(--accent-electric) l c h)",
          // 2: deep as is
          "oklch(from var(--accent-deep) l c h)",
          // 3: deep, darker
          "oklch(from var(--accent-deep) calc(l - 0.08) calc(c * 0.85) h)",
          // 4: deep, darkest + greyer
          "oklch(from var(--accent-deep) calc(l - 0.16) calc(c * 0.6) h)",
        ];
        // which pillColors shade each pill gets, one array per column
        const pillShades = [
          [1, 0, 2, 1, 0, 4, 2],
          [3, 4, 0, 3, 0, 1, 4],
          [4, 1, 4, 2, 1, 4, 0],
        ];

        // drawn inside the front window
        const frontContent = (
          <>
            <g
              transform={`translate(${contentBox.contentX}, ${contentBox.contentY})`}
            >
              {columns.starts.map((start, i) => {
                return (
                  <rect
                    key={i}
                    className="svg-debug"
                    x={start}
                    y={0}
                    width={columnSize}
                    height={contentBox.contentHeight}
                    fill="none"
                    stroke="purple" // lavender
                    strokeWidth={0.75}
                    strokeDasharray="6 4"
                  />
                );
              })}

              {/* row borders, in the middle of the gaps (none after the last row) */}
              {rows.dividers.map((y, i) => (
                <line
                  key={i}
                  x1={0}
                  y1={y}
                  x2={contentBox.contentWidth}
                  y2={y}
                  stroke="var(--accent-faint)"
                  opacity={0.2}
                  strokeWidth={1}
                />
              ))}

              {/* column borders, between the columns (none on the outer edges) */}
              {columns.dividers.map((x, i) => (
                <line
                  key={i}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={contentBox.contentHeight}
                  stroke="var(--accent-faint)"
                  opacity={0.2}
                  strokeWidth={1}
                />
              ))}

              {/* pills: x from the column, y from the row */}
              {columns.starts.map((columnX, c) =>
                rows.starts.map((rowY, r) => (
                  <Tube
                    key={`${c}-${r}`}
                    x={columnX + pillInset}
                    y={rowY}
                    width={pillMaxWidth}
                    height={pillHeight}
                    level={pillWidths[c][r]}
                    fill={pillColors[pillShades[c][r]]}
                    fillOpacity={0.75}
                  />
                )),
              )}
            </g>
          </>
        );

        return (
          <WindowStack
            layout={stackLayout}
            y={translateY}
            radius={3}
            strokeWidth={0.8}
            backOpacity={0.6}
            frontContent={frontContent}
          />
        );
      }}
    />
  );
}
