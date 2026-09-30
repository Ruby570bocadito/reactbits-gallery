"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type StackItem = {
  id: number | string;
  /** Rendered content of the card */
  content: React.ReactNode;
};

export type StackProps = {
  items: StackItem[];
  /** Card dimensions in px */
  cardWidth?: number;
  cardHeight?: number;
  /** Horizontal throw threshold in px */
  throwThreshold?: number;
  className?: string;
};

/**
 * Stack — React Bits
 * A flick-through card pile: throw the top card and the pile springs forward.
 */
export default function Stack({
  items,
  cardWidth = 220,
  cardHeight = 300,
  throwThreshold = 110,
  className = "",
}: StackProps) {
  const [order, setOrder] = useState<StackItem[]>(items);

  const cycle = () =>
    setOrder((prev) => [...prev.slice(1), prev[0]]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (
      Math.abs(info.offset.x) > throwThreshold ||
      Math.abs(info.velocity.x) > 400
    ) {
      cycle();
    }
  };

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: cardWidth, height: cardHeight }}
    >
      {order.slice(0, 6).map((item, depth) => {
        const isTop = depth === 0;
        const restRotate = Number(item.id) % 2 === 0 ? -2.6 : 2.6;

        return (
          <motion.div
            key={item.id}
            drag={isTop ? "x" : false}
            dragElastic={0.5}
            dragMomentum={false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            style={{
              position: "absolute",
              inset: 0,
              width: cardWidth,
              height: cardHeight,
              zIndex: 30 - depth,
              cursor: isTop ? "grab" : "default",
            }}
            initial={false}
            animate={{
              scale: 1 - depth * 0.055,
              y: depth * 16,
              rotate: isTop ? 0 : restRotate,
              opacity: depth >= 5 ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            whileDrag={{ cursor: "grabbing" }}
          >
            {item.content}
          </motion.div>
        );
      })}
    </div>
  );
}
