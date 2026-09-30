"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type ElasticSliderProps = {
  /** Initial position, 0–100 */
  defaultValue?: number;
  /** Inner track length in px */
  maxWidth?: number;
  /** Knob diameter in px */
  expandSize?: number;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Fill color left of the knob */
  leftColor?: string;
  /** Fill color right of the knob */
  rightColor?: string;
  /** Knob color */
  sliderColor?: string;
  isStepped?: boolean;
  stepSize?: number;
  className?: string;
  onValueChange?: (value: number) => void;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * ElasticSlider — React Bits
 * Draggable knob with elastic rubber-band stretch at both ends.
 */
export default function ElasticSlider({
  defaultValue = 50,
  maxWidth = 300,
  expandSize = 22,
  iconLeft,
  iconRight,
  leftColor = "#5227FF",
  rightColor = "#FF2D92",
  sliderColor = "#f0f0f0",
  isStepped = false,
  stepSize = 10,
  className = "",
  onValueChange,
}: ElasticSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const knobTravel = maxWidth - expandSize;
  const rawX = useMotionValue((defaultValue / 100) * knobTravel);
  const springX = useSpring(rawX, { stiffness: 300, damping: 28, mass: 0.5 });
  const stretchX = useSpring(1, { stiffness: 320, damping: 18 });
  const fillWidth = useTransform(springX, (x) => x + expandSize / 2 + 2);

  useEffect(() => {
    const unsub = springX.on("change", (x) => {
      const v = clamp(
        isStepped ? Math.round((x / knobTravel) * 100 / stepSize) * stepSize : Math.round((x / knobTravel) * 100),
        0,
        100
      );
      setValue((prev) => {
        if (prev !== v) onValueChange?.(v);
        return v;
      });
    });
    return unsub;
  }, [springX, knobTravel, isStepped, stepSize, onValueChange]);

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    track.setPointerCapture(e.pointerId);
    setDragging(true);
    const rect = track.getBoundingClientRect();
    rawX.jump(clamp(e.clientX - rect.left - expandSize / 2, 0, knobTravel));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const unclamped = e.clientX - rect.left - expandSize / 2;
    const clamped = clamp(unclamped, 0, knobTravel);

    // Rubber-band: knob stays at the end, body stretches toward the pointer
    const overshoot = Math.abs(unclamped - clamped);
    rawX.set(clamped);
    stretchX.set(1 + Math.min(overshoot / 110, 0.4));
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    stretchX.set(1);
  };

  return (
    <div className={cn("flex select-none items-center gap-3", className)}>
      {iconLeft ? <span className="text-white/50 [&_svg]:h-5 [&_svg]:w-5">{iconLeft}</span> : null}

      <div
        ref={trackRef}
        className="relative flex h-12 items-center rounded-full border border-white/10 bg-white/[0.05] backdrop-blur"
        style={{ width: maxWidth + expandSize, touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        {/* Fill left of the knob */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 h-full rounded-l-full"
          style={{ width: fillWidth, background: leftColor, opacity: 0.4 }}
        />
        {/* Static hint fill right of the knob */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-2.5 rounded-r-full"
          style={{ background: rightColor, opacity: 0.3 }}
        />

        {/* Knob */}
        <motion.div
          className="relative z-10 flex items-center justify-center rounded-full"
          style={{
            x: springX,
            scaleX: stretchX,
            width: expandSize + 6,
            height: expandSize + 6,
            marginLeft: expandSize / 2 - 3,
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
            transformOrigin: "center",
          }}
          whileTap={{ scale: 1.1 }}
        >
          <span
            className="absolute inset-0 rounded-full shadow-[0_2px_14px_rgba(0,0,0,0.55)]"
            style={{ background: `radial-gradient(circle at 32% 30%, #ffffff, ${sliderColor})` }}
          />
        </motion.div>

        {/* Value bubble */}
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-white/10 bg-black/70 px-2 py-0.5 text-xs font-semibold tabular-nums text-white/90 backdrop-blur">
          {value}
        </span>
      </div>

      {iconRight ? <span className="text-white/50 [&_svg]:h-5 [&_svg]:w-5">{iconRight}</span> : null}
    </div>
  );
}
