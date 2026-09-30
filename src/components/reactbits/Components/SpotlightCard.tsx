"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** rgba() color of the spotlight glow */
  spotlightColor?: string;
};

/**
 * SpotlightCard — React Bits
 * Card that reveals a radial spotlight following the pointer.
 */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(130, 97, 255, 0.28)",
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-white/20",
        className
      )}
      style={{ "--spotlight-color": spotlightColor } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, var(--spotlight-color), transparent 75%)`,
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
