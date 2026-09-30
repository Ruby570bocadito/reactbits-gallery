"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type RotatingTextProps = {
  texts: string[];
  /** Milliseconds each text stays on screen */
  rotationInterval?: number;
  /** Seconds between letter stagger */
  staggerDuration?: number;
  className?: string;
  /** Classes for the rotating words */
  textClassName?: string;
};

/**
 * RotatingText — React Bits
 * Cycles through a list of texts with a letter-by-letter slide.
 */
export default function RotatingText({
  texts,
  rotationInterval = 2400,
  staggerDuration = 0.02,
  className = "",
  textClassName = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!texts || texts.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % texts.length),
      rotationInterval
    );
    return () => clearInterval(id);
  }, [texts, rotationInterval]);

  const current = texts[index] ?? "";
  const letters = Array.from(current);

  return (
    <span
      className={cn("relative inline-flex overflow-hidden align-bottom", className)}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className={cn("inline-flex whitespace-nowrap", textClassName)}
          aria-label={current}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ staggerChildren: staggerDuration }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block will-change-transform"
              variants={{
                enter: { y: "120%", opacity: 0 },
                center: { y: "0%", opacity: 1 },
                exit: { y: "-120%", opacity: 0 },
              }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
