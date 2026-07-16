"use client";

import { useEffect, useRef } from "react";

export type RGB = { r: number; g: number; b: number };

const DEFAULT: RGB = { r: 52, g: 211, b: 153 }; // emerald, matches the theme
const PURPLE: RGB = { r: 168, g: 85, b: 247 };

/** Module-level accent so pages can retint the shared rain (arena → zone colour). */
let accent: RGB = { ...DEFAULT };
export function setMatrixAccent(rgb: RGB | null) {
  accent = rgb ?? { ...DEFAULT };
}

function blendAt(x: number, w: number): RGB {
  const t = Math.max(0, Math.min(1, x / w));
  return {
    r: Math.round(PURPLE.r + (DEFAULT.r - PURPLE.r) * t),
    g: Math.round(PURPLE.g + (DEFAULT.g - PURPLE.g) * t),
    b: Math.round(PURPLE.b + (DEFAULT.b - PURPLE.b) * t),
  };
}

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,./<>?";

/**
 * Matrix-style code rain used as the app-wide background. Fixed, behind all
 * content, and transparent-ish so the dark page shows through. Colour comes
 * from `accent` (or a left→right purple→green blend when `gradient` is set).
 */
export function MatrixRain({
  gradient = false,
  opacity = 0.5,
}: {
  gradient?: boolean;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 15;
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      cols = Math.floor(canvas!.width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -50);
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      // Fade previous frame toward black → trailing streaks.
      ctx!.fillStyle = "rgba(0, 0, 0, 0.09)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < cols; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const c = gradient ? blendAt(x, canvas!.width) : accent;
        const ch = CHARS.charAt(Math.floor(Math.random() * CHARS.length));

        // Bright leading glyph.
        ctx!.fillStyle = `rgba(${Math.min(255, c.r + 90)}, ${Math.min(255, c.g + 90)}, ${Math.min(255, c.b + 90)}, 0.95)`;
        ctx!.fillText(ch, x, y);

        if (y > canvas!.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    resize();
    window.addEventListener("resize", resize);
    frame();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [gradient]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ opacity }}
    />
  );
}
