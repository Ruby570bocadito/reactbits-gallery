"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StarBorderProps = {
  children: ReactNode;
  /** Glow color of the traveling streaks */
  color?: string;
  /** Seconds per sweep */
  speed?: string;
  /** Border thickness in px */
  thickness?: number;
  className?: string;
  /** Classes for the inner content wrapper */
  innerClassName?: string;
  style?: CSSProperties;
};

/**
 * StarBorder — React Bits
 * A glowing light streak sweeps endlessly along the top and bottom edges.
 */
export default function StarBorder({
  children,
  color = "#8261FF",
  speed = "6s",
  thickness = 1.5,
  className = "",
  innerClassName = "",
  style,
}: StarBorderProps) {
  return (
    <div
      className={cn("relative inline-block overflow-hidden rounded-xl", className)}
      style={{ padding: `${thickness}px`, ...style }}
    >
      {/* Static faint frame */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{ background: `linear-gradient(120deg, ${color}55, transparent 40%, ${color}33)` }}
        aria-hidden
      />

      {/* Traveling streaks */}
      <div
        className="animate-star-movement-top absolute left-0 top-0 h-[45%] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDuration: speed,
        }}
        aria-hidden
      />
      <div
        className="animate-star-movement-bottom absolute bottom-0 left-0 h-[45%] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDuration: speed,
        }}
        aria-hidden
      />

      {/* Content */}
      <div className={cn("relative z-10 rounded-[calc(0.75rem-1.5px)]", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
