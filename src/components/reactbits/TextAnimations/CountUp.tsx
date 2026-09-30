"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type CountUpProps = {
  to: number;
  from?: number;
  /** Animation duration in seconds */
  duration?: number;
  className?: string;
  /** Thousands separator, e.g. "," */
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Play only once */
  once?: boolean;
  /** Start when this fraction of the element is visible */
  threshold?: number;
};

const formatValue = (
  value: number,
  decimals: number,
  separator: string
): string => {
  const fixed = value.toFixed(decimals);
  if (!separator) return fixed;
  const [intPart, decimalPart] = fixed.split(".");
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return decimalPart ? `${withSep}.${decimalPart}` : withSep;
};

/**
 * CountUp — React Bits
 * Counts from `from` to `to` when the element enters the viewport.
 */
export default function CountUp({
  to,
  from = 0,
  duration = 2,
  className = "",
  separator = ",",
  decimals = 0,
  prefix = "",
  suffix = "",
  once = true,
  threshold = 0.4,
}: CountUpProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    let played = false;
    const render = (v: number) => {
      el.textContent = `${prefix}${formatValue(v, decimals, separator)}${suffix}`;
    };
    render(from);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (played && once) return;
        played = true;

        const state = { value: from };
        const tween = gsap.to(state, {
          value: to,
          duration,
          ease: "power2.out",
          onUpdate: () => render(state.value),
          onComplete: () => {
            if (!once) played = false;
          },
        });
        if (once) observer.disconnect();
        return () => tween.kill();
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, from, duration, decimals, separator, prefix, suffix, once, threshold]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {formatValue(from, decimals, separator)}
      {suffix}
    </span>
  );
}
