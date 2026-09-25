import { SlidersHorizontal } from "lucide-react";
import { DataGrid } from "../DataGrid";
import { StatCard } from "./StatCard";
import { Donut } from "./Donut";
import { BarChart } from "./BarChart";
import { centerInParent } from "../../../lib/svg-helpers";

export function VisualizeDiagram() {
  const viewboxWidth = 340;
  const viewboxHeight = 100;

  const unit = viewboxHeight / 12; // same base unit as ConnectDiagram
  const outerPadding = unit * 1; // top, bottom, left, right

  const contentHeight = viewboxHeight - outerPadding * 2;
  const contentWidth = viewboxWidth - outerPadding * 2;

  const iconSize = {
    slider: unit * 2.5,
  };

  // structured data stack items, all grouped together
  const stack = (() => {
    const width = contentWidth * 0.3;
    const height = contentHeight * 0.9;
    const offset = unit * 0.4; // step unit for the diagonal card stack
    const count = 4;

    // card in back has index 0 -> its y / x positions were multiplied by 0 -> unchanged
    // -> add offset * count - 1 to get total height
    const stackHeight = height + offset * (count - 1);
    const endX = width + outerPadding + offset * (count - 1);

    const { translateY, centerY, resolvedCenterY } = centerInParent(
      contentHeight,
      stackHeight,
      outerPadding,
    );

    return {
      width,
      height,
      offset,
      count,
      centerY,
      endX,
      translateY,
      resolvedCenterY,
    };
  })();

  const dashboard = (() => {
    // bigger than the stack, but not by so much it dwarfs it; width kept
    // modest so there's still a decent connector gap for the future animation
    const width = (viewboxWidth - outerPadding * 2) * 0.38;
    const height = contentHeight;

    const startX = viewboxWidth - outerPadding - width;
    const translateY = (contentHeight - height) / 2;

    return {
      startX,
      width,
      height,
      translateY,
    };
  })();

  // filter icon sits at the midpoint between the stack and the dashboard
  const iconCenterX = (stack.endX + dashboard.startX) / 2;

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

      <path
        stroke="var(--connector-color)"
        strokeWidth="var(--connector-weight)"
        d={`M ${stack.endX} ${stack.resolvedCenterY} H ${dashboard.startX}`}
      />

      {/* Transform */}
      <g
        transform={`translate(
          ${iconCenterX - iconSize.slider / 2},
          ${(viewboxHeight - iconSize.slider) / 2}
        )`}
      >
        <circle
          cx={iconSize.slider / 2}
          cy={iconSize.slider / 2}
          r={iconSize.slider / 2 + unit * 0.6}
          fill="var(--raised)"
          stroke="var(--accent)"
          strokeWidth="var(--node-stroke-width)"
        />

        <SlidersHorizontal
          size={iconSize.slider}
          strokeWidth={1}
          stroke="var(--node-text-color)"
        />
      </g>

      {/* Structured data stacks */}
      <g
        transform={`translate(${outerPadding}, ${stack.translateY + outerPadding})`}
      >
        {Array.from({ length: stack.count }, (_, i) => (
          <DataGrid
            key={i}
            x={stack.offset * i}
            y={stack.offset * i}
            width={stack.width}
            height={stack.height}
          />
        ))}
      </g>

      <g
        transform={`translate(${dashboard.startX}, ${dashboard.translateY + outerPadding})`}
      >
        <rect
          x={0}
          y={0}
          width={dashboard.width}
          height={dashboard.height}
          rx="var(--rx-node-sm)"
          fill="var(--node-color)"
          stroke="var(--node-border-color)"
          strokeWidth="var(--node-stroke-width)"
        />

        {(() => {
          const padding = unit * 0.5;
          const innerWidth = dashboard.width - padding * 2;
          const innerHeight = dashboard.height - padding * 2;
          const topHeight = innerHeight * 0.6;

          const gap = unit * 0.5;

          // placeholder data — swap for live/animated values later
          const barValues = [
            0.45, 0.35, 0.65, 0.4, 0.42, 0.58, 0.75, 0.62, 0.9,
          ];

          const bottomHeight = innerHeight - topHeight - gap;
          const donutSize = bottomHeight;
          const cardWidth = (innerWidth - donutSize - gap * 2) / 2;

          return (
            <g transform={`translate(${padding}, ${padding})`}>
              <rect
                x={0}
                y={0}
                width={innerWidth}
                height={topHeight}
                rx="var(--rx-node-xxs)"
                fill="var(--raised)"
              />

              <BarChart
                x={0}
                y={0}
                width={innerWidth}
                height={topHeight}
                values={barValues}
              />

              <StatCard
                x={0}
                y={topHeight + gap}
                width={cardWidth}
                height={bottomHeight}
                trend="up"
                progress={0.8}
              />

              <StatCard
                x={cardWidth + gap}
                y={topHeight + gap}
                width={cardWidth}
                height={bottomHeight}
                trend="down"
                progress={0.45}
              />

              <Donut
                x={(cardWidth + gap) * 2}
                y={topHeight + gap}
                size={donutSize}
                split={0.5}
              />
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
