"use client";

import type { ReactNode } from "react";
import { Layers } from "lucide-react";
import {
  AnimatedContent,
  Aurora,
  BlurText,
  DotGrid,
  LetterGlitch,
  Lightning,
  Particles,
  ShinyText,
  Silk,
  Squares,
  SpotlightCard,
  Waves,
} from "@/components/reactbits";

function SectionHeader({ eyebrow, title, accent, description }: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <ShinyText text={eyebrow} speed={5} className="text-xs font-semibold uppercase tracking-[0.2em]" />
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title} <span className="bg-gradient-to-r from-[#B497FF] to-[#FF2D92] bg-clip-text text-transparent">{accent}</span>
      </h2>
      <BlurText
        text={description}
        className="mt-4 text-base leading-relaxed text-white/60"
        delay={250}
      />
    </div>
  );
}

type PreviewCardProps = {
  name: string;
  tech: string;
  description: string;
  children: ReactNode;
};

function PreviewCard({ name, tech, description, children }: PreviewCardProps) {
  return (
    <SpotlightCard className="flex flex-col">
      <div className="relative h-56 overflow-hidden rounded-t-2xl border-b border-white/[0.06] bg-[#08010f]">
        {children}
        <div
          className="pointer-events-none absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-white/[0.06]"
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">{name}</h3>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-medium text-[#B497FF]">
            {tech}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-white/55">{description}</p>
      </div>
    </SpotlightCard>
  );
}

export default function BackgroundsSection() {
  return (
    <section id="backgrounds" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <AnimatedContent>
        <SectionHeader
          eyebrow="Backgrounds"
          title="Living canvases for"
          accent="your hero"
          description="Shader-driven scenes rendered live with OGL. Drop them behind any content and watch the page breathe."
        />
      </AnimatedContent>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatedContent delay={0} distance={60}>
          <PreviewCard
            name="Aurora"
            tech="OGL · WebGL"
            description="Layered simplex-noise bands flowing through custom gradient stops. The signature React Bits hero backdrop."
          >
            <Aurora
              className="absolute inset-0"
              colorStops={["#5227FF", "#B497FF", "#FF2D92"]}
              amplitude={1.1}
              speed={1.2}
            />
          </PreviewCard>
        </AnimatedContent>

        <AnimatedContent delay={0.12} distance={60}>
          <PreviewCard
            name="Particles"
            tech="OGL · gl.POINTS"
            description="Thousands of glowing particles that drift idly and scatter away from your pointer in real time."
          >
            <Particles
              className="absolute inset-0"
              particleCount={2200}
              colors={["#ffffff", "#B497FF", "#FF2D92"]}
            />
          </PreviewCard>
        </AnimatedContent>

        <AnimatedContent delay={0.24} distance={60}>
          <PreviewCard
            name="DotGrid"
            tech="OGL · Fragment"
            description="A procedural dot lattice that swells and brightens around the cursor with a soft idle wave."
          >
            <DotGrid
              className="absolute inset-0"
              gridSize={22}
              dotColor="#B497FF"
              waveAmplitude={0.4}
            />
          </PreviewCard>
        </AnimatedContent>

        <AnimatedContent delay={0.36} distance={60}>
          <PreviewCard
            name="Squares"
            tech="Canvas 2D"
            description="A diagonal wave sweeping through a square lattice; hover to light up the cells under your cursor."
          >
            <Squares
              className="absolute inset-0"
              direction="diagonal"
              speed={0.55}
              squareSize={34}
              borderColor="#4a2a7a"
              hoverFillColor="#5227FF"
            />
          </PreviewCard>
        </AnimatedContent>

        <AnimatedContent delay={0.48} distance={60}>
          <PreviewCard
            name="Silk"
            tech="OGL · GLSL ES 3.0"
            description="Five-octave simplex noise folded into luminous satin ridges, drifting endlessly in the dark."
          >
            <Silk
              className="absolute inset-0"
              color="#5227FF"
              speed={0.55}
              scale={1.6}
              noiseIntensity={1.0}
              rotation={0.6}
            />
          </PreviewCard>
        </AnimatedContent>

        <AnimatedContent delay={0.6} distance={60}>
          <PreviewCard
            name="Waves"
            tech="OGL · Vertex Shader"
            description="A translucent sine-field surface undulating in perspective — the camera orbits gently toward your cursor."
          >
            <Waves
              className="absolute inset-0"
              hue={259}
              amplitude={1.5}
              alpha={0.9}
            />
          </PreviewCard>
        </AnimatedContent>

        <AnimatedContent delay={0} distance={60}>
          <PreviewCard
            name="Lightning"
            tech="Canvas 2D"
            description="Midpoint-displacement bolts fork, flash and fade — every strike branches differently."
          >
            <Lightning
              className="absolute inset-0"
              hue={259}
              interval={2.1}
              forkProbability={0.2}
            />
          </PreviewCard>
        </AnimatedContent>

        <AnimatedContent delay={0.12} distance={60}>
          <PreviewCard
            name="LetterGlitch"
            tech="Canvas 2D"
            description="A matrix of glyphs randomly decoding into color — click the card to shock the whole board."
          >
            <LetterGlitch
              className="absolute inset-0"
              fontSize={16}
              glitchSpeed={90}
              idleOpacity={0.16}
            />
          </PreviewCard>
        </AnimatedContent>
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-white/35">
        <Layers className="h-3.5 w-3.5" />
        Move your cursor inside the cards — every preview is fully interactive.
      </p>
    </section>
  );
}
