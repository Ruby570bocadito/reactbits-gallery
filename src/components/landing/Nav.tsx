"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { ShinyText } from "@/components/reactbits";

const LINKS = [
  { label: "Backgrounds", href: "#backgrounds" },
  { label: "Text", href: "#text" },
  { label: "Interactions", href: "#interactions" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#060010]/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5" aria-label="React Bits Gallery home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5227FF] to-[#FF2D92] shadow-[0_0_18px_rgba(82,39,255,0.55)]">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            reactbits<span className="text-[#B497FF]">.gallery</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="https://reactbits.dev"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/80 transition-all duration-200 hover:border-white/30 hover:text-white"
        >
          <ShinyText text="reactbits.dev ↗" speed={4} />
        </a>
      </nav>
    </header>
  );
}
