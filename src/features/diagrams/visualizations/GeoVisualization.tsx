import { cn } from "@/lib/cn";
import { alignCenter, layoutUnit } from "@/lib/svg";
import { CityMap } from "./map/CityMap";
import { scandinaviaOrthographicBounds } from "./map/ScandinaviaOrthographic";

export function GeoVisualization({ className }: { className?: string }) {
  const viewboxWidth = 320;
  const viewboxHeight = 240;

  const unit = layoutUnit(viewboxHeight);

  const cityMap = (() => {
    const height = viewboxHeight;
    const width =
      (height * scandinaviaOrthographicBounds.width) /
      scandinaviaOrthographicBounds.height;
    const { offset: x } = alignCenter(viewboxWidth, width);

    const drawing = () => (
      <CityMap
        x={x}
        y={0}
        height={height}
        rotation={15}
        dotRadius={unit * 0.07}
      />
    );

    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      width="100%"
      height="100%"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
      className={cn(className)}
    >
      {cityMap.drawing()}
      {/* Diagram */}
    </svg>
  );
}
