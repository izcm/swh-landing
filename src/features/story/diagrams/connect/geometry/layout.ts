import { isoCubeMetrics, platformCardMetrics } from "@/lib/svg";

// every size in the left box, worked out once from the box's width + unit
export function connectLayout({
  width,
  unit,
}: {
  width: number;
  unit: number;
}) {
  // -- CARD · one shape, used for every node ----------------------
  // https://claude.ai/artifact/J4CDXe1aHvn32wsqS1Aze9
  const card = (() => {
    const angles = { angleA: 10, angleB: 30 };
    const platformThickness = unit * 0.35;
    // panel as wide as the platform's a edge
    const panelSize = isoCubeMetrics(width, platformThickness, angles).a
      .edgeLength;

    const gridDivisions = { across: 4, along: 8 };

    const metrics = platformCardMetrics({
      // side: "a",
      platformSize: width,
      platformThickness,
      angles,
      panelSize,
      panelThickness: unit * 2.4,
      towardBack: 0.25,
      towardFront: 0.125,
    });

    return { ...metrics, gridDivisions };
  })();

  // -- PANEL CONTENT · icon + label on the panel --------------------
  const content = (() => {
    const iconSize = card.panelThickness * 0.5; // knob
    const fontSize = unit * 0.55; // knob
    const padding = unit * 0.6; // knob: panel's left edge → icon
    const gap = unit * 0.7; // knob: icon → label

    return { iconSize, fontSize, padding, gap };
  })();

  return { card, content };
}

export type ConnectLayout = ReturnType<typeof connectLayout>;
