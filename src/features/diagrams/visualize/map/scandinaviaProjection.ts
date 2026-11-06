import { deg, type Point } from "@/lib/svg";

// where a longitude / latitude lands in ScandinaviaOrthographic's outline
// coordinates. the outlines came without their projection, so these numbers
// are fitted to 13 points on the coast (Lindesnes, Skagen, Nordkapp, …): off
// by ~10 units on average
const projection = {
  centerLon: 16.27,
  centerLat: 52.79,
  scale: 2023.76,
  rotation: 0.0704, // radians
  translateX: 220.92,
  translateY: 659.28,
};

export function projectScandinaviaOrthographic(
  lon: number,
  lat: number,
): Point {
  const { centerLon, centerLat, scale, rotation, translateX, translateY } =
    projection;
  const lambda = deg(lon - centerLon);
  const phi = deg(lat);
  const phi0 = deg(centerLat);

  // the point on a globe of radius 1, seen from straight above the center
  const u = Math.cos(phi) * Math.sin(lambda);
  const v =
    Math.cos(phi0) * Math.sin(phi) -
    Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda);

  // rotated, scaled, and flipped so y points down
  return {
    x: scale * (u * Math.cos(rotation) - v * Math.sin(rotation)) + translateX,
    y: -scale * (u * Math.sin(rotation) + v * Math.cos(rotation)) + translateY,
  };
}
