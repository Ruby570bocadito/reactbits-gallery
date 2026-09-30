"use client";

import {
  AnimatedContent,
  BlurText,
  CircularText,
  CountUp,
  GradientText,
  RotatingText,
  ShinyText,
  SplitText,
  SpotlightCard,
  TextType,
} from "@/components/reactbits";

const DEMO_HEIGHT = "flex h-36 items-center justify-center overflow-hidden px-4";

export default function TextSection() {
  return (
    <section id="text" className="relative scroll-mt-24 border-y border-white/[0.06] bg-white/[0.015] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimatedContent>
          <div className="mx-auto max-w-2xl text-center">
            <ShinyText text="Text animations" speed={5} className="text-xs font-semibold uppercase tracking-[0.2em]" />
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Kinetic <span className="bg-gradient-to-r from-[#B497FF] to-[#FF2D92] bg-clip-text text-transparent">typography</span>
            </h2>
            <BlurText
              text="From letter-by-letter reveals to flowing gradients — eight ways to make words earn attention."
              className="mt-4 text-base leading-relaxed text-white/60"
              delay={250}
            />
          </div>
        </AnimatedContent>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatedContent distance={50}>
            <SpotlightCard className="h-full">
              <div className={DEMO_HEIGHT}>
                <SplitText
                  text="Split rise up"
                  splitType="chars"
                  stagger={0.035}
                  delay={200}
                  className="text-2xl font-bold text-white"
                />
              </div>
              <div className="border-t border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold text-white">SplitText</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  Characters or words rise out of overflow masks, staggered with GSAP.
                </p>
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={50} delay={0.08}>
            <SpotlightCard className="h-full">
              <div className={DEMO_HEIGHT}>
                <BlurText
                  text="Focus from blur"
                  className="text-2xl font-bold text-white"
                  delay={200}
                  direction="bottom"
                />
              </div>
              <div className="border-t border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold text-white">BlurText</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  Words sharpen from a soft blur as they scroll into view.
                </p>
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={50} delay={0.16}>
            <SpotlightCard className="h-full">
              <div className={DEMO_HEIGHT}>
                <GradientText
                  colors={["#5227FF", "#FF2D92", "#B497FF", "#5227FF"]}
                  animationSpeed={5}
                  className="text-2xl font-bold"
                >
                  Gradient in flow
                </GradientText>
              </div>
              <div className="border-t border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold text-white">GradientText</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  An endless gradient stream clipped to the glyphs themselves.
                </p>
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={50}>
            <SpotlightCard className="h-full">
              <div className={DEMO_HEIGHT}>
                <ShinyText
                  text="Sweeping shimmer"
                  speed={3}
                  className="text-2xl font-bold"
                />
              </div>
              <div className="border-t border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold text-white">ShinyText</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  A light sweep gliding across the text on loop. Pure CSS.
                </p>
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={50} delay={0.08}>
            <SpotlightCard className="h-full">
              <div className={DEMO_HEIGHT}>
                <p className="text-2xl font-bold text-white/85">
                  Made with{" "}
                  <RotatingText
                    texts={["GSAP", "OGL", "Motion", "React 19"]}
                    rotationInterval={2200}
                    className="align-middle text-[#B497FF]"
                  />
                </p>
              </div>
              <div className="border-t border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold text-white">RotatingText</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  Letters slide up and out as words cycle — Framer Motion springs.
                </p>
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={50} delay={0.16}>
            <SpotlightCard className="h-full">
              <div className={DEMO_HEIGHT}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    <TextType
                      text={["design", "animate", "ship"]}
                      typingSpeed={85}
                      pauseDuration={1400}
                      deletingSpeed={40}
                      cursorClassName="text-[#B497FF]"
                    />
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-white/45">
                    for the modern web
                  </div>
                </div>
              </div>
              <div className="border-t border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold text-white">TextType</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  A typewriter that types, pauses, deletes and cycles sentences.
                </p>
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={50}>
            <SpotlightCard className="h-full">
              <div className={DEMO_HEIGHT}>
                <CircularText
                  text="REACT BITS • MOTION • REACT BITS • MOTION •"
                  spinDuration={16}
                  radius={54}
                  className="text-white/80"
                />
              </div>
              <div className="border-t border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold text-white">CircularText</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  Text riding a circular path — hover to speed the orbit up.
                </p>
              </div>
            </SpotlightCard>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
