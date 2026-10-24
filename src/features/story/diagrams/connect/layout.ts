import {
  alignEnd,
  cascadeLayout,
  dropAlongEdge,
  isoCubePoints,
  paddedBox,
  parallelogramMatrix,
  platformCorners,
  pointOnLine,
  spaceEvenly,
  type Point,
} from "@/lib/svg";
import { centerpieceLayout } from "@/features/diagrams/shared/centerpieceLayout";
import { connectNodes } from "./nodes/nodes";

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
    const groupWidth = viewboxWidth * 0.24;
    const groupHeight = viewboxHeight;

    // -- BOX · one shape, used for every node, as wide as groupWidth --
    const box = (() => {
      const thickness = unit * 1.6;
      const radius = 3;
      const radA = (angles.angleA * Math.PI) / 180;
      const radB = (angles.angleB * Math.PI) / 180;

      const lengthA = unit * 1.8; // knob: roof.left → roof.bottom
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

      const leftFace = parallelogramMatrix({
        origin: roof.left,
        xEnd: roof.bottom,
        yEnd: floor.left,
      });

      return { thickness, radius, height, roof, floor, rightFace, leftFace };
    })();

    // -- RIGHT FACE CONTENT · icon + label on the right wall ----------
    const content = (() => {
      const iconSize = unit * 0.85; // knob
      const fontSize = unit * 0.62; // knob
      const gap = unit * 0.7; // knob: icon → label

      return { iconSize, fontSize, gap };
    })();

    // each box's top (the roof's top corner), spread evenly down the column
    const boxYs = connectNodes.map((_, i) =>
      spaceEvenly({
        index: i,
        itemCount: connectNodes.length,
        itemSize: box.height, // the whole box, floor included
        start: 0,
        end: groupHeight,
      }),
    );

    return { groupWidth, groupHeight, box, content, boxYs };
  })();

  // right: the data grid, two tilted windows flush with the right edge
  const dataGrid = (() => {
    const groupWidth = viewboxWidth * 0.36;

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

  // where each node's connector leaves: one per node box, the middle of its
  // back wall, the side facing the centerpiece (opposite leftFace, where the
  // icon is): where the wall's diagonals cross, halfway from roof.top to
  // floor.right. the nodes are drawn from x = 0, each at its boxY. before the
  // centerpiece, because the centerpiece lines up with the middle one
  const nodesOut = (() => {
    const { roof, floor } = nodes.box;
    const backWallCenter = pointOnLine(roof.top, floor.right, 0.5);
    return nodes.boxYs.map((boxY) => ({
      x: backWallCenter.x,
      y: boxY + backWallCenter.y,
    }));
  })();

  // the slope the node connectors rise at toward the centerpiece: the nodes'
  // angleB, the diagram's up-to-the-right slope
  const nodesOutAngle = angles.angleB;

  // middle: the centerpiece, in the space left between the nodes and the windows
  const centerpiece = (() => {
    const groupWidth = viewboxWidth - nodes.groupWidth - dataGrid.groupWidth;
    const translateX = nodes.groupWidth; // right after the nodes

    const angles = { angleA: 15, angleB: 15 };
    const layout = centerpieceLayout({ size: unit * 5, angles });

    const centerX = translateX + groupWidth * 0.55;
    const x = centerX - layout.cube.size * 0.5;

    // its left wall's middle sits on HR's connector line: from the middle
    // node's connector point, rising at nodesOutAngle until it reaches the
    // wall. the wall's middle is halfway between roofLeft (x 0, 1 depth down)
    // and floorBottom (x a.run, 2 depths + the thickness down)
    const leftWallMiddle = {
      x: layout.cube.a.run / 2,
      y: layout.cube.depth * 1.5 + layout.cube.thickness / 2,
    };
    const middleNodeOut = nodesOut[Math.floor(nodesOut.length / 2)];
    // how much higher the wall's middle is than HR's point: the line climbs
    // nodesOutAngle over the distance across (run · tan(angle))
    const rise = dropAlongEdge({
      run: x + leftWallMiddle.x - middleNodeOut.x, // across from HR to the wall's middle
      angle: nodesOutAngle,
    });
    const y = middleNodeOut.y - rise - leftWallMiddle.y;

    return { groupWidth, translateX, angles, layout, x, y };
  })();

  // the connectors: where each line leaves and arrives, in viewbox coordinates.
  // two runs: nodes → centerpiece (nodesOut → centerpieceIn) and
  // centerpiece → data grid (centerpieceOut → dataGridIn)
  const connectors = (() => {
    // the centerpiece cube's corners: from isoCubePoints (drawn in a 100-wide
    // box), scaled and moved to where the cube is drawn
    const { cube } = centerpiece.layout;
    const pts = isoCubePoints(
      cube.size,
      cube.thickness,
      centerpiece.angles.angleA,
      centerpiece.angles.angleB,
    );
    const at = (p: Point) => ({
      x: centerpiece.x + p.x * pts.scale,
      y: centerpiece.y + p.y * pts.scale,
    });

    // centerpieceIn: the middle of the cube's left wall
    // (roofLeft → roofBottom, down to the floor), where its diagonals cross
    const centerpieceIn = pointOnLine(
      at(pts.roofLeft),
      at(pts.floorBottom),
      0.5,
    );

    // centerpieceOut: the middle of the cube's right wall
    // (roofBottom → roofRight, down to the floor), where its diagonals cross
    const centerpieceOut = pointOnLine(
      at(pts.roofBottom),
      at(pts.floorRight),
      0.5,
    );

    // dataGridIn: where the centerpiece's connector meets the data grid's x
    // (its left edge): from centerpieceOut, falling at the diagram's angleA
    // (15°, its down-to-the-right slope) over the distance across. down is +y
    const run = dataGrid.translateX - centerpieceOut.x;
    const dataGridIn = {
      x: dataGrid.translateX,
      y: centerpieceOut.y + dropAlongEdge({ run, angle: angles.angleA }),
    };

    return { nodesOut, centerpieceIn, centerpieceOut, dataGridIn };
  })();

  return { unit, nodes, dataGrid, centerpiece, connectors };
}

export type ConnectLayout = ReturnType<typeof connectLayout>;
