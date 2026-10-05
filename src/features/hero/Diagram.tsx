import {
  centerInParent,
  diagramLayout,
  pointOnCircle,
} from "@/lib/svg/helpers";
import {
  RoundedIsoCube,
  glassCube,
} from "../about/diagrams/software/RoundedIsoCube";
import {
  isoBottomCenter,
  isoCubeMetrics,
  isoTopCenter,
  standOn,
} from "@/lib/svg/ISOCube";
import { FileSpreadsheet, Cloud, FileText, Settings } from "lucide-react";
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

    const translateX = 0; // flush with the content box's left edge
    const { translateY } = centerInParent(contentHeight, groupHeight);

    // shared by both groups below
    const contentRing = {
      radius: groupWidth / 2,
      // middle of a square box as tall as the content box
      centerX: groupWidth / 2,
      centerY: groupHeight / 2,
    };

    // dots on the ring, each with a platform + standing surface
    const orbit = (() => {
      const platformSize = unit * 2.8;
      const platform = isoCubeMetrics(platformSize, contentHeight / 40);

      const pointOnContentRing = (degrees: number) =>
        pointOnCircle({
          angle: (degrees * Math.PI) / 180,
          circle: contentRing,
        });
      const nodes = [
        pointOnContentRing(90),
        pointOnContentRing(157),
        pointOnContentRing(210),
        pointOnContentRing(270),
      ];

      const standingSurface = {
        size: platform.edgeLength,
        depth: platform.edgeLength * Math.tan(Math.PI / 6),
      };

      // const nodeWidth = platform.size;
      // const nodeHeight = (() => {
      //   const { depth, thickness, edgeLength } = platform;
      //   return depth + thickness + edgeLength;
      // })();

      // corners of the platform's outline, measured from the point it's pinned
      // by (the middle of its top face)
      const corners = [
        { x: 0, y: -platform.depth }, // top tipop
        { x: -platform.size / 2, y: 0 }, // left
        { x: platform.size / 2, y: 0 }, // right
        { x: -platform.size / 2, y: platform.thickness }, // left, bottom
        { x: platform.size / 2, y: platform.thickness }, // right, bottom
        { x: 0, y: platform.depth + platform.thickness }, // front tip, bottom
        { x: -platform.size / 4, y: -standingSurface.size }, // surface top-left
        {
          x: -platform.size / 4 + standingSurface.size,
          y: -standingSurface.size + standingSurface.depth,
        }, // surface top-right
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

      // one standing surface per dot, standing on its platform
      // one icon per node, in the same order as `nodes` (90°, 157°, 210°, 270°)
      const nodeIcons = [
        { icon: Settings, iconStroke: "url(#hero-settings-gradient)" },
        { icon: FileText, iconStroke: "url(#hero-document-gradient)" },
        { icon: Cloud, iconStroke: "url(#hero-cloud-gradient)" },
        { icon: FileSpreadsheet, iconStroke: "url(#hero-sheet-gradient)" },
      ];

      const standingSurfaces = platformPoints.map((point, i) => ({
        x: point.x - platform.size / 4,
        y: point.y - standingSurface.size,
        size: standingSurface.size,
        ...nodeIcons[i],
      }));

      return {
        platform,
        nodes,
        platformPoints,
        standingSurfaces,
      };
    })();

    // the big glass cube in the middle, with a small cube floating inside
    const centerpiece = (() => {
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
        x: contentRing.centerX - unit,
        y: contentRing.centerY - metrics.height * 0.5,
      };
    })();

    return {
      groupWidth,
      groupHeight,
      translateX,
      translateY,
      contentRing,
      orbit,
      centerpiece,
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
        {/* icon colors, same as Map.tsx. 0–24 = lucide's own icon box */}
        <linearGradient
          id="hero-cloud-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#67D4FF" />
          <stop offset="100%" stopColor="#269BFF" />
        </linearGradient>
        <linearGradient
          id="hero-settings-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#A7A1FF" />
          <stop offset="100%" stopColor="#747BFF" />
        </linearGradient>
        <linearGradient
          id="hero-document-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#EDF7FF" />
          <stop offset="100%" stopColor="#A9CBE8" />
        </linearGradient>
        <linearGradient
          id="hero-sheet-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor="#8AF0D4" />
          <stop offset="100%" stopColor="#42D6AC" />
        </linearGradient>
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
            const { contentRing, groupWidth, groupHeight, orbit, centerpiece } =
              leftBox;
            const { nodes, platformPoints, platform, standingSurfaces } = orbit;

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

                {/* centerpiece */}
                <g transform={`translate(${centerpiece.x}, ${centerpiece.y})`}>
                  {/* shadow on the floor, under the floating cube. iso-flattened ellipse */}
                  <ellipse
                    className="float-shadow"
                    cx={centerpiece.size / 2}
                    cy={centerpiece.height - centerpiece.depth}
                    rx={centerpiece.innerCube.size * 0.4}
                    ry={
                      centerpiece.innerCube.size * 0.4 * Math.tan(Math.PI / 6)
                    }
                    fill="black"
                    opacity={0.4}
                    style={{ filter: "blur(4px)" }}
                  />
                  <g className="float-bob">
                    <RoundedIsoCube
                      {...glassCube}
                      x={centerpiece.innerCubePos.x}
                      y={centerpiece.innerCubePos.y - centerpiece.floatLift}
                      size={centerpiece.innerCube.size}
                      topFill="oklch(from var(--ground) 0.15 0.12 h / 0.8)"
                      wallFill="oklch(from var(--ground) 0.15 0.12 h / 0.8)"
                      // was / 0.8 drawn twice; one layer at 0.96 looks the same
                      stroke="oklch(from var(--ground) 0.65 0.12 h / 0.96)"
                      showBackEdges
                    />
                  </g>

                  <RoundedIsoCube
                    size={centerpiece.size}
                    // thickness={centerpiece.thickness}
                    showFrontEdge
                    // showBottom={false}
                    bottomFill="none"
                    topFill="url(#cubeSide)"
                    wallFill="url(#cubeSide)"
                    strokeWeight={1}
                  />
                </g>

                {/* orbit: dots, platforms, standing surfaces */}
                <g>
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
                        {...standingSurfaces[i]}
                        radius={12}
                        // angle={24} // 24 is good for what we want use this for platform frontangle to
                      />
                    </>
                  ))}
                </g>
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
