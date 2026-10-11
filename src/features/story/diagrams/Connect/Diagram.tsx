import { ThreeBoxDiagram } from "@/lib/svg";
import { connectLayout } from "./geometry/layout";
import { Nodes } from "./left/Nodes";

export function ConnectDiagram() {
  return (
    <ThreeBoxDiagram
      // viewbox
      viewboxWidth={620}
      viewboxHeight={250}
      // padding and gaps
      paddingUnits={0}
      gapUnits={1}
      // box ratios
      leftBoxSize={0.3}
      rightBoxSize={0.32}
      // boxs' contents
      left={({ width, height, unit }) => (
        <Nodes height={height} layout={connectLayout({ width, unit })} />
      )}
      centerpiece={(box) => (
        <circle
          cx={box.width / 2}
          cy={box.height / 2}
          r={box.unit * 3}
          fill="var(--accent-dim)"
        />
      )}
      right={(box) => (
        <circle
          cx={box.width / 2}
          cy={box.height / 2}
          r={box.unit * 2}
          fill="var(--accent-faint)"
        />
      )}
    />
  );
}
