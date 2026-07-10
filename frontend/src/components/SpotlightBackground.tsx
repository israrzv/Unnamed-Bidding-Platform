"use client";

import { useEffect, useRef } from "react";

const MASK =
  "radial-gradient(circle 190px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.4) 46%, transparent 72%)";

/**
 * App-wide background: a live-concert scene that stays hidden and is revealed
 * only in a soft circle around the cursor as it moves anywhere on the page.
 */
export function SpotlightBackground() {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      style={{
        ["--mx" as string]: "-1000px",
        ["--my" as string]: "-1000px",
        backgroundImage: "url(/concert.avif)",
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    />
  );
}
