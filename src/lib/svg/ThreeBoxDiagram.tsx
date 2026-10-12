import type { ReactNode } from "react";
import { paddedBox, stackWithGaps } from "./logic";

// what each slot gets: its own size, plus the diagram's shared unit
export type Box = { width: number; height: number; unit: number };

// an svg split into three boxes side by side: left | centerpiece | right.
// the caller says how wide left and right are (0..1 of the content width);
// the centerpiece gets what's left. each slot draws inside its own box,
// starting at (0, 0) = that box's top-left
export function ThreeBoxDiagram({
  viewboxWidth,
  viewboxHeight,
  paddingUnits,
  gapUnits,
  leftBoxSize,
  rightBoxSize,
  left,
  centerpiece,
  right,
}: {
  viewboxWidth: number;
  viewboxHeight: number;
  paddingUnits: number; // space around the content, in units
  gapUnits: number; // space between the boxes, in units
  leftBoxSize: number; // 0..1 of the content width
  rightBoxSize: number; // 0..1 of the content width
  left: (box: Box) => ReactNode;
  centerpiece: (box: Box) => ReactNode;
  right: (box: Box) => ReactNode;
}) {
  const { contentX, contentY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    paddingUnits,
  );

  const gap = unit * gapUnits;
  const leftWidth = contentWidth * leftBoxSize;
  const rightWidth = contentWidth * rightBoxSize;
  const centerWidth = contentWidth - leftWidth - rightWidth - gap * 2;

  const widths = [leftWidth, centerWidth, rightWidth];
  const { starts } = stackWithGaps(widths, gap);
  const slots = [left, centerpiece, right];
  // debug colors, one per slot: left, centerpiece, right
  const debugColors = [
    "#d9c79c" /* sand */,
    "#9cc5a8" /* sage */,
    "#aab4e6" /* lavender */,
  ];

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`} overflow="visible">
      {/* everything inside starts at the content box's top-left */}
      <g transform={`translate(${contentX}, ${contentY})`}>
        {/* debug: box edges as plain lines, all drawn the same way (verticals
            top → bottom, horizontals left → right), so where two boxes share
            an edge their dashes land on the same spots instead of mixing */}
        <g
          className="svg-debug"
          stroke="#aab4e6" // lavender
          strokeWidth={0.75}
          strokeDasharray="6 4"
        >
          {/* each slot's top and bottom edge */}
          {starts.map((start, i) => (
            <g key={i}>
              <line x1={start} y1={0} x2={start + widths[i]} y2={0} />
              <line
                x1={start}
                y1={contentHeight}
                x2={start + widths[i]}
                y2={contentHeight}
              />
            </g>
          ))}
          {/* each slot's left and right edge */}
          {starts
            .flatMap((start, i) => [start, start + widths[i]])
            .map((x, i) => (
              <line key={i} x1={x} y1={0} x2={x} y2={contentHeight} />
            ))}
        </g>

        {slots.map((draw, i) => (
          <g key={i} transform={`translate(${starts[i]}, 0)`}>
            {/* debug: this slot's center */}
            <circle
              className="svg-debug"
              cx={widths[i] / 2}
              cy={contentHeight / 2}
              r={2}
              fill={debugColors[i]}
            />
            {draw({ width: widths[i], height: contentHeight, unit })}
          </g>
        ))}
      </g>
    </svg>
  );
}
