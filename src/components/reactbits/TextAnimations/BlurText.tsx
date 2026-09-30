"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type BlurTextProps = {
  text: string;
  className?: string;
  /** Delay before animating, ms */
  delay?: number;
  /** Animate by whole words or single characters */
  animateBy?: "words" | "characters";
  /** Direction the units come from */
  direction?: "top" | "bottom";
  /** Start when this fraction of the element is visible */
  threshold?: number;
  onAnimationComplete?: () => void;
};

/**
 * BlurText — React Bits
 * Reveals words/characters from a soft blur into focus with GSAP.
 */
export default function BlurText({
  text,
  className = "",
  delay = 200,
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  onAnimationComplete,
}: BlurTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !text) return;

    const units = container.querySelectorAll(".blur-unit");
    let played = false;

    const animate = () => {
      if (played) return;
      played = true;
      gsap.fromTo(
        units,
        {
          opacity: 0,
          filter: "blur(10px)",
          y: direction === "top" ? -24 : 24,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.045,
          delay: delay / 1000,
          onComplete: onAnimationComplete,
        }
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, [text, animateBy, direction, delay, threshold]);

  const units = animateBy === "words" ? text.split(" ") : Array.from(text);

  return (
    <p ref={containerRef} className={className} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={i}
          aria-hidden
          className="blur-unit inline-block will-change-[filter,transform,opacity]"
        >
          {unit === " " ? "\u00A0" : unit}
          {animateBy === "words" ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
}
