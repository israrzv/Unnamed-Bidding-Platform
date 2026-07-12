"use client";

import React, { useEffect, useRef } from "react";

export interface ParticleTextEffectProps {
  text?: string;
  colors?: string[];
  className?: string;
  animationForce?: number;
  particleDensity?: number;
}

type Box = { str: string; x?: number; y?: number; w?: number; h?: number };

const rand = (max = 1, min = 0, dec = 0): number =>
  +(min + Math.random() * (max - min)).toFixed(dec);

/**
 * Renders `text` as a cloud of particles that scatter away from the cursor and
 * spring back. Sizes itself to its parent container. SSR-safe (all canvas work
 * happens after mount).
 */
export function ParticleTextEffect({
  text = "HOVER!",
  colors = ["ffad70", "f7d297", "edb9a1", "e697ac", "b38dca", "9c76db", "705cb5", "43428e", "2c2142"],
  className = "",
  animationForce = 80,
  particleDensity = 4,
}: ParticleTextEffectProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x?: number; y?: number }>({});
  const hasPointerRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let radius = 100;
    const box: Box = { str: text };
    let particles: ParticleClass[] = [];

    class ParticleClass {
      ox: number;
      oy: number;
      cx: number;
      cy: number;
      cr: number;
      f: number;
      rgb: number[];
      constructor(x: number, y: number, rgb: number[]) {
        this.ox = x;
        this.oy = y;
        this.cx = x;
        this.cy = y;
        this.cr = rand(5, 1);
        this.f = rand(animationForce + 15, animationForce - 15);
        this.rgb = rgb.map((c) => Math.max(0, c + rand(13, -13)));
      }
      draw() {
        ctx!.fillStyle = `rgb(${this.rgb.join(",")})`;
        ctx!.beginPath();
        ctx!.arc(this.cx, this.cy, this.cr, 0, 2 * Math.PI);
        ctx!.fill();
      }
      move() {
        const p = pointerRef.current;
        if (hasPointerRef.current && p.x !== undefined && p.y !== undefined) {
          const dx = this.cx - p.x;
          const dy = this.cy - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius && dist > 0) {
            const force = Math.min(this.f, ((radius - dist) / dist) * 2);
            this.cx += (dx / dist) * force;
            this.cy += (dy / dist) * force;
          }
        }
        const odx = this.ox - this.cx;
        const ody = this.oy - this.cy;
        const od = Math.hypot(odx, ody);
        if (od > 1) {
          const restore = Math.min(od * 0.1, 3);
          this.cx += (odx / od) * restore;
          this.cy += (ody / od) * restore;
        }
        this.draw();
      }
    }

    const dottify = () => {
      if (box.x === undefined || box.y === undefined || !box.w || !box.h) return;
      const data = ctx.getImageData(box.x, box.y, box.w, box.h).data;
      const next: ParticleClass[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const px = (i / 4) % box.w;
        const py = Math.floor(i / 4 / box.w);
        if (data[i + 3] && px % particleDensity === 0 && py % particleDensity === 0) {
          next.push(new ParticleClass(box.x + px, box.y + py, [data[i], data[i + 1], data[i + 2]]));
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = next;
      particles.forEach((p) => p.draw());
    };

    const write = () => {
      box.str = text;
      box.h = Math.floor(canvas.width / Math.max(1, box.str.length));
      radius = Math.max(35, box.h * 0.8);
      ctx.font = `900 ${box.h}px Verdana, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      box.w = Math.round(ctx.measureText(box.str).width);
      box.x = 0.5 * (canvas.width - box.w);
      box.y = 0.5 * (canvas.height - box.h);
      const gradient = ctx.createLinearGradient(box.x, box.y, box.x + box.w, box.y + box.h);
      const N = Math.max(1, colors.length - 1);
      colors.forEach((c, i) => gradient.addColorStop(i / N, `#${c}`));
      ctx.fillStyle = gradient;
      ctx.fillText(box.str, 0.5 * canvas.width, 0.5 * canvas.height);
      dottify();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => p.move());
      raf = requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      write();
    };

    resize();
    animate();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, colors, animationForce, particleDensity]);

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) * canvas.width) / rect.width;
    pointerRef.current.y = ((e.clientY - rect.top) * canvas.height) / rect.height;
    hasPointerRef.current = true;
  };

  const onPointerLeave = () => {
    hasPointerRef.current = false;
    pointerRef.current = {};
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-none"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerEnter={() => (hasPointerRef.current = true)}
      />
    </div>
  );
}
