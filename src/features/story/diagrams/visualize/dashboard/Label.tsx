import { listItemLayout, Tube } from "@/lib/svg";

// the label: a dot, then a title with a subtitle under it, centered in the
// row's height. drawn from (0, 0)
export function Label({
  width,
  height,
}: {
  width: number; // the label row's width
  height: number; // the label row's height
}) {
  const item = (() => {
    const dotRadius = height * 0.2;
    const lineHeight = dotRadius * 0.5;

    return listItemLayout({
      height,
      leadingInset: 0,
      leadingRadius: dotRadius,
      gap: lineHeight * 2,
      lineHeights: [lineHeight, lineHeight], // title, subtitle
      lineGap: lineHeight,
    });
  })();

  const { leading, text } = item;
  const textWidth = width - text.x;

  return (
    <>
      <circle
        cx={leading.cx}
        cy={leading.cy}
        r={leading.radius}
        fill="var(--accent)"
        fillOpacity={0.8}
      />
      <g transform={`translate(${text.x}, ${text.y})`}>
        {/* title: bright, shorter */}
        <Tube
          x={0}
          y={text.lineStarts[0]}
          width={textWidth}
          height={text.lineHeights[0]}
          level={0.5}
          fill="var(--accent-electric)"
        />
        {/* subtitle: dim, longer */}
        <Tube
          x={0}
          y={text.lineStarts[1]}
          width={textWidth}
          height={text.lineHeights[1]}
          level={0.8}
          fill="var(--accent-electric)"
          fillOpacity={0.3}
        />
      </g>
    </>
  );
}
