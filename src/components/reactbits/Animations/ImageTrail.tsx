"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type ImageTrailProps = {
  /** Image sources cycled into the trail. Procedural gradients when omitted. */
  items?: string[];
  /** Pointer travel (px) required between two trail spawns */
  threshold?: number;
  /** Trail card width (px) */
  width?: number;
  /** Trail card height (px) */
  height?: number;
  className?: string;
};

type TrailNode = { el: HTMLDivElement; timeline: gsap.core.Timeline };

/** Procedural gradient tiles so the demo works with zero external assets. */
function makeProceduralTiles(count: number, width: number, height: number): string[] {
  const palettes: [string, string, string][] = [
    ["#5227FF", "#B497FF", "#0b0118"],
    ["#FF2D92", "#5227FF", "#12041f"],
    ["#2AFFE6", "#5227FF", "#04121a"],
    ["#FFB02D", "#FF2D92", "#1a0b04"],
    ["#7CFF6B", "#2AFFE6", "#041a0e"],
    ["#B497FF", "#FF2D92", "#12041f"],
    ["#FF6B2D", "#FFD42D", "#1a1204"],
    ["#2D9BFF", "#2AFFE6", "#04121f"],
  ];
  return Array.from({ length: count }, (_, i) => {
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    const [a, b, c] = palettes[i % palettes.length];
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, a);
    grad.addColorStop(0.55, b);
    grad.addColorStop(1, c);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Abstract accent: glowing ring + orb, seeded per tile
    const cx = canvas.width * (0.3 + ((i * 0.17) % 0.4));
    const cy = canvas.height * (0.35 + ((i * 0.23) % 0.3));
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = canvas.width * 0.035;
    ctx.beginPath();
    ctx.arc(cx, cy, canvas.width * 0.16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.beginPath();
    ctx.arc(canvas.width - cx, canvas.height - cy, canvas.width * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    return canvas.toDataURL("image/png");
  });
}

/**
 * ImageTrail — React Bits
 * Moving the pointer across the container drops a sequence of image cards
 * that pop in, hang, then tumble away — GSAP timeline per card.
 */
export default function ImageTrail({
  items,
  threshold = 110,
  width = 140,
  height = 180,
  className,
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const lastRef = useRef({ x: -Infinity, y: -Infinity, time: 0 });
  const activeRef = useRef<TrailNode[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    tilesRef.current = items?.length
      ? items
      : makeProceduralTiles(8, width, height);

    const spawn = (x: number, y: number) => {
      const sources = tilesRef.current;
      if (!sources.length) return;
      const src = sources[indexRef.current % sources.length];
      indexRef.current += 1;

      const el = document.createElement("div");
      el.className = "image-trail-card";
      el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${width}px;height:${height}px;pointer-events:none;border-radius:14px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.45);will-change:transform,opacity;z-index:5;`;
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
      el.appendChild(img);
      container.appendChild(el);

      const timeline = gsap.timeline({
        onComplete: () => {
          activeRef.current = activeRef.current.filter((n) => n.el !== el);
          el.remove();
        },
      });
      timeline.fromTo(
        el,
        { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0, rotation: gsap.utils.random(-18, 18) },
        { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" }
      );
      timeline.to(el, {
        y: "+=90",
        scale: 0.45,
        opacity: 0,
        rotation: gsap.utils.random(-30, 30),
        duration: 0.55,
        ease: "power2.in",
        delay: 0.42,
      });

      activeRef.current.push({ el, timeline });
      // Keep at most 10 cards alive — kill the oldest
      if (activeRef.current.length > 10) {
        const oldest = activeRef.current.shift();
        oldest?.timeline.kill();
        oldest?.el.remove();
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const now = performance.now();
      const dist = Math.hypot(x - lastRef.current.x, y - lastRef.current.y);
      if (dist >= threshold && now - lastRef.current.time > 70) {
        lastRef.current = { x, y, time: now };
        spawn(x, y);
      }
    };

    container.addEventListener("pointermove", onMove);
    return () => {
      container.removeEventListener("pointermove", onMove);
      activeRef.current.forEach((n) => {
        n.timeline.kill();
        n.el.remove();
      });
      activeRef.current = [];
    };
  }, [items, threshold, width, height]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className ?? ""}`}
      style={{ cursor: "crosshair" }}
      aria-hidden
    >
      {/* Idle hint rendered under the trail layer */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/35">
          Move to reveal
        </span>
      </div>
    </div>
  );
}
