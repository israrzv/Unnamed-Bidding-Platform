"use client";

import { useSyncExternalStore } from "react";
import { LiquidGradientCanvas } from "@/components/ui/liquid-gradient";

// Default green-theme liquid palette (dark → emerald).
export const DEFAULT_PALETTE = ["#03140d", "#064e3b", "#059669", "#10b981", "#34d399"];

// Small external store so any page can retint the shared background (arena zones).
let currentColors: string[] = DEFAULT_PALETTE;
const subs = new Set<() => void>();

export function setBackgroundColors(colors: string[] | null) {
  currentColors = colors ?? DEFAULT_PALETTE;
  subs.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}
function getSnapshot() {
  return currentColors;
}

/**
 * App-wide animated liquid-gradient background. Fixed behind all content with a
 * dark scrim so cards/text stay readable. Pass `colors` to pin a palette (login),
 * or leave it out to follow the shared store (arena recolors it by zone).
 */
export function LiquidBackground({
  colors,
  opacity = 0.6,
}: {
  colors?: string[];
  opacity?: number;
}) {
  const storeColors = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PALETTE);
  const palette = colors ?? storeColors;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div style={{ opacity }} className="absolute inset-0">
        <LiquidGradientCanvas
          colors={palette}
          speed={0.5}
          scale={0.55}
          contrast={1.1}
          saturation={1.05}
          className="h-full w-full"
        />
      </div>
      {/* Readability scrim */}
      <div className="absolute inset-0 bg-zinc-950/55" />
    </div>
  );
}
