import {
  boxCorners,
  deg,
  dropAlongEdge,
  layoutUnit,
  parallelogramMatrix,
  pointOnLine,
  spaceEvenly,
  splitWithGaps,
} from "@/lib/svg";
import { centerpieceLayout } from "../shared/centerpiece/centerpieceLayout";
import { connectNodes } from "./connectNodes";

type Angles = { angleA: number; angleB: number };

// edge slopes in radians: A down to the right, B up to the right
export const connectingNodesAngles: Angles = {
  angleA: deg(15),
  angleB: deg(10),
};

export type ConnectingNodesShares = {
  nodes: number;
  connectors: number;
  centerpiece: number;
};

export function connectingNodesLayout({
  width,
  height,
  angles,
  shares,
}: {
  width: number;
  height: number;
  angles: Angles;
  shares: ConnectingNodesShares;
}) {
  const unit = layoutUnit(height);

  // left to right: the nodes, the connectors, the centerpiece
  const columns = (() => {
    const { sizes, starts } = splitWithGaps(
      width,
      [shares.nodes, shares.connectors, shares.centerpiece],
      0,
    );
    return { sizes, starts };
  })();

  // left: the nodes, one box per node, top to bottom
  const nodes = (() => {
    const groupWidth = columns.sizes[0];

    // -- BOX · one shape, used for every node, as wide as groupWidth --
    const box = (() => {
      const thickness = unit * 2;
      const radius = 12;

      const lengthA = unit * 2; // knob: roof.left → roof.bottom
      // roof.bottom → roof.right: the rest of groupWidth
      const lengthB =
        (groupWidth - lengthA * Math.cos(angles.angleA)) /
        Math.cos(angles.angleB);

      // roof + floor corners from the roof's two edges, measured from the box's top-left
      const { roof, floor } = boxCorners({
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
        end: height,
      }),
    );

    return {
      groupWidth,
      groupHeight: height,
      box,
      content,
      boxYs,
    };
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

  // right: the centerpiece, filling the last column
  const centerpiece = (() => {
    const groupWidth = columns.sizes[2];
    const translateX = columns.starts[2];

    const angle = deg(20);
    const layout = centerpieceLayout({ size: groupWidth, angle });

    const x = translateX;

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

    return { groupWidth, translateX, angle, layout, x, y };
  })();

  // the connectors' ends: nodesOut → centerpieceIns, plus centerpieceOut for
  // whatever the caller connects the centerpiece to
  const connectors = (() => {
    // the cube's corners, where it's drawn
    const { cube } = centerpiece.layout;
    const { roof, floor } = boxCorners({
      lengthA: cube.a.edgeLength,
      lengthB: cube.b.edgeLength,
      angleA: cube.a.angle,
      angleB: cube.b.angle,
      thickness: cube.thickness,
      x: centerpiece.x,
      y: centerpiece.y,
    });

    // the middle of the cube's left wall
    const leftWallCenter = pointOnLine(roof.left, floor.bottom, 0.5);

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
    const centerpieceOut = pointOnLine(roof.bottom, floor.right, 0.5);

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
      nodeConnectors,
    };
  })();

  return { unit, nodes, centerpiece, connectors };
}

export type ConnectingNodesLayout = ReturnType<typeof connectingNodesLayout>;
