import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { glyphStroke } from "../../../lib/svg-helpers";

type StatCardProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  trend: "up" | "down";
  progress: number; // 0-1
};

export function StatCard({
  x,
  y,
  width,
  height,
  trend,
  progress,
}: StatCardProps) {
  const color = "var(--accent)";
  const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  const padding = width * 0.07;
  const iconSize = height * 0.42;

  const barX = padding + iconSize + padding * 0.7;
  const barsWidth = width - barX - padding;
  const barHeight = height * 0.05;

  const progressY = height - padding - barHeight;
  const progressWidth = width - padding * 2;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx="var(--rx-node-xxs)"
        fill="var(--raised)"
        stroke="var(--node-border-color-faint)"
        strokeWidth="0.4"
      />

      {/* trend icon badge */}
      <rect
        x={padding}
        y={padding}
        width={iconSize}
        height={iconSize}
        rx="var(--rx-node-xxs)"
        fill={color}
        opacity={0.16}
      />
      <Icon
        x={padding + iconSize * 0.15}
        y={padding + iconSize * 0.15}
        size={iconSize * 0.7}
        strokeWidth={glyphStroke(iconSize * 0.7, 0.5)}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        stroke={color}
      />

      {/* text lines */}
      <rect
        x={barX}
        y={padding + iconSize * 0.18}
        width={barsWidth}
        height={barHeight * 0.7}
        rx={barHeight * 0.35}
        fill="var(--node-border-color)"
        opacity={0.7}
      />
      <rect
        x={barX}
        y={padding + iconSize * 0.18 + barHeight * 1.4}
        width={barsWidth * 0.6}
        height={barHeight * 0.7}
        rx={barHeight * 0.35}
        fill="var(--node-border-color)"
        opacity={0.4}
      />

      {/* progress bar */}
      <rect
        x={padding}
        y={progressY}
        width={progressWidth}
        height={barHeight}
        rx="var(--rx-node-xxs)"
        fill="var(--node-border-color-faint)"
      />
      <rect
        x={padding}
        y={progressY}
        width={progressWidth * progress}
        height={barHeight}
        rx="var(--rx-node-xxs)"
        fill="var(--accent)"
      />
    </g>
  );
}
