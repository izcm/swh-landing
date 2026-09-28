export function AISvg() {
  const viewboxWidth = 600;
  const viewboxHeight = 400;

  const unit = viewboxHeight / 12;
  const outerPadding = unit / 2;

  const contentHeight = viewboxHeight - outerPadding * 2;
  const contentWidth = viewboxWidth - outerPadding * 2;

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

    const { translateY, absoluteCenterY: resolvedCenterY } = centerInParent(
      contentHeight,
      resolvedHeight,
      outerPadding,
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
      y: spaceBetween(
        i,
        lineShapes.length,
        barHeight,
        y + padding,
        y + height - padding,
      ),
    }));

    // dashed wire from the panel's right edge out to a node
    const node = { x: x + width + 40, y: y + height / 2 };

    return { x, y, width, height, padding, barHeight, lines, node };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="w-full h-auto"
    >
      {/* <rect
        x={0}
        y={0}
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="red"
      /> */}

      <g transform={`translate(${outerPadding}, ${outerPadding})`}>
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
                <EditorWindow
                  x={i * gapX}
                  y={i * gapY}
                  width={editorBox.item.width}
                  height={editorBox.item.height}
                  ghost={!isFront}
                >
                  {isFront && <EditorCode />}
                </EditorWindow>
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

import { useEffect, useId, useState, type ReactNode } from "react";
import { centerInParent, spaceBetween } from "../../../lib/svg-helpers";

// shared layout for EditorWindow and EditorCode, in the window's own 300×200 viewBox
const editor = (() => {
  const viewboxWidth = 300;
  const viewboxHeight = 200;

  const unit = viewboxHeight / 12;

  // maybe this should be moved out of css and into
  // code instead since we need it for calculations
  const strokeWidth = 0.4;

  // strokes are centered on the edge, so pull the rect in by half on each side
  const inset = strokeWidth / 2;

  const contentWidth = viewboxWidth - inset * 2;
  const contentHeight = viewboxHeight - inset * 2;

  const headerHeight = unit * 2;
  const bottomHeight = unit * 1.5;

  return {
    viewboxWidth,
    viewboxHeight,
    unit,
    strokeWidth,
    inset,
    contentWidth,
    contentHeight,
    headerHeight,
    bottomHeight,
  };
})();

// bright at the start, fading out to the right — used by the window dots and the code bars
function AccentBarGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop
        offset="0%"
        style={{
          stopColor: "color-mix(in oklab, var(--accent) 50%, #1d4ed8)",
        }}
      />

      <stop
        offset="100%"
        style={{
          stopColor: "color-mix(in oklab, var(--accent) 75%, #1d4ed8)",
        }}
      />
    </linearGradient>
  );
}

// soft accent glow, same recipe as the suggestion panel's bars
// glow colour: the accent's own hue, kept saturated (oklch chroma 0.12) at mid lightness. plain --accent is
// light enough that a soft halo of it reads as white-ish mist on the dark background
const accentGlow = (blur: number, strength: number) =>
  `drop-shadow(0 0 ${blur}px oklch(from var(--accent) 0.55 0.12 h / ${strength}%))`;

type EditorWindowProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // see-through, slightly lighter "glass" pane for editors in the background
  ghost?: boolean;
  children?: ReactNode;
};

// the editor frame: background, border and the three header dots.
// children are drawn inside it, in the same 300×200 viewBox
export function EditorWindow({
  x = 0,
  y = 0,
  width = 300,
  height = 200,
  ghost = false,
  children,
}: EditorWindowProps) {
  const gradientId = useId();
  const dotGradientId = `${gradientId}-dot`;

  const nodeStyle = {
    // ghost: tinted toward the accent and mostly transparent, so what's behind shows through
    fill: ghost
      ? "oklch(from var(--accent) 0.18 0.06 h)"
      : "var(--node-color-deep)",
    fillOpacity: ghost ? 0.3 : 1,
    stroke: `url(#${gradientId})`,
    strokeWidth: editor.strokeWidth,
  };

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${editor.viewboxWidth} ${editor.viewboxHeight}`}
      overflow="visible"
    >
      <defs>
        <filter id="tinyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop
            offset="55%"
            style={{
              stopColor: "color-mix(in oklab, var(--accent) 70%, #1d4ed8)",
            }}
            stopOpacity="1"
          />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </linearGradient>

        <AccentBarGradient id={dotGradientId} />
      </defs>

      {/* background */}
      <rect
        x={editor.inset}
        y={editor.inset}
        width={editor.contentWidth}
        height={editor.contentHeight}
        rx="var(--rx-node-md)"
        // filter="url(#tinyGlow)"
        {...nodeStyle}
      />

      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={12 + i * 14}
          cy={editor.contentHeight / 16}
          r={3}
          fill={`url(#${dotGradientId})`}
          opacity={1 - (i * 0.2 + 0.2)}
          style={{ filter: accentGlow(2, 45) }}
          // filter="drop-shadow(0 0 1px color-mix(in oklab, var(--accent) 35%, transparent))"
        />
      ))}

      {children}
    </svg>
  );
}

