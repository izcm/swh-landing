// the platform look: solid accent roof, dark walls, a floor, soft glow.
// (what ISOCube's defaults used to be, before they became glassCube)
export const platformStyle = {
  faces: {
    roof: "oklch(from var(--accent) 0.22 0.08 h)",
    left: "var(--platform-wall-fill)",
  },
  strokeWeight: 1,
  radius: 4,
  // EdgeGradient's own stops, spelled out so ISOCube's glass default doesn't apply
  edgeOpacity: [0.5, 1, 0.35] as [number, number, number],
  glow: { blur: 2, strength: 18 },
  showMiddleEdge: false,
  showFloor: true,
};

// the grid lines on a platform's roof (stroked with an edge gradient)
export const platformGridStyle = {
  opacity: 0.2,
};
