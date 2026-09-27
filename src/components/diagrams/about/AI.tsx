export function AISvg() {
  const viewboxWidth = 600;
  const viewboxHeight = 400;

  const unit = viewboxHeight / 12;
  const outerPadding = unit;

  const contentHeight = viewboxHeight - outerPadding * 2;
  const contentWidth = viewboxWidth - outerPadding * 2;

  // preserve CodeEditor's 300:200 aspect ratio
  const editorBox = (() => {
    const width = contentWidth * 0.75;
    const height = width * (200 / 300);

    const skew = 10;

    const skewSlope = Math.tan((skew * Math.PI) / 180);
    const addedHeight = width * skewSlope;

    const resolvedHeight = height + addedHeight;

    const { translateY, absoluteCenterY: resolvedCenterY } = centerInParent(
      contentHeight,
      resolvedHeight,
      outerPadding,
    );

    return {
      width,
      height,
      skew,
      addedHeight,
      translateY,
      resolvedCenterY,
    };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="w-full h-auto"
    >
      <g transform={`translate(${outerPadding}, ${outerPadding})`}>
        <g
          transform={`translate(0, ${editorBox.translateY + editorBox.addedHeight}) skewY(${-editorBox.skew})`}
        >
          <g opacity={0.4}>
            <CodeEditor
              x={-60}
              y={-60}
              width={editorBox.width}
              height={editorBox.height}
            />
          </g>

          <g opacity={0.6}>
            <CodeEditor
              x={-30}
              y={-30}
              width={editorBox.width}
              height={editorBox.height}
            />
          </g>

          <CodeEditor width={editorBox.width} height={editorBox.height} />
        </g>
      </g>
    </svg>
  );
}

import { useEffect, useId, useState } from "react";
import { centerInParent, spaceBetween } from "../../../lib/svg-helpers";

type CodeEditorProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export function CodeEditor({
  x = 0,
  y = 0,
  width = 300,
  height = 200,
}: CodeEditorProps) {
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

  const editorHeaderHeight = unit * 2;
  const editorBottomHeight = unit * 1.5;

  const fontSize = 12;

  const code = (() => {
    const lineCount = 6;
    const top = editorHeaderHeight;
    const height = contentHeight - editorHeaderHeight - editorBottomHeight;

    const paddingX = unit;
    const width = contentWidth - paddingX * 2;

    return {
      lineCount,
      height,
      paddingX,
      width,
      translateY: top,
    };
  })();

  const gradientId = useId();
  const barGradientId = `${gradientId}-bar`;

  const nodeStyle = {
    fill: "var(--node-color-deep)",
    stroke: `url(#${gradientId})`,
    strokeWidth,
  };

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
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

        {/* code bars: bright at the start, fading out to the right */}
        <linearGradient id={barGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
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
      </defs>

      {/* background */}
      <rect
        x={inset}
        y={inset}
        width={contentWidth}
        height={contentHeight}
        rx="var(--rx-node-md)"
        // filter="url(#tinyGlow)"
        {...nodeStyle}
      />

      {/* straight lines have a zero-height bbox, so a bbox-based gradient stroke renders nothing */}
      {/* <path
        d={`M 0 ${contentHeight / 8}
            H ${contentWidth}`}
        {...nodeStyle}
        stroke="var(--accent)"
      /> */}

      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={12 + i * 12}
          cy={contentHeight / 16}
          r={3}
          fill={`url(#${barGradientId})`}
          opacity={1 - (i * 0.2 + 0.2)}
          filter="url(#tinyGlow)"
          // filter="drop-shadow(0 0 1px color-mix(in oklab, var(--accent) 35%, transparent))"
        />
      ))}

      <g transform={`translate(${code.paddingX}, ${code.translateY})`}>
        {Array.from({ length: code.lineCount }).map((_, i) => {
          const y = spaceBetween(i, code.lineCount, fontSize, 0, code.height);

          const maxFillPercent = 35 + ((i * 17) % 46);
          const maxFill = code.width * (maxFillPercent / 100);

          const fillPercent = 40 + ((i * 13) % 51);
          const fillValue = maxFill * (fillPercent / 100);

          const indent = i % 3 === 1 ? 8 : 0;
          const tubeX = 24 + indent;

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
                y={y}
                dominantBaseline="hanging"
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
                  width={maxFill - code.paddingX}
                  height={6}
                  rx={3}
                  fill="var(--accent)"
                  opacity={0.15}
                />

                {/* filled amount */}
                <rect
                  x={tubeX}
                  y={y}
                  width={fillValue}
                  height={6}
                  rx={3}
                  fill={`url(#${barGradientId})`}
                  style={{
                    transform: `scaleX(${tubeScale})`,
                    transformBox: "fill-box",
                    transformOrigin: "left center",
                  }}
                  opacity={tubeOpacity}
                  filter="url(#tinyGlow)"
                />
              </g>
            </g>
          );
        })}
      </g>

      <path
        d="H 0 100"
        width={contentWidth}
        height={contentHeight}
        rx="var(--rx-node-md)"
        {...nodeStyle}
      />

      {/* fake code */}
    </svg>
  );
}
