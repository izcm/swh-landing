import { cn } from "@/lib/cn";

// shared svg helpers
import { deg, isoFloorCenter } from "@/lib/svg";

// the big glass cube with the small one inside
import { DecoratedCenterpiece } from "./DecoratedCenterpiece";
import { centerpieceLayout } from "@/features/diagrams/shared/centerpiece/centerpieceLayout";

import { Floor } from "../shared/floor/Floor";
import { floorLayout } from "../shared/floor/floorLayout";

const heroAngle = deg(25);

// debug lines have className="svg-debug". show/hide them in diagram.css
export function HeroDiagram({ className }: { className?: string }) {
  // the centerpiece fills the viewBox, its top-left at 0, 0
  const centerpiece = (() => {
    const size = 375;
    const layout = centerpieceLayout({ size, angle: heroAngle });

    const x = 0;
    const y = 0;

    const drawing = (
      <DecoratedCenterpiece x={x} y={y} size={size} angle={heroAngle} />
    );

    return { ...layout, x, y, drawing };
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
        tileOpacity={0.2}
        fadeStretchX={1}
        fadeStart={0.15}
        fadeMiddle={0.5}
        tileStyle="lines"
      />
    );

    return { ...layout, drawing };
  })();

  const { cube } = centerpiece;

  return (
    <svg
      viewBox={`0 0 ${cube.size} ${cube.height}`}
      overflow="visible"
      className={cn(className)}
    >
      {/* debug: the viewBox, the cube's box */}
      <rect
        className="svg-debug"
        x={0}
        y={0}
        width={cube.size}
        height={cube.height}
        fill="none"
        stroke="#e8a0a8" // dusty rose
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />

      {/* the floor, under the centerpiece */}
      {floor.drawing}

      {/* the centerpiece */}
      {centerpiece.drawing}
    </svg>
  );
}
