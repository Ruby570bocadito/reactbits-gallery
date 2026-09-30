"use client";

import { useEffect, useRef } from "react";

export type SquaresProps = {
  /** Direction the wave travels */
  direction?: "diagonal" | "up" | "down" | "left" | "right";
  /** Wave travel speed */
  speed?: number;
  /** Square border color */
  borderColor?: string;
  /** Square cell size in px */
  squareSize?: number;
  /** Fill color of the square under the cursor */
  hoverFillColor?: string;
  className?: string;
};

interface SquareDatum {
  id: number;
  row: number;
  col: number;
}

/**
 * Squares — React Bits
 * A canvas grid of squares swept by a traveling wave; hovering fills cells.
 */
export default function Squares({
  direction = "diagonal",
  speed = 0.5,
  borderColor = "#3b2360",
  squareSize = 36,
  hoverFillColor = "#5227FF",
  className,
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef(0);
  const hoverRef = useRef<{ row: number; col: number } | null>(null);
  const gridOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const directionVectors = {
      diagonal: [1, 1],
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    } as const;
    const [dx, dy] = directionVectors[direction];

    let squares: SquareDatum[] = [];
    let numCols = 0;
    let numRows = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      numCols = Math.ceil(rect.width / squareSize) + 1;
      numRows = Math.ceil(rect.height / squareSize) + 1;
      squares = [];
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          squares.push({ id: row * numCols + col, row, col });
        }
      }
    };

    const drawSquares = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const now = performance.now() / 1000;

      // Slide the grid offset along the travel direction
      const travel = (now * speed * squareSize) % squareSize;
      gridOffsetRef.current = { x: travel * dx, y: travel * dy };

      for (const { row, col } of squares) {
        const x = col * squareSize - gridOffsetRef.current.x;
        const y = row * squareSize - gridOffsetRef.current.y;

        // Wave phase projected along the direction
        const projected = row * dy + col * dx;
        const phase = ((now * speed * 1.4 - projected * 0.22) % 2 + 2) % 2;
        const opacity = phase > 1 ? 2 - phase : phase;

        const isHover =
          hoverRef.current &&
          hoverRef.current.row === row &&
          hoverRef.current.col === col;

        if (isHover) {
          ctx.fillStyle = hoverFillColor;
          ctx.globalAlpha = 0.55;
          ctx.fillRect(x, y, squareSize, squareSize);
        }

        ctx.strokeStyle = borderColor;
        ctx.globalAlpha = isHover ? 0.95 : 0.08 + opacity * 0.55;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, squareSize, squareSize);
      }
      ctx.globalAlpha = 1;

      requestRef.current = requestAnimationFrame(drawSquares);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left + gridOffsetRef.current.x;
      const y = e.clientY - rect.top + gridOffsetRef.current.y;
      hoverRef.current = {
        col: Math.floor(x / squareSize),
        row: Math.floor(y / squareSize),
      };
    };

    const onMouseLeave = () => {
      hoverRef.current = null;
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    requestRef.current = requestAnimationFrame(drawSquares);

    return () => {
      cancelAnimationFrame(requestRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
