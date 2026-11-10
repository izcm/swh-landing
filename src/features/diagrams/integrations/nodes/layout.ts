import {
  addVector,
  boxCorners,
  deg,
  dropAlongEdge,
  isoCubeMetrics,
  layoutUnit,
  parallelogramMatrix,
  pointOnLine,
  spaceEvenly,
  splitWithGaps,
} from "@/lib/svg";
import { connectorPaths } from "./connectors";
import { nodeData } from "./data";

type Angles = { angleA: number; angleB: number };

// edge slopes in radians: A down to the right, B up to the right
export const nodesAngles: Angles = {
  angleA: deg(15),
  angleB: deg(10),
};

export type NodesShares = {
  nodes: number;
  connectors: number;
  cube: number;
};

export function nodesLayout({
  width,
  height,
  angles,
  shares,
}: {
  width: number;
  height: number;
  angles: Angles;
  shares: NodesShares;
}) {
  const unit = layoutUnit(height);
  const radius = 2;

  // left to right: the nodes, the connectors, the cube
  const columns = (() => {
    const { sizes, starts } = splitWithGaps(
      width,
      [shares.nodes, shares.connectors, shares.cube],
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
    const boxYs = nodeData.map((_, i) =>
      spaceEvenly({
        index: i,
        itemCount: nodeData.length,
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
  // cube). before the cube, which lines up with the middle one
  const nodesOut = (() => {
    const { roof, floor } = nodes.box;
    const backWallCenter = pointOnLine(roof.top, floor.right, 0.5);

    return nodes.boxYs.map((boxY) => ({
      x: floor.right.x,
      y: boxY + backWallCenter.y,
    }));
  })();

  // right: the empty cube, filling the last column
  const cube = (() => {
    const groupWidth = columns.sizes[2];
    const translateX = columns.starts[2];

    const angle = deg(20);
    const metrics = isoCubeMetrics(groupWidth, groupWidth * 0.625, {
      angleA: angle,
      angleB: angle,
    });
    const { roof, floor } = boxCorners({
      lengthA: metrics.a.edgeLength,
      lengthB: metrics.b.edgeLength,
      angleA: metrics.a.angle,
      angleB: metrics.b.angle,
      thickness: metrics.thickness,
    });

    const x = translateX;

    // its left wall's middle sits on HR's connector line, which rises at the
    // cube's angleB (so it meets the wall head-on)
    const leftWallMiddle = {
      x: metrics.a.run / 2,
      y: metrics.depth * 1.5 + metrics.thickness / 2,
    };
    const middleNodeOut = nodesOut[Math.floor(nodesOut.length / 2)];
    // how much higher the wall's middle is than HR's point
    const rise = dropAlongEdge({
      run: x + leftWallMiddle.x - middleNodeOut.x, // across from HR to the wall's middle
      angle: deg(6),
    });
    const y = middleNodeOut.y - rise - leftWallMiddle.y;

    return {
      groupWidth,
      translateX,
      angle,
      radius,
      metrics,
      roof,
      floor,
      x,
      y,
    };
  })();

  // the connectors' ends: nodesOut → cubeIns, plus cubeOut for
  // whatever the caller connects the cube to
  const connectors = (() => {
    const { metrics, roof, floor } = cube;
    const cubeAt = { x: cube.x, y: cube.y };

    // the middle of the cube's left wall
    const leftWallCenter = addVector(
      pointOnLine(roof.left, floor.bottom, 0.5),
      cubeAt,
    );

    // one in per node, stacked straight up and down the left wall, the same
    // distance apart, centered on the wall's middle. top node → top in
    const inGap = metrics.thickness * 0.12; // knob: between two ins, as a share of the wall's height
    const middle = (nodesOut.length - 1) / 2;
    const cubeIns = nodesOut.map((_, i) => ({
      x: cube.x + floor.left.x,
      y: leftWallCenter.y + (i - middle) * inGap,
    }));

    // the middle of the cube's right wall
    const cubeOut = addVector(
      pointOnLine(roof.bottom, floor.right, 0.5),
      cubeAt,
    );

    return {
      nodesOut,
      cubeIns,
      cubeOut,
      nodeConnectors: connectorPaths(nodesOut, cubeIns),
    };
  })();

  return { unit, nodes, cube, connectors };
}

export type NodesLayout = ReturnType<typeof nodesLayout>;
