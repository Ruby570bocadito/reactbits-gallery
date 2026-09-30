"use client";

import { Renderer, Program, Geometry, Mesh } from "ogl";
import { useEffect, useRef, type CSSProperties } from "react";

export type ParticlesProps = {
  /** Number of particles rendered */
  particleCount?: number;
  /** Base particle size in px */
  particleSize?: number;
  /** Palette for the particles */
  colors?: string[];
  /** Amplitude of the idle drift */
  speed?: number;
  /** Radius of the mouse repulsion field (clip space) */
  mouseRadius?: number;
  className?: string;
  style?: CSSProperties;
};

const VERT = /* glsl */ `
precision highp float;

attribute vec2 aPosition;
attribute float aRandom;
attribute vec3 aColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uSize;
uniform float uSpeed;
uniform float uMouseRadius;

varying float vRandom;
varying vec3 vColor;
varying float vGlow;

void main() {
  vRandom = aRandom;
  vColor = aColor;

  vec2 pos = aPosition;

  // Gentle idle drift, unique per particle
  float t = uTime * uSpeed;
  pos.x += sin(t * (0.15 + aRandom * 0.25) + aRandom * 6.2831) * 0.05;
  pos.y += cos(t * (0.12 + aRandom * 0.22) + aRandom * 4.7123) * 0.05;

  // Repulsion field around the pointer
  vec2 toMouse = pos - uMouse;
  float dist = length(toMouse);
  float force = 1.0 - clamp(dist / uMouseRadius, 0.0, 1.0);
  force = force * force;
  pos += normalize(toMouse + 0.0001) * force * 0.22;

  vGlow = force;

  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = uSize * (0.6 + aRandom * 0.8);
}
`;

const FRAG = /* glsl */ `
precision highp float;

varying float vRandom;
varying vec3 vColor;
varying float vGlow;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.05, d);
  alpha *= 0.35 + 0.5 * vRandom + vGlow * 0.6;
  gl_FragColor = vec4(vColor + vGlow * 0.35, alpha);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const num = parseInt(full, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export default function Particles({
  particleCount = 3500,
  particleSize = 2.2,
  colors = ["#ffffff", "#B497FF", "#FF2D92"],
  speed = 0.6,
  mouseRadius = 0.35,
  className,
  style,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let mesh: Mesh | null = null;
    let program: Program | null = null;
    let rafId = 0;
    let cleanupResize: (() => void) | null = null;
    let cleanupMouse: (() => void) | null = null;

    try {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      renderer = new Renderer({ alpha: true, antialias: true, dpr: DPR });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Build particle attributes: uniform square in clip space
      const positions = new Float32Array(particleCount * 2);
      const randoms = new Float32Array(particleCount);
      const colorArr = new Float32Array(particleCount * 3);
      const rgbPalette = colors.map(hexToRgb);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 2] = Math.random() * 2 - 1;
        positions[i * 2 + 1] = Math.random() * 2 - 1;
        randoms[i] = Math.random();
        const c = rgbPalette[i % rgbPalette.length];
        colorArr[i * 3] = c[0];
        colorArr[i * 3 + 1] = c[1];
        colorArr[i * 3 + 2] = c[2];
      }

      const geometry = new Geometry(gl, {
        aPosition: { size: 2, data: positions },
        aRandom: { size: 1, data: randoms },
        aColor: { size: 3, data: colorArr },
      });

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        transparent: true,
        uniforms: {
          uResolution: { value: [gl.canvas.width, gl.canvas.height] },
          uTime: { value: 0 },
          uMouse: { value: [10, 10] },
          uSize: { value: particleSize * DPR },
          uSpeed: { value: speed },
          uMouseRadius: { value: mouseRadius },
        },
      });

      mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

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

      const onMouseMove = (e: PointerEvent) => {
        if (!container || !program) return;
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        program.uniforms.uMouse.value = [x, y];
      };
      const onMouseLeave = () => {
        if (program) program.uniforms.uMouse.value = [10, 10];
      };
      container.addEventListener("pointermove", onMouseMove);
      container.addEventListener("pointerleave", onMouseLeave);
      cleanupMouse = () => {
        container.removeEventListener("pointermove", onMouseMove);
        container.removeEventListener("pointerleave", onMouseLeave);
      };

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
      cleanupMouse?.();
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
  }, [particleCount, particleSize, colors, speed, mouseRadius]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none", ...style }}
    />
  );
}
