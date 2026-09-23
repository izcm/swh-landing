import { Shuffle, FileText, Users, Box } from "lucide-react";
import { glyphStroke, spaceEvenly } from "../../lib/svg-helpers";
import { DataGrid } from "./DataGrid";

const nodeIcons = {
  Accounting: FileText,
  HR: Users,
  Others: Box,
};

export function ConnectDiagram() {
  const viewboxWidth = 300;
  const viewboxHeight = 100;

  const outerPadding = 8; // top, bottom, left, right
  const contentHeight = viewboxHeight - outerPadding * 2;

  const iconSize = {
    shuffle: 16,
  };

  const nodes = ["Accounting", "HR", "Others"] as const;

  const fontSize = 8;
  const nodeWidth = 96;
  const nodeHeight = fontSize * 2.4;
  const nodeIconSize = 12;
  const nodeIconGap = 7;

  const rightmostPiece = {
    width: 96,
    height: contentHeight * 0.72,
  };

  // absolute x where the node connectors converge, and where the box's
  // left edge sits (box hugs the right edge with exactly `padding` gap)
  const mergeX = outerPadding + nodeWidth + 16;
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
          // keep it for future proofing, but note for self:
          // as is, this will always equal containerHeight / 2
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
                letterSpacing="0em"
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
          r={iconSize.shuffle / 2 + 6}
          fill="var(--raised)"
          stroke="var(--accent)"
          strokeWidth="var(--node-stroke-width)"
        />

        <Shuffle size={iconSize.shuffle} strokeWidth={1} stroke="var(--fg)" />
      </g>

      {/* Structured output */}
      <DataGrid
        x={boxX}
        y={boxY}
        width={rightmostPiece.width}
        height={rightmostPiece.height}
      />
    </svg>
  );
}
