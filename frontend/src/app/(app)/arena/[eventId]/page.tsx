"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Info,
  Calendar,
  MapPin,
  ArrowUp,
  ArrowDown,
  UserPlus,
  Plus,
} from "lucide-react";
import { type Zone, zoneFor, ZONE } from "@/lib/zones";
import { getArena } from "@/lib/arenas";
import { getPledges, addPledge } from "@/lib/pledges";
import { setMatrixAccent, type RGB } from "@/components/ui/matrix-code-rain";
import { SeatingMap } from "@/components/ui/SeatingMap";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureRow } from "@/components/ui/FeatureRow";

const MAX_PLEDGES = 3;
const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md";

const ZONE_LADDER: { zone: Zone; sub: string }[] = [
  { zone: "blue", sub: "Front" },
  { zone: "green", sub: "Safe" },
  { zone: "yellow", sub: "Warning" },
  { zone: "red", sub: "Risk" },
];
const ZONE_RANK: Record<Zone, number> = { red: 0, yellow: 1, green: 2, blue: 3 };
const ZONE_RGB: Record<Zone, RGB> = {
  blue: { r: 34, g: 211, b: 238 },
  green: { r: 52, g: 211, b: 153 },
  yellow: { r: 251, g: 191, b: 36 },
  red: { r: 251, g: 113, b: 133 },
};
const ZONE_SWATCH: Record<Zone, string> = {
  blue: "bg-cyan-400",
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  red: "bg-rose-400",
};
const ZONE_DESC: Record<Zone, string> = {
  blue: "Closest to stage · Best view",
  green: "Great view · Secured",
  yellow: "Moderate view · At risk",
  red: "Far from stage · High risk",
};

const TOP_BIDDERS: { name: string; zone: Zone }[] = [
  { name: "Rahul K.", zone: "blue" },
  { name: "Sneha P.", zone: "blue" },
  { name: "Aditya R.", zone: "green" },
  { name: "Karan M.", zone: "yellow" },
  { name: "Isha T.", zone: "yellow" },
];

const ACTIVITY: { name: string; text: string; dir: "up" | "down" | "join" }[] = [
  { name: "Rahul K.", text: "Moved up to Green Zone", dir: "up" },
  { name: "Sneha P.", text: "Moved up to Blue Zone", dir: "up" },
  { name: "Isha T.", text: "Slipped to Yellow Zone", dir: "down" },
  { name: "Karan M.", text: "Joined the arena", dir: "join" },
];

