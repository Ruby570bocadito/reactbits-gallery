"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GradientTextProps = {
  children: ReactNode;
  /** Gradient stops */
  colors?: string[];
  /** Seconds for one full gradient loop */
  animationSpeed?: number;
  /** Draw a matching animated border around the text */
  showBorder?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * GradientText — React Bits
 * Animated gradient flowing through the glyphs via background-clip: text.
 */
export default function GradientText({
  children,
  colors = ["#5227FF", "#FF2D92", "#B497FF", "#5227FF"],
  animationSpeed = 8,
  showBorder = false,
  className = "",
  style,
}: GradientTextProps) {
  const backgroundImage = `linear-gradient(to right, ${colors.join(", ")})`;

  return (
    <span
      className={cn("gradient-text font-semibold", showBorder && "px-2", className)}
      style={{
        backgroundImage,
        animationDuration: `${animationSpeed}s`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
