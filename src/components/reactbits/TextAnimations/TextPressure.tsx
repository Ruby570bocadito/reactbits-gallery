"use client";

import { useEffect, useRef } from "react";

export type TextPressureProps = {
  /** Text to render */
  text?: string;
  /** Cursor influence radius in px */
  falloff?: number;
  /** Extra vertical growth at full pressure */
  maxScaleY?: number;
  /** Extra horizontal stretch at full pressure */
  maxScaleX?: number;
  /** Per-frame lerp factor (0-1) */
  stiffness?: number;
  className?: string;
};

export default function TextPressure({
  text = "TextPressure",
  falloff = 120,
  maxScaleY = 1.9,
  maxScaleX = 2.1,
  stiffness = 0.14,
  className,
}: TextPressureProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const letters = Array.from(root.children) as HTMLElement[];
    const centers: { x: number; y: number }[] = [];
    const current = letters.map(() => ({ sx: 1, sy: 1 }));
    const target = letters.map(() => ({ sx: 1, sy: 1 }));
    let raf = 0;

    const measure = () => {
      centers.length = 0;
      letters.forEach((el) => {
        const r = el.getBoundingClientRect();
        centers.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      });
    };

    const applyPressure = (mx: number, my: number) => {
      letters.forEach((_, i) => {
        if (!centers[i]) return;
        const d = Math.hypot(mx - centers[i].x, my - centers[i].y);
        const t = Math.max(0, 1 - d / falloff);
        const ease = t * t * (3 - 2 * t); // smoothstep falloff
        target[i].sx = 1 + ease * (maxScaleX - 1);
        target[i].sy = 1 + ease * (maxScaleY - 1);
      });
    };

    const onMove = (e: PointerEvent) => applyPressure(e.clientX, e.clientY);
    const onLeave = () => {
      target.forEach((t) => {
        t.sx = 1;
        t.sy = 1;
      });
    };

    // Letters move with scroll / entrance animations — re-measure on entry, cheap for short text
    root.addEventListener("pointerenter", measure);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    const loop = () => {
      letters.forEach((el, i) => {
        current[i].sx += (target[i].sx - current[i].sx) * stiffness;
        current[i].sy += (target[i].sy - current[i].sy) * stiffness;
        el.style.transform = `scale(${current[i].sx.toFixed(3)}, ${current[i].sy.toFixed(3)})`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerenter", measure);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      letters.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, [text, falloff, maxScaleY, maxScaleX, stiffness]);

  return (
    <span ref={rootRef} className={`inline-flex items-baseline whitespace-nowrap ${className ?? ""}`}>
      {text.split("").map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          className="inline-block will-change-transform"
          style={{ transformOrigin: "50% 62%" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
