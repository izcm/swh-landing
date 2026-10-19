import {
  alignCenter,
  cascadeLayout,
  paddedBox,
  parallelogramMatrix,
  platformCorners,
} from "@/lib/svg";
import { centerpieceLayout } from "@/features/diagrams/shared/centerpieceLayout";

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

  // left: the nodes, one box per node, top to bottom
  const nodes = (() => {
    const groupWidth = viewboxWidth * 0.25;
    const groupHeight = viewboxHeight;

    // -- BOX · one shape, used for every node, as wide as groupWidth --
    const box = (() => {
      const thickness = unit * 2;
      const radius = 3;
      const radA = (angles.angleA * Math.PI) / 180;
      const radB = (angles.angleB * Math.PI) / 180;

      const lengthA = unit; // knob: roof.left → roof.bottom
      // roof.bottom → roof.right: the rest of groupWidth
      const lengthB = (groupWidth - lengthA * Math.cos(radA)) / Math.cos(radB);

      // roof + floor corners from the roof's two edges, measured from the box's top-left
      const { roof, floor } = platformCorners({
        lengthA,
        lengthB,
        ...angles,
        thickness,
      });
      // roof.bottom is the lowest roof corner, so the whole box ends at floor.bottom
      const height = floor.bottom.y;

      // the right wall, where the icon + label go: x runs along roof.bottom → roof.right,
      // y runs down roof.bottom → floor.bottom
      const rightFace = parallelogramMatrix({
        origin: roof.bottom,
        xEnd: roof.right,
        yEnd: floor.bottom,
      });

      return { thickness, radius, height, roof, rightFace };
    })();

    // -- RIGHT FACE CONTENT · icon + label on the right wall ----------
    const content = (() => {
      const iconSize = unit * 1.2; // knob
      const fontSize = unit * 0.55; // knob
      const padding = unit * 0.6; // knob: the right face's left edge (roof.bottom → floor.bottom) → icon
      const gap = unit * 0.7; // knob: icon → label

      return { iconSize, fontSize, padding, gap };
    })();

    return { groupWidth, groupHeight, box, content };
  })();

  // right: the data grid, two tilted windows flush with the right edge
  const dataGrid = (() => {
    const groupWidth = viewboxWidth * 0.36;

    const stackLayout = cascadeLayout({
      groupWidth,
      heightToWidthRatio: 0.85,
      angle: angles.angleA,
      count: 2,
      gapX: 15,
      gapY: 15,
      side: "right",
    });
    const groupHeight = stackLayout.stackHeight;

    const translateX = viewboxWidth - groupWidth; // flush with the right edge
    const { offset: translateY } = alignCenter(viewboxHeight, groupHeight);

    return { groupWidth, groupHeight, translateX, translateY, stackLayout };
  })();

  // middle: the centerpiece, in the space left between the nodes and the windows
  const centerpiece = (() => {
    const groupWidth = viewboxWidth - nodes.groupWidth - dataGrid.groupWidth;
    const translateX = nodes.groupWidth; // right after the nodes

    const angles = { angleA: 15, angleB: 15 };
    const layout = centerpieceLayout({ size: unit * 5, angles });

    const centerX = translateX + groupWidth * 0.55;
    const centerY = viewboxHeight * 0.5;
    const x = centerX - layout.cube.size / 2;
    const y = centerY - layout.cube.height / 2;

    return { groupWidth, translateX, angles, layout, x, y };
  })();

  return { unit, nodes, dataGrid, centerpiece };
}

export type ConnectLayout = ReturnType<typeof connectLayout>;
