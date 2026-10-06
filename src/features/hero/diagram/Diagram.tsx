import { centerInParent, diagramLayout } from "@/lib/svg/helpers";
import { Centerpiece } from "./Centerpiece";
import { HeroDefs } from "./Defs";
import { heroLayout } from "./layout";
import { Orbit } from "./Orbit";

// the hero's camera: A = front-left edges (24°), B = front-right edges (30°)
const heroAngles = { angleA: 24, angleB: 30 };

export function HeroDiagram() {
  const viewboxWidth = 800;
  const viewboxHeight = 500;

  const { contentX, contentY, contentWidth, contentHeight, unit } =
    diagramLayout(
      viewboxWidth,
      viewboxHeight,
      0.5, // large viewbox gives too much padding here
    );

  const rightBox = (() => {
    const groupWidth = contentWidth * 0.42;
    const groupHeight = contentHeight * 0.8;

    const translateX = contentWidth - groupWidth;

    const { translateY } = centerInParent(contentHeight, groupHeight);

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
    const { translateY } = centerInParent(contentHeight, groupHeight);

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
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      <HeroDefs />

      {/* everything inside starts at the content box's top-left */}
      <g transform={`translate(${contentX}, ${contentY})`}>
        {/* debug: content box (inside the padding) */}
        <rect
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

            const { orbit, centerpiece } = layout;

            // where each connector leaves the centerpiece
            const {
              x: cubeX,
              y: cubeY,
              cube: { size, depth, thickness, b },
            } = centerpiece;

            const connectorStartingPoints = [
              { x: cubeX, y: cubeY + depth + thickness * 0.8 },
              { x: cubeX + b.run, y: cubeY },
              { x: cubeX + size, y: cubeY + depth + thickness / 2 },
              // { x: cubeX + size, y: cubeY + depth + thickness / 2 },
            ];

            return (
              <>
                <rect
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
                  cx={contentRing.centerX}
                  cy={contentRing.centerY}
                  r={contentRing.radius}
                  fill="none"
                  stroke="#9cc5a8" // sage
                  strokeWidth={0.75}
                />

                <rect
                  x={0}
                  y={0}
                  width={groupWidth}
                  height={groupHeight}
                  fill="none"
                  stroke="#d9c79c" // sand
                  strokeWidth={0.75}
                  strokeDasharray="6 4"
                />

                {connectorStartingPoints.map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r={2.5}
                    fill="#9cc5a8"
                    stroke="#9cc5a8" // sage
                    strokeWidth={0.75}
                  />
                ))}

                <rect
                  x={centerpiece.x}
                  y={centerpiece.y}
                  width={centerpiece.cube.size}
                  height={centerpiece.cube.height}
                  fill="none"
                  stroke="var(--accent)" // sand
                  strokeWidth={0.75}
                  strokeDasharray="6 4"
                />

                <Centerpiece {...layout.centerpiece} angles={heroAngles} />

                <Orbit {...layout.orbit} angles={heroAngles} />
              </>
            );
          })()}
        </g>
        {/* right box */}
        <g
          transform={`translate(${rightBox.translateX}, ${rightBox.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={rightBox.groupWidth}
            height={rightBox.groupHeight}
            fill="none"
            stroke="#aab4e6" // lavender
            strokeWidth={0.75}
            strokeDasharray="6 4"
          />
        </g>
      </g>
    </svg>
  );
}
