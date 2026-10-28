// the platform look: solid accent roof, dark walls, a floor, soft glow.
// (what ISOCube's defaults used to be, before they became glassCube)
export const platformStyle = {
  fills: {
    roof: "oklch(from var(--accent) 0.22 0.08 h)",
    left: "var(--platform-wall-fill)",
    right: "var(--platform-wall-fill)",
    floor: "var(--platform-wall-fill)",
  },
  strokeWidth: 1,
  radius: 4,
  edgeOpacity: [0.5, 1, 0.35] as [number, number, number],
  glow: { blur: 2, strength: 18 },
};

// the grid lines on a platform's roof (stroked with an edge gradient)
export const platformGridStyle = {
  opacity: 0.2,
};
