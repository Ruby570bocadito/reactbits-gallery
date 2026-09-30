"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type BlobCursorProps = {
  /** Number of trailing blobs */
  blobCount?: number;
  /** Gradient palette cycled across the trail */
  colors?: string[];
  /** Head blob radius in px */
  baseRadius?: number;
  /** Trail follow factor (0-1, higher = tighter trail) */
  speed?: number;
  /** Canvas blend mode */
  blendMode?: string;
  className?: string;
  style?: CSSProperties;
};

type Blob = { x: number; y: number; r: number; color: string };

const DEFAULT_COLORS = ["#5227FF", "#7C3AED", "#B497FF", "#FF2D92", "#5227FF"];

export default function BlobCursor({
  blobCount = 9,
  colors = DEFAULT_COLORS,
  baseRadius = 46,
  speed = 0.38,
  blendMode = "screen",
  className,
  style,
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.mixBlendMode = blendMode;
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let width = 1;
    let height = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * DPR);
      canvas.height = Math.round(height * DPR);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const blobs: Blob[] = Array.from({ length: blobCount }, (_, i) => ({
      x: width / 2,
      y: height / 2,
      r: baseRadius * (1 - (i / blobCount) * 0.62),
      color: colors[i % colors.length],
    }));

    const pointer = { x: width / 2, y: height / 2, active: false };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const loop = (now: number) => {
      // Idle: drift along a lissajous path when the pointer is away
      let tx = pointer.x;
      let ty = pointer.y;
      if (!pointer.active) {
        const t = now / 1000;
        tx = width / 2 + Math.cos(t * 0.55) * width * 0.26;
        ty = height / 2 + Math.sin(t * 0.85) * height * 0.3;
      }

      blobs.forEach((b, i) => {
        const follow = i === 0 ? 0.32 : Math.max(speed - i * 0.03, 0.06);
        b.x += (tx - b.x) * follow;
        b.y += (ty - b.y) * follow;
        tx = b.x;
        ty = b.y;
      });

      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = "lighter";
        blobs.forEach((b) => {
          const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          g.addColorStop(0, b.color);
          g.addColorStop(0.55, `${b.color}55`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      canvas.remove();
    };
  }, [blobCount, colors, baseRadius, speed, blendMode]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none", overflow: "hidden", ...style }}
    />
  );
}
