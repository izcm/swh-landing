import { Database, Mail, PanelsTopLeft, Users } from "lucide-react";

import { cn } from "@/lib/cn";
import {
  alignCenter,
  contentBoxLayout,
  glyphStrokeLucide,
  shortSideUnit,
  splitWithGaps,
  stackWithGaps,
} from "@/lib/svg";

const sourceData = [
  { label: "PowerOffice", icon: Users },
  { label: "Contracts", icon: PanelsTopLeft },
  { label: "Mailbox", icon: Mail },
];

const targetData = { label: "Transformed data", icon: Database };

function iconOverLabel(
  height: number,
  iconSize: number,
  fontSize: number,
  gap: number,
) {
  const { starts } = stackWithGaps([iconSize, fontSize], gap);
  const { offset } = alignCenter(height, iconSize + gap + fontSize);

  return {
    iconY: offset + starts[0],
    labelY: offset + starts[1] + fontSize * 0.5,
  };
}

export function ConnectingSystems({
  width,
  height,
  shares,
  paddingUnits = 0,
  rowGapUnits,
  sourceGapUnits,
  targetWidthShare,
  radius,
  iconSizeUnits,
  labelGapUnits,
  sourceFontSizeUnits,
  targetFontSizeUnits,
  arrowSizeUnits,
  strokeWidth,
  className,
}: {
  width: number;
  height: number;
  shares: { sources: number; connectors: number; target: number };
  paddingUnits?: number;
  rowGapUnits: number;
  sourceGapUnits: number;
  targetWidthShare: number;
  radius: number;
  iconSizeUnits: number;
  labelGapUnits: number;
  sourceFontSizeUnits: number;
  targetFontSizeUnits: number;
  arrowSizeUnits: number;
  strokeWidth: number;
  className?: string;
}) {
  const unit = shortSideUnit(width, height);
  const iconSize = unit * iconSizeUnits;
  const labelGap = unit * labelGapUnits;

  const { content, rows } = contentBoxLayout({
    width,
    height,
    unit,
    paddingXUnits: paddingUnits,
    paddingYUnits: paddingUnits,
    rowGapUnits,
    rowShares: [shares.sources, shares.connectors, shares.target],
  });

  const sourceBoxes = (() => {
    const groupWidth = content.width;
    const groupHeight = rows.sizes[0];
    const translateY = rows.starts[0];

    const { sizes, starts } = splitWithGaps(
      groupWidth,
      sourceData.map(() => 1 / sourceData.length),
      unit * sourceGapUnits,
    );
    const fontSize = unit * sourceFontSizeUnits;
    const { iconY, labelY } = iconOverLabel(
      groupHeight,
      iconSize,
      fontSize,
      labelGap,
    );

    const boxes = sourceData.map((source, i) => ({
      ...source,
      x: starts[i],
      width: sizes[i],
      centerX: starts[i] + sizes[i] * 0.5,
    }));

    return {
      groupWidth,
      groupHeight,
      translateY,
      fontSize,
      iconY,
      labelY,
      boxes,
    };
  })();

  const targetBox = (() => {
    const groupWidth = content.width * targetWidthShare;
    const groupHeight = rows.sizes[2];
    const {
      offset: translateX,
      relativeCenter,
      absoluteCenter: centerX,
    } = alignCenter(content.width, groupWidth);
    const translateY = rows.starts[2];

    const fontSize = unit * targetFontSizeUnits;
    const { iconY, labelY } = iconOverLabel(
      groupHeight,
      iconSize,
      fontSize,
      labelGap,
    );

    return {
      groupWidth,
      groupHeight,
      translateX,
      translateY,
      relativeCenter,
      centerX,
      fontSize,
      iconY,
      labelY,
    };
  })();

  const connectors = (() => {
    const top = rows.starts[1];
    const bottom = top + rows.sizes[1];
    const barY = top + rows.sizes[1] * 0.5;
    const arrowSize = unit * arrowSizeUnits;

    const first = sourceBoxes.boxes[0];
    const last = sourceBoxes.boxes[sourceBoxes.boxes.length - 1];
    const tipX = targetBox.centerX;

    const bar = `M ${first.centerX} ${top} V ${barY} H ${last.centerX} V ${top}`;
    const drops = sourceBoxes.boxes
      .slice(1, -1)
      .map(({ centerX }) => `M ${centerX} ${top} V ${barY}`);
    const stem = `M ${tipX} ${barY} V ${bottom}`;
    const arrowHead = `M ${tipX - arrowSize} ${bottom - arrowSize} L ${tipX} ${bottom} L ${tipX + arrowSize} ${bottom - arrowSize}`;

    return { d: [bar, ...drops, stem, arrowHead].join(" ") };
  })();

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full h-auto", className)}
      role="img"
      aria-label={targetData.label}
    >
      <g transform={`translate(${content.x}, ${content.y})`}>
        {/* connectors */}
        <path
          d={connectors.d}
          fill="none"
          stroke="var(--accent-muted)"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* source boxes */}
        <g transform={`translate(0, ${sourceBoxes.translateY})`}>
          {sourceBoxes.boxes.map(
            ({ label, icon: Icon, x, width: boxWidth, centerX }) => (
              <g key={label}>
                <rect
                  x={x}
                  width={boxWidth}
                  height={sourceBoxes.groupHeight}
                  rx={radius}
                  fill="var(--elevated-alt)"
                />
                <Icon
                  x={centerX - iconSize * 0.5}
                  y={sourceBoxes.iconY}
                  size={iconSize}
                  stroke="var(--accent)"
                  strokeWidth={glyphStrokeLucide(iconSize, strokeWidth)}
                />
                <text
                  x={centerX}
                  y={sourceBoxes.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={sourceBoxes.fontSize}
                  fill="var(--subtle)"
                >
                  {label}
                </text>
              </g>
            ),
          )}
        </g>

        {/* target box */}
        {(() => {
          const {
            translateX,
            translateY,
            groupWidth,
            groupHeight,
            relativeCenter,
            iconY,
            labelY,
            fontSize,
          } = targetBox;
          const { label, icon: Icon } = targetData;
          return (
            <g transform={`translate(${translateX}, ${translateY})`}>
              <rect
                width={groupWidth}
                height={groupHeight}
                rx={radius}
                fill="var(--elevated-alt)"
              />
              <Icon
                x={relativeCenter - iconSize * 0.5}
                y={iconY}
                size={iconSize}
                stroke="var(--accent)"
                strokeWidth={glyphStrokeLucide(iconSize, strokeWidth)}
              />
              <text
                x={relativeCenter}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={fontSize}
                fontWeight={600}
                fill="var(--fg)"
              >
                {label}
              </text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
