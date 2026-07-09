"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getParticipations } from "@/lib/pledges";
import { getArena } from "@/lib/arenas";
import { zoneFor, ZONE, type Zone } from "@/lib/zones";

const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md";

type Row = { id: string; name: string; venue: string; pledge: number; zone: Zone };

export function ActiveArenas() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    setRows(
      getParticipations().map(({ id, pledges }) => {
        const arena = getArena(id);
        const pledge = pledges[pledges.length - 1];
        return { id, name: arena.name, venue: arena.venue, pledge, zone: zoneFor(pledge) };
      })
    );
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">Your Active Arenas</h2>
        <Link href="/arena" className="text-sm text-zinc-400 transition-colors hover:text-white">
          View all
        </Link>
      </div>

      {rows === null ? null : rows.length === 0 ? (
        <div className={`${CARD} mt-4 flex items-center justify-between gap-4 p-5`}>
          <p className="text-sm text-zinc-400">You haven&apos;t pledged in any arenas yet.</p>
          <Link href="/events" className="whitespace-nowrap text-sm font-medium text-zinc-100 hover:underline">
            Explore events →
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/arena/${r.id}`}
              className={`${CARD} group p-5 transition-colors hover:border-zinc-700`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className={`h-2 w-2 rounded-full ${ZONE[r.zone].dot}`} />
                  {ZONE[r.zone].label}
                </span>
                <ArrowRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-300" />
              </div>
              <h3 className="mt-3 font-medium text-white">{r.name}</h3>
              <p className="mt-0.5 text-sm text-zinc-500">
                Pledge ₹{r.pledge.toLocaleString("en-IN")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
