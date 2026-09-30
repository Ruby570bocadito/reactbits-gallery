"use client";

import { useCallback, useEffect, useRef } from "react";

export type LetterGlitchProps = {
  /** Characters cycling through the grid */
  charset?: string;
  /** Font size of each cell (px) */
  fontSize?: number;
  /** Palette picked from on every glitch */
  glitchColors?: string[];
  /** Average ms between glitch waves (lower = busier) */
  glitchSpeed?: number;
  /** Share of cells repainted per wave (0–1) */
  glitchProbability?: number;
  /** Dim idle cells to this opacity (0–1, 0 hides them) */
  idleOpacity?: number;
  className?: string;
};

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}—=+*^?#";
const DEFAULT_COLORS = ["#B497FF", "#FF2D92", "#5227FF", "#2AFFE6", "#c8c8c8"];

type Cell = {
  char: string;
  color: string;
  /** 0 = idle, 1 = freshly glitched; decays toward 0 */
  heat: number;
};

/**
 * LetterGlitch — React Bits
 * A full-bleed grid of characters that randomly decodes into glitched,
 * colored glyphs — click to shock the whole board.
 */
export default function LetterGlitch({
  charset = DEFAULT_CHARS,
  fontSize = 15,
  glitchColors = DEFAULT_COLORS,
  glitchSpeed = 90,
  glitchProbability = 0.06,
  idleOpacity = 0.14,
  className,
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);
  const cellsRef = useRef<Cell[]>([]);
  const layoutRef = useRef({ cols: 0, rows: 0 });

  const randomChar = useCallback(
    () => charset.charAt(Math.floor(Math.random() * charset.length)),
    [charset]
  );
  const randomColor = useCallback(
    () => glitchColors[Math.floor(Math.random() * glitchColors.length)],
    [glitchColors]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const buildGrid = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.max(1, Math.floor(width / fontSize));
      const rows = Math.max(1, Math.floor(height / fontSize));
      layoutRef.current = { cols, rows };
      cellsRef.current = Array.from({ length: cols * rows }, () => ({
        char: randomChar(),
        color: randomColor(),
        heat: 0,
      }));
    };

    const glitchWave = (burst: number) => {
      const cells = cellsRef.current;
      if (!cells.length) return;
      const quota = Math.floor(cells.length * glitchProbability * burst);
      for (let i = 0; i < quota; i++) {
        const idx = Math.floor(Math.random() * cells.length);
        const cell = cells[idx];
        cell.char = randomChar();
        cell.color = randomColor();
        cell.heat = 1;
      }
    };

    const render = (now: number) => {
      const { cols, rows } = layoutRef.current;
      if (cols && rows) {
        if (now - lastTickRef.current >= glitchSpeed) {
          lastTickRef.current = now;
          glitchWave(1);
        }

        ctx.clearRect(0, 0, width, height);
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const pad = fontSize / 2;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const cell = cellsRef.current[r * cols + c];
            if (!cell) continue;
            // Fresh glitches burn bright, then settle back to idle embers
            cell.heat = Math.max(0, cell.heat - 0.035);
            const alpha = idleOpacity + cell.heat * (1 - idleOpacity);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = cell.heat > 0.35 ? cell.color : `rgba(255,255,255,0.85)`;
            ctx.fillText(cell.char, c * fontSize + pad, r * fontSize + pad);
            if (cell.heat > 0.8) {
              ctx.shadowColor = cell.color;
              ctx.shadowBlur = 8;
              ctx.fillText(cell.char, c * fontSize + pad, r * fontSize + pad);
              ctx.shadowBlur = 0;
            }
          }
        }
        ctx.globalAlpha = 1;
      }
      rafRef.current = requestAnimationFrame(render);
    };

    const onClick = () => glitchWave(6);

    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    ro.observe(canvas);
    canvas.addEventListener("click", onClick);
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("click", onClick);
      cellsRef.current = [];
    };
  }, [fontSize, glitchColors, glitchProbability, glitchSpeed, idleOpacity, randomChar, randomColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", cursor: "crosshair" }}
      aria-hidden
    />
  );
}
