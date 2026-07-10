"use client";

import { useRef, type ReactNode } from "react";

const MAX_ROTATE = 6; // degrees of in-plane spin

/**
 * Rotates a card clockwise / anticlockwise in-plane based on where the cursor
 * sits horizontally (right of center → clockwise, left → anticlockwise).
 */
export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    el.style.transform = `rotate(${(px * MAX_ROTATE).toFixed(2)}deg) scale(1.03)`;
  }

  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = "rotate(0deg) scale(1)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
