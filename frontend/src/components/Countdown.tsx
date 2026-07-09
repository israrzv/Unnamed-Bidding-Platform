"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number; ms: number };

const ZERO: Parts = { days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 };

function diff(target: number): Parts {
  const total = Math.max(0, target - Date.now());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
    ms: Math.floor(total % 1000),
  };
}

/** Live countdown ticking to the millisecond toward `targetMs` (epoch ms). */
export function Countdown({ targetMs }: { targetMs: number }) {
  // Start at zeros so server and first client render match, then tick on mount.
  const [parts, setParts] = useState<Parts>(ZERO);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setParts(diff(targetMs));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetMs]);

  const cell = (value: string, label: string) => (
    <div className="flex flex-col items-center">
      <span className="min-w-[3.5rem] rounded-lg border border-zinc-800/80 bg-zinc-950/60 px-3 py-2 text-center font-mono text-2xl font-bold text-white tabular-nums sm:text-3xl">
        {value}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
    </div>
  );

  return (
    <div className="flex items-end gap-2 sm:gap-3">
      {cell(String(parts.days).padStart(2, "0"), "Days")}
      {cell(String(parts.hours).padStart(2, "0"), "Hrs")}
      {cell(String(parts.minutes).padStart(2, "0"), "Min")}
      {cell(String(parts.seconds).padStart(2, "0"), "Sec")}
      {cell(String(parts.ms).padStart(3, "0"), "Ms")}
    </div>
  );
}
