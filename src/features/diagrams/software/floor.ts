import { deg, type Point } from "@/lib/svg";
import { tileStyleNames } from "../shared/floor/Floor";
import { floorLayout } from "../shared/floor/floorLayout";

export function softwareFloorLayout({
  center,
  cubeSize,
  tilesPerEdge,
}: {
  center: Point;
  cubeSize: number;
  tilesPerEdge: number;
}) {
  return floorLayout({
    center,
    tilesPerEdge,
    angle: deg(30),
    tileLength: cubeSize * (4 / 3),
  });
}

export const softwareFloorLook = {
  tileOpacity: 0.1,
  fadeStretchX: 0.75,
  fadeStretchY: 0.75,
  fadeStart: 0.2,
  fadeMiddle: 0.4,
  tileStyle: tileStyleNames[0],
};
