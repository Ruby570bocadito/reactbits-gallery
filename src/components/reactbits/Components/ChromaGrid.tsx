"use client";

import type { ReactNode } from "react";
import { useCallback } from "react";

export type ChromaItem = {
  icon: ReactNode;
  title: string;
  /** Secondary line, e.g. a role or tagline */
  subtitle?: string;
  /** Handle rendered as an @mention pill */
  handle?: string;
  /** Primary chroma color (border highlight) */
  borderColor: string;
  /** Secondary chroma color (inner gradient wash) */
  gradientColor: string;
};

export type ChromaGridProps = {
  items: ChromaItem[];
  /** Tailwind grid-cols classes override */
  columnsClass?: string;
  className?: string;
};

/**
 * ChromaGrid — React Bits
 * Card grid where a two-tone chroma border and interior wash track the
 * cursor per card via CSS custom properties — no re-renders while moving.
 */
export default function ChromaGrid({
  items,
  columnsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  className,
}: ChromaGridProps) {
  const trackPointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div className={`grid gap-5 ${columnsClass} ${className ?? ""}`}>
      {items.map((item, i) => (
        <div
          key={`${item.title}-${i}`}
          onPointerMove={trackPointer}
          className="chroma-card group/card p-[1px]"
          style={
            {
              "--chroma-a": item.borderColor,
              "--chroma-b": item.gradientColor,
            } as React.CSSProperties
          }
        >
          {/* Cursor-tracked border + wash (globals.css) */}
          <div className="chroma-border" aria-hidden />
          <div className="chroma-glow" aria-hidden />

          <div className="relative z-[3] flex h-full flex-col gap-4 rounded-[15px] bg-[#0a0118] p-6 transition-colors duration-300 group-hover/card:bg-[#0d0322]">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-white/10"
                style={{ background: `linear-gradient(140deg, ${item.borderColor}33, ${item.gradientColor}22)` }}
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-white">{item.title}</h3>
                {item.subtitle && (
                  <p className="truncate text-xs text-white/50">{item.subtitle}</p>
                )}
              </div>
            </div>

            {item.handle && (
              <span
                className="w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium"
                style={{
                  borderColor: `${item.borderColor}55`,
                  color: item.borderColor,
                  background: `${item.borderColor}14`,
                }}
              >
                {item.handle}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
