"use client";

import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef, type CSSProperties } from "react";

export type SilkProps = {
  /** Base silk color (hex) */
  color?: string;
  /** Animation speed */
  speed?: number;
  /** Spatial scale of the noise field */
  scale?: number;
  /** Brightness of the silky highlights */
  noiseIntensity?: number;
  /** Pattern rotation in radians */
  rotation?: number;
  className?: string;
  style?: CSSProperties;
};

const VERT = /* glsl */ `#version 300 es
precision highp float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uNoiseIntensity;
uniform float uRotation;
uniform vec3 uColor;

out vec4 fragColor;

// Ashima 3D simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  // Centered, aspect-corrected coordinates
  vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);

  float c = cos(uRotation);
  float s = sin(uRotation);
  p = mat2(c, -s, s, c) * p;

  float t = uTime * uSpeed * 0.35;

  // Five-octave fractal noise flowing through time
  vec3 q = vec3(p * uScale, t);
  float f = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 5; i++) {
    f += amp * snoise(q);
    q *= 2.03;
    amp *= 0.5;
  }

  // Silky ridges: band the noise field into luminous folds
  float bands = sin(f * 3.2 + t * 0.8) * 0.5 + 0.5;
  float v = clamp(f * 0.5 + 0.5, 0.0, 1.0);

  vec3 col = uColor * (0.04 + v * 0.16);
  col += uColor * v * uNoiseIntensity * (0.30 + 0.70 * bands);

  // Soft vignette keeps the card corners calm
  float vig = smoothstep(1.7, 0.35, length(p));
  col *= 0.5 + 0.5 * vig;

  fragColor = vec4(col, 1.0);
}
`;

export default function Silk({
  color = "#5227FF",
  speed = 0.55,
  scale = 1.6,
  noiseIntensity = 1.0,
  rotation = 0.6,
  className,
  style,
}: SilkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let mesh: Mesh | null = null;
    let program: Program | null = null;
    let rafId = 0;
    let cleanupResize: (() => void) | null = null;

    try {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      renderer = new Renderer({ alpha: true, antialias: true, dpr: DPR });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uResolution: { value: [gl.canvas.width, gl.canvas.height] },
          uTime: { value: 0 },
          uSpeed: { value: speed },
          uScale: { value: scale },
          uNoiseIntensity: { value: noiseIntensity },
          uRotation: { value: rotation },
          uColor: {
            value: [
              parseInt(color.slice(1, 3), 16) / 255,
              parseInt(color.slice(3, 5), 16) / 255,
              parseInt(color.slice(5, 7), 16) / 255,
            ],
          },
        },
      });

      const geometry = new Triangle(gl);
      mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        if (!renderer) return;
        const rect = container.getBoundingClientRect();
        const width = Math.max(rect.width, 1);
        const height = Math.max(rect.height, 1);
        renderer.setSize(width, height);
        gl.canvas.style.width = `${width}px`;
        gl.canvas.style.height = `${height}px`;
        if (program) program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      };

      gl.canvas.style.position = "absolute";
      gl.canvas.style.top = "0";
      gl.canvas.style.left = "0";
      container.appendChild(gl.canvas);
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(container);
      cleanupResize = () => ro.disconnect();

      const loop = (now: number) => {
        if (program) program.uniforms.uTime.value = now / 1000;
        if (renderer && mesh) renderer.render({ scene: mesh });
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    } catch {
      // WebGL unavailable — leave the container transparent
    }

    return () => {
      cancelAnimationFrame(rafId);
      cleanupResize?.();
      const canvas = container.querySelector("canvas");
      if (canvas) canvas.remove();
      try {
        renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        /* noop */
      }
      renderer = null;
      mesh = null;
      program = null;
    };
  }, [color, speed, scale, noiseIntensity, rotation]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none", ...style }}
    />
  );
}
