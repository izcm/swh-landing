import {
  accentGlow,
  allFills,
  ISOCube,
  isoCubeMetrics,
  type BoxLook,
} from "@/lib/svg";
import { glassCube, glassGlow } from "../glass";

// the shared 2x2 base, drawn top to bottom. y = where the top cube sits
export function CubeBase({
  size,
  y = 0,
  strokes,
}: {
  size: number;
  y?: number;
  strokes: BoxLook["strokes"];
}) {
  const { depth } = isoCubeMetrics(size);
  const half = size / 2;

  return (
    <g style={{ filter: accentGlow(glassGlow.blur, glassGlow.strength) }}>
      <ISOCube
        {...glassCube}
        strokes={strokes}
        size={size}
        x={half}
        y={y}
        fills={{
          ...allFills("var(--pane-fill)"),
          floor: [],
        }}
      />{" "}
      {/* hack to hide animation dot when behind cluster in top group */}
      <ISOCube
        {...glassCube}
        strokes={strokes}
        size={size}
        x={0}
        y={y + depth}
      />
      <ISOCube
        {...glassCube}
        strokes={strokes}
        size={size}
        x={size}
        y={y + depth}
      />
      <ISOCube
        {...glassCube}
        strokes={strokes}
        size={size}
        x={half}
        y={y + depth * 2}
      />
    </g>
  );
}
