import { NextResponse } from "next/server";

// Prerendered at build time so the route stays compatible with `output: export`
// (GitHub Pages). It carries no dynamic data, so force-static is lossless.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}