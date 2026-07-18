"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { ARENA_CATALOG } from "@/lib/arenas";
import { TiltCard } from "@/components/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureRow } from "@/components/ui/FeatureRow";
import { Newsletter } from "@/components/ui/Newsletter";

const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md";
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Evt = {
  id: string;
  title: string;
  venue: string;
  day: number;
  month: string;
  time: string;
  img: string;
  popularity: number;
  past: boolean;
};

const EVENTS: Evt[] = [
  ...ARENA_CATALOG.map((a, i) => ({
    id: a.id,
    title: a.name,
    venue: a.venue,
    day: Number(a.day),
    month: a.month,
    time: a.time,
    img: a.img,
    popularity: ARENA_CATALOG.length - i,
    past: false,
  })),
  {
    id: "aurora-past",
    title: "Aurora Live — Encore",
    venue: "Bengaluru",
    day: 2,
    month: "JUL",
    time: "8:00 PM",
    img: "/categories/theatre.jpg",
    popularity: 2,
    past: true,
  },
  {
    id: "pulse-past",
    title: "Pulse Festival — Finale",
    venue: "Goa",
    day: 5,
    month: "JUL",
    time: "6:00 PM",
    img: "/categories/sports.jpg",
    popularity: 1,
    past: true,
  },
];

export default function EventsPage() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"popular" | "least">("popular");

  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const eventDays = new Set(EVENTS.map((e) => e.day));

  function shiftMonth(delta: number) {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  const list = EVENTS.filter((e) => (tab === "past" ? e.past : !e.past))
    .filter((e) => (selectedDay ? e.day === selectedDay : true))
    .filter((e) => {
      const q = query.trim().toLowerCase();
      return q ? (e.title + e.venue).toLowerCase().includes(q) : true;
    })
    .sort((a, b) => (sort === "popular" ? b.popularity - a.popularity : a.popularity - b.popularity));

  return (
    <div className="space-y-14">
      <Reveal>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Events</h1>
          <p className="mt-1 text-zinc-400">Discover upcoming events and exclusive drops.</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by artist, event or venue..."
            suppressHydrationWarning
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
          />
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* Calendar */}
        <Reveal>
          <div className={`${CARD} p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">
                {MONTHS[view.month]} {view.year}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => shiftMonth(-1)}
                  className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => shiftMonth(1)}
                  className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((w, i) => (
                <div key={i} className="pb-2 text-xs font-medium text-zinc-600">
                  {w}
                </div>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <div key={i} />;
                const hasEvent = eventDays.has(day);
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`relative flex aspect-square items-center justify-center rounded-lg text-sm transition-all duration-200 hover:scale-110 ${
                      isSelected
                        ? "bg-emerald-500/15 font-semibold text-emerald-300 ring-1 ring-emerald-400"
                        : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    {day}
                    {hasEvent && !isSelected && (
                      <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="mt-4 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Clear date filter
              </button>
            )}
          </div>
        </Reveal>

        {/* List */}
        <div>
          <Reveal>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-6">
                {(["upcoming", "past"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative text-sm capitalize transition-colors ${
                      tab === t ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {t}
                    {tab === t && (
                      <span className="absolute -bottom-3 left-0 h-0.5 w-full rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSort((s) => (s === "popular" ? "least" : "popular"))}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-600"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {sort === "popular" ? "Most popular" : "Least popular"}
              </button>
            </div>
          </Reveal>

          <div className="mt-4 space-y-3">
            {list.length === 0 ? (
              <div className={`${CARD} p-6 text-sm text-zinc-500`}>No events found.</div>
            ) : (
              list.map((e, i) => (
                <Reveal key={e.id} delay={i * 60}>
                  <TiltCard>
                    <div className={`${CARD} group flex items-center gap-4 p-3 transition-colors hover:border-emerald-500/40`}>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-zinc-950/60 px-3 py-2">
                        <span className="text-lg font-bold leading-none text-white">{e.day}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          {e.month}
                        </span>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={e.img} alt="" className="h-14 w-16 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-white">{e.title}</h3>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                          <MapPin className="h-3 w-3" /> {e.venue}
                          <span className="mx-1 text-zinc-700">·</span>
                          {e.time} · ---- expected
                        </p>
                      </div>
                      <Link
                        href={`/arena/${e.id}`}
                        className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 sm:inline-flex"
                      >
                        View Event <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </TiltCard>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </div>

      <Reveal>
        <FeatureRow />
      </Reveal>

      {/* Newsletter */}
      <Reveal>
        <Newsletter />
      </Reveal>
    </div>
  );
}
