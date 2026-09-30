"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ScrambleTextProps = {
  /** Text to scramble into (used when `phrases` is not provided) */
  text?: string;
  /** Sequence of phrases — cycles when `loop` is true */
  phrases?: string[];
  /** Milliseconds between scramble ticks */
  speed?: number;
  /** Character pool used while scrambling */
  characters?: string;
  /** Loop through `phrases` forever */
  loop?: boolean;
  /** Pause after a phrase completes (loop mode, ms) */
  pauseDuration?: number;
  /** Delay before the first scramble (ms) */
  startDelay?: number;
  className?: string;
};

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}=+*^?#";

export default function ScrambleText({
  text = "React Bits",
  phrases,
  speed = 32,
  characters = DEFAULT_CHARS,
  loop = false,
  pauseDuration = 1500,
  startDelay = 200,
  className,
}: ScrambleTextProps) {
  // Stable identity so the scramble does not restart on unrelated parent re-renders
  const sequence = useMemo(
    () => (phrases && phrases.length > 0 ? phrases : [text]),
    [phrases, text]
  );
  const [display, setDisplay] = useState(sequence[0]);
  const rafRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const scrambleTo = (target: string, done: () => void) => {
      const chars = target.split("");
      let progress = 0;
      let last = 0;

      const tick = (now: number) => {
        if (cancelled) return;
        if (now - last >= speed) {
          last = now;
          progress += 1;
          const out = chars.map((ch, i) => {
            if (ch === " ") return " ";
            if (i < progress) return ch;
            return characters[Math.floor(Math.random() * characters.length)];
          });
          setDisplay(out.join(""));
          if (progress >= chars.length) {
            done();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const run = () => {
      let idx = 0;
      const next = () => {
        if (!loop || sequence.length <= 1) return;
        timeout = setTimeout(() => {
          idx = (idx + 1) % sequence.length;
          scrambleTo(sequence[idx], next);
        }, pauseDuration);
      };
      scrambleTo(sequence[idx], next);
    };

    timeout = setTimeout(run, startDelay);

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sequence, speed, characters, loop, pauseDuration, startDelay]);

  return <span className={className}>{display}</span>;
}
