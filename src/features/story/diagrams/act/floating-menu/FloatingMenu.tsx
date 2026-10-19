import { Eye, Plus, User, type LucideIcon } from "lucide-react";

import {
  BoxShadow,
  paddedBox,
  Platform,
  stackWithGaps,
  type cardPlatformLayout,
} from "@/lib/svg";
import { ElectricGlass } from "../ElectricGlass";
import { MenuRow } from "./MenuRow";

// one row per `act` action: task, assign, track
const actions: LucideIcon[] = [Plus, User, Eye];
// each row's label, in the same order as actions
const labels = ["TASK", "ASSIGN", "TRACK"];

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
  const { floor } = corners;

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

  // one row, moved down to its place in the stack
  const renderRow = (i: number, rowY: number, isSelected = false) => (
    <g key={i} transform={`translate(0, ${rowY})`}>
      <MenuRow
        width={rows.width}
        height={rows.rowHeight}
        radius={radius}
        Icon={actions[i]}
        label={labels[i]}
        isSelected={isSelected}
      />
    </g>
  );

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
          corners={[floor.left, floor.top, floor.right, floor.bottom]}
          drop={40}
        />
        {/* bobs up and down; the shadow stays put and shrinks in step
            (both default to 4s, no delay) */}
        <g className="float-bob">
          <Platform {...platform} grid={{ across: 5, along: 6 }} />
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
              fillOpacity={0.4}
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
