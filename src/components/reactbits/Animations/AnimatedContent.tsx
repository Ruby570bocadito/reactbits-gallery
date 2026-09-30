"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export type AnimatedContentProps = {
  children: ReactNode;
  /** Travel distance in px */
  distance?: number;
  /** Axis of motion */
  direction?: "vertical" | "horizontal";
  /** Animate from the opposite side */
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  /** Start when this fraction of the element is visible */
  threshold?: number;
  delay?: number;
  className?: string;
};

/**
 * AnimatedContent — React Bits
 * Fades/slides children into place when they scroll into view.
 */
export default function AnimatedContent({
  children,
  distance = 80,
  direction = "vertical",
  reverse = false,
  duration = 1,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  threshold = 0.1,
  delay = 0,
  className,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === "vertical" ? "y" : "x";
    const offset = reverse ? -distance : distance;

    gsap.set(el, {
      [axis]: offset,
      opacity: animateOpacity ? initialOpacity : 1,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        gsap.to(el, {
          [axis]: 0,
          opacity: 1,
          duration,
          ease,
          delay,
          overwrite: "auto",
        });
        observer.disconnect();
      },
      { threshold }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, threshold, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
