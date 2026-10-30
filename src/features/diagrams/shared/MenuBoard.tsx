import type { ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  alignCenter,
  contentBoxLayout,
  glyphStrokeLucide,
  placeItemCenter,
  RecessedPanel,
  stackWithGaps,
  type cascadeLayout,
} from "@/lib/svg";

import { CascadeBoards } from "./CascadeBoards";

// one row: its icon and its text, one string per line
export type MenuBoardRow = { icon: LucideIcon; lines: string[] };

// a menu board: a cascade of dark boards, the front one with a header (drawn
// by the caller) and one row per entry in `rows`.
// drawn with the cascade's top-left at (x, y)
export function MenuBoard({
  x = 0,
  y = 0,
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
  x?: number; // where the cascade's top-left goes
  y?: number;
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

  return (
    <g transform={`translate(${x}, ${y}) ${layout.transform}`}>
      {/* the boards, back to front. the back one fades a bit */}
      <CascadeBoards layout={layout} radius={radius} backOpacity={0.6} />


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
          {rows.map((row, i) => (
            <g key={i} transform={`translate(0, ${list.starts[i]})`}>
              <MenuRow
                {...row}
                width={content.width}
                height={list.itemHeight}
                radius={radius}
                fontSize={unit * fontSizeUnits}
              />
            </g>
          ))}
        </g>
      </g>
    </g>
  );
}

// one row of the list: a recessed panel with the icon centered in a box on
// the left, the lines next to it, and a chevron at the right end. drawn from (0, 0)
function MenuRow({
  width,
  height: h,
  radius,
  fontSize,
  icon: Icon,
  lines,
}: MenuBoardRow & {
  width: number;
  height: number;
  radius: number;
  fontSize: number;
}) {
  // the icon: centered in a box at the row's left, a share of the row's width
  const icon = (() => {
    const size = h * 0.4; // knob
    const box = { width: width * 0.2, height: h }; // knob: 0.2
    const { offsetX: x, offsetY: y } = placeItemCenter({
      parentWidth: box.width,
      parentHeight: box.height,
      itemWidth: size,
      itemHeight: size,
    });
    return { x, y, size, box };
  })();

  // the text: `gap` after the icon's box, its lines stacked, then centered in the row
  const text = (() => {
    const gap = h * 0.1; // knob: icon box → text
    // the text only needs a start, so its width is 0
    const [, x] = stackWithGaps([icon.box.width, 0], gap).starts;
    const lineHeights = lines.map(() => fontSize);
    const lineGap = fontSize * 0.35; // knob
    const { starts: lineStarts } = stackWithGaps(lineHeights, lineGap);
    const linesHeight = fontSize * lines.length + lineGap * (lines.length - 1);
    const { offset: y } = alignCenter(h, linesHeight);
    return { x, y, lineHeights, lineStarts };
  })();

  // the chevron: at the right end, centered in the row
  const chevron = (() => {
    const insetX = h * 0.15; // knob: from the row's right edge
    const size = h * 0.4; // knob
    return { x: width - insetX - size, y: (h - size) / 2, size };
  })();

  return (
    <>
      {/* the row: a recessed panel, like act's and visualize's boxes, with its
          own dim accent border instead of the panel's gradient */}
      <RecessedPanel width={width} height={h} radius={radius} strokeWidth={0} />
      <rect
        width={width}
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
      {/* the row's text, one <text> per line */}
      {lines.map((line, j) => (
        <text
          key={j}
          x={text.x}
          y={text.y + text.lineStarts[j] + text.lineHeights[j] / 2}
          dominantBaseline="central"
          fontSize={fontSize}
          fill="var(--color-fg-tinted)"
          fillOpacity={1}
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
    </>
  );
}
