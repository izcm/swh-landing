import { FileSpreadsheet, Cloud, FileText, Settings } from "lucide-react";
import { ISOCube } from "@/lib/svg/ISOCube";
import { StandingSurface } from "@/lib/svg/StandingSurface";
import { isoCubeMetrics, isoTopCenter, pointOnCircle } from "@/lib/svg/helpers";

// dots on the ring, each with a platform + standing surface
export function Orbit({
  contentRing,
  unit,
  contentHeight,
  angles,
}: {
  contentRing: { radius: number; centerX: number; centerY: number };
  unit: number;
  contentHeight: number;
  angles: { angleA: number; angleB: number };
}) {
  const platformSize = unit * 2.8;
  const platform = isoCubeMetrics(platformSize, contentHeight / 40, angles);

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

  // stands along the platform's front-left edge, so it uses angle A
  // const surfaceSize = platform.b.edgeLength;
  const surfaceSize = platform.a.edgeLength * 0.85;
  const standingSurface = {
    size: surfaceSize,
    depth: surfaceSize * Math.tan((angles.angleA * Math.PI) / 180),
  };

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
    const overflow = Math.max(...corners.map((c) => c.x * out.x + c.y * out.y));

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

  // middle of the platform's top face, from its top-left corner
  const topCenter = isoTopCenter(platform);

  return (
    <g className="float-bob-adjust-for-less-annoyance-later">
      {nodes.map((node, i) => (
        <>
          <circle key={i} cx={node.x} cy={node.y} r={4} fill="#9cc5a8" />

          {/* PLATFORM */}
          <ISOCube
            x={platformPoints[i].x - topCenter.x}
            y={platformPoints[i].y - topCenter.y}
            size={platform.size}
            thickness={platform.thickness}
            strokeWeight={0.7}
            showGrid
            {...angles}
          />

          <StandingSurface
            {...standingSurfaces[i]}
            radius={8}
            angle={angles.angleA}
            fill="var(--hero-standing-surface-fill)"
            stroke="var(--node-border-color)"
          />
        </>
      ))}
    </g>
  );
}
