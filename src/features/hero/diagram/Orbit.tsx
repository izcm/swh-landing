import { FileSpreadsheet, Cloud, FileText, Settings } from "lucide-react";
import { ISOCube } from "@/lib/svg/ISOCube";
import { StandingSurface } from "@/lib/svg/StandingSurface";
import { isoCubeMetrics, type Point } from "@/lib/svg/helpers";

type IsoMetrics = ReturnType<typeof isoCubeMetrics>;

// dots on the ring, each with a platform + standing surface.
// positions come from heroLayout (layout.ts)
export function Orbit({
  platform,
  nodes,
  standingSurface,
  platformCenterPoints,
  platformBoxPoints,
  toDiamondCenter,
  angles,
}: {
  platform: IsoMetrics;
  nodes: Point[];
  standingSurface: { size: number; thickness: number; depth: number };
  platformBoxPoints: Point[];
  platformCenterPoints: Point[];
  toDiamondCenter: Point;
  angles: { angleA: number; angleB: number };
}) {
  // one standing surface per dot, standing on its platform
  // one icon per node, in the same order as `nodes` (90°, 157°, 210°, 270°)
  const nodeIcons = [
    { icon: Settings, iconStroke: "url(#hero-settings-gradient)" },
    { icon: FileText, iconStroke: "url(#hero-document-gradient)" },
    { icon: Cloud, iconStroke: "url(#hero-cloud-gradient)" },
    { icon: FileSpreadsheet, iconStroke: "url(#hero-sheet-gradient)" },
  ];

  const standingSurfaces = platformCenterPoints.map((point, i) => ({
    x: point.x - platform.size / 4,
    y: point.y - standingSurface.thickness,
    size: standingSurface.size,
    thickness: standingSurface.thickness,
    ...nodeIcons[i],
  }));

  // debug box around each platform + its standing surface. the panel sticks up
  // above the platform, so the top is whichever of the two reaches higher
  const platformBoxes = platformCenterPoints.map((point) => {
    const top = point.y - standingSurface.thickness;
    const bottom = point.y - toDiamondCenter.y + platform.height;

    return {
      x: point.x - toDiamondCenter.x,
      y: top,
      width: platform.size,
      height: bottom - top,
    };
  });

  return (
    <g className="float-bob-adjust-for-less-annoyance-later">
      {nodes.map((node, i) => (
        <>
          <rect
            {...platformBoxes[i]}
            fill="none"
            stroke="#d9c79c" // sand
            strokeWidth={0.75}
            strokeDasharray="6 4"
          />

          <circle key={i} cx={node.x} cy={node.y} r={4} fill="#9cc5a8" />

          {/* PLATFORM */}
          <ISOCube
            x={platformBoxPoints[i].x}
            y={platformBoxPoints[i].y}
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
