import {
  alignEnd,
  cascadeLayout,
  deg,
  dropAlongEdge,
  isoCubePoints,
  paddedBox,
  parallelogramMatrix,
  platformCorners,
  pointOnLine,
  roundCorner,
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
      const radius = 6;

      const lengthA = unit * 1.8; // knob: roof.left → roof.bottom
      // roof.bottom → roof.right: the rest of groupWidth
      const lengthB =
        (groupWidth - lengthA * Math.cos(angles.angleA)) /
        Math.cos(angles.angleB);

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
      const plateInset = unit * 0.25; // knob: wall's edge → the plate under the icon / label

      return { iconSize, fontSize, gap, plateInset };
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

  // each node's connector start: the middle of its back wall (facing the
  // centerpiece). before the centerpiece, which lines up with the middle one
  const nodesOut = (() => {
    const { roof, floor } = nodes.box;
    const backWallCenter = pointOnLine(roof.top, floor.right, 0.5);

    return nodes.boxYs.map((boxY) => ({
      x: backWallCenter.x,
      y: boxY + backWallCenter.y,
    }));
  })();

  // middle: the centerpiece, in the space left between the nodes and the windows
  const centerpiece = (() => {
    const groupWidth = viewboxWidth - nodes.groupWidth - dataGrid.groupWidth;
    const translateX = nodes.groupWidth; // right after the nodes

    const angles = { angleA: deg(20), angleB: deg(20) };
    const layout = centerpieceLayout({ size: unit * 4.2, angles });

    const centerX = translateX + groupWidth * 0.55;
    const x = centerX - layout.cube.size * 0.5;

    // its left wall's middle sits on HR's connector line, which rises at the
    // cube's angleB (so it meets the wall head-on)
    const leftWallMiddle = {
      x: layout.cube.a.run / 2,
      y: layout.cube.depth * 1.5 + layout.cube.thickness / 2,
    };
    const middleNodeOut = nodesOut[Math.floor(nodesOut.length / 2)];
    // how much higher the wall's middle is than HR's point
    const rise = dropAlongEdge({
      run: x + leftWallMiddle.x - middleNodeOut.x, // across from HR to the wall's middle
      angle: deg(6),
    });
    const y = middleNodeOut.y - rise - leftWallMiddle.y;

    return { groupWidth, translateX, angles, layout, x, y };
  })();

  // under the centerpiece: two arrows chasing each other round a circle
  const syncArrows = (() => {
    const { cube } = centerpiece.layout;
    const radius = unit; // knob
    const gap = unit * 0.5; // knob: cube's bottom → top of the circle
    // lying flat on the same floor as the cube: squashed by its roof's slope
    const squash = Math.tan(centerpiece.angles.angleA);

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

  // the connectors' ends, in viewbox coordinates:
  // nodesOut → centerpieceIns, centerpieceOut → dataGridIn
  const connectors = (() => {
    // the cube's corners, scaled and moved to where it's drawn
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

    // the middle of the cube's left wall
    const leftWallCenter = pointOnLine(
      at(pts.roofLeft),
      at(pts.floorBottom),
      0.5,
    );

    // one in per node, stacked straight up and down the left wall, the same
    // distance apart, centered on the wall's middle. top node → top in
    const inGap = cube.thickness * 0.12; // knob: between two ins, as a share of the wall's height
    const middle = (nodesOut.length - 1) / 2;
    const centerpieceIns = nodesOut.map((_, i) => ({
      x: leftWallCenter.x,
      y: leftWallCenter.y + (i - middle) * inGap,
    }));

    // where the node connectors end: one spot per node on the inner cube's left
    // edge (its far-left vertical edge), inGap apart, centered on the edge's middle
    const { innerCube, innerCubePos, floatLift } = centerpiece.layout;
    const innerLeftEdgeMiddle = {
      x: centerpiece.x + innerCubePos.x,
      y:
        centerpiece.y +
        innerCubePos.y -
        floatLift +
        innerCube.depth +
        innerCube.thickness / 2,
    };
    const innerCubeIns = nodesOut.map((_, i) => ({
      x: innerLeftEdgeMiddle.x,
      y: innerLeftEdgeMiddle.y + (i - middle) * inGap,
    }));

    // the middle of the cube's right wall
    const centerpieceOut = pointOnLine(
      at(pts.roofBottom),
      at(pts.floorRight),
      0.5,
    );

    // from centerpieceOut, falling at angleA to the data grid's left edge
    const run = dataGrid.translateX - centerpieceOut.x;
    const dataGridIn = {
      x: dataGrid.translateX,
      y: centerpieceOut.y + dropAlongEdge({ run, angle: angles.angleA }),
    };

    const nodeConnectors = nodesOut.map((out, i) => {
      const centerpieceIn = centerpieceIns[i];
      const innerCubeIn = innerCubeIns[i];
      const line = {
        dx: centerpieceIn.x - out.x,
        dy: centerpieceIn.y - out.y,
      };

      // knob: each flat piece before and after the curve, as a share of dx
      const straight = line.dx * 0.3;

      // where the curve starts and ends
      const curveStart = { x: out.x + straight, y: out.y };
      const curveEnd = { x: centerpieceIn.x - straight, y: centerpieceIn.y };

      const c1 = {
        x: out.x + line.dx * 0.6,
        y: out.y,
      };

      const c2 = {
        x: out.x + line.dx * 0.3,
        y: centerpieceIn.y,
      };

      return [
        `M ${out.x} ${out.y}`,
        `L ${curveStart.x} ${curveStart.y}`,
        `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${curveEnd.x} ${curveEnd.y}`,
        // `L ${centerpieceIn.x} ${centerpieceIn.y}`,
        `L ${innerCubeIn.x} ${innerCubeIn.y}`,
      ].join(" ");
    });

    return {
      nodesOut,
      centerpieceIns,
      innerCubeIns,
      centerpieceOut,
      dataGridIn,
      nodeConnectors,
    };
  })();

  return { unit, nodes, dataGrid, centerpiece, syncArrows, connectors };
}

export type ConnectLayout = ReturnType<typeof connectLayout>;
