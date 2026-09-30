"use client";

import { useEffect, useRef } from "react";

export type LightningProps = {
  /** Base hue of the bolts (HSL) */
  hue?: number;
  /** Seconds between automatic strikes */
  interval?: number;
  /** Branching probability per segment (0–1) */
  forkProbability?: number;
  /** Extra ambient flashes after each strike */
  flash?: boolean;
  className?: string;
};

type Point = { x: number; y: number };

type Bolt = {
  /** List of polyline strokes: [main, branch, branch…] */
  strokes: Point[][];
  /** Birth timestamp (s) */
  born: number;
  /** Life span (s) */
  life: number;
  /** Strike intensity 0–1 */
  power: number;
};

/**
 * Lightning — React Bits
 * Recursive midpoint-displacement bolts drawn on canvas, branching as they
 * strike and fading into an afterglow.
 */
export default function Lightning({
  hue = 259,
  interval = 2.4,
  forkProbability = 0.16,
  flash = true,
  className,
}: LightningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const boltsRef = useRef<Bolt[]>([]);
  const nextStrikeRef = useRef(0);
  const flashRef = useRef({ alpha: 0, born: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Walk two points with recursive midpoint displacement. */
    const displace = (a: Point, b: Point, offset: number, depth: number): Point[] => {
      if (depth <= 0 || offset < 1.5) return [a, b];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const nx = -(b.y - a.y);
      const ny = b.x - a.x;
      const len = Math.hypot(nx, ny) || 1;
      const jitter = (Math.random() - 0.5) * 2 * offset;
      const mid = { x: mx + (nx / len) * jitter, y: my + (ny / len) * jitter };
      return [
        ...displace(a, mid, offset * 0.55, depth - 1).slice(0, -1),
        ...displace(mid, b, offset * 0.55, depth - 1),
      ];
    };

    const spawnBolt = (now: number, delay = 0) => {
      const startX = width * (0.15 + Math.random() * 0.7);
      const endX = startX + (Math.random() - 0.5) * width * 0.45;
      const endY = height * (0.82 + Math.random() * 0.2);
      const main = displace({ x: startX, y: -10 }, { x: endX, y: endY }, height * 0.14, 6);

      const strokes: Point[][] = [main];
      // Fork secondary bolts off random joints of the main channel
      for (const [i, p] of main.entries()) {
        if (i < 3 || i > main.length - 3) continue;
        if (Math.random() > forkProbability) continue;
        const dir = Math.random() > 0.5 ? 1 : -1;
        const reach = width * (0.08 + Math.random() * 0.16);
        const drop = height * (0.12 + Math.random() * 0.22);
        strokes.push(
          displace(p, { x: p.x + dir * reach, y: p.y + drop }, drop * 0.45, 4)
        );
      }

      boltsRef.current.push({
        strokes,
        born: now + delay,
        life: 0.45 + Math.random() * 0.35,
        power: 0.7 + Math.random() * 0.3,
      });
      if (boltsRef.current.length > 6) boltsRef.current.shift();
      if (flash && delay === 0) {
        flashRef.current = { alpha: 0.16 + Math.random() * 0.1, born: now };
      }
    };

    const drawStroke = (pts: Point[], widthPx: number, alpha: number) => {
      if (pts.length < 2 || alpha <= 0.01) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.lineWidth = widthPx;
      ctx.globalAlpha = alpha;
      ctx.stroke();
    };

    const render = () => {
      const now = performance.now() / 1000;

      if (now >= nextStrikeRef.current) {
        spawnBolt(now);
        // Roughly half of the storms chain a second strike right behind
        if (Math.random() < 0.5) spawnBolt(now, 0.1 + Math.random() * 0.14);
        nextStrikeRef.current = now + interval * (0.55 + Math.random() * 0.9);
      }

      ctx.clearRect(0, 0, width, height);

      // Ambient flash wash
      const f = flashRef.current;
      if (f.alpha > 0.005) {
        const age = now - f.born;
        const wash = f.alpha * Math.exp(-age * 7);
        if (wash > 0.005) {
          ctx.fillStyle = `hsla(${hue}, 90%, 78%, ${wash})`;
          ctx.fillRect(0, 0, width, height);
        } else {
          f.alpha = 0;
        }
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      boltsRef.current = boltsRef.current.filter((bolt) => {
        const age = now - bolt.born;
        if (age > bolt.life) return false;
        if (age < 0) return true; // chained strike not yet detonated
        // Bright strike that decays into an ember glow
        const t = age / bolt.life;
        const alpha = (1 - t) * bolt.power;
        const glow = 18 * (1 - t * 0.6);

        for (const [si, stroke] of bolt.strokes.entries()) {
          const w = si === 0 ? 2.4 : 1.3;
          ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${alpha})`;
          ctx.shadowBlur = glow;
          ctx.strokeStyle = `hsla(${hue}, 100%, ${88 - si * 6}%, 1)`;
          drawStroke(stroke, w, alpha);
          ctx.strokeStyle = `hsla(${(hue + 40) % 360}, 100%, 72%, 1)`;
          drawStroke(stroke, w * 3.4, alpha * 0.22);
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        return true;
      });

      rafRef.current = requestAnimationFrame(render);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      boltsRef.current = [];
    };
  }, [hue, interval, forkProbability, flash]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
