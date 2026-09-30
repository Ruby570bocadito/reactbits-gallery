"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type CircularTextProps = {
  text: string;
  /** Seconds per full rotation */
  spinDuration?: number;
  /** Rotation direction */
  direction?: "clockwise" | "counterclockwise";
  /** Run rotation only while hovered */
  onHover?: "slow" | "stop" | "speedup";
  radius?: number;
  className?: string;
};

/**
 * CircularText — React Bits
 * Text laid on a circular SVG path, endlessly rotating.
 */
export default function CircularText({
  text,
  spinDuration = 20,
  direction = "clockwise",
  onHover = "speedup",
  radius = 72,
  className = "",
}: CircularTextProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const chars = Array.from(text);
  const size = radius * 2 + 24;
  const center = size / 2;
  const pathRadius = radius;
  const circumference = 2 * Math.PI * pathRadius;
  const charSpacing = (circumference / Math.max(chars.length, 1)).toFixed(3);

  const duration = direction === "clockwise" ? spinDuration : -spinDuration;
  const hoverDuration =
    onHover === "stop" ? 0 : onHover === "slow" ? spinDuration * 2.5 : spinDuration / 4;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.style.setProperty("--circular-duration", `${Math.abs(duration)}s`);
  }, [duration]);

  return (
    <div
      className={cn("inline-block", className)}
      style={
        {
          "--circular-duration": `${Math.abs(duration)}s`,
        } as React.CSSProperties
      }
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="circular-text-svg block"
        role="img"
        aria-label={text}
      >
        <defs>
          <path
            id="circular-text-path"
            d={`M ${center},${center} m -${pathRadius},0 a ${pathRadius},${pathRadius} 0 1,1 ${pathRadius * 2},0 a ${pathRadius},${pathRadius} 0 1,1 -${pathRadius * 2},0`}
          />
        </defs>
        <text className="fill-current text-[11px] font-semibold uppercase tracking-[0.18em]">
          <textPath href="#circular-text-path" textLength={circumference} startOffset="0">
            {chars.map((ch, i) => (
              <tspan key={i}>{ch === " " ? "\u00A0" : ch}</tspan>
            ))}
          </textPath>
        </text>
      </svg>
      <style>{`
        .circular-text-svg {
          animation: circular-rotate var(--circular-duration) linear infinite;
          animation-direction: ${duration >= 0 ? "normal" : "reverse"};
        }
        .circular-text-svg:hover {
          animation-duration: ${Math.abs(hoverDuration) || 0.01}s;
        }
        @keyframes circular-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
