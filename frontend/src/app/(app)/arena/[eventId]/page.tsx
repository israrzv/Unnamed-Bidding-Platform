"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Info, Calendar, MapPin, Music } from "lucide-react";
import {
  type Zone,
  zoneFor,
  ZONE,
  YELLOW_ENTRY,
  GREEN_ENTRY,
  BLUE_ENTRY,
} from "@/lib/zones";
import { getArena } from "@/lib/arenas";
import { getPledges, addPledge } from "@/lib/pledges";
import { setParticleAccent, type RGB } from "@/components/ui/particle-field";

const MAX_PLEDGES = 3;
const EVENT_WHEN = "Sat, 18 May · 7:30 PM";

const CARD = "rounded-lg border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md";

// Best → worst, matching venue proximity to the stage.
const ZONE_LADDER: Zone[] = ["blue", "green", "yellow", "red"];
const ZONE_RANK: Record<Zone, number> = { red: 0, yellow: 1, green: 2, blue: 3 };

// A pledge picks a zone; we persist a representative tier value so existing
// helpers keep working — but no money is ever shown.
const ZONE_TIER: Record<Zone, number> = {
  red: 100,
  yellow: YELLOW_ENTRY,
  green: GREEN_ENTRY,
  blue: BLUE_ENTRY,
};

const ZONE_RGB: Record<Zone, RGB> = {
  blue: { r: 34, g: 211, b: 238 },
  green: { r: 52, g: 211, b: 153 },
  yellow: { r: 251, g: 191, b: 36 },
  red: { r: 251, g: 113, b: 133 },
};

const ZONE_DESC: Record<Zone, string> = {
  blue: "Front of the arena · best view",
  green: "Secured allocation · great spot",
  yellow: "Near the edge · view at risk",
  red: "Below threshold · allocation at risk",
};

const ZONE_SWATCH: Record<Zone, string> = {
  blue: "bg-cyan-400",
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  red: "bg-rose-400",
};

// Seating-map ring styling (dark zone-tinted fills, straight square borders).
const RING: Record<Zone, { base: string; active: string; label: string }> = {
  red: { base: "border-rose-900/70 bg-rose-950/50", active: "border-rose-400 bg-rose-500/25", label: "text-rose-300" },
  yellow: { base: "border-amber-900/70 bg-amber-950/40", active: "border-amber-400 bg-amber-500/25", label: "text-amber-300" },
  green: { base: "border-emerald-900/70 bg-emerald-950/40", active: "border-emerald-400 bg-emerald-500/25", label: "text-emerald-300" },
  blue: { base: "border-cyan-900/70 bg-cyan-950/50", active: "border-cyan-400 bg-cyan-500/25", label: "text-cyan-300" },
};

const TOP_BIDDERS: { name: string; zone: Zone }[] = [
  { name: "Rahul K.", zone: "blue" },
  { name: "Sneha P.", zone: "blue" },
  { name: "Aditya R.", zone: "green" },
];

function ZoneRing({
  z,
  active,
  children,
}: {
  z: Zone;
  active: boolean;
  children: React.ReactNode;
}) {
  const r = RING[z];
  return (
    <div className={`relative border p-[9%] pt-[11%] ${active ? r.active : r.base}`}>
      <span
        className={`absolute left-1/2 top-1 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.15em] ${
          active ? r.label : "text-zinc-500"
        }`}
      >
        {ZONE[z].label.split(" ")[0]}
      </span>
      {children}
    </div>
  );
}

