// shared svg helpers
import { alignCenter, paddedBox, dropAlongEdge } from "@/lib/svg/helpers";

// this diagram's own parts
import { Centerpiece } from "./Centerpiece";
import { heroConnectors } from "./connectors";
import { HeroDefs } from "./Defs";
import { HeroAppWindows } from "./HeroAppWindows";
import { heroLayout } from "./layout";
import { Orbit } from "./Orbit";

// the hero's camera: A = front-left edges (24°), B = front-right edges (30°)
const heroAngles = { angleA: 22.5, angleB: 30 };

// debug lines have className="svg-debug". show/hide them in diagram.css
export function HeroDiagram() {
  const viewboxWidth = 700;
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

            // angle = heroAngleA
            // run = rightbox translateX - connectorOut.x

            const run = rightBox.translateX - centerpieceConnectorOut.x;

            const rightboxConnectorIn = {
              x: centerpieceConnectorOut.x + run,
              y:
                centerpieceConnectorOut.y +
                dropAlongEdge({ run, angle: heroAngles.angleA }),
            };

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

                <rect
                  className="svg-debug"
                  x={centerpiece.x}
                  y={centerpiece.y}
                  width={centerpiece.cube.size}
                  height={centerpiece.cube.height}
                  fill="none"
                  stroke="var(--accent)" // sand
                  strokeWidth={0.75}
                  strokeDasharray="6 4"
                />

                {heroConnectors(layout, heroAngles).map(({ d }, i) => (
                  <path
                    key={i}
                    d={d}
                    stroke="var(--connector-color)"
                    strokeWidth={1}
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
