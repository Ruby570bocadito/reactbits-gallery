"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type MagnetLinesProps = {
  /** Number of rows in the grid */
  rows?: number;
  /** Number of columns in the grid */
  columns?: number;
  /** Length of each line segment in px */
  lineHeight?: number;
  /** Stroke width in px */
  lineWeight?: number;
  /** Resting angle in degrees */
  baseAngle?: number;
  /** Extra degrees applied to lines closest to the cursor */
  angleRange?: number;
  /** Line color */
  lineColor?: string;
  className?: string;
};

interface LineEntry {
  x: number;
  y: number;
  el: SVGSVGElement;
  current: number;
}

/**
 * MagnetLines — React Bits
 * A field of line segments that rotate to follow the cursor with easing.
 */
export default function MagnetLines({
  rows = 6,
  columns = 10,
  lineHeight = 34,
  lineWeight = 2,
  baseAngle = 0,
  angleRange = -90,
  lineColor = "#B497FF",
  className,
}: MagnetLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<LineEntry[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lines = linesRef.current;
    let running = true;

    const loop = () => {
      if (!running) return;
      const mouse = mouseRef.current;
      const rect = container.getBoundingClientRect();

      for (const line of lines) {
        let target = baseAngle;
        let energy = 0;

        if (mouse) {
          const dx = mouse.x - line.x;
          const dy = mouse.y - line.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = Math.hypot(rect.width / 2, rect.height / 2);
          const falloff = Math.max(0, 1 - dist / (maxDist * 0.9));
          const angleToMouse = (Math.atan2(dy, dx) * 180) / Math.PI;
          energy = falloff;
          target = baseAngle + angleToMouse * falloff + angleRange * falloff;
        }

        // Ease toward the target rotation
        line.current += (target - line.current) * 0.14;
        const scale = 1 + energy * 0.25;
        line.el.style.transform = `rotate(${line.current.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = null;
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [rows, columns, baseAngle, angleRange]);

  const registerLine = (i: number, el: HTMLDivElement | null) => {
    if (!el) return;
    if (linesRef.current[i]) return;
    requestAnimationFrame(() => {
      const cRect = containerRef.current?.getBoundingClientRect();
      if (!cRect) return;
      const rect = el.getBoundingClientRect();
      linesRef.current[i] = {
        x: rect.left + rect.width / 2 - cRect.left,
        y: rect.top + rect.height / 2 - cRect.top,
        el: el.querySelector("svg") as SVGSVGElement,
        current: baseAngle,
      };
    });
  };

  const cell = Math.max(lineHeight * 1.6, 40);

  return (
    <div
      ref={containerRef}
      className={cn("relative grid select-none place-items-center", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, ${cell}px)`,
        gridTemplateRows: `repeat(${rows}, ${cell}px)`,
        touchAction: "none",
      }}
      aria-hidden
    >
      {Array.from({ length: rows * columns }).map((_, i) => (
        <div key={i} ref={(el) => registerLine(i, el)} className="flex items-center justify-center">
          <svg
            width={lineWeight + 2}
            height={lineHeight}
            viewBox={`0 0 ${lineWeight + 2} ${lineHeight}`}
            style={{ transform: `rotate(${baseAngle}deg)` }}
          >
            <line
              x1={(lineWeight + 2) / 2}
              y1={0}
              x2={(lineWeight + 2) / 2}
              y2={lineHeight}
              stroke={lineColor}
              strokeWidth={lineWeight}
              strokeLinecap="round"
              opacity={0.85}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
