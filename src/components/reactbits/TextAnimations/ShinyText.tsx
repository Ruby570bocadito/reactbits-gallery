"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type ShinyTextProps = {
  text: string;
  /** Disable the shimmer animation */
  disabled?: boolean;
  /** Seconds per shimmer cycle */
  speed?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * ShinyText — React Bits
 * Light sweep sweeping across the text.
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = "",
  style,
}: ShinyTextProps) {
  return (
    <span
      className={cn("shiny-text", disabled && "disabled", className)}
      style={{ animationDuration: `${speed}s`, ...style }}
    >
      {text}
    </span>
  );
}
