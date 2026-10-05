import { centerInParent, diagramLayout } from "@/lib/svg/helpers";
import { Centerpiece } from "./Centerpiece";
import { HeroDefs } from "./Defs";
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
    const groupWidth = contentWidth * 0.4;
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
        cubeFro
        {/* debug: content box (inside the padding) */}
        <rect
          x={0}
          y={0}
          width={contentWidth}
          height={contentHeight}
          fill="none"
          stroke="#e8a0a8" // dusty rose
          strokeWidth={0.75}
          strokeDasharray="6 4"
        />
        {/* left: content ring */}
        <g
          transform={`translate(${leftBox.translateX}, ${leftBox.translateY})`}
        >
          {(() => {
            const { contentRing, groupWidth, groupHeight } = leftBox;

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

                <Centerpiece
                  contentRing={contentRing}
                  unit={unit}
                  angles={heroAngles}
                />

                <Orbit
                  contentRing={contentRing}
                  unit={unit}
                  contentHeight={contentHeight}
                  angles={heroAngles}
                />
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
