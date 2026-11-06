import { layoutUnit } from "@/lib/svg";
import { floorLayout } from "./floorLayout";

export const serviceFloorLook = {
  tileOpacity: 0.15,
  fadeStretchX: 1,
  fadeStretchY: 1,
  fadeStart: 0.25,
};

export function serviceFloorLayout({
  viewboxWidth,
  viewboxHeight,
  angle,
}: {
  viewboxWidth: number;
  viewboxHeight: number;
  angle: number;
}) {
  const unit = layoutUnit(viewboxHeight);

  return floorLayout({
    center: { x: viewboxWidth * 0.5, y: viewboxHeight * 0.95 },
    tilesPerEdge: 11,
    angle,
    tileLength: unit * 2.5,
  });
}
