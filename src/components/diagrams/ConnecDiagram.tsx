import { Shuffle, FileText, Users, Box } from "lucide-react";
import { spaceAround, glyphStroke, spaceEvenly } from "../../lib/svg-helpers";

const nodeIcons = {
  Accounting: FileText,
  HR: Users,
  Others: Box,
};

export function ConnectDiagram() {
  const viewboxWidth = 360;
  const viewboxHeight = 160;

  const outerPadding = 10; // top, bottom, left, right
  const contentHeight = viewboxHeight - outerPadding * 2;

  const iconSize = {
    shuffle: 24,
  };

  const nodes = ["Accounting", "HR", "Others"] as const;

  const fontSize = 10;
  const nodeWidth = 110;
  const nodeHeight = fontSize * 2.7;
  const nodeIconSize = 16;
  const nodeIconGap = 10;

  const rightmostPiece = {
    width: 110,
    height: contentHeight * 0.6,
  };

  // absolute x where the node connectors converge, and where the box's
  // left edge sits (box hugs the right edge with exactly `padding` gap)
  const mergeX = outerPadding + nodeWidth + 24;
  const boxX = viewboxWidth - outerPadding - rightmostPiece.width;
  const boxY = (viewboxHeight - rightmostPiece.height) / 2;
  // shuffle icon sits at the midpoint between the two, so the connector
  // line has equal breathing room on either side of it
  const shuffleCenterX = (mergeX + boxX) / 2;

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      <g
        transform={`translate(${outerPadding}, ${outerPadding})`}
        fill="none"
        stroke="var(--connector-color)"
        strokeWidth="var(--connector-weight)"
        strokeLinecap="round"
      >
        {(() => {
          const center =
            spaceEvenly(1, 3, nodeHeight, 0, contentHeight) + nodeHeight / 2;
          const destX = mergeX - outerPadding;
          const connectorCurveRadius = 12;

          return (
            <>
              {nodes.map((_, i) => {
                const y =
                  spaceEvenly(i, nodes.length, nodeHeight, 0, contentHeight) +
                  nodeHeight / 2;

                const bend = y === center ? 0 : y > center ? -1 : 1;

                return (
                  <path
                    key={i}
                    d={`
                      M ${nodeWidth} ${y}
                      H ${destX - connectorCurveRadius}
                      Q ${destX} ${y} 
                        ${destX} ${y + connectorCurveRadius * bend}
                      V${center}`}
                  />
                );
              })}
              <circle
                className="accent-dot"
                r="2.4"
                cx={destX}
                cy={center}
                fill="var(--accent)"
                strokeWidth="var(--node-stroke-width)"
                filter="drop-shadow(0 0 3px var(--accent))"
              />

              <path
                d={`
                  M ${destX} ${center}
                  H ${boxX - outerPadding}
                `}
              />
            </>
          );
        })()}
      </g>

      <g transform={`translate(${outerPadding}, ${outerPadding})`}>
        {nodes.map((system, i) => {
          const itemHeight = nodeHeight;

          const y = spaceEvenly(i, nodes.length, itemHeight, 0, contentHeight);

          const Icon = nodeIcons[system];

          return (
            <g key={system}>
              <rect
                x={0}
                y={y}
                width={nodeWidth}
                height={itemHeight}
                rx="var(--rx-node-lg)"
                fill="var(--node-color)"
                stroke="var(--node-border-color)"
                strokeWidth="var(--node-stroke-width)"
              />

              <Icon
                x={nodeIconGap}
                y={y + itemHeight / 2 - nodeIconSize / 2}
                size={nodeIconSize}
                strokeWidth={glyphStroke(nodeIconSize, 0.5)}
                stroke="var(--fg)"
              />

              <text
                x={nodeIconGap + nodeIconSize + nodeIconGap}
                y={y + itemHeight / 2}
                dominantBaseline="middle"
                textAnchor="start"
                fill="var(--fg)"
                fontSize={fontSize}
                fontFamily="inherit"
                letterSpacing="0.02em"
              >
                {system}
              </text>
            </g>
          );
        })}
      </g>
      {/* Transform */}
      <g
        transform={`translate(
    ${shuffleCenterX - iconSize.shuffle / 2},
    ${(viewboxHeight - iconSize.shuffle) / 2}
  )`}
      >
        <circle
          cx={iconSize.shuffle / 2}
          cy={iconSize.shuffle / 2}
          r={iconSize.shuffle / 2 + 9}
          fill="var(--raised)"
          stroke="var(--accent)"
          strokeWidth="var(--node-stroke-width)"
        />

        <Shuffle
          size={iconSize.shuffle}
          strokeWidth={glyphStroke(iconSize.shuffle)}
          stroke="var(--fg)"
        />
      </g>

      {/* Structured output */}
      {(() => {
        const x = boxX;
        const y = boxY;
        const width = rightmostPiece.width;
        const height = rightmostPiece.height;

        const paddingX = 8;
        const paddingY = 4;

        const rowCount = 3;
        const rowHeight = (height - paddingY * 2) / rowCount;

        const avatarSize = 12;
        // no * 2 here, see (*) below
        const contentX = x + paddingX + avatarSize + 8;

        return (
          <g>
            {/* outer container */}
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx="var(--rx-node-lg)"
              fill="var(--node-color)"
              stroke="var(--node-border-color)"
              strokeWidth="var(--node-stroke-width)"
            />

            {/* rows */}
            {Array.from({ length: rowCount }).map((_, i) => {
              const rowY = y + paddingY + i * rowHeight;
              const centerY = rowY + rowHeight / 2;

              return (
                <g key={i}>
                  {/* separators */}
                  {i > 0 && (
                    <line
                      x1={x + paddingX}
                      y1={rowY}
                      x2={x + width - paddingX} // (*) other edge, padding again
                      y2={rowY}
                      stroke="var(--node-border-color)"
                      strokeWidth="var(--node-stroke-width)"
                      opacity={0.55}
                    />
                  )}

                  {/* avatar */}
                  <rect
                    x={x + paddingX}
                    y={centerY - avatarSize / 2}
                    width={avatarSize}
                    height={avatarSize}
                    rx={3}
                    fill="var(--node-border-color)"
                  />

                  {/* primary */}
                  <rect
                    x={contentX}
                    y={centerY - 5}
                    width={width * (0.34 + i * 0.04)}
                    height={3}
                    rx={1.5}
                    fill="var(--node-border-color)"
                  />

                  {/* secondary */}
                  <rect
                    x={contentX}
                    y={centerY + 2}
                    width={width * (0.5 - i * 0.04)}
                    height={3}
                    rx={1.5}
                    fill="var(--muted)"
                  />
                </g>
              );
            })}
          </g>
        );
      })()}
    </svg>
  );
}
