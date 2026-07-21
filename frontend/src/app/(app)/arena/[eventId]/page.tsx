"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Info,
  LockKeyhole,
  MapPin,
  Plus,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import { type Zone, zoneFor, ZONE } from "@/lib/zones";
import { getArena } from "@/lib/arenas";
import { getPledges, addPledge } from "@/lib/pledges";
import { setBackgroundColors } from "@/components/ui/liquid-background";
import { SeatingMap } from "@/components/ui/SeatingMap";
import { Reveal } from "@/components/ui/Reveal";

const MAX_PLEDGES = 3;
const CARD = "rounded-2xl border border-white/[0.08] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.28)]";

const ZONE_LADDER: { zone: Zone; label: string; view: string }[] = [
  { zone: "red", label: "Red", view: "Upper view" },
  { zone: "yellow", label: "Yellow", view: "Clear view" },
  { zone: "green", label: "Green", view: "Great view" },
  { zone: "blue", label: "Blue", view: "Closest view" },
];
const ZONE_PALETTE: Record<Zone, string[]> = {
  blue: ["#03161d", "#0c4a5a", "#0891b2", "#22d3ee", "#67e8f9"],
  green: ["#03140d", "#064e3b", "#059669", "#10b981", "#34d399"],
  yellow: ["#1a1204", "#713f12", "#b45309", "#f59e0b", "#fbbf24"],
  red: ["#1a060d", "#881337", "#be123c", "#f43f5e", "#fb7185"],
};

const ZONE_SWATCH: Record<Zone, string> = {
  blue: "bg-cyan-400",
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  red: "bg-rose-400",
};
const ZONE_GLOW: Record<Zone, string> = {
  blue: "shadow-[0_0_24px_rgba(34,211,238,0.24)]",
  green: "shadow-[0_0_24px_rgba(52,211,153,0.24)]",
  yellow: "shadow-[0_0_24px_rgba(251,191,36,0.2)]",
  red: "shadow-[0_0_24px_rgba(251,113,133,0.2)]",
};
const ZONE_COPY: Record<Zone, string> = {
  blue: "Closest view · strongest current position",
  green: "Great view · allocation currently secured",
  yellow: "Clear view · allocation currently in range",
  red: "Upper view · allocation currently at risk",
};

