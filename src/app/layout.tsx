import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Bits Gallery — Animated React Components",
  description:
    "A curated showcase of React Bits: animated WebGL backgrounds, kinetic typography and springy micro-interactions built with GSAP, OGL and Framer Motion for Next.js.",
  keywords: [
    "React Bits",
    "animated components",
    "GSAP",
    "WebGL",
    "Framer Motion",
    "Next.js",
    "Tailwind CSS",
  ],
  authors: [{ name: "React Bits Gallery" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "React Bits Gallery",
    description:
      "Animated backgrounds, kinetic typography and micro-interactions for modern React apps.",
    siteName: "React Bits Gallery",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
