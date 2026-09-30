"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type TiltedCardProps = {
  children: React.ReactNode;
  /** Max rotation in degrees */
  rotateAmplitude?: number;
  /** Scale while hovering */
  scaleOnHover?: number;
  /** Caption revealed at the bottom on hover */
  captionText?: string;
  className?: string;
  /** Classes for the inner media container */
  innerClassName?: string;
};

/**
 * TiltedCard — React Bits
 * 3D perspective tilt that follows the pointer with springy inertia.
 */
export default function TiltedCard({
  children,
  rotateAmplitude = 14,
  scaleOnHover = 1.06,
  captionText,
  className = "",
  innerClassName = "",
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const rotateXRaw = useTransform(py, [0, 1], [rotateAmplitude, -rotateAmplitude]);
  const rotateYRaw = useTransform(px, [0, 1], [-rotateAmplitude, rotateAmplitude]);
  const rotateX = useSpring(rotateXRaw, springConfig);
  const rotateY = useSpring(rotateYRaw, springConfig);
  const scale = useSpring(1, springConfig);

  // Glare sheen tracks the pointer
  const glareX = useTransform(px, [0, 1], ["30%", "70%"]);
  const glareY = useTransform(py, [0, 1], ["30%", "70%"]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.3), transparent 55%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    px.set(Math.min(Math.max(relX, 0), 1));
    py.set(Math.min(Math.max(relY, 0), 1));
  };

  const handleMouseEnter = () => {
    setHovering(true);
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    scale.set(1);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className={cn("[perspective:900px]", className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className={cn("relative", innerClassName)}>{children}</div>

        {/* Glare sheen */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: glareBackground }}
          initial={false}
          animate={{ opacity: hovering ? 0.9 : 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden
        />

        {captionText ? (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center pb-3"
            initial={false}
            animate={{ opacity: hovering ? 1 : 0, y: hovering ? 0 : 10 }}
            transition={{ duration: 0.25 }}
          >
            <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
              {captionText}
            </span>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
}
