import { isoCubeMetrics, panelPoints } from "../logic";

// a platform with a panel standing on its top face. the panel stands
// `towardBack` along the left→back edge (which grid line), then `towardFront`
// along that grid line. positions are measured from the platform's top-left;
// `sticksUp` is how far the panel reaches above that, `height` is the whole card
export function platformCardMetrics({
  platformSize,
  platformThickness,
  angles,
  panelSize,
  panelThickness,
  // side,
  towardBack,
  towardFront,
}: {
  platformSize: number;
  platformThickness: number;
  angles: { angleA: number; angleB: number };
  panelSize: number;
  panelThickness: number;
  // which edge direction the panel stands along:
  // "a" = slopes DOWN at angle A, "b" = slopes UP at angle B
  // side: "a" | "b";
  towardBack: number; // 0..1 along the left→back edge (which grid line)
  towardFront: number; // 0..1 along that grid line toward the front
}) {
  const platform = isoCubeMetrics(platformSize, platformThickness, angles);
  // the panel's slope. also the skew for anything drawn on it
  // const panelAngle = side === "a" ? angles.angleA : -angles.angleB;
  const panelAngle = angles.angleA;

  const panel = panelPoints({
    size: panelSize,
    thickness: panelThickness,
    angle: panelAngle,
  });

  // where the panel's bottom-left stands, from the platform's top-left
  const { depth, a, b } = platform;
  const panelStart = {
    x: b.run * towardBack + a.run * towardFront,
    y: depth - depth * towardBack + depth * towardFront,
  };

  // how far the panel reaches above the platform's top. if its top edge slopes
  // up (negative depth), its right side is the highest point, depth higher
  const sticksUp = panelThickness - panelStart.y - Math.min(0, panel.depth);
  // the whole card: platform + the part of the panel above it
  const height = platform.height + sticksUp;

  return {
    platform,
    panel,
    panelAngle,
    panelStart,
    panelThickness,
    angles,
    sticksUp,
    height,
  };
}
