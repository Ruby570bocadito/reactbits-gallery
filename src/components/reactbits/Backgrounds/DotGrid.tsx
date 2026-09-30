"use client";

import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef, type CSSProperties } from "react";

export type DotGridProps = {
  /** Cell size in px */
  gridSize?: number;
  /** Base dot radius in px */
  dotSize?: number;
  /** Dot color */
  dotColor?: string;
  /** Radial falloff of the mouse influence in px */
  mouseFalloff?: number;
  /** Subtle idle wave animation strength */
  waveAmplitude?: number;
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
uniform vec2 uMouse;
uniform float uGridSize;
uniform float uDotSize;
uniform vec3 uDotColor;
uniform float uMouseFalloff;
uniform float uWaveAmplitude;
uniform float uTime;

out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy;

  // Snap to grid cells
  vec2 cell = mod(frag, uGridSize) - uGridSize * 0.5;
  float distToDotCenter = length(cell);

  // Mouse influence (uMouse is in px, origin bottom-left)
  float mouseDist = distance(frag, uMouse);
  float influence = exp(-mouseDist / uMouseFalloff);

  // Gentle idle breathing wave
  float wave = sin(frag.x * 0.02 + uTime * 1.2) * sin(frag.y * 0.02 - uTime * 0.8);
  wave = (wave * 0.5 + 0.5) * uWaveAmplitude;

  float radius = uDotSize * (0.8 + influence * 2.6 + wave);
  float mask = smoothstep(radius, radius - 1.2, distToDotCenter);

  float brightness = 0.35 + influence * 0.65 + wave * 0.25;
  vec3 color = uDotColor * brightness;

  fragColor = vec4(color, mask);
}
`;

export default function DotGrid({
  gridSize = 24,
  dotSize = 1.6,
  dotColor = "#B497FF",
  mouseFalloff = 140,
  waveAmplitude = 0.35,
  className,
  style,
}: DotGridProps) {
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

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uResolution: { value: [gl.canvas.width, gl.canvas.height] },
          uMouse: { value: [-9999, -9999] },
          uGridSize: { value: gridSize * DPR },
          uDotSize: { value: dotSize * DPR },
          uDotColor: {
            value: [
              parseInt(dotColor.slice(1, 3), 16) / 255,
              parseInt(dotColor.slice(3, 5), 16) / 255,
              parseInt(dotColor.slice(5, 7), 16) / 255,
            ],
          },
          uMouseFalloff: { value: mouseFalloff * DPR },
          uWaveAmplitude: { value: waveAmplitude },
          uTime: { value: 0 },
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

      const onMouseMove = (e: PointerEvent) => {
        if (!container || !program) return;
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) * DPR;
        const y = (rect.bottom - e.clientY) * DPR;
        program.uniforms.uMouse.value = [x, y];
      };
      const onMouseLeave = () => {
        if (program) program.uniforms.uMouse.value = [-9999, -9999];
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
  }, [gridSize, dotSize, dotColor, mouseFalloff, waveAmplitude]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none", ...style }}
    />
  );
}