export default function ArenaPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId ?? "arena";
  const arena = useMemo(() => getArena(eventId), [eventId]);
  const [pledges, setPledges] = useState<number[]>([]);
  const [entry, setEntry] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const saved = getPledges(eventId).slice(0, MAX_PLEDGES);
    setPledges(saved);
    setEntry(saved.length ? saved[saved.length - 1] + 100 : 500);
  }, [eventId]);

  const current = pledges.length ? pledges[pledges.length - 1] : null;
  const zone: Zone | null = current !== null ? zoneFor(current) : null;
  const pledgesLeft = Math.max(0, MAX_PLEDGES - pledges.length);
  const tooLow = current !== null && entry <= current;
  const invalid = !Number.isFinite(entry) || entry <= 0 || tooLow;

  useEffect(() => {
    setBackgroundColors(zone ? ZONE_PALETTE[zone] : null);
    return () => setBackgroundColors(null);
  }, [zone]);

  function placePledge() {
    if (pledgesLeft <= 0 || invalid) return;
    addPledge(eventId, entry);
    setPledges((previous) => [...previous, entry]);
    setEntry(entry + 100);
    setConfirmed(true);
    window.setTimeout(() => setConfirmed(false), 2200);
  }

  return (
    <div className="space-y-5 pb-8">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/arena"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-black px-4 text-sm text-zinc-400 transition-all duration-200 hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            My arenas
          </Link>
        </div>
      </Reveal>


      <Reveal>
        <section className={`${CARD} overflow-hidden`}>
          <div className="group relative isolate min-h-[280px] overflow-hidden bg-black p-6 sm:p-8">
            <div className="absolute inset-y-0 right-0 -z-20 w-full overflow-hidden sm:w-[58%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={arena.img}
                alt={`${arena.name} event artwork`}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
            </div>
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#000_0%,#000_38%,rgba(0,0,0,0.76)_58%,rgba(0,0,0,0.12)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="flex min-h-[220px] max-w-xl flex-col justify-end">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Live ticket allocation
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.035em] text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                {arena.name}
              </h1>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-300">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-zinc-500" />
                  {arena.month} {arena.day} · {arena.time}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                  {arena.venue}
                </span>
              </div>
            </div>
          </div>
          <div className="grid border-t border-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock3, label: "Allocation closes", value: "-- : --", detail: "Exact time pending" },
              { icon: Ticket, label: "Allocations", value: arena.spots.toString(), detail: "Tickets in this arena" },
              { icon: Users, label: "Fan participation", value: "----", detail: "Verified fans" },
              { icon: Activity, label: "Arena activity", value: "----", detail: "Updates when available" },
            ].map(({ icon: Icon, label, value, detail }) => (
              <div key={label} className="group flex items-start gap-3 border-white/[0.08] p-5 sm:border-r last:border-r-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition-all group-hover:border-emerald-400/25 group-hover:text-emerald-300">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-600">{label}</p>
                  <p className="mt-1 font-mono text-xl font-semibold text-white tabular-nums">{value}</p>
                  <p className="mt-0.5 text-xs text-zinc-600">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
        <div className="space-y-5">
          <Reveal>
            <section className={`${CARD} p-5 sm:p-7`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">Your allocation outlook</p>
                  {zone ? (
                    <>
                      <h2 className={`mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight ${ZONE[zone].text}`}>
                        {ZONE[zone].label}
                        <ShieldCheck className="h-5 w-5" />
                      </h2>
                      <p className="mt-1 text-sm text-zinc-400">{ZONE_COPY[zone]}</p>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Choose your first pledge</h2>
                      <p className="mt-1 text-sm text-zinc-400">Your zone appears after your pledge is confirmed.</p>
                    </>
                  )}
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-right">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">Your current pledge</p>
                  <p className="mt-1 font-mono text-xl font-semibold text-white tabular-nums">
                    {current === null ? "----" : `₹${current.toLocaleString("en-IN")}`}
                  </p>
                </div>
              </div>


              <div className="mt-8 grid grid-cols-4 gap-2" aria-label="Allocation zones from upper view to closest view">
                {ZONE_LADDER.map((item, index) => {
                  const active = zone === item.zone;
                  return (
                    <div key={item.zone} className="relative pt-4 text-center">
                      <div className={`absolute left-0 right-0 top-[6px] h-px ${index === 0 ? "left-1/2" : ""} ${index === ZONE_LADDER.length - 1 ? "right-1/2" : ""} bg-zinc-800`} />
                      <span
                        className={`relative mx-auto block h-3 w-3 rounded-full border-2 border-black transition-all duration-300 ${
                          active ? `${ZONE_SWATCH[item.zone]} scale-125 ${ZONE_GLOW[item.zone]}` : "bg-zinc-700"
                        }`}
                      />
                      <p className={`mt-3 text-xs font-semibold ${active ? ZONE[item.zone].text : "text-zinc-500"}`}>{item.label}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-700">{item.view}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 rounded-xl border border-white/[0.08] bg-zinc-950 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Your pledge stays private</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Other fans cannot see your amount. Zone cutoffs and the highest pledge are never shown, helping keep allocation fair.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className={`${CARD} p-5 sm:p-7`}>
              <div className="flex items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">Venue map</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">See where each zone sits</h2>
                  <p className="mt-1 text-sm text-zinc-500">Select any section to explore it. Your current zone glows automatically.</p>
                </div>
              </div>
              <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-white/[0.06] bg-zinc-950/80 p-4 sm:p-6">
                <SeatingMap currentZone={zone} />
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {ZONE_LADDER.slice().reverse().map((item) => (
                  <div
                    key={item.zone}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                      zone === item.zone ? "border-white/15 bg-white/[0.06]" : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${ZONE_SWATCH[item.zone]}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${ZONE[item.zone].text}`}>{item.label} Zone</p>
                      <p className="text-[11px] text-zinc-600">{item.view}</p>
                    </div>
                    {zone === item.zone && <Check className="h-4 w-4 text-white" aria-label="Your current zone" />}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        </div>

        <div className="space-y-5 xl:sticky xl:top-5">
          <Reveal>
            <section className={`${CARD} overflow-hidden`}>
              <div className="border-b border-white/[0.08] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Make your move</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      {pledgesLeft > 0 ? "Set your pledge" : "Pledges complete"}
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
                    {pledgesLeft} left
                  </span>
                </div>

                <div className="mt-5 flex gap-2" aria-label={`${pledges.length} of ${MAX_PLEDGES} pledges used`}>
                  {Array.from({ length: MAX_PLEDGES }).map((_, index) => (
                    <div key={index} className="flex-1">
                      <div className={`h-1 rounded-full transition-colors ${index < pledges.length ? "bg-emerald-400" : "bg-zinc-800"}`} />
                      <p className="mt-2 text-[10px] uppercase tracking-wider text-zinc-600">Pledge {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>


              <div className="p-5 sm:p-6">
                <label htmlFor="pledge-amount" className="text-sm font-medium text-zinc-300">
                  {pledgesLeft > 0 ? `Pledge ${pledges.length + 1} amount` : "Final pledge amount"}
                </label>
                <div className="mt-2 flex items-center rounded-xl border border-white/[0.1] bg-zinc-950 px-4 transition-all focus-within:border-emerald-400/50 focus-within:ring-4 focus-within:ring-emerald-400/[0.08]">
                  <span className="text-lg text-zinc-600">₹</span>
                  <input
                    id="pledge-amount"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={50}
                    value={entry || ""}
                    onChange={(event) => setEntry(Math.max(0, Number(event.target.value)))}
                    disabled={pledgesLeft <= 0}
                    suppressHydrationWarning
                    className="min-w-0 flex-1 bg-transparent px-3 py-4 font-mono text-2xl font-semibold text-white tabular-nums outline-none disabled:opacity-50"
                    aria-describedby="pledge-guidance"
                  />
                  <span className="text-xs text-zinc-600">INR</span>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[250, 500, 1000].map((increase) => (
                    <button
                      key={increase}
                      type="button"
                      onClick={() => setEntry((value) => value + increase)}
                      disabled={pledgesLeft <= 0}
                      className="min-h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-zinc-400 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +₹{increase.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <div id="pledge-guidance" className="mt-3 min-h-10">
                  {tooLow && pledgesLeft > 0 ? (
                    <p className="flex items-start gap-2 text-xs leading-5 text-rose-300" role="alert">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Your next pledge must be higher than your previous ₹{current!.toLocaleString("en-IN")} pledge.
                    </p>
                  ) : (
                    <p className="text-xs leading-5 text-zinc-600">You choose the amount. BidFair never reveals what others pledged.</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={placePledge}
                  disabled={pledgesLeft <= 0 || invalid}
                  className="group mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-emerald-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
                >
                  {confirmed ? (
                    <><Check className="h-4 w-4" /> Pledge confirmed</>
                  ) : pledgesLeft <= 0 ? (
                    "All pledges used"
                  ) : (
                    <><Plus className="h-4 w-4" /> Confirm pledge <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                  )}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
                  <LockKeyhole className="h-3 w-3" /> Secure, private, and limited to three pledges
                </p>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className={`${CARD} p-5 sm:p-6`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">Your journey</p>
                  <h2 className="mt-1 text-base font-semibold text-white">Pledge history</h2>
                </div>
                <span className="font-mono text-xs text-zinc-600">{pledges.length}/{MAX_PLEDGES}</span>
              </div>
              {pledges.length ? (
                <ol className="mt-4 space-y-2">
                  {pledges.map((pledge, index) => {
                    const pledgeZone = zoneFor(pledge);
                    return (
                      <li key={`${pledge}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-black ${ZONE_SWATCH[pledgeZone]}`}>{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-zinc-600">Pledge {index + 1}</p>
                          <p className="font-mono text-sm font-semibold text-white tabular-nums">₹{pledge.toLocaleString("en-IN")}</p>
                        </div>
                        <span className={`text-xs font-medium ${ZONE[pledgeZone].text}`}>{ZONE[pledgeZone].label.split(" ")[0]}</span>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/[0.1] px-4 py-6 text-center">
                  <p className="text-sm text-zinc-500">Your confirmed pledges will appear here.</p>
                </div>
              )}
            </section>
          </Reveal>

          <Reveal>
            <section className={`${CARD} p-5 sm:p-6`}>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-white">Fair allocation protection</h2>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">Verified fans, private pledges, one clearing price, and automatic refunds for any difference.</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-500">
                {["No public rankings", "No visible thresholds", "No ticket trading", "No scalper advantage"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg bg-white/[0.025] px-3 py-2.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> {item}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}