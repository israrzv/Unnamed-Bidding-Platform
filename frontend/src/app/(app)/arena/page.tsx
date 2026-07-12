"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { getParticipations } from "@/lib/pledges";
import { getArena } from "@/lib/arenas";
import { zoneFor, ZONE, type Zone } from "@/lib/zones";
import { TiltCard } from "@/components/TiltCard";

const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md";

type Row = { id: string; name: string; venue: string; pledge: number; zone: Zone };

export default function ArenaIndexPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const parts = getParticipations().map(({ id, pledges }) => {
      const arena = getArena(id);
      const pledge = pledges[pledges.length - 1];
      return { id, name: arena.name, venue: arena.venue, pledge, zone: zoneFor(pledge) };
    });
    setRows(parts);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">My Arenas</h1>
        <p className="mt-1 text-zinc-400">Arenas you&apos;ve pledged in and your current standing.</p>
      </div>

      {rows === null ? null : rows.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center gap-4 p-10 text-center`}>
          <Compass className="h-6 w-6 text-zinc-600" />
          <div>
            <p className="font-medium text-white">You haven&apos;t entered any arenas yet</p>
            <p className="mt-1 text-sm text-zinc-500">Browse the drop calendar to join a live arena.</p>
          </div>
          <Link
            href="/events"
            className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white"
          >
            Explore events
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <TiltCard key={r.id}>
              <Link
                href={`/arena/${r.id}`}
                className={`${CARD} group flex flex-col gap-4 p-5 transition-colors hover:border-zinc-700`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className={`h-2 w-2 rounded-full ${ZONE[r.zone].dot}`} />
                    {ZONE[r.zone].label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-200" />
                </div>
                <div>
                  <h2 className="font-medium text-white">{r.name}</h2>
                  <p className="mt-0.5 text-sm text-zinc-500">{r.venue}</p>
                </div>
                <div className="border-t border-zinc-800/80 pt-3 text-sm text-zinc-400">
                  Your pledge: <span className="font-medium text-white">₹{r.pledge.toLocaleString("en-IN")}</span>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}
