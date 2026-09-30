"use client";

import { useEffect, useRef, useState } from "react";

export type TrueFocusProps = {
  /** Sentence broken into focusable words */
  sentence?: string;
  /** Manually pick the focused word by hovering instead of auto-cycling */
  manualMode?: boolean;
  /** Ms each word holds focus */
  interval?: number;
  /** Blur radius applied to unfocused words (px) */
  blurAmount?: number;
  /** Focus frame color */
  borderColor?: string;
  /** Glow color behind the focused word */
  glowColor?: string;
  className?: string;
};

/**
 * TrueFocus — React Bits
 * A camera-style focus rectangle hops from word to word; the word inside
 * the frame snaps sharp while everything else stays out of focus.
 */
export default function TrueFocus({
  sentence = "Focus on what matters",
  manualMode = false,
  interval = 1600,
  blurAmount = 5,
  borderColor = "#5227FF",
  glowColor = "rgba(82, 39, 255, 0.65)",
  className,
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [hovering, setHovering] = useState(false);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the rectangle glued to the active word
  useEffect(() => {
    const el = wordRefs.current[active];
    if (!el) return;
    setFrame({
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  }, [active, sentence]);

  // Auto-advance focus unless hovered (or fully manual)
  useEffect(() => {
    if (manualMode || hovering) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % words.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [manualMode, hovering, interval, words.length]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block leading-relaxed ${className ?? ""}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          ref={(node) => {
            wordRefs.current[i] = node;
          }}
          className="relative z-10 mx-[0.28em] inline-block cursor-default font-semibold transition-all duration-300"
          style={{
            filter: i === active ? "blur(0px)" : `blur(${blurAmount}px)`,
            color: i === active ? "#ffffff" : "rgba(255,255,255,0.55)",
          }}
          onMouseEnter={() => manualMode && setActive(i)}
        >
          {word}
        </span>
      ))}

      {/* Camera focus frame */}
      <div
        ref={frameRef}
        aria-hidden
        className="pointer-events-none absolute z-0 rounded-[2px] transition-all duration-300 ease-out"
        style={{
          top: frame.top - 5,
          left: frame.left - 5,
          width: frame.width + 10,
          height: frame.height + 10,
          border: `1.5px solid ${borderColor}`,
          boxShadow: `0 0 14px ${glowColor}, inset 0 0 10px ${glowColor}`,
        }}
      >
        {/* Viewfinder corners */}
        {(
          [
            "top-0 left-0 border-t-2 border-l-2",
            "top-0 right-0 border-t-2 border-r-2",
            "bottom-0 left-0 border-b-2 border-l-2",
            "bottom-0 right-0 border-b-2 border-r-2",
          ] as const
        ).map((corner) => (
          <span
            key={corner}
            className={`absolute h-2.5 w-2.5 ${corner}`}
            style={{ borderColor }}
          />
        ))}
      </div>
    </div>
  );
}
