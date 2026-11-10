import { allFills } from "@/lib/svg";

// the look of the old ISOCube: sharp dark glass at 80%, middle edge on.
export const glassFill = "oklch(from var(--accent-dim) l c h / 0.3)";

// more electric maybe later with some retouches?
// const glassFill = "oklch(from var(--accent) 0.32 0.2 h / 0.35)";

export const glassCube = {
  radius: 0,
  fills: { ...allFills(glassFill), floor: [] },
  strokeWidth: 0.85,
};

// ISOCube drew every edge twice (face outline + edge line) and its edge
// gradient is see-through, so the doubled edges were brighter: two layers of
// 50% / 100% / 35% stack up to 75% / 100% / 58%, which is what this is
export const glassEdgeOpacity: [number, number, number] = [1, 0.75, 0.5];

// the glass look's halo, for the caller's wrapping <g>: ISOCube draws no glow
export const glassGlow = { blur: 4, strength: 12 };
