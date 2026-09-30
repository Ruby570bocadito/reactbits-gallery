"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type FadeContentProps = {
  children: ReactNode;
  /** Blur in addition to the fade */
  blur?: boolean;
  /** Initial opacity */
  opacity?: number;
  /** Start when this fraction of the element is visible */
  threshold?: number;
  /** Transition duration in ms */
  duration?: number;
  /** Transition delay in ms */
  delay?: number;
  className?: string;
};

/**
 * FadeContent — React Bits
 * Lightweight opacity (+ optional blur) entrance when scrolled into view.
 */
export default function FadeContent({
  children,
  blur = false,
  opacity = 0,
  threshold = 0.1,
  duration = 600,
  delay = 0,
  className,
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : opacity,
        filter: blur ? (inView ? "blur(0px)" : "blur(6px)") : undefined,
        transition: `opacity ${duration}ms ease-out ${delay}ms, filter ${duration}ms ease-out ${delay}ms`,
        willChange: "opacity, filter",
      }}
    >
      {children}
    </div>
  );
}
