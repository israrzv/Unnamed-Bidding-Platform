"use client";

import { useMemo, useState } from "react";
import { type Zone, ZONE } from "@/lib/zones";

// Zones from the stage outward (closest = best).
const ZONES_OUT: Zone[] = ["blue", "green", "yellow", "red"];
const FILL: Record<Zone, string> = {
  blue: "34,211,238",
  green: "52,211,153",
  yellow: "251,191,36",
  red: "251,113,133",
};
const RADII: Record<Zone, [number, number]> = {
  blue: [58, 98],
  green: [98, 138],
  yellow: [138, 178],
  red: [178, 215],
};

const CX = 200;
const CY = 42;
const A0 = (30 * Math.PI) / 180;
const A1 = (150 * Math.PI) / 180;
const SEATS_PER = 16;

function pt(r: number, a: number) {
  return `${(CX + r * Math.cos(a)).toFixed(2)},${(CY + r * Math.sin(a)).toFixed(2)}`;
}

function seatPath(ri: number, ro: number, a1: number, a2: number) {
  return `M${pt(ro, a1)} A${ro},${ro} 0 0 1 ${pt(ro, a2)} L${pt(ri, a2)} A${ri},${ri} 0 0 0 ${pt(ri, a1)} Z`;
}

/**
 * Curved stadium seating map. Zones fan out from the stage (blue closest → red
 * farthest). Tap a seat to see which zone it's in; the user's current zone and
 * a "You" marker are highlighted.
 */
export function SeatingMap({ currentZone }: { currentZone: Zone | null }) {
  const [sel, setSel] = useState<{ zone: Zone; idx: number } | null>(null);

  const seats = useMemo(() => {
    const out: { zone: Zone; idx: number; d: string }[] = [];
    const step = (A1 - A0) / SEATS_PER;
    const gap = step * 0.14;
    for (const z of ZONES_OUT) {
      const [ri, ro] = RADII[z];
      for (let i = 0; i < SEATS_PER; i++) {
        const a1 = A0 + i * step + gap;
        const a2 = A0 + (i + 1) * step - gap;
        out.push({ zone: z, idx: i, d: seatPath(ri, ro, a1, a2) });
      }
    }
    return out;
  }, []);

  const you = useMemo(() => {
    if (!currentZone) return null;
    const [ri, ro] = RADII[currentZone];
    const r = (ri + ro) / 2;
    const a = (A0 + A1) / 2;
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  }, [currentZone]);

  return (
    <div>
      <svg viewBox="0 0 400 268" className="w-full">
        <rect x={CX - 46} y={8} width={92} height={26} rx={6} fill="#e5e7eb" />
        <text x={CX} y={25} textAnchor="middle" fontSize="11" fontWeight="700" fill="#18181b">
          STAGE
        </text>

        {seats.map((s, k) => {
          const isSel = sel?.zone === s.zone && sel?.idx === s.idx;
          const isCur = currentZone === s.zone;
          const alpha = isSel ? 0.95 : isCur ? 0.5 : 0.2;
          return (
            <path
              key={k}
              d={s.d}
              fill={`rgba(${FILL[s.zone]},${alpha})`}
              stroke={isSel ? "#ffffff" : "rgba(9,9,11,0.55)"}
              strokeWidth={isSel ? 1.5 : 0.6}
              className="cursor-pointer transition-all duration-150 hover:brightness-125"
              onClick={() => setSel({ zone: s.zone, idx: s.idx })}
            />
          );
        })}

        {you && (
          <g>
            <circle cx={you.x} cy={you.y} r={8} fill="#ffffff" />
            <text x={you.x} y={you.y + 3} textAnchor="middle" fontSize="8" fontWeight="700" fill="#18181b">
              You
            </text>
          </g>
        )}
      </svg>

      <p className="mt-2 text-center text-xs text-zinc-400">
        {sel ? (
          <>
            That seat is in the{" "}
            <span className={`font-semibold ${ZONE[sel.zone].text}`}>
              {ZONE[sel.zone].label.split(" ")[0]} Zone
            </span>
          </>
        ) : (
          "Tap a seat to see its zone"
        )}
      </p>
    </div>
  );
}
