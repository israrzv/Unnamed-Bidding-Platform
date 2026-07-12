"use client";

import { useEffect, useRef } from "react";

type Particle = {
  hx: number;
  hy: number;
  delay: number;
  zSpeed: number;
  jx: number;
  jy: number;
  color: string;
};

const HOLD = 0.35; // assembled hold before dissolving
const PER_LETTER = 0.1; // stagger between letters (faster)
const MAX_SCALE = 7.5; // when a particle has "passed" the viewer it's gone
const SIZE_CAP = 4.5;

/**
 * Renders `text`, dissolves it letter-by-letter into particles, then blows the
 * sand toward the viewer (‑z → +z): particles expand out from the centre and
 * grow as they rush past the screen, then fade. Calls `onComplete` when gone.
 */
export function ParticleText({
  text = "BidFair",
  onComplete,
}: {
  text?: string;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 2;

    const fontSize = Math.min(180, Math.max(64, w * 0.15));
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.fillText(text, cx, cy);
    const data = ctx.getImageData(0, 0, w, h).data;

    const gap = 2; // denser sampling → far more, finer granules (smoother)
    const particles: Particle[] = [];
    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        if (data[(y * w + x) * 4 + 3] > 128) {
          particles.push({ hx: x, hy: y, delay: 0, zSpeed: 0, jx: 0, jy: 0, color: "#fff" });
        }
      }
    }

    // Per-letter boundaries so letters dissolve one after another, left → right.
    const totalW = ctx.measureText(text).width;
    let acc = cx - totalW / 2;
    const letterEnds: number[] = [];
    for (let i = 0; i < text.length; i++) {
      acc += ctx.measureText(text[i]).width;
      letterEnds.push(acc);
    }
    const letterIndexAt = (x: number) => {
      for (let i = 0; i < letterEnds.length; i++) if (x <= letterEnds[i]) return i;
      return letterEnds.length - 1;
    };

    for (const p of particles) {
      p.delay = letterIndexAt(p.hx) * PER_LETTER + Math.random() * 0.05;
      p.zSpeed = 2.6 + Math.random() * 3.2; // how fast it rushes toward the viewer
      p.jx = (Math.random() - 0.5) * 70;
      p.jy = (Math.random() - 0.5) * 70;
      p.color = Math.random() < 0.14 ? "#34d399" : "#ffffff";
    }

    const start = performance.now();
    let raf = 0;
    let done = false;

    function frame(now: number) {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of particles) {
        const lt = t - HOLD - p.delay;
        if (lt < 0) {
          // still assembled
          ctx.globalAlpha = 1;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.hx, p.hy, gap - 1, gap - 1);
          alive++;
          continue;
        }
        const scale = 1 + p.zSpeed * lt; // grows → rushing toward viewer (+z)
        if (scale >= MAX_SCALE) continue; // passed the screen
        const nx = cx + (p.hx - cx) * scale + p.jx * lt;
        const ny = cy + (p.hy - cy) * scale + p.jy * lt;
        const size = (gap - 1) * Math.min(scale, SIZE_CAP);
        ctx.globalAlpha = Math.max(0, 1 - (scale - 1) / (MAX_SCALE - 1));
        ctx.fillStyle = p.color;
        ctx.fillRect(nx - size / 2, ny - size / 2, size, size);
        alive++;
      }
      ctx.globalAlpha = 1;
      if (alive === 0) {
        if (!done) {
          done = true;
          onComplete();
        }
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [text, onComplete]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
