"use client";

import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import { useEffect, useRef, type CSSProperties } from "react";

export type AuroraProps = {
  /** Gradient stops flowing through the aurora bands */
  colorStops?: string[];
  /** Light intensity multiplier */
  amplitude?: number;
  /** Time multiplier for the flow */
  speed?: number;
  /** Softness of the bottom edge blend */
  blend?: number;
  className?: string;
  style?: CSSProperties;
};

const VERT = /* glsl */ `#version 300 es
precision highp float;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform float uBlend;

in vec2 vUv;
out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
    0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 gradientColor(float t) {
  vec3 c0 = uColorStops[0];
  vec3 c1 = uColorStops[1];
  vec3 c2 = uColorStops[2];
  if (t < 0.5) return mix(c0, c1, clamp(t / 0.5, 0.0, 1.0));
  return mix(c1, c2, clamp((t - 0.5) / 0.5, 0.0, 1.0));
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.12;

  // Layered simplex noise drives the band shape
  float n1 = snoise(vec2(uv.x * 1.8 + t * 0.6, t * 0.5));
  float n2 = snoise(vec2(uv.x * 3.6 - t * 0.4, t * 0.8)) * 0.5;
  float n3 = snoise(vec2(uv.x * 6.0 + t * 0.9, t * 1.1)) * 0.25;
  float noise = n1 + n2 + n3;

  // Primary band: concentrated glow rising from the lower third
  float band1 = exp(-pow((uv.y - 0.18 - noise * 0.18) * 3.2, 2.0));

  // Secondary band: softer, higher, offset hue
  float n4 = snoise(vec2(uv.x * 1.2 - t * 0.35, t * 0.4));
  float band2 = exp(-pow((uv.y - 0.52 - n4 * 0.22) * 2.1, 2.0));

  vec3 col1 = gradientColor(fract(uv.x + 0.05)) * band1 * uAmplitude;
  vec3 col2 = gradientColor(fract(uv.x + 0.45)) * band2 * uAmplitude * 0.38;

  vec3 color = col1 + col2;

  // Subtle ambient wash so the dark base never reads fully black
  color += gradientColor(fract(uv.x)) * 0.02;

  // Blend the bottom edge softly and fade the very top
  float bottom = smoothstep(0.0, uBlend * 0.4 + 0.06, uv.y);
  float top = 1.0 - smoothstep(0.55, 1.0, uv.y) * 0.75;
  color *= bottom * top;

  fragColor = vec4(color, 1.0);
}
`;

export default function Aurora({
  colorStops = ["#5227FF", "#B497FF", "#FF2D92"],
  amplitude = 1.15,
  speed = 1.0,
  blend = 0.5,
  className,
  style,
}: AuroraProps) {
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
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: colorStops.map((c) => new Color(c)) },
          uBlend: { value: blend },
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
        if (program) program.uniforms.uTime.value = (now / 1000) * speed;
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
  }, [amplitude, blend, speed, colorStops]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    />
  );
}
