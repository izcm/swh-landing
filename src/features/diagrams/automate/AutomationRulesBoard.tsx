import {
  Box,
  ChevronRight,
  FileText,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

import {
  alignCenter,
  contentBoxLayout,
  glyphStrokeLucide,
  LitPane,
  placeItemCenter,
  RecessedPanel,
  stackWithGaps,
  WindowDots,
  type cascadeLayout,
} from "@/lib/svg";

// one row per rule: its icon and its text, one string per line
const rules: { icon: LucideIcon; lines: string[] }[] = [
  { icon: FileText, lines: ["When a new invoice", "is created"] },
  { icon: User, lines: ["Sync employee data", "across systems"] },
  { icon: Box, lines: ["Create follow-up task"] },
];

// the automate diagram's rule board: a cascade of dark boards, the front one
// with a header (gear icon, title, dots) and one row per rule.
// drawn with the cascade's top-left at (0, 0)
export function AutomationRulesBoard({
  layout,
  radius,
  unit,
  paddingXUnits,
  paddingYUnits,
}: {
  layout: ReturnType<typeof cascadeLayout>;
  radius: number; // the boards' and rows' corner radius
  unit: number; // the diagram's ruler, the padding is measured in it
  paddingXUnits: number; // around the content, left and right, in units
  paddingYUnits: number; // around the content, top and bottom, in units
}) {
  const { front, item } = layout;

  // the front board's content: the header, then the list of rules, paddingY apart
  const contentBox = (() => {
    const headerShare = 0.15; // knob: the header's share of the rows' height
    return contentBoxLayout({
      width: item.width,
      height: item.height,
      unit,
      paddingXUnits,
      paddingYUnits,
      rowGapUnits: 0.2, // knob: header → list
      rowShares: [headerShare, 1 - headerShare],
    });
  })();
  const { content, rows } = contentBox;

  // the list: one row per rule, stacked in the list's row with a smaller gap
  const list = (() => {
    const height = rows.sizes[1];
    const gap = unit * 0.24; // knob: between two rules
    const count = rules.length;
    // count rows + (count - 1) gaps fill the list's height
    const itemHeight = (height - gap * (count - 1)) / count;
    const { starts } = stackWithGaps(
      Array.from({ length: count }, () => itemHeight),
      gap,
    );

    return { y: rows.starts[1], itemHeight, starts };
  })();

  // the header row: gear icon + title on the left, dots at the right end
  const header = (() => {
    const height = rows.sizes[0];
    const iconSize = height * 0.6; // knob
    const gap = height * 0.25; // knob: icon → title
    const fontSize = height * 0.45; // knob
    const dotRadius = height * 0.0875; // knob
    const dotGap = dotRadius * 2.4; // knob
    const dotsWidth = dotRadius * 6 + dotGap * 2;

    return {
      height,
      iconSize,
      fontSize,
      dotRadius,
      dotGap,
      icon: { x: 0, y: (height - iconSize) / 2 },
      title: { x: iconSize + gap, y: height / 2 },
      dotsX: content.width - dotsWidth, // flush with the content's right edge
    };
  })();

  // inside one row, left to right: the icon's box with the separator line as
  // its right side, then the rule's lines `gap` after it. the chevron at the end
  const row = (lineCount: number, h: number) => {
    const insetX = h * 0.15; // knob: from the row's right edge to the chevron
    const gap = h * 0.2; // knob: separator → text
    const iconSize = h * 0.4; // knob
    const fontSize = h * 0.25; // knob

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

    // down: the rule's lines stacked, then centered in the row
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
          <LitPane
            width={board.width}
            height={board.height}
            radius={radius}
          />
        </g>
      ))}

      {/* the front board's content, inside its padding */}
      <g
        transform={`translate(${front.x + content.x}, ${front.y + content.y})`}
      >
        {/* header: gear icon, title, dots */}
        {(() => {
          const {
            icon,
            title,
            iconSize,
            fontSize,
            height,
            dotsX,
            dotRadius,
            dotGap,
          } = header;
          return (
            <g transform={`translate(0, ${rows.starts[0]})`}>
              <Settings
                x={icon.x}
                y={icon.y}
                size={iconSize}
                stroke="var(--accent-electric)"
                strokeWidth={glyphStrokeLucide(iconSize, 0.9)}
              />
              <text
                x={title.x}
                y={title.y}
                dominantBaseline="central"
                fontSize={fontSize}
                fontWeight={500}
                fill="var(--accent-glow)"
                fillOpacity={0.9}
              >
                Automation Rules
              </text>
              <g transform={`translate(${dotsX}, 0)`}>
                <WindowDots height={height} radius={dotRadius} gap={dotGap} />
              </g>
            </g>
          );
        })()}

        {/* the rules, one row each */}
        <g transform={`translate(0, ${list.y})`}>
          {rules.map(({ icon: Icon, lines }, i) => {
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
                {/* the rule's text, one <text> per line */}
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
