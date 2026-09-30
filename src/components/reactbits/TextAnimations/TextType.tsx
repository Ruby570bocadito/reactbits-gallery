"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TextTypeProps = {
  /** A single string or a list of strings to cycle through */
  text: string | string[];
  /** ms per character while typing */
  typingSpeed?: number;
  /** ms to wait when a word is complete */
  pauseDuration?: number;
  /** ms per character while deleting */
  deletingSpeed?: number;
  /** Start delay in ms */
  startDelay?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  /** Loop back through the list (single strings restart only if true) */
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
  onSentenceComplete?: (sentence: string) => void;
};

/**
 * TextType — React Bits
 * Typewriter effect with optional multi-sentence cycling and blinking cursor.
 */
export default function TextType({
  text,
  typingSpeed = 70,
  pauseDuration = 1600,
  deletingSpeed = 38,
  startDelay = 300,
  showCursor = true,
  cursorCharacter = "|",
  loop = true,
  className = "",
  cursorClassName = "",
  onSentenceComplete,
}: TextTypeProps) {
  const texts = Array.isArray(text) ? text : [text];
  const [displayed, setDisplayed] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let sentenceIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const current = texts[sentenceIndex];

      if (!deleting) {
        charIndex += 1;
        setDisplayed(current.slice(0, charIndex));

        if (charIndex === current.length) {
          onSentenceComplete?.(current);
          const isLast = sentenceIndex === texts.length - 1;
          if (texts.length === 1 && !loop) return;
          if (isLast && !loop) return;
          deleting = true;
          timerRef.current = setTimeout(tick, pauseDuration);
          return;
        }
        timerRef.current = setTimeout(tick, typingSpeed + Math.random() * 40);
      } else {
        charIndex -= 1;
        setDisplayed(current.slice(0, charIndex));

        if (charIndex === 0) {
          deleting = false;
          sentenceIndex = (sentenceIndex + 1) % texts.length;
        }
        timerRef.current = setTimeout(tick, deletingSpeed);
      }
    };

    timerRef.current = setTimeout(tick, startDelay);

    return () => {
      disposed = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, typingSpeed, pauseDuration, deletingSpeed, startDelay, loop]);

  return (
    <span className={cn("inline", className)} aria-label={texts.join(", ")}>
      <span aria-hidden>{displayed}</span>
      {showCursor ? (
        <span
          aria-hidden
          className={cn("texttype-cursor ml-0.5 inline-block", cursorClassName)}
        >
          {cursorCharacter}
        </span>
      ) : null}
    </span>
  );
}
