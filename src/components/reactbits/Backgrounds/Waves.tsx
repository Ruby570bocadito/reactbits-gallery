"use client";

import { Camera, Mesh, Plane, Program, Renderer } from "ogl";
import { useEffect, useRef, type CSSProperties } from "react";

export type WavesProps = {
  /** Base hue in degrees (0-360) */
  hue?: number;
  /** Wave height multiplier */
  amplitude?: number;
  /** Spatial frequency of the waves (≈ 2π × wave count across the surface) */
  frequency?: number;
  /** Surface opacity (0-1) */
  alpha?: number;
  /** Mouse-orbit damping (0-1, higher = snappier) */
  damping?: number;
  /** Animation speed */
  speed?: number;
  className?: string;
  style?: CSSProperties;
};

const VERT = /* glsl */ `#version 300 es
precision highp float;

in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uAmp;
uniform float uFreq;

out float vElev;
out vec2 vLocal;

void main() {
  vec3 pos = position;

  // Three layered sine fields, slightly detuned for organic motion.
  // NOTE: OGL Plane positions span [-0.5, 0.5], so uFreq ≈ 2π × wave count.
  float w1 = sin(pos.x * uFreq + uTime * 0.9);
  float w2 = cos(pos.y * uFreq * 1.4 + uTime * 0.7);
  float w3 = sin((pos.x + pos.y) * uFreq * 0.6 - uTime * 0.5);
  float w4 = sin(pos.x * uFreq * 2.7 - uTime * 1.3) * 0.18;
  float elev = (w1 * 0.55 + w2 * 0.30 + w3 * 0.50 + w4) * uAmp * 0.6;

  pos.z += elev;

  vElev = elev;
  vLocal = position.xy;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec3 uColor;
uniform float uAlpha;
uniform float uAmp;

in float vElev;
in vec2 vLocal;

out vec4 fragColor;

void main() {
  // Elevation 0..1 across the wave height
  float h = clamp(vElev / max(uAmp * 0.6, 0.001) * 0.5 + 0.5, 0.0, 1.0);

  // Deep troughs to crest color, with a white glint on the highest crests
  vec3 col = mix(uColor * 0.10, uColor, h);
  col += vec3(1.0) * smoothstep(0.62, 1.0, h) * 0.45;

  // Fade at the plane edges so the surface dissolves into the card
  float edge = smoothstep(0.5, 0.32, abs(vLocal.x)) * smoothstep(0.5, 0.30, abs(vLocal.y));

  fragColor = vec4(col, uAlpha * edge);
}
`;

function hslToRgb(h: number): [number, number, number] {
  // h in degrees, s=0.95, l=0.60 — vivid but readable on dark cards
  const s = 0.95;
  const l = 0.6;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let [r, g, b] = [0, 0, 0];
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [r + m, g + m, b + m];
}

export default function Waves({
  hue = 259,
  amplitude = 1.5,
  frequency = 22,
  alpha = 0.85,
  damping = 0.06,
  speed = 1.0,
  className,
  style,
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let mesh: Mesh | null = null;
    let program: Program | null = null;
    let camera: Camera | null = null;
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
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: amplitude },
          uFreq: { value: frequency },
          uAlpha: { value: alpha },
          uColor: { value: hslToRgb(hue) },
        },
      });

      const geometry = new Plane(gl, { widthSegments: 64, heightSegments: 44 });
      mesh = new Mesh(gl, { geometry, program });
      mesh.scale.set(6.0, 3.6, 1);
      // Tilt the surface toward a floor-like view so the z displacement
      // reads as real geometric relief from the camera
      mesh.rotation.x = -Math.PI / 2.6;

      camera = new Camera(gl, { fov: 35 });
      camera.position.set(0, 1.35, 3.6);

      // Damped mouse-orbit state
      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      const timeScale = { value: speed };

      const resize = () => {
        if (!renderer || !camera) return;
        const rect = container.getBoundingClientRect();
        const width = Math.max(rect.width, 1);
        const height = Math.max(rect.height, 1);
        renderer.setSize(width, height);
        gl.canvas.style.width = `${width}px`;
        gl.canvas.style.height = `${height}px`;
        camera.perspective({ aspect: width / height });
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
        if (!container) return;
        const rect = container.getBoundingClientRect();
        target.x = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        target.y = -(((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
      };
      const onMouseLeave = () => {
        target.x = 0;
        target.y = 0;
      };
      container.addEventListener("pointermove", onMouseMove);
      container.addEventListener("pointerleave", onMouseLeave);
      cleanupMouse = () => {
        container.removeEventListener("pointermove", onMouseMove);
        container.removeEventListener("pointerleave", onMouseLeave);
      };

      const loop = (now: number) => {
        if (program) program.uniforms.uTime.value = (now / 1000) * timeScale.value;
        if (camera) {
          current.x += (target.x - current.x) * damping;
          current.y += (target.y - current.y) * damping;
          camera.position.set(current.x * 1.0, 1.35 + current.y * 0.55, 3.6);
          camera.lookAt([0, 0, 0]);
        }
        if (renderer && mesh && camera) renderer.render({ scene: mesh, camera });
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
      camera = null;
    };
  }, [hue, amplitude, frequency, alpha, damping, speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none", ...style }}
    />
  );
}
