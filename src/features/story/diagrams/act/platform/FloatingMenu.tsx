import { ChevronRight, Eye, Mail, User, type LucideIcon } from "lucide-react";

import {
  alignCenter,
  BoxShadow,
  paddedBox,
  Platform,
  glyphStrokeLucide,
  stackWithGaps,
  Tube,
  type cardPlatformLayout,
} from "@/lib/svg";
import { ElectricGlass } from "../ElectricGlass";

// one row per `act` action: email, assign, track
const actions: LucideIcon[] = [Mail, User, Eye];

// the act's floating menu: a platform with a glass card standing on it,
// one row per action, the first one picked. drawn with the bounding box's
// top-left at (0, 0)
export function FloatingMenu({
  layout,
  radius,
  rowGap,
}: {
  layout: ReturnType<typeof cardPlatformLayout>;
  radius: number; // the card's and rows' corner radius
  rowGap: number; // space between the card's rows
}) {
  const {
    groupWidth,
    groupHeight,
    originX,
    originY,
    platform,
    corners,
    center,
    card,
  } = layout;
  const { bottom } = corners;

  // which row looks picked: drawn above the ink, with an extra glass layer
  const selected = 0;

  // padding inside the card: the rows go in the content box
  const box = paddedBox(card.width, card.height, 0.5, 1);

  // rows that show `act` actions, filling the card's content box
  const rows = (() => {
    const { contentX, contentY, contentWidth, contentHeight } = box;
    const count = actions.length;
    // count rows + (count - 1) gaps fill the content height
    const rowHeight = (contentHeight - rowGap * (count - 1)) / count;
    const items = stackWithGaps(
      Array.from({ length: count }, () => rowHeight),
      rowGap,
    );

    return {
      translateX: contentX,
      translateY: contentY + box.paddingY * 0.25,
      width: contentWidth,
      rowHeight,
      items,
    };
  })();

  // inside one row: icon in a circle, label + subtitle bars, chevron at the end
  const row = (() => {
    const h = rows.rowHeight;
    const insetX = h * 0.15; // from the row's left and right edges
    const gap = h * 0.2; // between icon, text and chevron

    const icon = (() => {
      const radius = h * 0.3;
      const size = radius * 1.2; // the lucide icon inside the circle
      return { cx: insetX + radius, cy: h / 2, radius, size };
    })();

    const chevron = (() => {
      const size = h * 0.4;
      return { x: rows.width - insetX - size, y: (h - size) / 2, size };
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

      return { x, y, width, lineHeights, lineStarts: lines.starts };
    })();

    return { icon, chevron, text };
  })();
  const { icon, chevron, text } = row;

  // one row: glass, icon in a circle, label + subtitle, chevron
  const renderRow = (i: number, rowY: number, isSelected = false) => {
    const Icon = actions[i];

    return (
      <g key={i} transform={`translate(0, ${rowY})`}>
        <ElectricGlass
          width={rows.width}
          height={rows.rowHeight}
          radius={radius}
          strokeWidth={0.8}
        />
        {isSelected && (
          <ElectricGlass
            width={rows.width}
            height={rows.rowHeight}
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
        {/* label + subtitle: everything inside starts at the text box's top-left */}
        {(() => {
          const { x, y, width, lineHeights, lineStarts } = text;
          return (
            <g transform={`translate(${x}, ${y})`}>
              {/* label: bright, longer */}
              <Tube
                y={lineStarts[0]}
                width={width}
                height={lineHeights[0]}
                level={0.75}
                fill="var(--accent-electric)"
                fillOpacity={0.9}
              />
              {/* subtitle: dim, shorter */}
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
        {/* chevron at the end */}
        <ChevronRight
          x={chevron.x}
          y={chevron.y}
          size={chevron.size}
          stroke="var(--accent-electric)"
          strokeOpacity={0.6}
          strokeWidth={glyphStrokeLucide(chevron.size, 1.2)}
        />
      </g>
    );
  };

  return (
    <>
      <rect
        className="svg-debug"
        x={0}
        y={0}
        width={groupWidth}
        height={groupHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      {/* content shifted so the bounding box's top-left is (0, 0) */}
      <g transform={`translate(${originX}, ${originY})`}>
        {/* drawn first, so the platform sits on top of it */}
        <BoxShadow
          corners={[bottom.left, bottom.back, bottom.right, bottom.front]}
          drop={40}
          still
        />
        {/* bobs up and down; the shadow stays put and shrinks in step
            (both default to 4s, no delay) */}
        <g>
          <Platform {...platform} grid={{ across: 4, along: 6 }} />
          {/* the card: glass, slanted by skewY */}
          <g transform={`translate(${card.x}, ${card.y}) skewY(${card.angle})`}>
            <ElectricGlass
              width={card.width}
              height={card.height}
              radius={radius}
              strokeWidth={1}
            />
            {/* the other rows, under the ink: they look inactive */}
            <g transform={`translate(${rows.translateX}, ${rows.translateY})`}>
              {rows.items.starts.map((rowY, i) =>
                i === selected ? null : renderRow(i, rowY),
              )}
            </g>
            {/* ink over the whole card: dims everything drawn so far */}
            <rect
              width={card.width}
              height={card.height}
              rx={radius}
              fill="var(--accent-ink)"
              fillOpacity={0.55}
            />
            {/* the selected row, above the ink, with an extra layer of glass */}
            <g transform={`translate(${rows.translateX}, ${rows.translateY})`}>
              {renderRow(selected, rows.items.starts[selected], true)}
            </g>
          </g>
          {/* debug: the platform's center */}
          <circle
            className="svg-debug"
            cx={center.x}
            cy={center.y}
            r={3}
            fill="hotpink"
          />
        </g>
      </g>
    </>
  );
}
