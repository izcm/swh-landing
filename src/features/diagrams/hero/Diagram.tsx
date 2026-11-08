import { CirclePlay, Mail, Plus, RefreshCw, Zap } from "lucide-react";

import { cn } from "@/lib/cn";

// shared svg helpers
import {
  accentGlow,
  addVector,
  alignCenter,
  boxCorners,
  cascadeLayout,
  deg,
  isoCubeEdgeVectors,
  isoFloorCenter,
  paddedBox,
  scaleVector,
} from "@/lib/svg";

// the big glass cube with the small one inside
import { Centerpiece } from "@/features/diagrams/shared/centerpiece/Centerpiece";
import { centerpieceLayout } from "@/features/diagrams/shared/centerpiece/centerpieceLayout";

import { Dashboard } from "./dashboard/Dashboard";

import { MenuBoard, type MenuBoardRow } from "../shared/menu-board/MenuBoard";
import { MenuBoardHeader } from "../shared/menu-board/Header";

import { Floor } from "../shared/floor/Floor";
import { floorLayout } from "../shared/floor/floorLayout";

import { WindowHeader } from "../shared/window/WindowHeader";
import { CascadeBoards } from "../shared/CascadeBoards";

const heroAngle = deg(25);

// the action menu's rows: one per action, as in the reference
const actions: MenuBoardRow[] = [
  { icon: Plus, lines: ["Create task"] },
  { icon: RefreshCw, lines: ["Sync data"] },
  { icon: Mail, lines: ["Send reminder"] },
  { icon: CirclePlay, lines: ["Run automation"] },
];

