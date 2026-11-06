import { type cascadeLayout } from "@/lib/svg";

// a cascade's boards, back to front: the back one
// `backOpacity` see-through, fading up to solid at the front.
// drawn in the cascade's own coords: put it inside the caller's
// <g transform={layout.transform}>, next to whatever sits on the boards
export function CascadeBoards({
  layout,
  radius,
  backOpacity,
}: {
  layout: ReturnType<typeof cascadeLayout>;
  radius: number; // the boards' corner radius
  backOpacity: number; // the back board's opacity, the front one is 1
}) {
  return (
    <>
      {layout.items.map((board, i) => (
        <rect
          key={i}
          x={board.x}
          y={board.y}
          width={board.width}
          height={board.height}
          rx={radius}
          fill="var(--pane-fill)"
          stroke="var(--accent-ink)"
          strokeWidth={1}
          opacity={backOpacity + board.depth * (1 - backOpacity)}
        />
      ))}
    </>
  );
}
