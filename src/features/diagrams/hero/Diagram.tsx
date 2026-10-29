// shared svg helpers
import { alignCenter, deg, paddedBox } from "@/lib/svg";

// the big glass cube with the small one inside, shared with connect
import { Centerpiece } from "@/features/diagrams/shared/Centerpiece";
import { centerpieceLayout } from "@/features/diagrams/shared/centerpieceLayout";

const heroAngle = deg(25);

// debug lines have className="svg-debug". show/hide them in diagram.css
export function HeroDiagram() {
  const viewboxWidth = 900;
  const viewboxHeight = 600;

  const { contentX, contentY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    0, // 0 padding
  );

  // the centerpiece, in the middle of the content box
  const centerpiece = (() => {
    const size = unit * 8; // knob: same size in units as the old hero's
    const layout = centerpieceLayout({ size, angle: heroAngle });

    const { offset: x } = alignCenter(contentWidth, layout.cube.size);
    const { offset: y } = alignCenter(contentHeight, layout.cube.height);

    return { ...layout, x, y };
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

        {/* middle: the centerpiece */}
        <Centerpiece
          {...centerpiece}
          angle={heroAngle}
          cubeStrokeWeight={1} // knob
          innerCubeStrokeWeight={1} // knob
        />
      </g>
    </svg>
  );
}
