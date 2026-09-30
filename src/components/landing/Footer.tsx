"use client";

import { ArrowUpRight, Zap } from "lucide-react";
import {
  AnimatedContent,
  DotGrid,
  ShinyText,
  StarBorder,
} from "@/components/reactbits";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* CTA band */}
      <div className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <AnimatedContent distance={60}>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0218]">
            <DotGrid
              className="absolute inset-0 opacity-70"
              gridSize={26}
              dotColor="#7a5cff"
              waveAmplitude={0.5}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#060010_85%)]" aria-hidden />

            <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-16 text-center">
              <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to make your UI{" "}
                <span className="bg-gradient-to-r from-[#B497FF] to-[#FF2D92] bg-clip-text text-transparent">
                  move?
                </span>
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/60">
                Copy any component straight into your project — no lock-in, no
                wrapper bloat, just clean React + Tailwind you fully own.
              </p>
              <StarBorder color="#8261FF" speed="5s">
                <a
                  href="https://reactbits.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-[#0b0118] px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#160a2e]"
                >
                  Browse all components
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </StarBorder>
            </div>
          </div>
        </AnimatedContent>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] bg-[#060010]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#5227FF] to-[#FF2D92]">
              <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold text-white">reactbits.gallery</span>
          </div>

          <ShinyText
            text="Built with React Bits · Next.js 16 · Tailwind CSS 4 · GSAP · OGL"
            speed={6}
            className="text-xs"
          />

          <p className="text-xs text-white/40">MIT License · Open source</p>
        </div>
      </div>
    </footer>
  );
}