export default function ArenaPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId ?? "arena";
  const arena = useMemo(() => getArena(eventId), [eventId]);

  const [pledges, setPledges] = useState<number[]>([]);
  const [entry, setEntry] = useState<number>(0);

  useEffect(() => {
    const saved = getPledges(eventId);
    setPledges(saved);
    setEntry(saved.length ? saved[saved.length - 1] + 100 : 500);
  }, [eventId]);

  const current = pledges.length ? pledges[pledges.length - 1] : null;
  const zone: Zone | null = current !== null ? zoneFor(current) : null;
  const bidsLeft = MAX_PLEDGES - pledges.length;
  const tooLow = current !== null && entry <= current;

  useEffect(() => {
    setMatrixAccent(zone ? ZONE_RGB[zone] : null);
    return () => setMatrixAccent(null);
  }, [zone]);

  function placeBid() {
    if (bidsLeft <= 0 || tooLow || entry <= 0) return;
    addPledge(eventId, entry);
    setPledges((p) => [...p, entry]);
    setEntry(entry + 100);
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <Link
          href="/arena"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> My arenas
        </Link>
      </Reveal>

      {/* Event header */}
      <Reveal>
        <div className={`relative flex flex-wrap items-center gap-4 overflow-hidden p-4 ${CARD}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={arena.img} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live Now
            </span>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
              {arena.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {arena.month} {arena.day} · {arena.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {arena.venue}
              </span>
              <span className="text-zinc-500">{arena.spots} allocations left</span>
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Auction ends in</p>
            <p className="font-mono text-2xl font-bold text-white tabular-nums">-- : --</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">MM &nbsp; SS</p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Position + bid */}
          <Reveal>
            <div className={`p-6 ${CARD}`}>
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Position */}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                      Your position
                    </p>
                    <div className="flex items-center gap-1.5">
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
                  {zone ? (
                    <>
                      <p className={`mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight ${ZONE[zone].text}`}>
                        {ZONE[zone].label} <ShieldCheck className="h-5 w-5" />
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">{ZONE[zone].status}</p>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        No pledge yet
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        Place a pledge to reveal your zone.
                      </p>
                    </>
                  )}

                  {/* Zone ladder */}
                  <div className="relative mt-6 flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-1.5 h-0.5 bg-zinc-800" />
                    {ZONE_LADDER.map((z) => {
                      const active = zone === z.zone;
                      return (
                        <div key={z.zone} className="relative z-10 flex flex-col items-center">
                          <span
                            className={`h-3.5 w-3.5 rounded-full ring-2 ring-zinc-950 ${
                              active ? ZONE_SWATCH[z.zone] : "bg-zinc-700"
                            }`}
                          />
                          <span
                            className={`mt-1.5 text-[10px] font-medium ${
                              active ? ZONE[z.zone].text : "text-zinc-500"
                            }`}
                          >
                            {ZONE[z.zone].label.split(" ")[0]}
                          </span>
                          <span className="text-[9px] text-zinc-600">{z.sub}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 flex items-start gap-1.5 text-xs text-zinc-500">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    You can move up to a higher zone, never lower.
                  </p>
                </div>

                {/* Bid entry (no threshold / highest shown) */}
                <div className="flex flex-col">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                    {bidsLeft > 0 ? `Your next pledge · ${pledges.length + 1} of ${MAX_PLEDGES}` : "All pledges used"}
                  </p>
                  <div className="mt-2 flex items-center rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 focus-within:border-emerald-500/50">
                    <span className="text-zinc-500">₹</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      step={50}
                      value={entry || ""}
                      onChange={(e) => setEntry(Math.max(0, Number(e.target.value)))}
                      disabled={bidsLeft <= 0}
                      suppressHydrationWarning
                      className="w-full bg-transparent px-3 py-3 text-xl font-semibold text-white tabular-nums outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="mt-2 flex gap-2">
                    {[250, 500, 1000].map((inc) => (
                      <button
                        key={inc}
                        onClick={() => setEntry((v) => v + inc)}
                        disabled={bidsLeft <= 0}
                        className="flex-1 rounded-lg border border-zinc-800 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-600 disabled:opacity-40"
                      >
                        +₹{inc}
                      </button>
                    ))}
                  </div>

                  {tooLow && bidsLeft > 0 && (
                    <p className="mt-2 text-xs text-rose-400">
                      You can only raise your pledge — enter more than ₹{current!.toLocaleString("en-IN")}.
                    </p>
                  )}

                  <button
                    onClick={placeBid}
                    disabled={bidsLeft <= 0 || tooLow || entry <= 0}
                    className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                    {bidsLeft <= 0 ? "No pledges left" : "Place Next Bid"}
                  </button>

                  {pledges.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {pledges.map((p, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400"
                        >
                          Pledge {i + 1}: ₹{p.toLocaleString("en-IN")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Top bidders + activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className={`p-6 ${CARD}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">Top bidders</h2>
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
                  </span>
                </div>
                <ul className="mt-4 space-y-1">
                  {TOP_BIDDERS.map((b, i) => (
                    <li key={b.name} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-800/30">
                      <span className="w-4 text-center text-xs font-semibold text-zinc-500">{i + 1}</span>
                      <span className="flex-1 text-sm text-zinc-200">{b.name}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs ${ZONE[b.zone].text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${ZONE_SWATCH[b.zone]}`} />
                        {ZONE[b.zone].label.split(" ")[0]} Zone
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div className={`p-6 ${CARD}`}>
                <h2 className="text-sm font-semibold text-white">Recent activity</h2>
                <ul className="mt-4 space-y-3">
                  {ACTIVITY.map((a, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          a.dir === "up"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : a.dir === "down"
                            ? "bg-rose-500/15 text-rose-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {a.dir === "up" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : a.dir === "down" ? (
                          <ArrowDown className="h-3.5 w-3.5" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-zinc-200">
                          <span className="font-medium text-white">{a.name}</span> {a.text}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-600">----</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Right: Venue & Zones */}
        <div className="lg:col-span-1">
          <Reveal>
            <div className={`p-6 ${CARD}`}>
              <h2 className="text-sm font-semibold text-white">Venue &amp; Zones</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Closer to the stage is a stronger position. Your zone is highlighted.
              </p>

              <div className="mt-4">
                <SeatingMap currentZone={zone} />
              </div>

              <div className="mt-5 space-y-2.5 border-t border-zinc-800/80 pt-4">
                {ZONE_LADDER.map((z) => (
                  <div
                    key={z.zone}
                    className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 ${
                      zone === z.zone ? "bg-zinc-800/40" : ""
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ZONE_SWATCH[z.zone]}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${ZONE[z.zone].text}`}>
                        {ZONE[z.zone].label}
                      </p>
                      <p className="truncate text-[11px] text-zinc-500">{ZONE_DESC[z.zone]}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-500">---- of allocations</span>
                  </div>
                ))}
                <p className="pt-1 text-[11px] text-zinc-600">
                  Allocations update in real time based on bid activity.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal>
        <div>
          <FeatureRow />
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-900 bg-zinc-800 text-[9px] text-zinc-500"
                  >
                    --
                  </span>
                ))}
              </div>
              <span className="text-sm text-zinc-500">---- fans online</span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
