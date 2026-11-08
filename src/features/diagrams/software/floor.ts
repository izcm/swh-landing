import { deg, type Point } from "@/lib/svg";
import { tileStyleNames } from "../shared/floor/Floor";
import { floorLayout } from "../shared/floor/floorLayout";

export function softwareFloorLayout({
  center,
  cubeSize,
}: {
  center: Point;
  cubeSize: number;
}) {
  return floorLayout({
    center,
    tilesPerEdge: 11,
    angle: deg(30),
    tileLength: cubeSize * (4 / 3),
  });
}

export const softwareFloorLook = {
  tileOpacity: 0.1,
  fadeStretchX: 0.5,
  fadeStretchY: 0.5,
  fadeStart: 0.2,
  fadeMiddle: 0.4,
  tileStyle: tileStyleNames[0],
};
