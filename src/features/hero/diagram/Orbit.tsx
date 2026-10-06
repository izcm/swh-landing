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
  platformPoints,
  topCenter,
  angles,
}: {
  platform: IsoMetrics;
  nodes: Point[];
  standingSurface: { size: number; thickness: number; depth: number };
  platformPoints: Point[];
  topCenter: Point;
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

  const standingSurfaces = platformPoints.map((point, i) => ({
    x: point.x - platform.size / 4,
    y: point.y - standingSurface.thickness,
    size: standingSurface.size,
    thickness: standingSurface.thickness,
    ...nodeIcons[i],
  }));

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
