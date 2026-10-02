import { diagramLayout } from "@/lib/svg/helpers";

export function HeroDiagram() {
  const viewboxWidth = 700;
  const viewboxHeight = 500;

  const { contentX, contentY, contentWidth, contentHeight } = diagramLayout(
    viewboxWidth,
    viewboxHeight,
    0.5, // large viewbox gives too much padding here
  );

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      {/* debug: content box (inside the padding) */}
      <rect
        x={contentX}
        y={contentY}
        width={contentWidth}
        height={contentHeight}
        fill="none"
        stroke="red"
      />
    </svg>
  );
}
