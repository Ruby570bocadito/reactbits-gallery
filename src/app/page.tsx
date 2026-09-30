"use client";

import { ClickSpark } from "@/components/reactbits";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import BackgroundsSection from "@/components/landing/BackgroundsSection";
import TextSection from "@/components/landing/TextSection";
import InteractionsSection from "@/components/landing/InteractionsSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <ClickSpark sparkColor="#B497FF" sparkCount={10}>
      <div className="flex min-h-screen flex-col bg-[#060010] font-sans text-white antialiased selection:bg-[#5227FF]/40">
        <Nav />
        <main className="flex flex-1 flex-col">
          <Hero />
          <BackgroundsSection />
          <TextSection />
          <InteractionsSection />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}
