import { BidChamber } from "@/components/BidChamber";

const RULES = [
  {
    title: "Uniform clearing price",
    body: "Winners all pay the same price — the lowest winning bid — not their max.",
  },
  {
    title: "Sealed & single",
    body: "One private bid per person. No sniping, no visible bidding wars.",
  },
  {
    title: "Instant refund",
    body: "If the cutoff clears below your bid, the difference is refunded from escrow instantly.",
  },
];

const ACTIVITY = [
  { who: "@Yug_P", action: "reinforced their stance", accent: "violet" },
  { who: "Squad 'Vipers'", action: "entered the arena", accent: "cyan" },
  { who: "@midnight_raven", action: "locked a spot", accent: "violet" },
  { who: "@sara.k", action: "slipped below the cutoff", accent: "rose" },
  { who: "@arjun_09", action: "raised into the winning zone", accent: "cyan" },
];

const accentText: Record<string, string> = {
  violet: "text-violet-400",
  cyan: "text-cyan-400",
  rose: "text-rose-500",
};

export default function BiddingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-white">Neon Nights — Arena</h1>
        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
          ● Live
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left 60% — Bid Action Chamber */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md lg:col-span-3">
          <BidChamber />
        </div>

        {/* Right 40% — Live Spectator Box */}
        <div className="space-y-6 lg:col-span-2">
          {/* Vickrey rules */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span>🛡️</span>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-400">
                Vickrey Clearing Engine
              </h2>
            </div>
            <ul className="mt-4 space-y-4">
              {RULES.map((rule) => (
                <li key={rule.title}>
                  <p className="text-sm font-medium text-white">{rule.title}</p>
                  <p className="text-sm text-zinc-400">{rule.body}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Live activity log */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Live Activity
              </h2>
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            </div>
            <ul className="mt-4 space-y-3">
              {ACTIVITY.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                  <span className="text-zinc-400">
                    <span className={accentText[item.accent]}>{item.who}</span> {item.action}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
