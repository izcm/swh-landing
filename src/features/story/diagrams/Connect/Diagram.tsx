import { Shuffle, type LucideIcon } from "lucide-react";

import {
  alignCenter,
  AppWindow,
  glyphStrokeLucide,
  ThreeBoxDiagram,
  WindowStack,
  windowStackLayout,
} from "@/lib/svg";
import { connectLayout } from "./geometry/layout";
import { Nodes } from "./left/Nodes";

export function ConnectorIcon({
  r,
  x,
  y,
  icon: Icon,
}: {
  r: number;
  x: number;
  y: number;
  icon: LucideIcon;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        cx={0}
        cy={0}
        r={r}
        fill="var(--accent-ink)"
        stroke="var(--accent-electric)"
        strokeWidth={0.5}
      />
      <Icon
        x={-(r * 0.5)}
        y={-(r * 0.5)}
        size={r}
        strokeWidth={glyphStrokeLucide(r, 1.5)}
        stroke="var(--accent-glow)"
      />
    </g>
  );
}
export function ConnectDiagram() {
  // const layout =
  return (
    <ThreeBoxDiagram
      // viewbox
      viewboxWidth={600}
      viewboxHeight={250}
      // padding and gaps
      paddingUnits={0}
      gapUnits={0}
      // box ratios
      leftBoxSize={0.3}
      rightBoxSize={0.35}
      // boxs' contents
      left={({ width, height, unit }) => (
        <Nodes height={height} layout={connectLayout({ width, unit })} />
      )}
      centerpiece={({ width, height, unit }) => (
        <ConnectorIcon
          r={unit * 1.5}
          x={width * 0.55}
          y={height * 0.5}
          icon={Shuffle}
        />
      )}
      right={({ width, height, unit }) => {
        const layout = connectLayout({ width, unit });

        const stackLayout = windowStackLayout({
          groupWidth: width,
          groupHeight: height,
          heightToWidthRatio: 0.8,
          angle: layout.card.angles.angleA,
          count: 2,
          gapX: 15,
          gapY: 15,
          side: "right",
        });

        const { offset: translateY } = alignCenter(
          height,
          stackLayout.stackHeight,
        );

        return <WindowStack layout={stackLayout} y={translateY} />;
      }}
    />
  );
}
