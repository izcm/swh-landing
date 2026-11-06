import {
  alignEnd,
  cascadeLayout,
  deg,
  dropAlongEdge,
  paddedBox,
} from "@/lib/svg";
import { connectingNodesLayout } from "./connectingNodesLayout";

type Angles = { angleA: number; angleB: number };

// every section's size and position, worked out once from the viewbox + angles
export function connectLayout({
  viewboxWidth,
  viewboxHeight,
  angles,
}: {
  viewboxWidth: number;
  viewboxHeight: number;
  angles: Angles;
}) {
  // 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);

  // right: the data grid, two tilted windows flush with the right edge
  const dataGrid = (() => {
    const groupWidth = viewboxWidth * 0.36;

    // the three windows that are stacked behind eachother to the right side of diagram
    const stackLayout = cascadeLayout({
      groupWidth,
      heightToWidthRatio: 0.85,
      angle: angles.angleA,
      count: 3,
      gapX: 15,
      gapY: 15,
      side: "right",
    });
    const groupHeight = stackLayout.stackHeight;

    const translateX = viewboxWidth - groupWidth; // flush with the right edge
    const { offset: translateY } = alignEnd(viewboxHeight, groupHeight); // flush with the bottom edge

    return { groupWidth, groupHeight, translateX, translateY, stackLayout };
  })();

  // left + middle: the nodes and the centerpiece, in the space left of the data grid
  const connectingNodes = (() => {
    const width = viewboxWidth * 0.7;
    const height = viewboxHeight * 0.75;
    const translateX = 0;
    const translateY = 0;
    const shares = { nodes: 0.4, connectors: 0.25, centerpiece: 0.35 };
    const layout = connectingNodesLayout({ width, height, angles, shares });

    return { width, height, translateX, translateY, shares, layout };
  })();

  const { centerpiece } = connectingNodes.layout;

  // under the centerpiece: two arrows chasing each other round a circle
  const syncArrows = (() => {
    const { cube } = centerpiece.layout;
    const radius = unit; // knob
    const gap = unit * 0.5; // knob: cube's bottom → top of the circle
    // lying flat on the same floor as the cube: squashed by its roof's slope
    const squash = Math.tan(centerpiece.angle);

    return {
      cx: centerpiece.x + cube.size / 2,
      cy: centerpiece.y + cube.height + gap + radius * squash,
      squash,
      radius,
      count: 2,
      thickness: unit * 0.12, // knob
      gapAngle: deg(40), // knob
      headLength: unit * 0.35, // knob
      headWidth: unit * 0.35, // knob
    };
  })();

  const connectors = (() => {
    const { centerpieceOut } = connectingNodes.layout.connectors;

    // from centerpieceOut, falling at angleA to the data grid's left edge
    const run = dataGrid.translateX - centerpieceOut.x;
    const dataGridIn = {
      x: dataGrid.translateX,
      y: centerpieceOut.y + dropAlongEdge({ run, angle: angles.angleA }),
    };

    return { ...connectingNodes.layout.connectors, dataGridIn };
  })();

  return {
    unit,
    connectingNodes,
    dataGrid,
    centerpiece,
    syncArrows,
    connectors,
  };
}

export type ConnectLayout = ReturnType<typeof connectLayout>;
