"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";

export type MetaBallsProps = {
  /** Ball fill palette (radial gradients, cycled) */
  colors?: string[];
  /** Number of chase balls */
  ballCount?: number;
  /** Gooey blur strength (px) */
  blur?: number;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_COLORS = ["#FF2D92", "#5227FF", "#B497FF", "#7C3AED"];

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  k: number;
  rest: { x: number; y: number };
};

export default function MetaBalls({
  colors = DEFAULT_COLORS,
  ballCount = 4,
  blur = 10,
  className,
  style,
}: MetaBallsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const cursorRef = useRef<SVGCircleElement>(null);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    let width = 1;
    let height = 1;

    const balls: Ball[] = Array.from({ length: ballCount }, (_, i) => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 17 + (i % 2) * 6,
      k: 0.05 + i * 0.016,
      rest: { x: 0, y: 0 },
    }));

    const cursor = { x: 0, y: 0, vx: 0, vy: 0 };
    const pointer = { x: 0, y: 0, active: false, pressed: false };

    const layout = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      balls.forEach((b, i) => {
        b.rest.x = (width * (i + 1)) / (ballCount + 1);
        b.rest.y = height / 2 + (i % 2 === 0 ? -height * 0.13 : height * 0.13);
        if (b.x === 0 && b.y === 0) {
          b.x = b.rest.x;
          b.y = b.rest.y;
        }
      });
      if (cursor.x === 0 && cursor.y === 0) {
        cursor.x = width / 2;
        cursor.y = height / 2;
      }
    };
    layout();

    const ro = new ResizeObserver(layout);
    ro.observe(container);

    const toLocal = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      toLocal(e);
      pointer.active = true;
    };
    const onDown = (e: PointerEvent) => {
      toLocal(e);
      pointer.active = true;
      pointer.pressed = true;
      container.setPointerCapture(e.pointerId);
    };
    const onUp = () => {
      pointer.pressed = false;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.pressed = false;
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);
    container.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const step = () => {
      const tx = pointer.active ? pointer.x : width / 2;
      const ty = pointer.active ? pointer.y : height / 2;

      balls.forEach((b, i) => {
        // While pressed, every ball chases the pointer with its own lag;
        // otherwise it springs back to its resting slot.
        const gx = pointer.pressed ? tx : b.rest.x;
        const gy = pointer.pressed ? ty : b.rest.y;
        b.vx = (b.vx + (gx - b.x) * b.k) * 0.86;
        b.vy = (b.vy + (gy - b.y) * b.k) * 0.86;
        b.x += b.vx;
        b.y += b.vy;
        const el = circleRefs.current[i];
        if (el) {
          el.setAttribute("cx", b.x.toFixed(1));
          el.setAttribute("cy", b.y.toFixed(1));
        }
      });

      // A small always-attached ball follows the pointer itself
      cursor.vx = (cursor.vx + (tx - cursor.x) * 0.2) * 0.72;
      cursor.vy = (cursor.vy + (ty - cursor.y) * 0.2) * 0.72;
      cursor.x += cursor.vx;
      cursor.y += cursor.vy;
      const c = cursorRef.current;
      if (c) {
        c.setAttribute("cx", cursor.x.toFixed(1));
        c.setAttribute("cy", cursor.y.toFixed(1));
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [ballCount]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none", ...style }}
    >
      <svg ref={svgRef} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id={`${gradientId}-goo`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
          {colors.map((c, i) => (
            <radialGradient key={`${gradientId}-g${i}`} id={`${gradientId}-g${i}`} cx="35%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor={c} />
              <stop offset="100%" stopColor={c} />
            </radialGradient>
          ))}
        </defs>
        <g filter={`url(#${gradientId}-goo)`}>
          {Array.from({ length: ballCount }, (_, i) => (
            <circle
              key={i}
              ref={(el) => {
                circleRefs.current[i] = el;
              }}
              cx={-99}
              cy={-99}
              r={17 + (i % 2) * 6}
              fill={`url(#${gradientId}-g${i % colors.length})`}
            />
          ))}
          <circle ref={cursorRef} cx={-99} cy={-99} r={13} fill={`url(#${gradientId}-g0)`} opacity={0.92} />
        </g>
      </svg>
    </div>
  );
}
