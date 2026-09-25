import { Bell, CalendarDays, Lightbulb, SquareCheck, User } from "lucide-react";
import { centerInParent, glyphStroke } from "../../lib/svg-helpers";
import { BarChart } from "./Visualize/BarChart";
import { Donut } from "./Visualize/Donut";

const actions = [
  { label: "Plan", Icon: CalendarDays },
  { label: "Assign", Icon: User },
  { label: "Notify", Icon: Bell },
  { label: "Track", Icon: SquareCheck },
];

// placeholder list rows: status dot + text line of varying length
const statusRows = [
  { color: "var(--critical)", lineWidth: 0.4 },
  { color: "var(--caution)", lineWidth: 0.5 },
  { color: "var(--accent)", lineWidth: 0.32 },
];

export function ActDiagram() {
  const viewboxWidth = 300;
  const viewboxHeight = 100;
  const unit = viewboxHeight / 12; // same base unit as the other diagrams

  const outerPadding = unit * 1;

  const contentHeight = viewboxHeight - outerPadding * 2;
  const contentWidth = viewboxWidth - outerPadding * 2;

  // act icon — path is drawn in its own coordinate space, so we measure its
  // bbox once and derive center + scale from unit
  const centerIcon = (() => {
    const bbox = { minX: 27, maxX: 89, minY: 15, maxY: 88 };
    const pathHeight = bbox.maxY - bbox.minY;

    const height = unit * 6.5; // rendered height in viewbox units
    const scale = height / pathHeight;

    const pathCenterX = (bbox.minX + bbox.maxX) / 2;
    const pathCenterY = (bbox.minY + bbox.maxY) / 2;

    // round skull part of the path: back (27) to forehead (83), top at 15 —
    // treated as a circle, so its center sits one radius below the top
    const skull = { minX: 27, maxX: 83, minY: 15 };
    const skullRadius = (skull.maxX - skull.minX) / 2;
    const skullCenterX = skull.minX + skullRadius;
    const skullCenterY = skull.minY + skullRadius;

    const bulbSize = 36;

    return {
      bbox,
      scale,
      pathCenterX,
      pathCenterY,
      skullCenterX,
      skullCenterY,
      bulbSize,
    };
  })();

  // left placeholder container
  const leftBox = (() => {
    const width = contentWidth * 0.32;
    const height = contentHeight;

    const { translateY, resolvedCenterY } = centerInParent(
      contentHeight,
      height,
      outerPadding,
    );

    const endX = outerPadding + width;

    return { width, height, translateY, resolvedCenterY, endX };
  })();

  // right placeholder container — right-aligned, same math as
  // VisualizeDiagram's "dashboard" box (startX + width + outerPadding =
  // viewboxWidth)
  const rightBox = (() => {
    const width = contentWidth * 0.26;
    const height = contentHeight; // square

    const startX = viewboxWidth - outerPadding - width;

    const { translateY, resolvedCenterY } = centerInParent(
      contentHeight,
      height,
      outerPadding,
    );

    return { width, height, startX, translateY, resolvedCenterY };
  })();

  // icon sits at the midpoint between the two boxes
  // gap = the gap between right box and left box (connector start / end)
  const gapCenterX = (leftBox.endX + rightBox.startX) / 2;

  // where the head outline crosses the connector's height (pathCenterY),
  // measured on the path: back of the head curve and the nose slope
  const headOutlineAtCenter = { backX: 27.7, faceX: 83.8 };
  const toViewboxX = (pathX: number) => {
    // e.g. pathX = 27.7 (back of head, on the head's drawing)

    // 27.7 - 58 = -30.3 → 30.3 left of the head's middle
    const distanceFromMiddle = pathX - centerIcon.pathCenterX;

    // -30.3 * 0.74 = -22.4 → same distance, at the head's drawn size
    const scaledDistance = distanceFromMiddle * centerIcon.scale;

    // 158.5 + -22.4 = 136.1 → x in the diagram
    return gapCenterX + scaledDistance;
  };
  const headLeftX = toViewboxX(headOutlineAtCenter.backX);
  const headRightX = toViewboxX(headOutlineAtCenter.faceX);

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      {/* debug: svg bounds */}
      {/* <rect
        x={0}
        y={0}
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="red"
      /> */}

      {/* connectors: left box -> head, head -> right box */}
      <g stroke="var(--connector-color)" strokeWidth="var(--connector-weight)">
        <path
          d={`M ${leftBox.endX} ${leftBox.resolvedCenterY} H ${headLeftX}`}
        />
        <path
          d={`M ${headRightX} ${rightBox.resolvedCenterY} H ${rightBox.startX}`}
        />
      </g>

      {/* left placeholder */}
      <g transform={`translate(${outerPadding}, ${outerPadding})`}>
        <rect
          x={0}
          y={leftBox.translateY}
          width={leftBox.width}
          height={leftBox.height}
          rx="var(--rx-node-sm)"
          fill="var(--node-color)"
          stroke="var(--node-border-color)"
          strokeWidth="var(--node-stroke-width)"
        />

        {(() => {
          const padding = unit * 0.75;
          const innerWidth = leftBox.width - padding * 2;
          const innerHeight = leftBox.height - padding * 2;

          // top: bar chart box + donut; bottom: status rows
          const topHeight = innerHeight * 0.4;
          const bottomY = topHeight + padding * 2; // below the divider
          const bottomHeight = innerHeight - bottomY;

          const boxPadding = unit * 0.5;
          const chartBox = { width: innerWidth * 0.62, height: topHeight };

          const donutSize = topHeight * 0.8;
          // right-aligned to the inner edge, same as the pills below
          const donutX = innerWidth - donutSize;

          const rowHeight = bottomHeight / statusRows.length;
          const dotRadius = unit * 0.3;
          const lineHeight = unit * 0.35;
          const pillWidth = innerWidth * 0.16;

          return (
            <g
              transform={`translate(${padding}, ${leftBox.translateY + padding})`}
            >
              <rect
                width={chartBox.width}
                height={chartBox.height}
                rx="var(--rx-node-xxs)"
                fill="none"
                stroke="var(--node-border-color-faint)"
                strokeWidth="var(--node-stroke-width)"
              />

              <BarChart
                x={boxPadding}
                y={boxPadding}
                width={chartBox.width - boxPadding * 2}
                height={chartBox.height - boxPadding * 2}
                values={[0.35, 0.55, 0.75, 1]}
              />

              <Donut
                x={donutX}
                y={topHeight / 2 - donutSize / 2}
                size={donutSize}
                split={0.7}
              />

              <path
                d={`M ${-padding} ${topHeight + padding} H ${innerWidth + padding}`} // span whole box
                stroke="var(--node-border-color-faint)"
                strokeWidth={"var(--node-stroke-width)"}
                opacity={0.6}
              />

              {statusRows.map(({ color, lineWidth }, i) => {
                const centerY = bottomY + rowHeight * (i + 0.5);

                return (
                  <g key={i}>
                    <circle
                      cx={dotRadius}
                      cy={centerY}
                      r={dotRadius}
                      fill={color}
                    />
                    <rect
                      x={dotRadius * 2 + unit * 0.8}
                      y={centerY - lineHeight / 2}
                      width={innerWidth * lineWidth}
                      height={lineHeight}
                      rx={lineHeight / 2}
                      fill="var(--node-border-color)"
                    />
                    <rect
                      x={innerWidth - pillWidth}
                      y={centerY - lineHeight / 2}
                      width={pillWidth}
                      height={lineHeight}
                      rx={lineHeight / 2}
                      fill="var(--node-border-color)"
                      opacity={0.6}
                    />
                  </g>
                );
              })}
            </g>
          );
        })()}
      </g>

      {/* right container: action list */}
      <g
        transform={`translate(${rightBox.startX}, ${rightBox.translateY + outerPadding})`}
      >
        <rect
          x={0}
          y={0}
          width={rightBox.width}
          height={rightBox.height}
          rx="var(--rx-node-xs)"
          fill="var(--node-color)"
          stroke="var(--node-border-color)"
          strokeWidth="var(--node-stroke-width)"
        />

        {(() => {
          // same text/icon sizing as ConnectDiagram's node list
          const fontSize = unit * 0.9;
          const iconSize = unit * 1.2;
          const gap = unit * 0.8;

          const rowHeight = rightBox.height / actions.length;

          return actions.map(({ label, Icon }, i) => {
            const y = i * rowHeight;

            return (
              <g key={label}>
                {i > 0 && (
                  <path
                    d={`M 0 ${y} H ${rightBox.width}`}
                    stroke="var(--node-border-color)"
                    strokeWidth="var(--node-stroke-width)"
                    opacity={0.75}
                  />
                )}

                <Icon
                  x={gap}
                  y={y + rowHeight / 2 - iconSize / 2}
                  size={iconSize}
                  strokeWidth={glyphStroke(iconSize, 0.5)}
                  stroke="var(--node-text-color)"
                />

                <text
                  x={gap + iconSize + gap}
                  y={y + rowHeight / 2}
                  dominantBaseline="middle"
                  textAnchor="start"
                  fill="var(--node-text-color)"
                  fontSize={fontSize}
                  fontFamily="inherit"
                >
                  {label}
                </text>
              </g>
            );
          });
        })()}
      </g>

      {/* transform icon — placeholder, swap for something act-specific later */}
      <g
        // move to target center, scale, then shift the path's own bbox
        // center onto the origin
        transform={`translate(
          ${gapCenterX},
          ${leftBox.resolvedCenterY}
        ) scale(${centerIcon.scale}) translate(
          ${-centerIcon.pathCenterX},
          ${-centerIcon.pathCenterY}
        )`}
      >
        <path
          d="
              M 32 88
              L 32 69
              C 32 61 27 55 27 45
              C 27 27 40 15 56 15
              C 72 15 83 27 83 43
              L 83 50
              L 89 61
              C 90 63 88 65 85 65
              L 82 65
              L 82 72
              C 82 76 79 79 75 79
              L 68 79
              L 68 88
          "
          fill="none"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="var(--accent)"
          opacity={0.75}
        />

        {/* lightbulb centered in the skull (path coords) */}
        <Lightbulb
          x={centerIcon.skullCenterX - centerIcon.bulbSize / 2}
          y={centerIcon.skullCenterY - centerIcon.bulbSize / 2}
          size={centerIcon.bulbSize}
          strokeWidth={1}
          stroke="var(--node-text-color)"
          opacity={0.8}
        />
      </g>
    </svg>
  );
}
