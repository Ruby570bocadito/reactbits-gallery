"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

export type ClickSparkProps = {
  children: ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  /** Distance sparks travel from the click point */
  sparkRadius?: number;
  sparkCount?: number;
  /** Spark lifetime in ms */
  duration?: number;
};

type Spark = {
  x: number;
  y: number;
  angle: number;
  startTime: number;
};

const easeOut = (t: number): number => t * (2 - t);

/**
 * ClickSpark — React Bits
 * Renders a canvas overlay that bursts spark particles on every click.
 */
export default function ClickSpark({
  children,
  sparkColor = "#B497FF",
  sparkSize = 12,
  sparkRadius = 22,
  sparkCount = 8,
  duration = 420,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animationRef = useRef(0);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    const step = (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      sparksRef.current = sparksRef.current.filter(
        (spark) => now - spark.startTime < duration
      );

      ctx.save();
      ctx.lineCap = "round";
      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;

      for (const spark of sparksRef.current) {
        const progress = (now - spark.startTime) / duration;
        const eased = easeOut(progress);
        const dist = eased * sparkRadius;
        const alpha = 1 - progress;
        ctx.globalAlpha = Math.max(alpha, 0);

        const x1 = spark.x + Math.cos(spark.angle) * dist;
        const y1 = spark.y + Math.sin(spark.angle) * dist;
        const x2 = spark.x + Math.cos(spark.angle) * (dist + sparkSize * (1 - eased * 0.4));
        const y2 = spark.y + Math.sin(spark.angle) * (dist + sparkSize * (1 - eased * 0.4));
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, [sparkColor, sparkRadius, sparkSize, duration]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      });
    }
  }, [sparkCount]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen"
      onClick={handleClick}
      style={{ isolation: "isolate" }}
    >
      {children}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50"
        aria-hidden
      />
    </div>
  );
}