// fake code: line numbers + animated bars. meant to be a child of EditorWindow
export function EditorCode() {
  const [animation, setAnimation] = useState(0);

  useEffect(() => {
    let id: number;

    function animate(time: number) {
      setAnimation(Math.sin(time / 1000));
      id = requestAnimationFrame(animate);
    }

    id = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(id);
  }, []);

  const barGradientId = useId();

  const fontSize = 12;

  const code = (() => {
    const lineCount = 6;
    const top = editor.headerHeight;
    const height =
      editor.contentHeight - editor.headerHeight - editor.bottomHeight;

    const paddingX = editor.unit;
    const width = editor.contentWidth - paddingX * 2;

    return {
      lineCount,
      height,
      paddingX,
      width,
      translateY: top,
    };
  })();

  return (
    <g transform={`translate(${code.paddingX}, ${code.translateY})`}>
      <defs>
        <AccentBarGradient id={barGradientId} />
      </defs>

      {Array.from({ length: code.lineCount }).map((_, i) => {
        const y = spaceBetween(i, code.lineCount, fontSize, 0, code.height);

        const maxFillPercent = 35 + ((i * 17) % 46);
        const maxFill = code.width * (maxFillPercent / 100);

        const fillPercent = 40 + ((i * 13) % 51);
        const fillValue = maxFill * (fillPercent / 100);

        const indent = i % 3 === 1 ? 8 : 0;
        const tubeX = 24 + indent;
        const tubeWidth = maxFill - code.paddingX;

        // short lines get a second bar after them (two "tokens" on one line).
        // when there are two, the first is always fully filled
        const hasSecond = tubeWidth < code.width * 0.45;
        const firstFill = hasSecond ? tubeWidth : fillValue;
        const second = (() => {
          if (!hasSecond) return null;
          const gap = 8;
          const width = code.width * (0.18 + ((i * 11) % 20) / 100);
          return {
            x: tubeX + tubeWidth + gap,
            width,
            fill: width * (fillPercent / 100),
          };
        })();

        const normalScale = 1;
        const movementAmount = 0.1;

        const tubeScale = normalScale;
        // i === 1 ? normalScale + animation * movementAmount : normalScale;

        const normalOpacity = 0.8;
        const opacityMovement = 0.1;

        const tubeOpacity = normalOpacity + animation * opacityMovement;

        return (
          <g key={i}>
            <text
              x={0}
              // centred on the bar (bars are 6 high, so their middle is y + 3)
              y={y + 3}
              dominantBaseline="central"
              fill="var(--accent)"
              fontSize={fontSize}
              opacity={0.25 + (i % 2) * 0.2}
              filter="url(#tinyGlow)"
              // style={{ filter: "drop-shadow(2px 2px 5px var(--accent))" }}
            >
              {i + 1}
            </text>

            <g>
              {/* tube / empty amount */}
              <rect
                x={tubeX}
                y={y}
                width={tubeWidth}
                height={6}
                rx={3}
                fill="var(--accent)"
                opacity={0.15}
              />

              {/* filled amount */}
              <rect
                x={tubeX}
                y={y}
                width={firstFill}
                height={6}
                rx={3}
                fill={`url(#${barGradientId})`}
                style={{
                  transform: `scaleX(${tubeScale})`,
                  transformBox: "fill-box",
                  transformOrigin: "left center",
                }}
                opacity={tubeOpacity}
              />

              {/* second bar on short lines: its own tube + partial fill */}
              {second && (
                <>
                  <rect
                    x={second.x}
                    y={y}
                    width={second.width}
                    height={6}
                    rx={3}
                    fill="var(--accent)"
                    opacity={0.15}
                  />
                  <rect
                    x={second.x}
                    y={y}
                    width={second.fill}
                    height={6}
                    rx={3}
                    fill={`url(#${barGradientId})`}
                    opacity={tubeOpacity}
                  />
                </>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
}

type CodeEditorProps = Omit<EditorWindowProps, "children">;

// window + fake code
export function CodeEditor(props: CodeEditorProps) {
  return (
    <EditorWindow {...props}>
      <EditorCode />
    </EditorWindow>
  );
}
