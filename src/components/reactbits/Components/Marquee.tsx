"use client";

import type { ReactNode } from "react";

export type MarqueeProps = {
  /** Content repeated across the loop — provide one full set */
  children: ReactNode;
  /** Seconds for one full loop of the content */
  speed?: number;
  /** Travel direction */
  direction?: "left" | "right";
  /** Freeze the loop while hovered */
  pauseOnHover?: boolean;
  /** Soft-mask the left/right edges */
  fadeEdges?: boolean;
  className?: string;
};

/**
 * Marquee — React Bits
 * An infinite horizontal loop built from duplicated content and a single
 * CSS animation. Pure transform, GPU-friendly, pauses on demand.
 */
export default function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  fadeEdges = true,
  className,
}: MarqueeProps) {
  const animation = `${direction === "left" ? "marquee-left" : "marquee-right"} ${speed}s linear infinite`;
  const pauseClass = pauseOnHover ? "group-hover:[animation-play-state:paused]" : "";

  return (
    <div
      className={`group relative flex w-full min-w-0 overflow-hidden [contain:inline-size] ${
        fadeEdges
          ? "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          : ""
      } ${className ?? ""}`}
    >
      <div className={`flex w-max shrink-0 items-center ${pauseClass}`} style={{ animation }}>
        {children}
      </div>
      <div aria-hidden className={`flex w-max shrink-0 items-center ${pauseClass}`} style={{ animation }}>
        {children}
      </div>
    </div>
  );
}
