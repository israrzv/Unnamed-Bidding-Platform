"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Info } from "lucide-react";
import { type Zone, zoneFor, nextZoneHint, ZONE } from "@/lib/zones";
import { getArena } from "@/lib/arenas";
import { getPledges, addPledge } from "@/lib/pledges";
import { setParticleAccent, type RGB } from "@/components/ui/particle-field";

const MAX_PLEDGES = 3;
const TOP_PLEDGES = [2000, 1850, 1700];

// Particle-field accent per zone (matches each zone's signature colour).
const ZONE_RGB: Record<Zone, RGB> = {
  blue: { r: 34, g: 211, b: 238 }, // cyan-400
  green: { r: 52, g: 211, b: 153 }, // emerald-400
  yellow: { r: 251, g: 191, b: 36 }, // amber-400
  red: { r: 251, g: 113, b: 133 }, // rose-400
};

export default function ArenaPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId ?? "arena";
  const arena = useMemo(() => getArena(eventId), [eventId]);

  const [pledges, setPledges] = useState<number[]>([]);
  const [entry, setEntry] = useState<number>(0);

  // Restore this arena's saved pledges on mount so nothing resets on return.
  useEffect(() => {
    const saved = getPledges(eventId);
    setPledges(saved);
    setEntry(saved.length ? saved[saved.length - 1] + 50 : 550);
  }, [eventId]);

  const current = pledges.length ? pledges[pledges.length - 1] : null;
  const zone: Zone | null = current !== null ? zoneFor(current) : null;

  // Retint the shared particle background to the active zone; reset on leave.
  useEffect(() => {
    setParticleAccent(zone ? ZONE_RGB[zone] : null);
    return () => setParticleAccent(null);
  }, [zone]);
  const bidsLeft = MAX_PLEDGES - pledges.length;
  const minAllowed = current !== null ? current + 1 : 1;
  const tooLow = entry < minAllowed;

  function submitPledge() {
    if (bidsLeft <= 0 || tooLow) return;
    addPledge(eventId, entry);
    setPledges((p) => [...p, entry]);
  }

  return (
    <div className="relative">
      <Link
        href="/arena"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> My arenas
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{arena.name}</h1>
          <p className="mt-1 text-zinc-400">{arena.venue} · {arena.spots} allocations</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-500 ${
            zone ? ZONE[zone].badge : "border-zinc-700 bg-zinc-800/40 text-zinc-400"
          }`}
        >
          {zone ? ZONE[zone].label : "Awaiting first pledge"}
        </span>
      </div>

      {/* Ceiling */}
      <div className="mt-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-md">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Ceiling — Top Pledges</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-zinc-300">
          {TOP_PLEDGES.map((amt, i) => (
            <span key={i}>
              <span className="text-zinc-600">{i + 1}.</span> ₹{amt.toLocaleString("en-IN")}
            </span>
          ))}
        </div>
      </div>

      {/* Center focus */}
      <div
        className={`mt-6 rounded-2xl border bg-zinc-900/40 p-8 text-center backdrop-blur-md transition-colors duration-500 sm:p-12 ${
          zone ? ZONE[zone].border : "border-zinc-800/80"
        }`}
      >
        <ShieldCheck className={`mx-auto h-8 w-8 ${zone ? ZONE[zone].text : "text-zinc-600"}`} />
        {zone ? (
          <>
            <p className={`mt-4 text-sm font-medium uppercase tracking-widest ${ZONE[zone].text}`}>
              {ZONE[zone].label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {ZONE[zone].status}
            </p>
            <p className="mt-3 text-zinc-400">
              Current pledge:{" "}
              <span className="font-medium text-white">₹{current!.toLocaleString("en-IN")}</span>
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Place your first pledge
            </p>
            <p className="mt-2 text-zinc-400">Your zone lights up the arena the moment you pledge.</p>
          </>
        )}
      </div>

      {/* Action area */}
      <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <label htmlFor="pledge" className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            {bidsLeft > 0 ? `Pledge ${pledges.length + 1} of ${MAX_PLEDGES}` : "All pledges used"}
          </label>
          <span className="text-xs text-zinc-500">{bidsLeft} left</span>
        </div>

        <div className="mt-2 flex items-center rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 focus-within:border-zinc-600">
          <span className="text-zinc-500">₹</span>
          <input
            id="pledge"
            type="number"
            inputMode="numeric"
            step={50}
            value={entry || ""}
            onChange={(e) => setEntry(Math.max(0, Number(e.target.value)))}
            min={minAllowed}
            disabled={bidsLeft <= 0}
            suppressHydrationWarning
            className="w-full bg-transparent px-3 py-3 text-xl font-semibold text-white tabular-nums outline-none disabled:opacity-50"
          />
        </div>

        {current !== null && tooLow && bidsLeft > 0 ? (
          <p className="mt-3 text-sm text-rose-400">
            You can only raise your pledge — enter more than ₹{current.toLocaleString("en-IN")}.
          </p>
        ) : (
          bidsLeft > 0 && (
            <p className={`mt-3 text-sm ${zone ? ZONE[zone].text : "text-zinc-500"}`}>
              {current !== null ? nextZoneHint(current) : "Pledge to secure your allocation and reveal your zone."}
            </p>
          )
        )}

        {pledges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
            {pledges.map((p, i) => (
              <span key={i} className="rounded-full border border-zinc-800 px-2.5 py-1">
                Pledge {i + 1}: ₹{p.toLocaleString("en-IN")}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={submitPledge}
          disabled={bidsLeft <= 0 || tooLow}
          className="mt-4 w-full rounded-lg bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white disabled:opacity-40"
        >
          {bidsLeft <= 0 ? "No pledges left" : `Submit pledge · ₹${entry.toLocaleString("en-IN")}`}
        </button>
      </div>

      {/* Footer note */}
      <p className="mt-6 flex items-start gap-2 text-sm text-zinc-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        You only pay the final clearing price. If you pledge ₹1000 and it clears at
        ₹600, your escrow is refunded the difference.
      </p>
    </div>
  );
}
