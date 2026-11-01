import { spaceBetween, stackWithGaps, Tube } from "@/lib/svg";

// a title and a dimmer subtitle at the top, a filled tube at the bottom.
export function KPICardContent({
  width,
  height,
  lineHeight,
  lineGap,
  level,
}: {
  width: number;
  height: number;
  lineHeight: number; // each tube's thickness
  lineGap: number; // between the title and the subtitle
  level: number; // how full the bottom tube is, 0-1
}) {
  // two groups, space between: title + subtitle, then the filled tube
  const groupSizes = [lineHeight * 2 + lineGap, lineHeight];
  const [textY, barY] = groupSizes.map((itemSize, index) =>
    spaceBetween({
      index,
      itemCount: groupSizes.length,
      itemSize,
      start: 0,
      end: height,
    }),
  );
  const lines = stackWithGaps([lineHeight, lineHeight], lineGap);

  return (
    <>
      {/* title: brighter, longer */}
      <Tube
        y={textY + lines.starts[0]}
        width={width}
        height={lineHeight}
        level={0.85}
        fill="var(--accent-electric)"
        fillOpacity={0.6}
      />
      {/* subtitle: dim, shorter */}
      <Tube
        y={textY + lines.starts[1]}
        width={width}
        height={lineHeight}
        level={0.5}
        fill="var(--accent-electric)"
        fillOpacity={0.38}
      />
      {/* filled tube: a faint accent track, partly filled */}
      <Tube
        y={barY}
        width={width}
        height={lineHeight}
        level={level}
        fill="var(--accent)"
        fillOpacity={0.58}
        trackColor="var(--accent)"
        trackOpacity={0.16}
      />
    </>
  );
}