// debug lines have className="svg-debug". show/hide them in diagram.css
export function HeroDiagram({ className }: { className?: string }) {
  const viewboxWidth = 900;
  const viewboxHeight = 600;

  const { contentX, contentY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    0, // 0 padding
  );

  // the centerpiece, in the middle of the content box
  const centerpiece = (() => {
    const size = unit * 7.5; // knob: same size in units as the old hero's
    const layout = centerpieceLayout({ size, angle: heroAngle });

    const { offset: x } = alignCenter(contentWidth, layout.cube.size);
    const { offset: y } = alignCenter(contentHeight, layout.cube.height);

    const { cube } = layout;
    // the cube's corners in the hero diagram
    const cubeCorners = boxCorners({
      lengthA: cube.a.edgeLength,
      lengthB: cube.b.edgeLength,
      angleA: cube.a.angle,
      angleB: cube.b.angle,
      thickness: cube.thickness,
      x,
      y,
    });

    const drawing = (
      <Centerpiece
        {...layout}
        x={x}
        y={y}
        angle={heroAngle}
        cubeStrokeWeight={1} // knob
        innerCubeStrokeWeight={1} // knob
      />
    );

    return { ...layout, x, y, cubeCorners, drawing };
  })();

  const tilesPerCubeEdge = 3;
  // the floor of tiles under the centerpiece
  const floor = (() => {
    const cubeFloor = isoFloorCenter(centerpiece.cube);

    const layout = floorLayout({
      center: {
        x: centerpiece.x + cubeFloor.x,
        y: centerpiece.y + cubeFloor.y,
      },
      tileLength: centerpiece.cube.edgeLength / tilesPerCubeEdge,
      tilesPerEdge: 11, // minus tilesPerCubeEdge must stay even, so the cube sits on grid lines
      angle: heroAngle,
    });

    const drawing = (
      <Floor
        layout={layout}
        tileOpacity={0.15}
        fadeStretchX={1.3}
        fadeMiddle={0.75}
        tileStyle="lines"
      />
    );

    return { ...layout, drawing };
  })();

  // between a cascade's boards, across and down: shared by the action menu and
  // the dashboard
  const cascadeGap = unit * 0.2; // knob

  const actionMenu = (() => {
    const { cube, cubeCorners } = centerpiece;
    const x =
      cubeCorners.roof.right.x + cube.edgeLength / (tilesPerCubeEdge * 2); // to end of cube + half of one tile
    const y = cubeCorners.roof.top.y;

    const boardLayout = cascadeLayout({
      groupWidth: unit * 4, // knob
      heightToWidthRatio: 1.45, // knob: taller than interactive-tools' board, it has 4 rows
      // slants down to the right, like the cube's left face
      angle: heroAngle,
      count: 2, // knob
      gapX: cascadeGap,
      gapY: cascadeGap,
      side: "right", // the back board sticks out up and to the right
    });

    const radius = unit * 0.1; // knob: the boards' and rows' corners
    const spacing = { paddingX: 0.8, paddingY: 0.6, rowGap: 0.6 }; // in the board's unit
    const headerShare = 0.18;
    const fontSizeUnits = 0.8;
    const headerFontSizeUnits = 0.9;

    // its top-left at x, y
    const drawing = (
      <MenuBoard
        x={x}
        y={y}
        layout={boardLayout}
        radius={radius}
        spacing={spacing}
        headerShare={headerShare}
        fontSizeUnits={fontSizeUnits}
        header={({ height, unit }) => (
          <MenuBoardHeader
            height={height}
            fontSize={unit * headerFontSizeUnits}
            icon={Zap}
            title="Actions"
          />
        )}
        rows={actions}
      />
    );

    return { x, y, drawing };
  })();

  const dashboard = (() => {
    const { cube, cubeCorners } = centerpiece;

    // slight skew
    const angle = heroAngle;

    const heightToWidthRatio = 0.75;
    const itemHeight = cube.thickness * 1;
    const itemWidth = itemHeight / heightToWidthRatio;

    const itemCount = 2;
    const groupWidth = itemWidth + cascadeGap * (itemCount - 1); // two items

    const boardLayout = cascadeLayout({
      groupWidth,
      heightToWidthRatio,
      gapX: cascadeGap,
      gapY: cascadeGap,
      count: itemCount,
      angle: -angle,
      side: "left",
    });

    const { edgeA } = isoCubeEdgeVectors(cube);

    const start = addVector(cubeCorners.roof.left, scaleVector(edgeA, -1));

    const radius = 3; // knob: the boards' corners, also the boxes' inside the dashboard

    // the front board: the header across the top, the content under it inside the padding
    const frontBoard = (() => {
      const { width, height } = boardLayout.item;
      const headerHeight = height * 0.12;
      const box = paddedBox(width, height - headerHeight, 0.6);
      const content = {
        x: box.contentX,
        y: headerHeight + box.contentY,
        width: box.contentWidth,
        height: box.contentHeight,
      };
      return { width, headerHeight, paddingX: box.paddingX, content };
    })();

    const drawing = (
      <>
        <g
          transform={`translate(${start.x}, ${start.y - boardLayout.toTop}) ${boardLayout.transform}`}
        >
          <CascadeBoards
            layout={boardLayout}
            radius={radius}
            backOpacity={0.6}
          />

          {/* the front board's content */}
          <g opacity={1}>
            {(() => {
              const { width, headerHeight, paddingX, content } = frontBoard;
              return (
                <g
                  transform={`translate(${boardLayout.front.x}, ${boardLayout.front.y})`}
                >
                  <WindowHeader
                    width={width}
                    height={headerHeight}
                    itemHeight={headerHeight * 0.2}
                    contentX={paddingX}
                  />
                  <g transform={`translate(${content.x}, ${content.y})`}>
                    <Dashboard
                      width={content.width}
                      height={content.height}
                      radius={radius}
                      strokeWidth={1} // knob
                    />
                  </g>
                </g>
              );
            })()}
          </g>
        </g>
      </>
    );

    // how far the board's highest corner is above the content box's top (y = 0).
    // 0 when it already fits
    const overflow = Math.max(0, boardLayout.toTop - start.y);

    return { overflow, drawing };
  })();

  const centerpieceDecorators = (() => {
    const { cube, cubeCorners } = centerpiece;

    const { floor: cubeFloor } = cubeCorners;

    const { edgeA, edgeB } = isoCubeEdgeVectors(cube);

    const start = addVector(cubeFloor.top, {
      x: 0,
      y: -cube.thickness * 0.1,
    });

    const lineScale = 1.2; // knob: each line's length, in cube edges

    const end1 = addVector(start, scaleVector(edgeA, lineScale));
    const end2 = addVector(start, scaleVector(edgeB, -lineScale)); // same line as now: right → bottom

    const verticalLine = (() => {
      const lineStart = addVector(start, scaleVector(edgeA, 0.2));
      const lineEnd = addVector(lineStart, {
        x: 0,
        y: -cube.thickness * lineScale,
      });
      return { start: lineStart, end: lineEnd };
    })();

    const dashArray = "12 6"; // knob: dash length, gap length
    const dotRadius = 2; // knob: the tiny circles at the lines' ends

    const drawing = (
      <g>
        {[verticalLine, { start, end: end1 }, { start, end: end2 }].map(
          (line, i) => (
            <line
              key={i}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke="var(--accent)"
              strokeWidth={1}
              strokeDasharray={dashArray}
            />
          ),
        )}

        {/* tiny circles at the lines' ends */}
        <g style={{ filter: accentGlow(4, 25) }}>
          {[verticalLine.start, verticalLine.end, end1, end2].map(
            (point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={dotRadius}
                fill="var(--accent-glow)"
              />
            ),
          )}
        </g>
      </g>
    );

    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      overflow="visible"
      className={cn(className)}
    >
      {/* everything inside starts at the content box's top-left */}
      <g transform={`translate(${contentX}, ${contentY})`}>
        {/* debug: content box (inside the padding) */}
        <rect
          className="svg-debug"
          x={0}
          y={0}
          width={contentWidth}
          height={contentHeight}
          fill="none"
          stroke="#e8a0a8" // dusty rose
          strokeWidth={0.75}
          strokeDasharray="6 4"
        />

        {/* the scene, moved down just enough for the dashboard to fit */}
        <g transform={`translate(0, ${dashboard.overflow})`}>
          {/* the floor, under the centerpiece */}
          {floor.drawing}

          {/* left of the cube: the dashboard */}
          {/* {dashboard.drawing} */}

          {/* middle: around the centerpiece */}
          {centerpieceDecorators.drawing}

          {/* middle: the centerpiece */}
          {centerpiece.drawing}

          {/* right of the cube: the action menu */}
          {/* {actionMenu.drawing} */}
        </g>
      </g>
    </svg>
  );
}
