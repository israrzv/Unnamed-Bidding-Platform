"use client";

import { useMemo, useState } from "react";
import { type Zone, ZONE } from "@/lib/zones";

const ZONES_OUT: Zone[] = ["blue", "green", "yellow", "red"];
const RGB: Record<Zone, string> = {
  blue: "34,211,238",
  green: "52,211,153",
  yellow: "251,191,36",
  red: "251,113,133",
};
const HEX: Record<Zone, string> = {
  blue: "#22d3ee",
  green: "#34d399",
  yellow: "#fbbf24",
  red: "#fb7185",
};
const RADII: Record<Zone, [number, number]> = {
  blue: [78, 112],
  green: [114, 151],
  yellow: [153, 191],
  red: [193, 230],
};

const CX = 240;
const CY = 76;
const A0 = (24 * Math.PI) / 180;
const A1 = (156 * Math.PI) / 180;
const SECTIONS = 18;

function point(radius: number, angle: number) {
  return `${(CX + radius * Math.cos(angle)).toFixed(2)},${(CY + radius * Math.sin(angle)).toFixed(2)}`;
}

function sectionPath(inner: number, outer: number, start: number, end: number) {
  return `M${point(outer, start)} A${outer},${outer} 0 0 1 ${point(outer, end)} L${point(inner, end)} A${inner},${inner} 0 0 0 ${point(inner, start)} Z`;
}

function zoneName(zone: Zone) {
  return ZONE[zone].label.split(" ")[0];
}

