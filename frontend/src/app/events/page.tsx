"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md";
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Drop = { id: string; title: string; venue: string };

function keyOf(y: number, m: number, d: number) {
  return `${y}-${m}-${d}`;
}

export default function EventsPage() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState<string | null>(null);

  // Mock drops seeded into the current month so the calendar always has data.
  const drops = useMemo<Record<string, Drop[]>>(() => {
    const y = today.getFullYear();
    const m = today.getMonth();
    return {
      [keyOf(y, m, 12)]: [{ id: "neon-nights", title: "Neon Nights — Arena Drop", venue: "NSCI Dome, Mumbai" }],
      [keyOf(y, m, 18)]: [{ id: "desert-mirage", title: "Desert Mirage — Day 1", venue: "Jaipur" }],
      [keyOf(y, m, 25)]: [{ id: "rooftop-3", title: "Rooftop Sessions Vol. 3", venue: "Delhi" }],
    };
  }, [today]);

  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function shiftMonth(delta: number) {
    setSelected(null);
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  const catalog: { key: string; drop: Drop; day: number }[] = selected
    ? (drops[selected] ?? []).map((drop) => ({ key: selected, drop, day: Number(selected.split("-")[2]) }))
    : Object.entries(drops)
        .filter(([k]) => k.startsWith(`${view.year}-${view.month}-`))
        .flatMap(([k, list]) => list.map((drop) => ({ key: k, drop, day: Number(k.split("-")[2]) })));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Events</h1>
        <p className="mt-1 text-zinc-400">A curated drop calendar. Pick a date to filter.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar */}
        <div className={`${CARD} p-6`}>
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-white">
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
              const k = keyOf(view.year, view.month, day);
              const hasDrop = Boolean(drops[k]);
              const isSelected = selected === k;
              const isToday =
                day === today.getDate() &&
                view.month === today.getMonth() &&
                view.year === today.getFullYear();
              return (
                <button
                  key={i}
                  onClick={() => setSelected(isSelected ? null : k)}
                  className={`relative flex aspect-square items-center justify-center rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-zinc-100 font-medium text-zinc-900"
                      : "text-zinc-300 hover:bg-zinc-800"
                  } ${isToday && !isSelected ? "ring-1 ring-zinc-700" : ""}`}
                >
                  {day}
                  {hasDrop && !isSelected && (
                    <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-violet-500" />
                  )}
                </button>
              );
            })}
          </div>

          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Catalog */}
        <div>
          <h2 className="border-b border-zinc-800/80 pb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
            {selected ? "Drops on this date" : "This month"}
          </h2>
          <div className="mt-4 space-y-3">
            {catalog.length === 0 ? (
              <div className={`${CARD} p-6 text-sm text-zinc-500`}>No drops on this date.</div>
            ) : (
              catalog.map(({ drop, day }) => (
                <Link
                  key={drop.id}
                  href={`/arena/${drop.id}`}
                  className={`${CARD} group flex items-stretch overflow-hidden transition-colors hover:border-zinc-700`}
                >
                  <div className="flex w-24 shrink-0 items-center justify-center border-r border-zinc-800/80 bg-zinc-900/60 text-center">
                    <div>
                      <p className="text-lg font-semibold text-white">{day}</p>
                      <p className="text-xs text-zinc-500">{MONTHS[view.month].slice(0, 3)}</p>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-medium text-white">{drop.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-zinc-500">
                      <MapPin className="h-3.5 w-3.5" /> {drop.venue}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
