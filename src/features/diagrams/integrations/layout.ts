import {
  alignEnd,
  cascadeLayout,
  deg,
  dropAlongEdge,
  paddedBox,
} from "@/lib/svg";
import { nodesLayout } from "./nodes/layout";

type Angles = { angleA: number; angleB: number };

// every section's size and position, worked out once from the viewbox + angles
export function integrationsLayout({
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
    const groupWidth = viewboxWidth * 0.4;

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

  // left + middle: the nodes and the cube, in the space left of the data grid
  const nodes = (() => {
    const width = viewboxWidth * 0.75;
    const height = viewboxHeight * 0.75;
    const translateX = 0;
    const translateY = 0;
    const shares = { nodes: 0.35, connectors: 0.3, cube: 0.35 };
    const layout = nodesLayout({ width, height, angles, shares });

    return { width, height, translateX, translateY, shares, layout };
  })();

  const { cube } = nodes.layout;

  // under the cube: two arrows chasing each other round a circle
  const syncArrows = (() => {
    const { metrics } = cube;
    const radius = unit; // knob
    const gap = unit * 0.5; // knob: cube's bottom → top of the circle
    // lying flat on the same floor as the cube: squashed by its roof's slope
    const squash = Math.tan(cube.angle);

    return {
      cx: cube.x + metrics.size / 2,
      cy: cube.y + metrics.height + gap + radius * squash,
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
    const { stackLayout, translateX, translateY } = dataGrid;
    const [backWindow] = stackLayout.items;

    // the middle of the back window's top edge
    const topMiddleX = backWindow.x + backWindow.width * 0.5;
    const dataGridIn = {
      x: translateX + topMiddleX,
      y:
        translateY +
        stackLayout.toTop +
        backWindow.y +
        dropAlongEdge({ run: topMiddleX, angle: stackLayout.angle }),
    };

    return { ...nodes.layout.connectors, dataGridIn };
  })();

  return {
    unit,
    nodes,
    dataGrid,
    cube,
    syncArrows,
    connectors,
  };
}

export type IntegrationsLayout = ReturnType<typeof integrationsLayout>;