export function SeatingMap({ currentZone }: { currentZone: Zone | null }) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);

  const sections = useMemo(() => {
    const step = (A1 - A0) / SECTIONS;
    const gap = step * 0.11;
    return ZONES_OUT.reduce<Record<Zone, string[]>>(
      (result, zone) => {
        const [inner, outer] = RADII[zone];
        result[zone] = Array.from({ length: SECTIONS }, (_, index) => {
          const start = A0 + index * step + gap;
          const end = A0 + (index + 1) * step - gap;
          return sectionPath(inner, outer, start, end);
        });
        return result;
      },
      { blue: [], green: [], yellow: [], red: [] }
    );
  }, []);

  const you = useMemo(() => {
    if (!currentZone) return null;
    const [inner, outer] = RADII[currentZone];
    const radius = (inner + outer) / 2;
    const angle = (A0 + A1) / 2;
    return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
  }, [currentZone]);

  const previewZone = hoveredZone ?? selectedZone;

  function selectZone(zone: Zone) {
    setSelectedZone((current) => (current === zone ? null : zone));
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#050608] shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
        <div className="pointer-events-none absolute inset-x-[18%] top-[4%] h-28 rounded-full bg-violet-500/10 blur-3xl" />
        <svg
          viewBox="0 0 480 350"
          className="relative z-10 w-full select-none"
          role="img"
          aria-label="Interactive concert venue with four allocation zones around the stage"
        >
          <defs>
            <radialGradient id="venue-floor" cx="50%" cy="20%" r="85%">
              <stop offset="0%" stopColor="#172033" />
              <stop offset="48%" stopColor="#090b10" />
              <stop offset="100%" stopColor="#030405" />
            </radialGradient>
            <linearGradient id="stage-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4f4f5" />
              <stop offset="42%" stopColor="#a1a1aa" />
              <stop offset="100%" stopColor="#27272a" />
            </linearGradient>
            <linearGradient id="catwalk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="100%" stopColor="#3f3f46" />
            </linearGradient>
            <filter id="stage-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {ZONES_OUT.map((zone) => (
              <filter key={zone} id={`glow-${zone}`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={HEX[zone]} floodOpacity="0.75" />
              </filter>
            ))}
          </defs>

          <rect width="480" height="350" rx="20" fill="url(#venue-floor)" />

          {/* Soft concert spotlights */}
          <path d="M174 42 L90 294 L204 294 Z" fill="rgba(99,102,241,0.055)" />
          <path d="M306 42 L390 294 L276 294 Z" fill="rgba(34,211,238,0.045)" />
          <path d="M214 45 L178 305 L254 305 Z" fill="rgba(255,255,255,0.025)" />
          <path d="M266 45 L302 305 L226 305 Z" fill="rgba(255,255,255,0.02)" />

          {/* Arena architecture */}
          <path d="M34 303 Q240 380 446 303" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <path d="M48 288 Q240 350 432 288" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          <path d="M66 274 Q240 328 414 274" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />

          {/* Main stage, side screens, lighting truss and catwalk */}
          <g filter="url(#stage-glow)">
            <rect x="177" y="24" width="126" height="42" rx="7" fill="url(#stage-face)" />
            <rect x="185" y="31" width="110" height="25" rx="4" fill="#09090b" />
            <path d="M198 51 C216 30 229 50 241 36 C253 22 270 48 284 33" fill="none" stroke="#34d399" strokeWidth="2" opacity="0.9" />
            <text x="240" y="47" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="2" fill="#f4f4f5">LIVE</text>
          </g>
          <rect x="142" y="29" width="27" height="31" rx="4" fill="#18181b" stroke="#52525b" />
          <rect x="311" y="29" width="27" height="31" rx="4" fill="#18181b" stroke="#52525b" />
          <rect x="148" y="35" width="15" height="19" rx="2" fill="#0f766e" opacity="0.75" />
          <rect x="317" y="35" width="15" height="19" rx="2" fill="#0e7490" opacity="0.75" />
          <path d="M156 21 H324" stroke="#71717a" strokeWidth="2" />
          {Array.from({ length: 9 }).map((_, index) => (
            <g key={`light-${index}`}>
              <circle cx={168 + index * 18} cy="21" r="3" fill={index % 2 ? "#22d3ee" : "#34d399"} opacity="0.8" />
              <line x1={168 + index * 18} y1="24" x2={164 + index * 19} y2="70" stroke="rgba(255,255,255,0.045)" />
            </g>
          ))}
          <path d="M225 66 H255 L260 108 Q240 115 220 108 Z" fill="url(#catwalk)" stroke="#71717a" strokeWidth="0.8" />
          <ellipse cx="240" cy="108" rx="21" ry="7" fill="#52525b" stroke="#a1a1aa" strokeWidth="0.8" />
          <text x="240" y="18" textAnchor="middle" fontSize="8" fontWeight="700" letterSpacing="1.6" fill="#a1a1aa">STAGE</text>

          {/* Four interactive seating bands. Hovering any section lights its whole zone. */}
          {ZONES_OUT.map((zone) => {
            const highlighted = hoveredZone === zone || selectedZone === zone;
            const current = currentZone === zone;
            const opacity = highlighted ? 0.9 : current ? 0.58 : 0.2;
            return (
              <g
                key={zone}
                role="button"
                tabIndex={0}
                aria-label={`${zoneName(zone)} Zone${current ? ", your current zone" : ""}. Select to preview.`}
                aria-pressed={selectedZone === zone}
                className="cursor-pointer outline-none transition-all duration-300 focus-visible:opacity-100"
                style={{ filter: highlighted ? `url(#glow-${zone})` : undefined }}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
                onFocus={() => setHoveredZone(zone)}
                onBlur={() => setHoveredZone(null)}
                onClick={() => selectZone(zone)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectZone(zone);
                  }
                }}
              >
                {sections[zone].map((path, index) => (
                  <path
                    key={index}
                    d={path}
                    fill={`rgba(${RGB[zone]},${opacity})`}
                    stroke={highlighted ? `rgba(${RGB[zone]},0.92)` : "rgba(3,4,5,0.78)"}
                    strokeWidth={highlighted ? 1.05 : 0.65}
                    className="transition-all duration-300"
                  />
                ))}
              </g>
            );
          })}

          {/* Standing-floor crowd detail */}
          {Array.from({ length: 24 }).map((_, index) => {
            const column = index % 8;
            const row = Math.floor(index / 8);
            return (
              <circle
                key={`crowd-${index}`}
                cx={207 + column * 9.5 + (row % 2) * 3}
                cy={123 + row * 9}
                r="1.6"
                fill={index % 3 === 0 ? "#34d399" : "#71717a"}
                opacity={index % 3 === 0 ? 0.72 : 0.4}
              />
            );
          })}

          {you && (
            <g className="animate-pulse motion-reduce:animate-none" pointerEvents="none">
              <circle cx={you.x} cy={you.y} r="13" fill="none" stroke="#ffffff" strokeOpacity="0.3" />
              <circle cx={you.x} cy={you.y} r="8" fill="#ffffff" />
              <text x={you.x} y={you.y + 2.8} textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#09090b">YOU</text>
            </g>
          )}
        </svg>

        <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[10px] text-zinc-400 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          Hover a zone to illuminate it
        </div>
      </div>

      <div className="mt-3 flex min-h-8 items-center justify-center text-center text-xs text-zinc-400" aria-live="polite">
        {previewZone ? (
          <p>
            <span className={`font-semibold ${ZONE[previewZone].text}`}>{zoneName(previewZone)} Zone</span>
            {currentZone === previewZone ? " · your current allocation outlook" : " · select to keep highlighted"}
          </p>
        ) : (
          <p>Explore the venue by hovering or selecting a colored zone.</p>
        )}
      </div>
    </div>
  );
}