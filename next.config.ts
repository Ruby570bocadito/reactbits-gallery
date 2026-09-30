import type { NextConfig } from "next";

// GitHub Pages build: NEXT_EXPORT=1 switches from standalone server output
// to a fully static export in ./out (deployed via GitHub Actions).
const isExport = process.env.NEXT_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isExport ? "export" : "standalone",
  ...(isExport
    ? {
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