export default function ArenaPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId ?? "arena";
  const arena = useMemo(() => getArena(eventId), [eventId]);

  const [pledges, setPledges] = useState<number[]>([]);

  useEffect(() => {
    setPledges(getPledges(eventId));
  }, [eventId]);

  const current = pledges.length ? pledges[pledges.length - 1] : null;
  const zone: Zone | null = current !== null ? zoneFor(current) : null;
  const currentRank = zone ? ZONE_RANK[zone] : -1;
  const bidsLeft = MAX_PLEDGES - pledges.length;

  useEffect(() => {
    setParticleAccent(zone ? ZONE_RGB[zone] : null);
    return () => setParticleAccent(null);
  }, [zone]);

  function pledgeZone(z: Zone) {
    if (bidsLeft <= 0 || ZONE_RANK[z] <= currentRank) return;
    addPledge(eventId, ZONE_TIER[z]);
    setPledges((p) => [...p, ZONE_TIER[z]]);
  }

  return (
    <div className="relative">
      <Link
        href="/arena"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> My arenas
      </Link>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* ---------- Left column ---------- */}
        <div className="space-y-5 lg:col-span-2">
          {/* Event header */}
          <div className={`flex flex-wrap items-center gap-4 p-5 ${CARD}`}>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 text-emerald-300">
              <Music className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {arena.name}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {EVENT_WHEN}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {arena.venue}
                </span>
              </div>
            </div>
            <span className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300">
              {arena.spots} allocations
            </span>
          </div>

          {/* Your position + pledge picker */}
          <div className={`p-6 ${CARD}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Your position
                </p>
                {zone ? (
                  <>
                    <p className={`mt-2 text-2xl font-semibold tracking-tight ${ZONE[zone].text}`}>
                      {ZONE[zone].label}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{ZONE[zone].status}</p>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      No pledge yet
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Pick a zone below to secure your allocation.
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">
                  {bidsLeft > 0 ? `Pledge ${pledges.length + 1} of ${MAX_PLEDGES}` : "All pledges used"}
                </span>
                <div className="flex gap-1.5">
                  {Array.from({ length: MAX_PLEDGES }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i < pledges.length ? "bg-emerald-400" : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-widest text-zinc-500">
              {bidsLeft > 0 ? "Move up a zone" : "All pledges used"}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ZONE_LADDER.map((z) => {
                const locked = bidsLeft <= 0 || ZONE_RANK[z] <= currentRank;
                const isCurrent = zone === z;
                return (
                  <button
                    key={z}
                    onClick={() => pledgeZone(z)}
                    disabled={locked}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                      isCurrent
                        ? ZONE[z].badge
                        : locked
                        ? "cursor-not-allowed border-zinc-800 bg-zinc-950/40 text-zinc-600"
                        : "border-zinc-700 bg-zinc-950/40 text-zinc-200 hover:border-zinc-500 hover:text-white"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${ZONE_SWATCH[z]}`} />
                    {ZONE[z].label.split(" ")[0]}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 flex items-start gap-2 text-sm text-zinc-500">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              You have {MAX_PLEDGES} pledges and can only move to a higher zone — never lower.
            </p>
          </div>

          {/* Top bidders (names only, no money) */}
          <div className={`p-6 ${CARD}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight text-white">Top bidders</h2>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
              </span>
            </div>
            <ul className="mt-4 space-y-1">
              {TOP_BIDDERS.map((b, i) => (
                <li
                  key={b.name}
                  className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-zinc-800/30"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-zinc-200">{b.name}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs ${ZONE[b.zone].text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${ZONE_SWATCH[b.zone]}`} />
                    {ZONE[b.zone].label.split(" ")[0]} Zone
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Right column: Venue & Zones ---------- */}
        <div className="lg:col-span-1">
          <div className={`p-6 ${CARD}`}>
            <h2 className="text-sm font-semibold tracking-tight text-white">Venue &amp; Zones</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Closer to the stage is a stronger position. Your zone is highlighted.
            </p>

            {/* Concentric seating map — connected square rings, stage at core */}
            <div className="mt-4">
              <ZoneRing z="red" active={zone === "red"}>
                <ZoneRing z="yellow" active={zone === "yellow"}>
                  <ZoneRing z="green" active={zone === "green"}>
                    <ZoneRing z="blue" active={zone === "blue"}>
                      <div className="flex aspect-[2/1] items-center justify-center border border-zinc-600 bg-zinc-800/70">
                        <span className="rounded-sm bg-zinc-100 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-zinc-900">
                          STAGE
                        </span>
                      </div>
                    </ZoneRing>
                  </ZoneRing>
                </ZoneRing>
              </ZoneRing>
            </div>

            {/* Legend */}
            <div className="mt-5 space-y-2.5 border-t border-zinc-800/80 pt-4">
              {ZONE_LADDER.map((z) => (
                <div
                  key={z}
                  className={`flex items-start gap-2.5 rounded-md border px-3 py-2 ${
                    zone === z ? `${ZONE[z].border} bg-zinc-900/60` : "border-transparent"
                  }`}
                >
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${ZONE_SWATCH[z]}`} />
                  <div>
                    <p className={`text-xs font-semibold ${ZONE[z].text}`}>
                      {ZONE[z].label}
                    </p>
                    <p className="text-xs text-zinc-500">{ZONE_DESC[z]}</p>
                  </div>
                  {zone === z && <ShieldCheck className={`ml-auto h-4 w-4 ${ZONE[z].text}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
