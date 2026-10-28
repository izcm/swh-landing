import type { ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  alignCenter,
  contentBoxLayout,
  glyphStrokeLucide,
  LitPane,
  placeItemCenter,
  RecessedPanel,
  stackWithGaps,
  type cascadeLayout,
} from "@/lib/svg";

// one row: its icon and its text, one string per line
export type MenuBoardRow = { icon: LucideIcon; lines: string[] };

// a menu board: a cascade of dark boards, the front one with a header (drawn
// by the caller) and one row per entry in `rows`.
// drawn with the cascade's top-left at (0, 0)
export function MenuBoard({
  layout,
  radius,
  unit,
  paddingXUnits,
  paddingYUnits,
  headerShare,
  headerGapUnits,
  rowGapUnits,
  fontSizeUnits,
  header: renderHeader,
  rows,
}: {
  layout: ReturnType<typeof cascadeLayout>;
  radius: number; // the boards' and rows' corner radius
  unit: number; // the diagram's ruler, the padding and gaps are measured in it
  paddingXUnits: number; // around the content, left and right, in units
  paddingYUnits: number; // around the content, top and bottom, in units
  headerShare: number; // the header's share of the content's height
  headerGapUnits: number; // header → rows, in units
  rowGapUnits: number; // between two rows, in units
  fontSizeUnits: number; // the rows' text size, in units
  // draws the header in its box, from (0, 0)
  header: (box: { width: number; height: number }) => ReactNode;
  rows: MenuBoardRow[];
}) {
  const { front, item } = layout;

  // the front board's content: the header, then the list of rows
  const contentBox = contentBoxLayout({
    width: item.width,
    height: item.height,
    unit,
    paddingXUnits,
    paddingYUnits,
    rowGapUnits: headerGapUnits,
    rowShares: [headerShare, 1 - headerShare],
  });
  const { content, rows: contentRows } = contentBox;

  // the list: one row per entry, stacked in the list's row with a smaller gap
  const list = (() => {
    const height = contentRows.sizes[1];
    const gap = unit * rowGapUnits;
    const count = rows.length;
    // count rows + (count - 1) gaps fill the list's height
    const itemHeight = (height - gap * (count - 1)) / count;
    const { starts } = stackWithGaps(
      Array.from({ length: count }, () => itemHeight),
      gap,
    );

    return { y: contentRows.starts[1], itemHeight, starts };
  })();

  // the header row's box, the caller draws in it
  const header = { width: content.width, height: contentRows.sizes[0] };

  // inside one row, left to right: the icon's box with the separator line as
  // its right side, then the row's lines `gap` after it. the chevron at the end
  const row = (lineCount: number, h: number) => {
    const insetX = h * 0.15; // knob: from the row's right edge to the chevron
    const gap = h * 0.28; // knob: separator → text
    const iconSize = h * 0.4; // knob
    const fontSize = unit * fontSizeUnits;

    // the icon's box: from the row's left edge, a share of its width, full
    // height. the icon sits in its middle
    const iconBox = { width: content.width * 0.2, height: h }; // knob: 0.2
    const { offsetX: iconX, offsetY: iconY } = placeItemCenter({
      parentWidth: iconBox.width,
      parentHeight: iconBox.height,
      itemWidth: iconSize,
      itemHeight: iconSize,
    });

    // across: the box, then the text; the text only needs a start, so its width is 0
    const across = stackWithGaps([iconBox.width, 0], gap);
    const [, textX] = across.starts;
    const separatorX = iconBox.width; // the box's right side

    // down: the row's lines stacked, then centered in the row
    const lineHeights = Array.from({ length: lineCount }, () => fontSize);
    const lineGap = fontSize * 0.35; // knob
    const { starts: lineStarts } = stackWithGaps(lineHeights, lineGap);
    const linesHeight = fontSize * lineCount + lineGap * (lineCount - 1);
    const { offset: textY } = alignCenter(h, linesHeight);

    // the separator line: a share of the row's height, centered in it
    const separator = (() => {
      const height = h * 0.6; // knob
      const { offset: y } = alignCenter(h, height);
      return { x: separatorX, y, height };
    })();

    const icon = { x: iconX, y: iconY, size: iconSize };
    const text = { x: textX, y: textY, lineHeights, lineStarts, fontSize };
    const chevron = (() => {
      const size = h * 0.4; // knob
      return { x: content.width - insetX - size, y: (h - size) / 2, size };
    })();

    return { icon, separator, text, chevron };
  };

  return (
    <g transform={layout.transform}>
      {/* the boards, back to front, each a lit pane. the back one fades a bit */}
      {layout.items.map((board, i) => (
        <g
          key={i}
          transform={`translate(${board.x}, ${board.y})`}
          opacity={0.6 + board.depth * 0.4}
        >
          <LitPane width={board.width} height={board.height} radius={radius} />
        </g>
      ))}

      {/* the front board's content, inside its padding */}
      <g
        transform={`translate(${front.x + content.x}, ${front.y + content.y})`}
      >
        {/* header: drawn by the caller */}
        <g transform={`translate(0, ${contentRows.starts[0]})`}>
          {renderHeader(header)}
        </g>

        {/* the rows, one per entry */}
        <g transform={`translate(0, ${list.y})`}>
          {rows.map(({ icon: Icon, lines }, i) => {
            const h = list.itemHeight;
            const { icon, separator, text, chevron } = row(lines.length, h);
            return (
              <g key={i} transform={`translate(0, ${list.starts[i]})`}>
                {/* the row: a recessed panel, like act's and visualize's boxes, with its
                    own dim accent border instead of the panel's gradient */}
                <RecessedPanel
                  width={content.width}
                  height={h}
                  radius={radius}
                  strokeWidth={0}
                />
                <rect
                  width={content.width}
                  height={h}
                  rx={radius}
                  fill="none"
                  stroke="oklch(from var(--accent) l c h / 0.4)" // knob: 0.4
                  strokeWidth={0.75}
                />
                {/* icon */}
                <Icon
                  x={icon.x}
                  y={icon.y}
                  size={icon.size}
                  stroke="var(--accent-electric)"
                  strokeWidth={glyphStrokeLucide(icon.size, 1)}
                />
                {/* separator between the icon and the text: the row's faint edge color */}
                <line
                  x1={separator.x}
                  y1={separator.y}
                  x2={separator.x}
                  y2={separator.y + separator.height}
                  stroke="oklch(from var(--accent-electric) l c h / 0.35)"
                  strokeWidth={0.75}
                />
                {/* the row's text, one <text> per line */}
                {lines.map((line, j) => (
                  <text
                    key={j}
                    x={text.x}
                    y={text.y + text.lineStarts[j] + text.lineHeights[j] / 2}
                    dominantBaseline="central"
                    fontSize={text.fontSize}
                    fill="var(--accent-glow)"
                    fillOpacity={0.8}
                  >
                    {line}
                  </text>
                ))}
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
          })}
        </g>
      </g>
    </g>
  );
}
