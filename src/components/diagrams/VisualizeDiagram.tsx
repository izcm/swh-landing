import { SlidersHorizontal } from "lucide-react";
import { DataGrid } from "./DataGrid";
import { glyphStroke } from "../../lib/svg-helpers";

export function VisualizeDiagram() {
  const viewboxWidth = 300;
  const viewboxHeight = 100;

  const outerPadding = 8; // top, bottom, left, right
  const contentHeight = viewboxHeight - outerPadding * 2;

  const fontSize = 8;

  const iconSize = {
    slider: 16,
  };

  // structured data stack items, all grouped together
  const stack = (() => {
    const width = 80;
    const height = contentHeight * 0.56;
    const offset = 4; // step unit for the diagonal card stack
    const count = 3;

    // card in back has index 0 -> its y / x positions were multiplied by 0 -> unchanged
    // -> add offset * count - 1 to get total height
    const stackHeight = height + offset * (count - 1);

    const centerY = stackHeight / 2;

    // to move the stack to center -> find translateY
    const translateY = (contentHeight - stackHeight) / 2;
    const endX = width + outerPadding + offset * (count - 1);

    const resolvedCenterY = centerY + translateY + outerPadding;

    return {
      width,
      height,
      offset,
      count,
      centerY,
      endX,
      translateY,
      resolvedCenterY,
    };
  })();

  const dashboard = (() => {
    // bigger than the stack, but not by so much it dwarfs it; width kept
    // modest so there's still a decent connector gap for the future animation
    const width = (viewboxWidth - outerPadding * 2) * 0.4;
    const height = 76;

    const startX = viewboxWidth - outerPadding - width;
    const translateY = (contentHeight - height) / 2;

    return {
      startX,
      width,
      height,
      translateY,
    };
  })();

  // filter icon sits at the midpoint between the stack and the dashboard
  const iconCenterX = (stack.endX + dashboard.startX) / 2;

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      {/* debug: svg bounds */}
      <rect
        x={0}
        y={0}
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="red"
      />

      <path
        stroke="var(--connector-color)"
        strokeWidth="var(--connector-weight)"
        d={`M ${stack.endX} ${stack.resolvedCenterY} H ${stack.endX + 100}`}
      />

      {/* Transform */}
      <g
        transform={`translate(
          ${iconCenterX - iconSize.slider / 2},
          ${(viewboxHeight - iconSize.slider) / 2}
        )`}
      >
        <circle
          cx={iconSize.slider / 2}
          cy={iconSize.slider / 2}
          r={iconSize.slider / 2 + 6}
          fill="var(--raised)"
          stroke="var(--accent)"
          strokeWidth="var(--node-stroke-width)"
        />

        <SlidersHorizontal
          size={iconSize.slider}
          strokeWidth={1}
          stroke="var(--fg)"
        />
      </g>

      {/* Structured data stacks */}
      <g
        transform={`translate(${outerPadding}, ${stack.translateY + outerPadding})`}
      >
        {Array.from({ length: stack.count }, (_, i) => (
          <DataGrid
            key={i}
            x={stack.offset * i}
            y={stack.offset * i}
            width={stack.width}
            height={stack.height}
          />
        ))}
      </g>

      <g
        transform={`translate(${dashboard.startX}, ${dashboard.translateY + outerPadding})`}
      >
        <rect
          x={0}
          y={0}
          width={dashboard.width}
          height={dashboard.height}
          rx="var(--rx-node-sm)"
          fill="var(--node-color)"
          stroke="var(--node-border-color)"
          strokeWidth="var(--node-stroke-width)"
        />
      </g>
    </svg>
  );
}
