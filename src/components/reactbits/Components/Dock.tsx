"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export type DockItemData = {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  /** Icon size range while magnifying */
  baseSize?: number;
  magnification?: number;
  distance?: number;
};

type DockItemProps = DockItemData & {
  mouseX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distance: number;
};

function DockItem({ title, icon, onClick, mouseX, baseSize, magnification, distance }: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distanceCalc, [-distance, 0, distance], [baseSize, magnification, baseSize]);
  const size = useSpring(sizeSync, { stiffness: 220, damping: 22, mass: 0.4 });

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={title}
      onClick={onClick}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/80 transition-colors duration-200 hover:bg-white/[0.12] hover:text-white"
    >
      <span className="flex h-[45%] w-[45%] items-center justify-center [&_svg]:h-full [&_svg]:w-full">
        {icon}
      </span>

      {/* Tooltip */}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 text-[11px] font-medium text-white/90 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
        {title}
      </span>
    </motion.button>
  );
}

/**
 * Dock — React Bits
 * macOS-style dock with pointer magnification.
 */
export default function Dock({
  items,
  className = "",
  baseSize = 40,
  magnification = 64,
  distance = 130,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={({ clientX }) => mouseX.set(clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur-xl",
        className
      )}
    >
      {items.map((item) => (
        <div key={item.title} className="group relative">
          <DockItem
            {...item}
            mouseX={mouseX}
            baseSize={baseSize}
            magnification={magnification}
            distance={distance}
          />
        </div>
      ))}
    </div>
  );
}
