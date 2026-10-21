import { alignCenter, stackWithGaps } from "../logic";

// one list item in a row `height` tall: a leading circle (a dot, an icon's
// circle) `leadingInset` in from the left, then a block of lines `gap` after
// it, top to bottom, `lineGap` apart ([title] or [title, subtitle]). the
// circle and the block are both centered on the row's height. the text's
// width is left to the caller: it depends on what sits at the row's right end
export function listItemLayout({
  height,
  leadingInset,
  leadingRadius,
  gap,
  lineHeights,
  lineGap = 0,
}: {
  height: number; // the row's height
  leadingInset: number; // from the row's left edge to the circle
  leadingRadius: number;
  gap: number; // from the circle to the text
  lineHeights: number[]; // one per line, top to bottom
  lineGap?: number; // between lines. not needed for one line
}) {
  const leading = {
    cx: leadingInset + leadingRadius,
    cy: height / 2,
    radius: leadingRadius,
  };

  const { starts: lineStarts } = stackWithGaps(lineHeights, lineGap);
  const linesHeight =
    lineHeights.reduce((sum, lineHeight) => sum + lineHeight, 0) +
    lineGap * (lineHeights.length - 1);
  const { offset: y } = alignCenter(height, linesHeight);

  const text = {
    x: leading.cx + leading.radius + gap,
    y,
    lineHeights,
    lineStarts,
  };

  return { leading, text };
}
