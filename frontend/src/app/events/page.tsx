import Link from "next/link";
import { Countdown } from "@/components/Countdown";

const PAST_EVENTS = [
  { title: "Warehouse 09 — Closing Set", location: "Bengaluru", cleared: "₹9,800", date: "Jun 14" },
  { title: "Rooftop Sessions Vol. 2", location: "Delhi", cleared: "₹7,500", date: "May 30" },
];

const UPCOMING_EVENTS = [
  { title: "Desert Mirage — Day 1", location: "Jaipur", reveals: "in 9 days" },
];

function Marker({ tone }: { tone: "past" | "live" | "future" }) {
  const dot =
    tone === "live"
      ? "bg-cyan-400 ring-4 ring-cyan-400/20 animate-pulse"
      : tone === "future"
      ? "bg-violet-500 ring-4 ring-violet-500/15"
      : "bg-zinc-600 ring-4 ring-zinc-700/20";
  return (
    <div className="relative flex w-6 flex-col items-center">
      <span className={`z-10 mt-2 h-3 w-3 rounded-full ${dot}`} />
    </div>
  );
}

export default function EventsPage() {
  const targetMs = Date.now() + 3 * 86_400_000 + 5 * 3_600_000;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-violet-400">Live Drop Calendar</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Events</h1>
        </div>
        <button className="w-fit rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-violet-500/40 hover:text-white">
          🗓️ Browse by date
        </button>
      </div>

      {/* Timeline: past (top) → live (middle) → upcoming (bottom) */}
      <div className="relative">
        {/* Vertical spine */}
        <div className="absolute bottom-2 left-3 top-2 w-px bg-gradient-to-b from-zinc-800 via-cyan-500/30 to-violet-500/30" />

        <div className="space-y-6">
          {/* PAST */}
          <p className="ml-10 text-xs uppercase tracking-widest text-zinc-600">Past drops</p>
          {PAST_EVENTS.map((e) => (
            <div key={e.title} className="flex gap-4">
              <Marker tone="past" />
              <div className="flex-1 rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5 opacity-70 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-zinc-300">{e.title}</h3>
                    <p className="text-sm text-zinc-500">📍 {e.location} · {e.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full border border-zinc-700/60 bg-zinc-800/40 px-3 py-1 text-xs font-medium text-zinc-400">
                      Ended
                    </span>
                    <p className="mt-1 text-xs text-zinc-500">
                      Cleared <span className="text-zinc-300">{e.cleared}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* LIVE NOW — cinematic hero */}
          <p className="ml-10 text-xs uppercase tracking-widest text-cyan-400">● Live now</p>
          <div className="flex gap-4">
            <Marker tone="live" />
            <section className="flex-1 overflow-hidden rounded-2xl border border-cyan-500/20 bg-zinc-900/40 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-md">
              <div className="grid md:grid-cols-2">
                <div className="relative flex min-h-[240px] items-center justify-center bg-gradient-to-br from-violet-600/30 via-zinc-900 to-cyan-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.25),transparent_60%)]" />
                  <span className="relative rounded-lg border border-zinc-700/60 bg-zinc-950/40 px-4 py-2 text-xs uppercase tracking-widest text-zinc-400">
                    Event Flyer
                  </span>
                  <span className="absolute left-4 top-4 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                    ● Live Drop Open
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">Neon Nights — Arena Drop</h2>
                    <p className="mt-2 text-zinc-400">📍 NSCI Dome, Mumbai · 21+ · GA</p>
                    <p className="mt-4 max-w-md text-sm text-zinc-500">
                      100 spots. Single sealed bid. Top bidders win at the uniform
                      clearing price.
                    </p>
                  </div>
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">Bidding closes in</p>
                    <Countdown targetMs={targetMs} />
                  </div>
                  <Link
                    href="/bidding"
                    className="inline-flex w-fit items-center justify-center rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300 hover:bg-violet-700 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]"
                  >
                    Enter the Arena
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* UPCOMING */}
          <p className="ml-10 text-xs uppercase tracking-widest text-violet-400">Upcoming</p>
          {UPCOMING_EVENTS.map((e) => (
            <div key={e.title} className="flex gap-4">
              <Marker tone="future" />
              <div className="flex-1 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{e.title}</h3>
                    <p className="text-sm text-zinc-500">📍 {e.location}</p>
                  </div>
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                    Reveals {e.reveals}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Locked teaser */}
          <div className="flex gap-4">
            <Marker tone="future" />
            <div className="relative flex-1 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
              <div className="pointer-events-none select-none space-y-3 p-6 blur-md">
                <div className="h-6 w-2/3 rounded bg-zinc-800" />
                <div className="h-4 w-1/2 rounded bg-zinc-800" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950/50 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700/60 bg-zinc-900/80">🔒</span>
                <p className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
                  Next Drop Revealing Soon
                </p>
                <button className="text-xs font-medium text-zinc-400 underline-offset-4 hover:text-white hover:underline">
                  Turn on notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
