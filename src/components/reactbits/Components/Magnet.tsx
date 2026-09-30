"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export type MagnetProps = {
  children: ReactNode;
  /** Extra px around the wrapper that still attract */
  padding?: number;
  /** Higher value = weaker pull */
  magnetStrength?: number;
  disabled?: boolean;
  /** If true, the magnet follows the pointer anywhere on the page */
  activeOnlyOnHover?: boolean;
  wrapperClassName?: string;
  innerClassName?: string;
};

/**
 * Magnet — React Bits
 * Elements that are attracted toward the pointer with springy motion.
 */
export default function Magnet({
  children,
  padding = 80,
  magnetStrength = 3,
  disabled = false,
  activeOnlyOnHover = true,
  wrapperClassName = "",
  innerClassName = "",
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 14, mass: 0.15 });
  const springY = useSpring(y, { stiffness: 160, damping: 14, mass: 0.15 });

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const inX = e.clientX >= rect.left - padding && e.clientX <= rect.right + padding;
      const inY = e.clientY >= rect.top - padding && e.clientY <= rect.bottom + padding;

      if (inX && inY) {
        setActive(true);
        x.set((e.clientX - centerX) / magnetStrength);
        y.set((e.clientY - centerY) / magnetStrength);
      } else {
        setActive(false);
        x.set(0);
        y.set(0);
      }
    };

    if (activeOnlyOnHover) {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const onMove = (e: MouseEvent) => handleMouseMove(e);
      const onLeave = () => {
        setActive(false);
        x.set(0);
        y.set(0);
      };
      // Listen on a wider area: attach to document but only react near the wrapper
      document.addEventListener("mousemove", onMove);
      return () => document.removeEventListener("mousemove", onMove);
    }

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [disabled, padding, magnetStrength, activeOnlyOnHover, x, y]);

  return (
    <motion.div
      ref={wrapperRef}
      className={cn("relative inline-block", wrapperClassName)}
      animate={{ scale: active ? 1.04 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div className={cn("inline-block", innerClassName)} style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
