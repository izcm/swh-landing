import {
  centerInParent,
  diagramLayout,
  pointOnCircle,
} from "@/lib/svg/helpers";
import { RoundedIsoCube } from "../about/diagrams/software/RoundedIsoCube";
import { isoCubeMetrics, isoTopCenter } from "@/lib/svg/ISOCube";

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
    const nodeSize = unit * 2.8;

    // same dims as SoftwareDiagram's platform: size = cube group (2 × 500/8) × 1.5,
    // thickness = its unit / 2 (400 / 12 / 2)
    const platform = isoCubeMetrics(nodeSize, contentHeight / 40);

    const contentRing = {
      radius: groupWidth / 2,
      // middle of a square box as tall as the content box
      centerX: groupWidth / 2,
      centerY: groupHeight / 2,
    };

    const pointOnContentRing = (degrees: number) =>
      pointOnCircle({ angle: (degrees * Math.PI) / 180, circle: contentRing });
    const nodes = [
      pointOnContentRing(90),
      pointOnContentRing(157),
      pointOnContentRing(210),
      pointOnContentRing(270),
    ];

    // corners of the platform's outline, measured from the point it's pinned
    // by (the middle of its top face)
    const corners = [
      { x: 0, y: -platform.depth }, // top tipop
      { x: -platform.size / 2, y: 0 }, // left
      { x: platform.size / 2, y: 0 }, // right
      { x: -platform.size / 2, y: platform.thickness }, // left, bottom
      { x: platform.size / 2, y: platform.thickness }, // right, bottom
      { x: 0, y: platform.depth + platform.thickness }, // front tip, bottom
    ];

    // each platform: start at its dot, then step back toward the center by
    // as much as it sticks out past the ring. the dots and ring don't move
    const platformPoints = nodes.map((node) => {
      // direction from the center to the dot, one step long
      const out = {
        x: (node.x - contentRing.centerX) / contentRing.radius,
        y: (node.y - contentRing.centerY) / contentRing.radius,
      };

      // how far the corner that sticks out most is past the dot, along `out`
      const overflow = Math.max(
        ...corners.map((c) => c.x * out.x + c.y * out.y),
      );

      return {
        x: node.x - out.x * overflow,
        y: node.y - out.y * overflow,
      };
    });

    const translateX = 0; // flush with the content box's left edge
    const { translateY } = centerInParent(contentHeight, groupHeight);

    const centerNode = (() => {
      const metrics = isoCubeMetrics(150);

      return {
        ...metrics,
        x: contentRing.centerX - unit,
        y: contentRing.centerY - metrics.height / 2 - unit / 4,
      };
    })();

    return {
      groupWidth,
      groupHeight,
      nodeSize,
      contentRing,
      nodes,
      platformPoints,
      translateX,
      translateY,
      centerNode,
      platform,
    };
  })();

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      {/* everything inside starts at the content box's top-left */}
      <g transform={`translate(${contentX}, ${contentY})`}>
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
            const {
              contentRing,
              groupWidth,
              groupHeight,
              nodes,
              platformPoints,
              centerNode,
              platform,
            } = leftBox;

            // middle of the platform's top face, from its top-left corner
            const topCenter = isoTopCenter(platform);

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

                <g transform={`translate(${centerNode.x}, ${centerNode.y})`}>
                  <RoundedIsoCube
                    size={centerNode.size}
                    // thickness={centerNode.thickness}
                    showFrontEdge
                    bottomFill="oklch(from var(--accent) 0.2 0.06 h)"
                    topFill="oklch(from var(--accent) 0.15 0.06 h / 0.3)"
                    wallFill="oklch(from var(--accent) 0.15 0.06 h / 0.3)"
                    strokeWeight={0.85}
                  />
                </g>

                {nodes.map((node, i) => (
                  <>
                    <circle
                      key={i}
                      cx={node.x}
                      cy={node.y}
                      r={4}
                      fill="#9cc5a8"
                    />

                    {/* PLATFORM */}
                    <RoundedIsoCube
                      x={platformPoints[i].x - topCenter.x}
                      y={platformPoints[i].y - topCenter.y}
                      size={platform.size}
                      thickness={platform.thickness}
                      strokeWeight={0.7}
                      showGrid
                    />
                  </>
                ))}
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
