import { ChevronRight, type LucideIcon } from "lucide-react";

import { alignCenter, glyphStrokeLucide, stackWithGaps } from "@/lib/svg";
import { ElectricGlass } from "../ElectricGlass";

// one row of the floating menu: glass, icon in a circle, label, chevron at
// the end. drawn with the row's top-left at (0, 0)
export function MenuRow({
  width,
  height,
  radius,
  Icon,
  label,
  isSelected = false,
}: {
  width: number;
  height: number;
  radius: number; // the row's corner radius
  Icon: LucideIcon; // the action's icon
  label: string; // the action's name
  isSelected?: boolean; // adds an extra glass layer
}) {
  // inside the row: icon in a circle, label + subtitle bars, chevron at the end
  const row = (() => {
    const h = height;
    const insetX = h * 0.15; // from the row's left and right edges
    const gap = h * 0.2; // between icon, text and chevron

    const icon = (() => {
      const radius = h * 0.3;
      const size = radius * 1.2; // the lucide icon inside the circle
      return { cx: insetX + radius, cy: h / 2, radius, size };
    })();

    const chevron = (() => {
      const size = h * 0.4;
      return { x: width - insetX - size, y: (h - size) / 2, size };
    })();

    // two lines stacked and centered: a longer label, a shorter subtitle
    const text = (() => {
      const x = icon.cx + icon.radius + gap;
      const width = chevron.x - gap - x;

      // the two lines
      const lineHeight = h * 0.09;
      const lineHeights = [lineHeight, lineHeight]; // label, subtitle
      const lineGap = h * 0.1;

      const lines = stackWithGaps(lineHeights, lineGap);
      const linesHeight = lineHeights[0] + lineGap + lineHeights[1];

      const { offset: y } = alignCenter(h, linesHeight);

      // the label text, used instead of the two lines for now
      const fontSize = h * 0.2;

      return { x, y, width, lineHeights, lineStarts: lines.starts, fontSize };
    })();

    return { icon, chevron, text };
  })();
  const { icon, chevron, text } = row;

  return (
    <>
      <ElectricGlass
        width={width}
        height={height}
        radius={radius}
        strokeWidth={0.8}
      />
      {isSelected && (
        <ElectricGlass
          width={width}
          height={height}
          radius={radius}
          strokeWidth={0.8}
        />
      )}
      {/* icon in a circle */}
      {(() => {
        const { cx, cy, radius: r, size } = icon;
        return (
          <>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="oklch(from var(--accent) 0.35 0.12 h)"
              fillOpacity={0.5}
            />
            <Icon
              x={cx - size / 2}
              y={cy - size / 2}
              size={size}
              stroke="var(--accent-electric)"
              strokeWidth={glyphStrokeLucide(size, 1)}
            />
          </>
        );
      })()}
      {/* old look, kept to switch back: label + subtitle as two bars
          (bright longer label, dim shorter subtitle) instead of the text.
          to use it again, uncomment it and remove the <text> below
      {(() => {
        const { x, y, width, lineHeights, lineStarts } = text;
        return (
          <g transform={`translate(${x}, ${y})`}>
            <Tube
              y={lineStarts[0]}
              width={width}
              height={lineHeights[0]}
              level={0.75}
              fill="var(--accent-electric)"
              fillOpacity={0.9}
            />
            <Tube
              y={lineStarts[1]}
              width={width}
              height={lineHeights[1]}
              level={0.5}
              fill="var(--accent-electric)"
              fillOpacity={0.35}
            />
          </g>
        );
      })()}
      */}
      {/* label: the action's name in capitals, centered in the row */}
      <text
        x={text.x}
        y={height / 2}
        dominantBaseline="central"
        fontSize={text.fontSize}
        fontWeight={500}
        letterSpacing={text.fontSize * 0.12}
        fill="var(--accent-glow)"
        fillOpacity={0.9}
      >
        {label}
      </text>
      {/* chevron at the end */}
      <ChevronRight
        x={chevron.x}
        y={chevron.y}
        size={chevron.size}
        stroke="var(--accent-electric)"
        strokeOpacity={0.6}
        strokeWidth={glyphStrokeLucide(chevron.size, 1.2)}
      />
    </>
  );
}
