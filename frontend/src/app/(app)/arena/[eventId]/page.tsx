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

// Best → worst, matching venue proximity to the stage.
const ZONE_LADDER: Zone[] = ["blue", "green", "yellow", "red"];
const ZONE_RANK: Record<Zone, number> = { red: 0, yellow: 1, green: 2, blue: 3 };

// A pledge picks a zone; we persist a representative tier value so existing
// helpers (zoneFor, participations) keep working — but no money is ever shown.
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

const TOP_BIDDERS: { name: string; zone: Zone }[] = [
  { name: "Rahul K.", zone: "blue" },
  { name: "Sneha P.", zone: "blue" },
  { name: "Aditya R.", zone: "green" },
];

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

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* ---------- Left column ---------- */}
        <div className="space-y-6 lg:col-span-2">
          {/* Event header */}
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 text-emerald-300">
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
            <span className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300">
              {arena.spots} allocations
            </span>
          </div>

          {/* Your position + pledge picker */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md">
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
                  Pledge {Math.min(pledges.length + (bidsLeft > 0 ? 1 : 0), MAX_PLEDGES)} of{" "}
                  {MAX_PLEDGES}
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
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      isCurrent
                        ? `${ZONE[z].badge}`
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
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md">
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
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-zinc-800/30"
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
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md">
            <h2 className="text-sm font-semibold tracking-tight text-white">Venue &amp; Zones</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Your allocation zone is set by your pledge tier — closer to the stage is a
              stronger position.
            </p>

            {/* Stage */}
            <div className="mt-5 flex justify-center">
              <span className="rounded-md bg-zinc-100 px-6 py-1.5 text-xs font-semibold tracking-widest text-zinc-900">
                STAGE
              </span>
            </div>

            {/* Zone bands, closest (blue) → farthest (red) */}
            <div className="mt-3 space-y-2">
              {ZONE_LADDER.map((z) => {
                const active = zone === z;
                return (
                  <div
                    key={z}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-all ${
                      active
                        ? `${ZONE[z].border} ${ZONE[z].badge}`
                        : "border-zinc-800 bg-zinc-950/40"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${ZONE_SWATCH[z]}`} />
                      <span
                        className={`text-sm font-medium ${
                          active ? ZONE[z].text : "text-zinc-300"
                        }`}
                      >
                        {ZONE[z].label}
                      </span>
                    </span>
                    {active && <ShieldCheck className={`h-4 w-4 ${ZONE[z].text}`} />}
                  </div>
                );
              })}
            </div>

            {/* Legend descriptions */}
            <div className="mt-5 space-y-2.5 border-t border-zinc-800/80 pt-4">
              {ZONE_LADDER.map((z) => (
                <div key={z} className="flex items-start gap-2.5">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${ZONE_SWATCH[z]}`} />
                  <div>
                    <p className={`text-xs font-medium ${ZONE[z].text}`}>
                      {ZONE[z].label.split(" — ")[0]}
                    </p>
                    <p className="text-xs text-zinc-500">{ZONE_DESC[z]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
