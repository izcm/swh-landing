import { useId } from "react";
import { CirclePlay, Mail, Plus, RefreshCw, Zap } from "lucide-react";

// shared svg helpers
import { alignCenter, cascadeLayout, deg, paddedBox } from "@/lib/svg";

// the big glass cube with the small one inside, shared with connect
import { Centerpiece } from "@/features/diagrams/shared/Centerpiece";
import { centerpieceLayout } from "@/features/diagrams/shared/centerpieceLayout";

import { MenuBoard, type MenuBoardRow } from "../shared/MenuBoard";
import { MenuBoardHeader } from "../shared/MenuBoardHeader";

import { floorLayout } from "./floor";

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
    const size = unit * 7; // knob: same size in units as the old hero's
    const layout = centerpieceLayout({ size, angle: heroAngle });

    const { offset: x } = alignCenter(contentWidth, layout.cube.size);
    const { offset: y } = alignCenter(contentHeight, layout.cube.height);

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

    return { ...layout, x, y, drawing };
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
            // flattens the circle around its middle
            gradientTransform={`translate(${fade.cx} ${fade.cy}) scale(1 ${fade.squash}) translate(${-fade.cx} ${-fade.cy})`}
          >
            <stop offset="0%" stopColor="white" stopOpacity={1} />
            <stop offset="50%" stopColor="white" stopOpacity={0.8} />
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

  const actionMenu = (() => {
    const { x: cpx, y: cpy, cube } = centerpiece;
    const x = cpx + cube.size + cube.edgeLength / (tilesPerCubeEdge * 2); // to end of cube + half of one tile
    const y = cpy;

    const boardLayout = cascadeLayout({
      groupWidth: unit * 3.8, // knob
      heightToWidthRatio: 1.4, // knob: taller than act's board, it has 4 rows
      // slants down to the right, like the cube's left face
      angle: heroAngle,
      count: 2, // knob
      gapX: unit * 0.2, // knob
      gapY: unit * 0.2, // knob
      side: "right", // the back board sticks out up and to the right
    });

    const radius = unit * 0.1; // knob: the boards' and rows' corners
    const paddingXUnits = 0.25; // knob
    const paddingYUnits = 0.2; // knob
    const headerShare = 0.15; // knob: the header's share of the board's content
    const headerGapUnits = 0.15; // knob: header → rows
    const rowGapUnits = 0.18; // knob: between two rows
    const fontSizeUnits = 0.225; // knob: the rows' text size
    const headerFontSize = unit * 0.25; // knob: the header's text size

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

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`} overflow="visible">
      {/* everything inside starts at the content box's top-left */}
      <g transform={`translate(${contentX}, ${contentY})`}>
        {/* the floor, under the centerpiece */}
        {floor.drawing}

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

        {/* middle: the centerpiece */}
        {centerpiece.drawing}

        {/* right of the cube: the action menu */}
        {actionMenu.drawing}
      </g>
    </svg>
  );
}
