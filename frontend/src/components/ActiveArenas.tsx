"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getParticipations } from "@/lib/pledges";
import { getArena } from "@/lib/arenas";
import { zoneFor, ZONE, type Zone } from "@/lib/zones";
import { TiltCard } from "@/components/TiltCard";
import { Reveal } from "@/components/ui/Reveal";

const CARD = "rounded-xl border border-zinc-800/80 bg-black";

type Row = {
  id: string;
  name: string;
  day: string;
  month: string;
  img: string;
  pledge: number;
  zone: Zone;
};

export function ActiveArenas() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    setRows(
      getParticipations().map(({ id, pledges }) => {
        const arena = getArena(id);
        const pledge = pledges[pledges.length - 1];
        return {
          id,
          name: arena.name,
          day: arena.day,
          month: arena.month,
          img: arena.img,
          pledge,
          zone: zoneFor(pledge),
        };
      })
    );
  }, []);

  return (
    <Reveal>
      <section>
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-lg font-semibold tracking-tight text-white">Your active arenas</h2>
          <Link
            href="/arena"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            View all →
          </Link>
        </div>

        {rows === null ? null : rows.length === 0 ? (
          <div className={`${CARD} flex items-center justify-between gap-4 p-5`}>
            <p className="text-sm text-zinc-400">You haven&apos;t pledged in any arenas yet.</p>
            <Link
              href="/events"
              className="whitespace-nowrap text-sm font-medium text-emerald-400 hover:underline"
            >
              Explore events →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map((r) => (
              <TiltCard key={r.id}>
                <Link
                  href={`/arena/${r.id}`}
                  className={`${CARD} group flex items-center gap-4 p-4 transition-colors hover:border-zinc-700`}
                >
                  <div className="flex flex-col items-center justify-center rounded-lg bg-zinc-900 px-3 py-2">
                    <span className="text-xl font-bold leading-none text-white">{r.day}</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      {r.month}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <span className={`h-2 w-2 rounded-full ${ZONE[r.zone].dot}`} />
                      {ZONE[r.zone].label}
                    </span>
                    <h3 className="mt-1 truncate font-medium text-white">{r.name}</h3>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      Pledge ₹{r.pledge.toLocaleString("en-IN")}
                    </p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.img}
                    alt=""
                    className="h-14 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-300" />
                </Link>
              </TiltCard>
            ))}
          </div>
        )}
      </section>
    </Reveal>
  );
}
