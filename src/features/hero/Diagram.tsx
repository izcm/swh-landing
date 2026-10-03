import {
  centerInParent,
  diagramLayout,
  pointOnCircle,
} from "@/lib/svg/helpers";
import { RoundedIsoCube } from "../about/diagrams/software/RoundedIsoCube";
import {
  ISOCube,
  isoBottomCenter,
  isoCubeMetrics,
  isoTopCenter,
  standOn,
} from "@/lib/svg/ISOCube";
import { StandingSurface } from "@/lib/svg/StandingSurface";

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

      // small cube standing in the middle of the big cube's floor,
      // same as SoftwareDiagram's bottom-left group
      const innerCube = isoCubeMetrics(metrics.size / 2);
      const innerCubePos = standOn(isoBottomCenter(metrics), innerCube);

      return {
        ...metrics,
        innerCube,
        innerCubePos,
        // how far the small cube floats above the floor
        floatLift: 12,
        x: contentRing.centerX - unit * 0.5,
        y: contentRing.centerY - metrics.height * 0.5 - unit * 0.25,
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
      <defs>
        {/* center cube glass: lighter front/top, darker sides */}
        <linearGradient id="cubeSide" x1="0" y1="0" x2="1" y2="1">
          {/* saturated blue glass: same hue as --accent, more chroma so it
              doesn't wash out grey over the dark background */}
          <stop
            offset="0%"
            stopColor="oklch(from var(--accent) 0.55 0.18 h)"
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor="oklch(from var(--accent) 0.35 0.16 h)"
            stopOpacity="0.3"
          />
        </linearGradient>
        {/* <linearGradient id="cubeSide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
          <stop
            offset="100%"
            stopColor="var(--accent-deep)"
            stopOpacity="0.15"
          />
        </linearGradient> */}
      </defs>

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
                  {/* shadow on the floor, under the floating cube. iso-flattened ellipse */}
                  <ellipse
                    className="float-shadow"
                    cx={centerNode.size / 2}
                    cy={centerNode.height - centerNode.depth}
                    rx={centerNode.innerCube.size * 0.4}
                    ry={centerNode.innerCube.size * 0.4 * Math.tan(Math.PI / 6)}
                    fill="black"
                    opacity={0.4}
                    style={{ filter: "blur(4px)" }}
                  />
                  <g className="float-bob">
                    <ISOCube
                      x={centerNode.innerCubePos.x}
                      y={centerNode.innerCubePos.y - centerNode.floatLift}
                      size={centerNode.innerCube.size}
                      fill="oklch(from var(--ground) 0.2 0.12 h)"
                      stroke="oklch(from var(--ground) 0.65 0.12 h / 0.8)"
                      showBackEdges
                    />
                  </g>

                  <RoundedIsoCube
                    size={centerNode.size}
                    // thickness={centerNode.thickness}
                    showFrontEdge
                    // showBottom={false}
                    bottomFill="none"
                    topFill="url(#cubeSide)"
                    wallFill="url(#cubeSide)"
                    strokeWeight={1}
                    angle={30}
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

                    <StandingSurface
                      x={node.x}
                      y={node.y - platform.edgeLength}
                      size={platform.edgeLength}
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
