import { useId } from "react";
import {
  accentGlow,
  alignCenter,
  paddedBox,
  spaceBetween,
} from "@/lib/svg/helpers";
import { EditorCode } from "./editor/EditorCode";
import { AppWindow, WindowDots } from "@/lib/svg/window/AppWindow";
import { AccentBarGradient } from "@/lib/svg/window/AccentBarGradient";

export function AISvg() {
  const viewboxWidth = 600;
  const viewboxHeight = 400;

  const { paddingX, paddingY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    0.5,
  );

  // header strip at the top of each editor window (dots sit in it, code starts below it)
  const editorHeaderHeight = unit * 0.8;

  // preserve CodeEditor's 300:200 aspect ratio
  const editorBox = (() => {
    const width = contentWidth * 0.8;
    const skew = 10;

    const skewSlope = Math.tan((skew * Math.PI) / 180);

    const itemCount = 3;
    const gapX = 45;
    const gapY = (gapX * 2) / 3;

    const itemWidth = width - gapX * (itemCount - 1);
    const itemHeight = (itemWidth * 2) / 3;

    // highest point: back editor's top-right corner from origin (a distance thats why we add it to bottom)
    const topLift = itemWidth * skewSlope;
    // // lowest point: front editor's bottom-left corner
    const bottom = itemHeight + (itemCount - 1) * (gapY - gapX * skewSlope);
    const resolvedHeight = topLift + bottom;

    const { offset: translateY, absoluteCenter: resolvedCenterY } = alignCenter(
      contentHeight,
      resolvedHeight,
    );

    return {
      // whole stack, as it sits in the content area after skewing
      width,
      resolvedHeight,
      translateY,
      resolvedCenterY,

      skew: { angle: skew, addedHeight: topLift },
      stack: { count: itemCount, gapX, gapY },
      item: { width: itemWidth, height: itemHeight },
    };
  })();

  // AI suggestion panel, placed relative to the front editor (in the tilted group's coords)
  const suggestionGradientId = useId();
  const suggestion = (() => {
    const { count, gapX, gapY } = editorBox.stack;
    const front = { x: (count - 1) * gapX, y: (count - 1) * gapY };

    // starts a quarter in from the front editor's left and sticks out past its right edge
    const x = front.x + editorBox.item.width * 0.28;
    const y = front.y + editorBox.item.height * 0.42;
    const width = editorBox.item.width * 0.82;
    const height = editorBox.item.height * 0.4;

    const padding = height * 0.22;
    const barHeight = 6;

    // three suggested lines, spread over the panel's inner height
    const lineShapes = [
      { indent: 0, width: 0.72 },
      { indent: 12, width: 0.42 },
      { indent: 12, width: 0.3 },
    ];
    const innerWidth = width - padding * 2;
    const lines = lineShapes.map((shape, i) => ({
      indent: shape.indent,
      width: innerWidth * shape.width,
      y: spaceBetween({
        index: i,
        itemCount: lineShapes.length,
        itemSize: barHeight,
        start: y + padding,
        end: y + height - padding,
      }),
    }));

    // dashed wire from the panel's right edge out to a node
    const node = { x: x + width + 40, y: y + height / 2 };

    return { x, y, width, height, padding, barHeight, lines, node };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      // className="w-full h-auto"
    >
      {/* <rect
        x={0}
        y={0}
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="red"
      /> */}

      <g transform={`translate(${paddingX}, ${paddingY})`}>
        {/* debug: editor's skewed bounding box */}
        {/* <rect
          x={0}
          y={editorBox.translateY}
          width={editorBox.width}
          height={editorBox.resolvedHeight}
          fill="none"
          stroke="red"
        /> */}

        <g
          transform={`translate(0, ${editorBox.translateY + editorBox.skew.addedHeight}) skewY(${-editorBox.skew.angle})`}
        >
          {/* drawn back to front: i = 0 is the furthest back, the last one is in front */}
          {Array.from({ length: editorBox.stack.count }).map((_, i) => {
            const { count, gapX, gapY } = editorBox.stack;

            // 0 at the back → 1 at the front
            const depth = count > 1 ? i / (count - 1) : 1;
            // ghost panes are already see-through, so fade them less overall
            // to keep their borders readable
            const opacity = 0.6 + depth * 0.4;

            // only the front editor shows code
            const isFront = i === count - 1;

            return (
              <g
                key={i}
                opacity={opacity}
                // front: quiet halo to lift it off the rest. back: big faint haze, a bit out of focus
                style={{
                  filter: isFront ? accentGlow(4, 12) : accentGlow(2, 6),
                }}
              >
                <AppWindow
                  x={i * gapX}
                  y={i * gapY}
                  width={editorBox.item.width}
                  height={editorBox.item.height}
                  viewboxWidth={300}
                  viewboxHeight={200}
                  ghost={!isFront}
                >
                  <WindowDots headerHeight={editorHeaderHeight} />
                  {isFront && (
                    <EditorCode
                      width={300}
                      height={200}
                      headerHeight={editorHeaderHeight}
                    />
                  )}
                </AppWindow>
              </g>
            );
          })}

          {/* AI suggestion: glass panel over the front editor's lower right, wired out to a node */}
          <g>
            <rect
              x={suggestion.x}
              y={suggestion.y}
              width={suggestion.width}
              height={suggestion.height}
              rx="var(--rx-node-md)"
              fill="oklch(from var(--accent) 0.18 0.06 h)"
              fillOpacity={0.8}
              stroke="color-mix(in oklab, var(--accent) 40%, transparent)"
              strokeWidth={0.8}
              style={{ filter: accentGlow(6, 18) }}
            />

            <defs>
              <AccentBarGradient id={suggestionGradientId} />
            </defs>

            {suggestion.lines.map((line, i) => (
              <rect
                key={i}
                x={suggestion.x + suggestion.padding + line.indent}
                y={line.y}
                width={line.width}
                height={suggestion.barHeight}
                rx={suggestion.barHeight / 2}
                fill={`url(#${suggestionGradientId})`}
                style={{
                  filter:
                    "drop-shadow(0 0 2.5px color-mix(in oklab, var(--accent) 45%, transparent))",
                }}
              />
            ))}

            <line
              x1={suggestion.x + suggestion.width}
              y1={suggestion.node.y}
              x2={suggestion.node.x}
              y2={suggestion.node.y}
              stroke="var(--accent)"
              strokeWidth={1}
              strokeDasharray="3 4"
              opacity={0.6}
            />

            {/* node: a small diamond */}
            <rect
              x={suggestion.node.x - 4}
              y={suggestion.node.y - 4}
              width={8}
              height={8}
              transform={`rotate(45 ${suggestion.node.x} ${suggestion.node.y})`}
              fill="var(--accent)"
              style={{
                filter:
                  "drop-shadow(0 0 4px color-mix(in oklab, var(--accent) 65%, transparent))",
              }}
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
