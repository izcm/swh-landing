import {
  centerInParent,
  diagramLayout,
  dropAlongEdge,
  isoCubePoints,
  isoTopCenter,
  pointOnLine,
  type Point,
} from "@/lib/svg/helpers";
import { Centerpiece } from "./Centerpiece";
import { HeroDefs } from "./Defs";
import { heroLayout } from "./layout";
import { Orbit } from "./Orbit";

// the hero's camera: A = front-left edges (24°), B = front-right edges (30°)
const heroAngles = { angleA: 22.5, angleB: 30 };

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

            const testConnectors = orbit.nodes;

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

                <Orbit
                  {...layout.orbit}
                  angles={heroAngles}
                  platformBoxPoints={layout.orbit.platformPoints}
                />

                {testConnectors.map((out, i) => {
                  let color = "#e8a0a8"; // dusty rose
                  let boxCenterpieceX = centerpiece.x;

                  const platformCenter = orbit.platformCenterPoints[i];
                  const platformBox = orbit.platformPoints[i];

                  if (out.y > contentRing.centerY) {
                    color = "#d9c79c"; // sand
                  }

                  const { platform } = orbit;

                  // if platformBoxPoints.y > centerpiece.y -> lower part of circle
                  // the connector goes out from topBack - topRight corner middle of edge
                  // else -> connector goes out from topRight to topFront corner
                  // and specil cases for angles where no edge suits)
                  const cubeMiddleY =
                    centerpiece.y + centerpiece.cube.height / 2;
                  const isLower = platformCenter.y > cubeMiddleY;

                  // the platform's corners, from isoCubePoints (drawn in a
                  // 100-wide box) scaled and moved to this platform's spot
                  const pts = isoCubePoints(
                    platform.size,
                    platform.thickness,
                    platform.a.angle,
                    platform.b.angle,
                  );
                  const at = (p: Point) => ({
                    x: platformBox.x + p.x * pts.scale,
                    y: platformBox.y + p.y * pts.scale,
                  });

                  const topBack = at(pts.topBack);
                  const topRight = at(pts.topRight);
                  const topFront = at(pts.topFront);

                  const atTopBackRight = (t: number) =>
                    pointOnLine(topBack, topRight, t);
                  const atTopFrontRight = (t: number) =>
                    pointOnLine(topRight, topFront, t);
                  const isSpecial = i === 0 || i === orbit.nodes.length - 1;

                  // special (top/bottom platforms): leave from the corner facing
                  // the cube. the rest: leave from the middle of the right edge
                  const connectorOut = isSpecial
                    ? isLower
                      ? atTopBackRight(0.25)
                      : atTopBackRight(0.25)
                    : isLower
                      ? atTopBackRight(0.5)
                      : atTopFrontRight(0.5);

                  const dx = boxCenterpieceX - connectorOut.x;

                  // normal: follow the iso angle. lower ones go up (B), upper
                  // ones go down (A). up is minus in SVG
                  const angle = isLower ? heroAngles.angleB : heroAngles.angleA;
                  const drop = dropAlongEdge({ run: dx, angle });

                  const dy = isSpecial
                    ? cubeMiddleY - connectorOut.y // straight to the cube's middle height
                    : isLower
                      ? -drop
                      : drop;

                  const centerCubeTopBack = {
                    x: centerpiece.x + centerpiece.cube.b.run,
                    y: centerpiece.y,
                  };

                  const centerCubeBottomFront = {
                    x: centerpiece.x + centerpiece.cube.a.run,
                    y: centerpiece.y + centerpiece.cube.height,
                  };

                  return (
                    <>
                      <circle
                        cx={centerCubeTopBack.x}
                        cy={centerCubeTopBack.y}
                        r={3}
                        fill="#9cc5a8"
                        strokeWidth={0.75}
                      />

                      <circle
                        cx={centerCubeBottomFront.x}
                        cy={centerCubeBottomFront.y}
                        r={3}
                        fill="#9cc5a8"
                        strokeWidth={0.75}
                      />

                      <path
                        d={`M ${connectorOut.x} ${connectorOut.y} l ${dx} ${dy}`}
                        stroke={color}
                        strokeWidth={0.75}
                        strokeDasharray="6 4"
                      />
                    </>
                  );
                })}
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
