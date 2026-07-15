"use client";

import { useEffect, useRef } from "react";

type Segment = { text: string; color: string };

type P = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  vx: number;
  vy: number;
  speed: number;
  fadeFast: boolean;
};

/**
 * One-shot vaporize: draws `segments` (multi-colour text) crisply and centered
 * in the canvas's own box, holds, then dissolves it left-to-right into fine
 * particles that drift and fade. Calls `onComplete` once every particle is gone.
 */
export function VaporizeText({
  segments,
  onComplete,
  hold = 0.5,
  vaporDuration = 1.9,
}: {
  segments: Segment[];
  onComplete: () => void;
  hold?: number;
  vaporDuration?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pin BOTH the display size and the backing store to the viewport, scaled
    // by DPR. Setting style + attribute explicitly (not relying on CSS h-full)
    // guarantees a 1:1, undistorted, centred canvas.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    const w = (canvas.width = Math.round(cssW * dpr));
    const h = (canvas.height = Math.round(cssH * dpr));
    const cx = w / 2;
    const cy = h / 2;

    const fontSize = Math.min(140, Math.max(52, cssW * 0.1)) * dpr;
    const font = `800 ${fontSize}px Inter, system-ui, sans-serif`;

    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const widths = segments.map((s) => ctx.measureText(s.text).width);
    const total = widths.reduce((a, b) => a + b, 0);
    const startX = cx - total / 2;

    const drawText = () => {
      ctx.font = font;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      let x = startX;
      segments.forEach((s, i) => {
        ctx.fillStyle = s.color;
        ctx.fillText(s.text, x, cy);
        x += widths[i];
      });
    };

    ctx.clearRect(0, 0, w, h);
    drawText();
    const data = ctx.getImageData(0, 0, w, h).data;

    const gap = Math.max(1, Math.round(dpr));
    const particles: P[] = [];
    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const idx = (y * w + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 40) {
          particles.push({
            ox: x,
            oy: y,
            x,
            y,
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2],
            a: alpha / 255,
            vx: 0,
            vy: 0,
            speed: 0,
            fadeFast: false,
          });
        }
      }
    }

    const left = startX;
    const width = total;
    const SPREAD = Math.max(0.6, fontSize / 90);
    const density = 0.7;

    const start = performance.now();
    let lastT = start;
    let raf = 0;
    let finished = false;

    function frame(now: number) {
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      ctx!.clearRect(0, 0, w, h);

      if (t < hold) {
        drawText();
        raf = requestAnimationFrame(frame);
        return;
      }

      const progress = Math.min(1, (t - hold) / vaporDuration);
      const vaporizeX = left + width * progress;

      let alive = 0;
      for (const p of particles) {
        if (p.ox <= vaporizeX) {
          if (p.speed === 0) {
            const angle = Math.random() * Math.PI * 2;
            p.speed = (Math.random() * 1 + 0.5) * SPREAD;
            p.vx = Math.cos(angle) * p.speed;
            p.vy = Math.sin(angle) * p.speed * 0.7 - 0.4;
            p.fadeFast = Math.random() > density;
          }
          if (p.fadeFast) {
            p.a = Math.max(0, p.a - dt * 1.6);
          } else {
            const rand = SPREAD * 2;
            p.vx = (p.vx + (Math.random() - 0.5) * rand) * 0.96;
            p.vy = (p.vy + (Math.random() - 0.5) * rand) * 0.96;
            p.x += p.vx * dt * 26;
            p.y += p.vy * dt * 22;
            p.a = Math.max(0, p.a - dt * 0.55);
          }
          if (p.a > 0.01) {
            ctx!.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
            ctx!.fillRect(p.x, p.y, gap, gap);
            alive++;
          }
        } else {
          ctx!.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
          ctx!.fillRect(p.x, p.y, gap, gap);
          alive++;
        }
      }

      if (progress >= 1 && alive === 0) {
        if (!finished) {
          finished = true;
          onCompleteRef.current();
        }
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // Run exactly once on mount — a one-shot animation. onComplete is called
    // via a ref so it stays current without re-triggering the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
