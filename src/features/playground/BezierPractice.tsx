import { useState } from "react";

type Point = { x: number; y: number };

const centerX = 170;
const centerY = 125;
const referenceRadius = 100;
const pointRadius = 88;
const count = 16;

// Starting point inside the circle
const startPoint: Point = { x: 165, y: 145 };

// Generate 32 points around the circle
const circlePoints: Point[] = Array.from({ length: count }, (_, i) => {
  const angle = (i / count) * Math.PI * 2;

  return {
    x: centerX + Math.cos(angle) * pointRadius,
    y: centerY - Math.sin(angle) * pointRadius, // subtract since Y axis grows downwards in SVGs
  };
});

const initialPoints: Point[] = [startPoint, ...circlePoints];

export function BezierPractice() {
  const [points, setPoints] = useState<Point[]>(initialPoints);

  // Same smoothing formula as your Snail
  let edgeSmooth = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const c1 = {
      x: p1.x + (p2.x - p0.x) / 6,
      y: p1.y + (p2.y - p0.y) / 6,
    };

    const c2 = {
      x: p2.x - (p3.x - p1.x) / 6,
      y: p2.y - (p3.y - p1.y) / 6,
    };

    edgeSmooth += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }

  const edgeLine = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 340 250"
      width="100%"
      style={{ background: "#050d1e", touchAction: "none" }}
    >
      {/* Reference circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={referenceRadius}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={1}
        strokeDasharray="5 5"
      />

      {/* Straight connections */}
      <path
        d={edgeLine}
        fill="none"
        stroke="#64748b"
        strokeWidth={1}
        strokeDasharray="4 4"
      />

      {/* Smoothed Bézier */}
      <path
        d={edgeSmooth}
        fill="none"
        stroke="#4ade80"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Points: drag them to reshape the curve */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 7 : 4}
            fill={i === 0 ? "#f59e0b" : "#60a5fa"}
            stroke="#fff"
            strokeWidth={1}
            style={{ cursor: "grab" }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

              const svg = e.currentTarget.ownerSVGElement;
              if (!svg) return;

              const matrix = svg.getScreenCTM();
              if (!matrix) return;

              const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
                matrix.inverse(),
              );

              setPoints((previous) =>
                previous.map((p, index) =>
                  index === i ? { x: point.x, y: point.y } : p,
                ),
              );
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
          />

          <text
            x={p.x + 7}
            y={p.y - 7}
            fontSize={i === 0 ? 12 : 8}
            fill="#fff"
            pointerEvents="none"
          >
            {i === 0 ? "Start" : `P${i}`}
          </text>
        </g>
      ))}
    </svg>
  );
}
