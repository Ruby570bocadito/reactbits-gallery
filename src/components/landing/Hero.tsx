"use client";

import { motion } from "framer-motion";
import { ArrowDown, Github, Sparkles } from "lucide-react";
import {
  Aurora,
  BlurText,
  CountUp,
  RotatingText,
  ShinyText,
  SplitText,
  StarBorder,
} from "@/components/reactbits";

const STATS = [
  { value: 22, suffix: "", label: "Components" },
  { value: 3, suffix: "", label: "WebGL backgrounds" },
  { value: 60, suffix: "fps", label: "Spring motion" },
  { value: 100, suffix: "%", label: "MIT licensed" },
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Animated aurora backdrop */}
      <Aurora
        className="absolute inset-0 -z-10"
        colorStops={["#5227FF", "#B497FF", "#FF2D92"]}
        amplitude={1.2}
        speed={1.1}
        blend={0.6}
      />
      {/* Readability veils */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#060010]/60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#060010]"
        aria-hidden
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 pb-16 pt-32 text-center sm:px-6">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[#B497FF]" />
          <ShinyText
            text="22 open-source animated components · MIT"
            speed={5}
            className="text-xs font-medium"
          />
        </div>

        <h1 className="max-w-4xl text-[42px] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          <SplitText text="Interface motion" splitType="chars" stagger={0.025} delay={150} />
          <span className="mt-1 block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block bg-gradient-to-r from-[#B497FF] via-[#FF2D92] to-[#B497FF] bg-clip-text text-transparent"
            >
              that feels alive
            </motion.span>
          </span>
        </h1>

        <BlurText
          text="A curated gallery of React Bits — animated backgrounds, kinetic typography and micro-interactions, ready to drop into your Next.js app."
          className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
          delay={900}
          direction="bottom"
        />

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <StarBorder color="#8261FF" speed="5s" thickness={1.5}>
            <a
              href="#backgrounds"
              className="flex items-center gap-2 rounded-xl bg-[#0b0118] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#160a2e]"
            >
              Explore components
              <ArrowDown className="h-4 w-4" />
            </a>
          </StarBorder>

          <a
            href="#interactions"
            className="flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-all duration-200 hover:border-white/35 hover:text-white"
          >
            <Github className="h-4 w-4" />
            Try the interactions
          </a>
        </div>

        <p className="mt-6 text-xs text-white/40">
          Build with <RotatingText
            texts={["GSAP", "WebGL", "Framer Motion", "Tailwind CSS"]}
            rotationInterval={2600}
            className="h-[1.25em] overflow-hidden align-middle font-semibold text-[#B497FF]"
          />
        </p>

        {/* Stats */}
        <dl className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-y-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-8 backdrop-blur-md sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <dd className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-bold text-transparent">
                <CountUp to={stat.value} suffix={stat.suffix} duration={2.2} />
              </dd>
              <dt className="text-xs uppercase tracking-wider text-white/45">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
