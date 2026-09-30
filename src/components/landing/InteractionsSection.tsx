"use client";

import {
  Bell,
  Compass,
  Github,
  Heart,
  Home,
  MousePointer2,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  AnimatedContent,
  BlurText,
  Dock,
  Magnet,
  ShinyText,
  SpotlightCard,
  StarBorder,
  TiltedCard,
} from "@/components/reactbits";

const DOCK_ITEMS = [
  { title: "Home", icon: <Home /> },
  { title: "Explore", icon: <Compass /> },
  { title: "Favorites", icon: <Heart /> },
  { title: "Notifications", icon: <Bell /> },
  { title: "Settings", icon: <Settings /> },
  { title: "GitHub", icon: <Github /> },
];

export default function InteractionsSection() {
  return (
    <section id="interactions" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <AnimatedContent>
        <div className="mx-auto max-w-2xl text-center">
          <ShinyText text="Interactions" speed={5} className="text-xs font-semibold uppercase tracking-[0.2em]" />
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Micro-interactions that <span className="bg-gradient-to-r from-[#B497FF] to-[#FF2D92] bg-clip-text text-transparent">respond</span>
          </h2>
          <BlurText
            text="Tilt, magnetize, magnify — physical, springy feedback for everything a cursor touches."
            className="mt-4 text-base leading-relaxed text-white/60"
            delay={250}
          />
        </div>
      </AnimatedContent>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {/* TiltedCard */}
        <AnimatedContent distance={50}>
          <SpotlightCard className="h-full">
            <div className="flex h-72 items-center justify-center overflow-hidden p-6">
              <TiltedCard
                rotateAmplitude={12}
                scaleOnHover={1.07}
                captionText="TiltedCard · follow the light"
                className="w-full max-w-[210px]"
              >
                <div className="relative flex h-52 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b0b3a] via-[#3a1270] to-[#12041f] ring-1 ring-white/10">
                  <div
                    className="absolute -top-10 h-32 w-32 rounded-full bg-[#5227FF]/50 blur-2xl"
                    aria-hidden
                  />
                  <div
                    className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[#FF2D92]/40 blur-2xl"
                    aria-hidden
                  />
                  <Sparkles className="h-10 w-10 text-[#B497FF]" />
                  <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-sm font-bold uppercase tracking-[0.25em] text-transparent">
                    Hover me
                  </span>
                </div>
              </TiltedCard>
            </div>
            <div className="border-t border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold text-white">TiltedCard</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                3D perspective tilt with spring inertia and a glare that tracks the pointer.
              </p>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        {/* Magnet */}
        <AnimatedContent distance={50} delay={0.08}>
          <SpotlightCard className="h-full">
            <div className="flex h-72 items-center justify-center p-6">
              <Magnet padding={90} magnetStrength={3.2}>
                <StarBorder color="#8261FF" speed="5s">
                  <div className="flex items-center gap-2 rounded-xl bg-[#0b0118] px-6 py-3.5 text-sm font-semibold text-white">
                    <MousePointer2 className="h-4 w-4 text-[#B497FF]" />
                    Pull me closer
                  </div>
                </StarBorder>
              </Magnet>
            </div>
            <div className="border-t border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Magnet</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                Elements gravitate toward the cursor inside an extended attraction field.
              </p>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        {/* Dock */}
        <AnimatedContent distance={50} delay={0.16}>
          <SpotlightCard className="h-full">
            <div className="flex h-72 items-center justify-center overflow-hidden p-6">
              <Dock items={DOCK_ITEMS} baseSize={38} magnification={58} distance={110} />
            </div>
            <div className="border-t border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Dock</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                macOS-style magnification driven by pointer distance and springs.
              </p>
            </div>
          </SpotlightCard>
        </AnimatedContent>
      </div>
    </section>
  );
}
