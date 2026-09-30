"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export type SplitTextProps = {
  text: string;
  className?: string;
  /** Delay before the animation starts, ms */
  delay?: number;
  /** Duration of each unit's animation, s */
  duration?: number;
  ease?: string;
  /** Splitting granularity */
  splitType?: "chars" | "words";
  /** Initial state applied to each unit */
  from?: gsap.TweenVars;
  /** Final state applied to each unit */
  to?: gsap.TweenVars;
  stagger?: number;
  textAlign?: "left" | "center" | "right";
  onAnimationComplete?: () => void;
};

/**
 * SplitText — React Bits
 * Splits the text into words/chars and animates each unit in with GSAP.
 * Words use overflow-hidden masks so units rise into place cleanly.
 */
export default function SplitText({
  text,
  className = "",
  delay = 100,
  duration = 1,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, yPercent: 100 },
  to = { opacity: 1, yPercent: 0 },
  stagger = 0.03,
  textAlign = "center",
  onAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const words = useMemo(() => text.split(" ").filter(Boolean), [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !text) return;

    const units = container.querySelectorAll(".split-unit");
    const tween = gsap.fromTo(units, from, {
      ...to,
      duration,
      ease,
      stagger,
      delay: delay / 1000,
      onComplete: onAnimationComplete,
    });

    return () => {
      tween.kill();
    };
  }, [text, splitType, delay, duration, ease, stagger, from, to, onAnimationComplete]);

  return (
    <p
      ref={containerRef}
      className={className}
      style={{ textAlign, whiteSpace: "normal" }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={word + wi} aria-hidden>
          {wi > 0 ? " " : null}
          <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
            {splitType === "chars" ? (
              Array.from(word).map((char, ci) => (
                <span key={ci} className="split-unit inline-block will-change-transform">
                  {char}
                </span>
              ))
            ) : (
              <span className="split-unit inline-block will-change-transform">{word}</span>
            )}
          </span>
        </span>
      ))}
    </p>
  );
}
