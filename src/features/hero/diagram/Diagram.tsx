// shared svg helpers
import { alignCenter, paddedBox, dropAlongEdge, pointOnLine } from "@/lib/svg";

// this diagram's own parts
import { HeroDefs } from "./Defs";

// positions (no drawing)
import { heroLayout } from "./geometry/layout";
import { heroConnectors } from "./geometry/connectors";
import { heroSnailPoints } from "./geometry/snail";

// left box
import { Centerpiece } from "./left/Centerpiece";
import { Orbit } from "./left/Orbit";

// right box
import { HeroAppWindows } from "./right/HeroAppWindows";

// the hero's camera: A = front-left edges (24°), B = front-right edges (30°)
const heroAngles = { angleA: 22.5, angleB: 30 };

// debug lines have className="svg-debug". show/hide them in diagram.css
export function HeroDiagram() {
  const viewboxWidth = 650; // or 720 ?? hard choice
  const viewboxHeight = 500;

  const { contentX, contentY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    0, // 0 padding
  );

  const rightBox = (() => {
    const groupWidth = contentWidth * 0.4;
    const groupHeight = contentHeight * 0.8;

    const translateX = contentWidth - groupWidth;

    const { offset: translateY } = alignCenter(contentHeight, groupHeight);

    return {
      groupWidth,
      groupHeight,
      translateX,
      translateY,
    };
  })();

  const leftBox = (() => {
    const groupWidth = contentWidth - rightBox.groupWidth;
    const groupHeight = contentHeight;

    const translateX = 0; // flush with the content box's left edge
    const { offset: translateY } = alignCenter(contentHeight, groupHeight);

    // shared by the orbit and the centerpiece
    const contentRing = {
      radius: groupWidth / 2,
      // middle of a square box as tall as the content box
      centerX: groupWidth / 2,
      centerY: groupHeight / 2,
    };

    return {
      groupWidth,
      groupHeight,
      translateX,
      translateY,
      contentRing,
    };
  })();

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`} overflow="visible">
      <HeroDefs />

      {/* everything inside starts at the content box's top-left */}
      <g transform={`translate(${contentX}, ${contentY})`}>
        {/* debug: content box (inside the padding) */}
        <rect
          className="svg-debug"
          x={0}
          y={0}
          width={contentWidth}
          height={contentHeight}
          fill="none"
          stroke="#e8a0a8" // dusty rosei
          strokeWidth={0.75}
          strokeDasharray="6 4"
        />
        {/* left: content ring */}
        <g
          transform={`translate(${leftBox.translateX}, ${leftBox.translateY})`}
        >
          {(() => {
            const { contentRing, groupWidth, groupHeight } = leftBox;
            // every position in the hero: use layout.centerpiece / layout.orbit
            // here to draw anything between them (e.g. connectors)
            const layout = heroLayout({
              contentRing,
              unit,
              contentHeight,
              angles: heroAngles,
            });

            const { centerpiece } = layout;

            const centerpieceConnectorOut = {
              x: centerpiece.x + centerpiece.cube.size,
              y:
                centerpiece.y +
                centerpiece.cube.depth +
                centerpiece.cube.thickness * 0.6,
            };

            const run = rightBox.translateX - centerpieceConnectorOut.x;

            const rightboxConnectorIn = {
              x: centerpieceConnectorOut.x + run,
              y:
                centerpieceConnectorOut.y +
                dropAlongEdge({ run, angle: heroAngles.angleA }),
            };

            const snailStartPoint = pointOnLine(
              centerpieceConnectorOut,
              rightboxConnectorIn,
              0.32,
            );

            const snailEndPoint = rightboxConnectorIn;

            // start point, one point per platform, then the end point
            const snailPoints = heroSnailPoints(
              layout,
              contentRing,
              snailStartPoint,
              snailEndPoint,
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
                  stroke="#d9c79c" // sand
                  strokeWidth={0.75}
                  strokeDasharray="6 4"
                />

                <circle
                  className="svg-debug"
                  cx={contentRing.centerX}
                  cy={contentRing.centerY}
                  r={contentRing.radius}
                  fill="none"
                  stroke="#9cc5a8" // sage
                  strokeWidth={0.75}
                />

                {heroConnectors(layout, heroAngles).map(({ d }, i) => (
                  <path
                    key={i}
                    d={d}
                    stroke="var(--connector-color)"
                    strokeWidth={1}
                    fill="none"
                    strokeDasharray="8 12"
                  />
                ))}

                <path
                  d={`
                    M ${centerpieceConnectorOut.x} ${centerpieceConnectorOut.y} 
                    L ${rightboxConnectorIn.x} ${rightboxConnectorIn.y}`}
                  stroke="var(--connector-color)"
                  strokeWidth={1}
                  strokeDasharray="8 12"
                />

                <Centerpiece {...layout.centerpiece} angles={heroAngles} />

                <Orbit
                  {...layout.orbit}
                  angles={heroAngles}
                  platformBoxPoints={layout.orbit.platformPoints}
                />

                {/* debug: smooth curve through the snail points */}
                {/* <path
                  className="svg-debug-snail"
                  d={smoothPath(snailPoints)}
                  stroke="var(--accent-electric)"
                  fill="none"
                  strokeWidth={0.4}
                  strokeDasharray="8 10"
                /> */}
                {/* <path
                  className="svg-debug-snail"
                  d={`
                  M ${snailPoints[0].x} ${snailPoints[0].y}

                  C ${snailPoints[0].x - 80} ${snailPoints[0].y + 30}
                    ${snailPoints[1].x + 40} ${snailPoints[1].y + 60}
                    ${snailPoints[1].x} ${snailPoints[1].y}

                  C ${snailPoints[1].x - 50} ${snailPoints[1].y - 60}
                    ${snailPoints[2].x - 50} ${snailPoints[2].y + 60}
                    ${snailPoints[2].x} ${snailPoints[2].y}

                  C ${snailPoints[2].x + 50} ${snailPoints[2].y - 60}
                    ${snailPoints[3].x - 60} ${snailPoints[3].y - 30}
                    ${snailPoints[3].x} ${snailPoints[3].y}

                  C ${snailPoints[3].x + 70} ${snailPoints[3].y + 30}
                    ${snailPoints[4].x - 50} ${snailPoints[4].y - 30}
                    ${snailPoints[4].x} ${snailPoints[4].y}
                `}
                  stroke="var(--accent-electric)"
                  fill="none"
                  strokeWidth={0.4}
                  strokeDasharray="8 10"
                /> */}

                {/* {snailPoints.map((point, i) => (
                  <circle
                    key={i}
                    className="svg-debug-snail"
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill="red"
                  />
                ))} */}
              </>
            );
          })()}
        </g>
        {/* right box */}
        <HeroAppWindows
          x={rightBox.translateX}
          y={rightBox.translateY}
          width={rightBox.groupWidth}
          height={rightBox.groupHeight}
          angle={heroAngles.angleA}
        />
      </g>
    </svg>
  );
}
