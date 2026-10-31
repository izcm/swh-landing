import { useId } from "react";
import { CirclePlay, Mail, Plus, RefreshCw, Zap } from "lucide-react";

// shared svg helpers
import {
  addVector,
  alignCenter,
  boxCorners,
  cascadeLayout,
  deg,
  isoCubeEdgeVectors,
  paddedBox,
  scaleVector,
  toDegrees,
} from "@/lib/svg";

// the big glass cube with the small one inside, shared with connect
import { Centerpiece } from "@/features/diagrams/shared/Centerpiece";
import { centerpieceLayout } from "@/features/diagrams/shared/centerpieceLayout";

import { MenuBoard, type MenuBoardRow } from "../shared/MenuBoard";
import { MenuBoardHeader } from "../shared/MenuBoardHeader";

import { floorLayout } from "./floor";
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
export function HeroDiagram() {
  const viewboxWidth = 900;
  const viewboxHeight = 600;

  const { contentX, contentY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    0, // 0 padding
  );

  // ids for the <defs> below
  const floorTileId = useId();
  const floorMaskId = useId();

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
    const layout = floorLayout({
      cube: centerpiece.cube,
      cubePos: { x: centerpiece.x, y: centerpiece.y },
      angle: heroAngle,
      tilesPerCubeEdge, // knob
      tilesPerFloorEdge: 12, // knob
    });
    const { tile, fade, width, height } = layout;
    const fadeStretchX = 1.3; // knob: how much wider than the floor's own circle the fade reaches

    const drawing = (
      <>
        <defs>
          {/* the fade: white in the middle, gone at the floor's edges */}
          <radialGradient
            id="somethingxoxo"
            gradientUnits="userSpaceOnUse"
            cx={fade.cx}
            cy={fade.cy}
            r={fade.r}
            // flattens the circle around its middle, and stretches it sideways
            gradientTransform={`translate(${fade.cx} ${fade.cy}) scale(${fadeStretchX} ${fade.squash}) translate(${-fade.cx} ${-fade.cy})`}
          >
            <stop offset="0%" stopColor="white" stopOpacity={1} />
            <stop offset="50%" stopColor="white" stopOpacity={0.75} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>

          <mask
            id={floorMaskId}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={width}
            height={height}
          >
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="url(#somethingxoxo)"
            />
          </mask>

          <pattern
            id={floorTileId}
            patternUnits="userSpaceOnUse"
            x={layout.patternX}
            y={layout.patternY}
            width={tile.corners.right.x}
            height={tile.corners.bottom.y}
          >
            <path
              d={tile.d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1}
            />
          </pattern>
        </defs>

        <g transform={`translate(${layout.translateX}, ${layout.translateY})`}>
          <path
            d={layout.d}
            fill={`url(#${floorTileId})`}
            opacity={0.15}
            mask={`url(#${floorMaskId})`}
          />
        </g>
      </>
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
      heightToWidthRatio: 1.45, // knob: taller than act's board, it has 4 rows
      // slants down to the right, like the cube's left face
      angle: heroAngle,
      count: 2, // knob
      gapX: cascadeGap,
      gapY: cascadeGap,
      side: "right", // the back board sticks out up and to the right
    });

    const radius = unit * 0.1; // knob: the boards' and rows' corners
    const paddingXUnits = 0.25; // knob
    const paddingYUnits = 0.2; // knob
    const headerShare = 0.15; // knob: the header's share of the board's content
    const headerGapUnits = 0.15; // knob: header → rows
    const rowGapUnits = 0.18; // knob: between two rows
    const fontSizeUnits = 0.26; // knob: the rows' text size
    const headerFontSize = unit * 0.28; // knob: the header's text size

    // its top-left at x, y
    const drawing = (
      <MenuBoard
        x={x}
        y={y}
        layout={boardLayout}
        radius={radius}
        unit={unit}
        paddingXUnits={paddingXUnits}
        paddingYUnits={paddingYUnits}
        headerShare={headerShare}
        headerGapUnits={headerGapUnits}
        rowGapUnits={rowGapUnits}
        fontSizeUnits={fontSizeUnits}
        header={({ height }) => (
          <MenuBoardHeader
            height={height}
            fontSize={headerFontSize}
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

    const drawing = (
      <>
        <g
          transform={`translate(${start.x}, ${start.y - boardLayout.toTop}) ${boardLayout.transform}`}
        >
          <CascadeBoards layout={boardLayout} radius={3} backOpacity={0.6} />
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
      // y: 0,
      y: -cube.thickness * 0.1,
    });

    const lineScale = 1.15; // knob: each line's length, in cube edges

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

    const dashArray = "12 4"; // knob: dash length, gap length
    const dotRadius = 2; // knob: the tiny circles at the lines' ends

    const drawing = (
      <g color="var(--accent)" opacity={0.5}>
        {[verticalLine, { start, end: end1 }, { start, end: end2 }].map(
          (line, i) => (
            <line
              key={i}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray={dashArray}
            />
          ),
        )}

        {/* tiny circles at the lines' ends */}
        {[verticalLine.start, verticalLine.end, end1, end2].map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={dotRadius}
            fill="currentColor"
          />
        ))}
      </g>
    );

    return { drawing };
  })();

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`} overflow="visible">
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
          {dashboard.drawing}

          {/* middle: around the centerpiece */}
          {centerpieceDecorators.drawing}

          {/* middle: the centerpiece */}
          {centerpiece.drawing}

          {/* right of the cube: the action menu */}
          {actionMenu.drawing}
        </g>
      </g>
    </svg>
  );
}
