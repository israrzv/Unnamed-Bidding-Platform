"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// --- Deterministic candlestick series (upward trend) ---
function noise(i: number) {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1; // [-1, 1]
}

const N = 60;
const W = 1200;
const H = 400;
const PAD = 30;

type Candle = { x: number; open: number; close: number; high: number; low: number };

const RAW: Candle[] = (() => {
  const out: Candle[] = [];
  let price = 12;
  for (let i = 0; i < N; i++) {
    const open = price;
    price = price + 1.4 + noise(i) * 3.4;
    const close = price;
    const high = Math.max(open, close) + Math.abs(noise(i + 100)) * 3 + 1;
    const low = Math.min(open, close) - Math.abs(noise(i + 200)) * 3 - 1;
    out.push({ x: i, open, close, high, low });
  }
  return out;
})();

const minLow = Math.min(...RAW.map((c) => c.low));
const maxHigh = Math.max(...RAW.map((c) => c.high));
const spacing = W / N;
const bodyW = spacing * 0.55;
const yOf = (p: number) => PAD + ((maxHigh - p) / (maxHigh - minLow)) * (H - 2 * PAD);

const CANDLES = RAW.map((c) => {
  const cx = (c.x + 0.5) * spacing;
  const up = c.close >= c.open;
  return {
    key: c.x,
    cx,
    color: up ? "#22c55e" : "#ef4444",
    wy1: yOf(c.high),
    wy2: yOf(c.low),
    bx: cx - bodyW / 2,
    by: yOf(Math.max(c.open, c.close)),
    bh: Math.max(2, Math.abs(yOf(c.open) - yOf(c.close))),
  };
});

const MASK =
  "radial-gradient(circle 190px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.4) 46%, transparent 72%)";

/** App-wide background: an upward candlestick chart revealed only near the cursor. */
export function SpotlightBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // The login screen has its own liquid background — no candlestick there.
  if (pathname?.startsWith("/login")) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        ["--mx" as string]: "-1000px",
        ["--my" as string]: "-1000px",
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full">
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={(i * W) / 12} y1="0" x2={(i * W) / 12} y2={H} stroke="#3f3f46" strokeOpacity="0.22" strokeWidth="1" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i * H) / 6} x2={W} y2={(i * H) / 6} stroke="#3f3f46" strokeOpacity="0.22" strokeWidth="1" />
        ))}
        {CANDLES.map((c) => (
          <g key={c.key}>
            <line x1={c.cx} y1={c.wy1} x2={c.cx} y2={c.wy2} stroke={c.color} strokeWidth="1.5" />
            <rect x={c.bx} y={c.by} width={bodyW} height={c.bh} fill={c.color} rx="1" />
          </g>
        ))}
      </svg>
    </div>
  );
}
