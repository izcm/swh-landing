import {
  placeItemCenter,
  spaceEvenly,
  splitWithGaps,
  toDegrees,
  Tube,
  type Point,
} from "@/lib/svg";
import { Gauge } from "../Gauge";
import { skewAtT } from "./skewAtT";

// the gauge on the left and a legend of dot + filled tube rows on the right,
// each slanted like the panel at its height
export function GaugeCard({ panel, unit }: { panel: Point[]; unit: number }) {
  const panelWidth = panel[1].x - panel[0].x;
  const panelHeight = panel[3].y - panel[0].y;

  const paddingX = unit * 0.2;
  const columns = splitWithGaps(
    panelWidth - paddingX * 2,
    [0.5, 0.4],
    unit * 0.2,
  );

  const gauge = (() => {
    const box = {
      x: paddingX + columns.starts[0],
      width: columns.sizes[0],
      height: panelHeight,
    };
    const size = Math.min(box.width, box.height);
    const { offsetX, offsetY } = placeItemCenter({
      parentWidth: box.width,
      parentHeight: box.height,
      itemWidth: size,
      itemHeight: size,
    });

    return {
      size,
      transform: `skewY(${toDegrees(skewAtT(panel, 0.5))}) translate(${box.x + offsetX}, ${offsetY})`,
    };
  })();

  const legend = (() => {
    const x = paddingX + columns.starts[1];

    const count = 4;

    const rowHeight = panelHeight * 0.08;
    const dotRadius = rowHeight * 0.55;

    const dotX = x + dotRadius;
    const tubeX = x + rowHeight * 3;

    const tubeWidth = x + columns.sizes[1] - tubeX;
    const tubeHeight = rowHeight * 0.6;

    const rowYs = Array.from(
      { length: count },
      (_, index) =>
        spaceEvenly({
          index,
          itemCount: count,
          itemSize: rowHeight,
          start: 0,
          end: panelHeight,
        }) +
        rowHeight * 0.5,
    );
    const levels = [0.8, 0.6, 0.45, 0.3];

    return { rowYs, dotX, dotRadius, tubeX, tubeWidth, tubeHeight, levels };
  })();

  const rowTransform = (y: number) =>
    `translate(0, ${y}) skewY(${toDegrees(skewAtT(panel, y / panelHeight))})`;

  return (
    <g transform={`translate(${panel[0].x}, ${panel[0].y})`}>
      {/* gauge */}
      <g transform={gauge.transform}>
        <Gauge
          width={gauge.size}
          height={gauge.size}
          values={[1, 1, 1, 1, 1]}
          value={3}
        />
      </g>
      {/* legend: a dot and a filled tube per row */}
      {(() => {
        const {
          rowYs,
          dotX,
          dotRadius,
          tubeX,
          tubeWidth,
          tubeHeight,
          levels,
        } = legend;
        return rowYs.map((y, i) => (
          <g key={i} transform={rowTransform(y)}>
            <circle cx={dotX} r={dotRadius} fill="var(--accent)" />
            <Tube
              x={tubeX}
              y={-tubeHeight * 0.5}
              width={tubeWidth}
              height={tubeHeight}
              level={levels[i]}
              fillOpacity={0.5}
              fill="var(--accent)"
              trackOpacity={0.25}
            />
          </g>
        ));
      })()}
    </g>
  );
}
