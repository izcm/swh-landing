import { useEffect, useId, useState } from "react";
import { spaceBetween } from "@/lib/svg/helpers";
import { AccentBarGradient } from "@/lib/svg/window/AccentBarGradient";

// fake code: line numbers + animated bars. meant to be a child of AppWindow,
// given the same viewboxWidth / viewboxHeight as that window
export function EditorCode({
  viewboxWidth, // viewbox??? why viewbox this is not an svg its a group
  viewboxHeight, // ???? why not just heigth / width i dont get it
  headerHeight, // the window's header strip; code starts below it
}: {
  viewboxWidth: number;
  viewboxHeight: number;
  headerHeight: number;
}) {
  // spacing for the fake code, from the window's height
  const unit = viewboxHeight / 12;
  const bottomHeight = unit * 1.5;
  const [animation, setAnimation] = useState(0);

  useEffect(() => {
    let id: number;

    function animate(time: number) {
      setAnimation(Math.sin(time / 1000));
      id = requestAnimationFrame(animate);
    }

    id = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(id);
  }, []);

  const barGradientId = useId();

  const fontSize = 12;

  const code = (() => {
    const lineCount = 6;
    const top = headerHeight * 1 + unit / 2;
    const height = viewboxHeight - headerHeight - bottomHeight;

    const paddingX = unit;
    const width = viewboxWidth - paddingX * 2;

    return {
      lineCount,
      height,
      paddingX,
      width,
      translateY: top,
    };
  })();

  return (
    <g transform={`translate(${code.paddingX}, ${code.translateY})`}>
      <defs>
        <AccentBarGradient id={barGradientId} />
      </defs>

      {Array.from({ length: code.lineCount }).map((_, i) => {
        const y = spaceBetween({
          index: i,
          itemCount: code.lineCount,
          itemSize: fontSize,
          start: 0,
          end: code.height,
        });

        const maxFillPercent = 35 + ((i * 17) % 46);
        const maxFill = code.width * (maxFillPercent / 100);

        const fillPercent = 40 + ((i * 13) % 51);
        const fillValue = maxFill * (fillPercent / 100);

        const indent = i % 3 === 1 ? 8 : 0;
        const tubeX = 24 + indent;
        const tubeWidth = maxFill - code.paddingX;

        // short lines get a second bar after them (two "tokens" on one line).
        // when there are two, the first is always fully filled
        const hasSecond = tubeWidth < code.width * 0.45;
        const firstFill = hasSecond ? tubeWidth : fillValue;
        const second = (() => {
          if (!hasSecond) return null;
          const gap = 8;
          const width = code.width * (0.18 + ((i * 11) % 20) / 100);
          return {
            x: tubeX + tubeWidth + gap,
            width,
            fill: width * (fillPercent / 100),
          };
        })();

        const normalScale = 1;
        const movementAmount = 0.1;

        const tubeScale = normalScale;
        // i === 1 ? normalScale + animation * movementAmount : normalScale;

        const normalOpacity = 0.8;
        const opacityMovement = 0.1;

        const tubeOpacity = normalOpacity + animation * opacityMovement;

        return (
          <g key={i}>
            <text
              x={0}
              // centred on the bar (bars are 6 high, so their middle is y + 3)
              y={y + 3}
              dominantBaseline="central"
              fill="var(--accent)"
              fontSize={fontSize}
              opacity={0.25 + (i % 2) * 0.2}
              filter="url(#tinyGlow)"
              // style={{ filter: "drop-shadow(2px 2px 5px var(--accent))" }}
            >
              {i + 1}
            </text>

            <g>
              {/* tube / empty amount */}
              <rect
                x={tubeX}
                y={y}
                width={tubeWidth}
                height={6}
                rx={3}
                fill="var(--accent)"
                opacity={0.15}
              />

              {/* filled amount */}
              <rect
                x={tubeX}
                y={y}
                width={firstFill}
                height={6}
                rx={3}
                fill={`url(#${barGradientId})`}
                style={{
                  transform: `scaleX(${tubeScale})`,
                  transformBox: "fill-box",
                  transformOrigin: "left center",
                }}
                opacity={tubeOpacity}
              />

              {/* second bar on short lines: its own tube + partial fill */}
              {second && (
                <>
                  <rect
                    x={second.x}
                    y={y}
                    width={second.width}
                    height={6}
                    rx={3}
                    fill="var(--accent)"
                    opacity={0.15}
                  />
                  <rect
                    x={second.x}
                    y={y}
                    width={second.fill}
                    height={6}
                    rx={3}
                    fill={`url(#${barGradientId})`}
                    opacity={tubeOpacity}
                  />
                </>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
}
