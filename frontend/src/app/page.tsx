import Link from "next/link";

const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-violet-400">Command Center</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Welcome back, Dev
          </h1>
          <p className="mt-1 text-zinc-400">
            Here&apos;s your escrow, your savings, and the arenas you&apos;re in.
          </p>
        </div>
        <Link
          href="/bidding"
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300 hover:bg-violet-700 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]"
        >
          Enter the Arena
        </Link>
      </section>

      {/* Metric cards */}
      <section className="grid gap-5 md:grid-cols-3">
        {/* Locked Escrow Vault */}
        <div className={`${CARD} p-6`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Locked Escrow Vault</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              🔒
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold text-cyan-400">₹24,500</p>
          <p className="mt-1 text-xs text-zinc-500">Held securely across 2 active bids</p>
        </div>

        {/* Saved from Scalpers */}
        <div className={`${CARD} p-6`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Saved from Scalpers</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              🛡️
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">₹11,200</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          </div>
          <p className="mt-2 text-xs text-zinc-500">Level 4 Fair Buyer · 75% to next tier</p>
        </div>

        {/* Active Arenas */}
        <div className={`${CARD} p-6`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Active Arenas</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              🏟️
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">2</p>
          <p className="mt-1 text-xs text-zinc-500">Events you&apos;re currently bidding in</p>
        </div>
      </section>

      {/* Active positions */}
      <section className={`${CARD} p-6`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Your Active Positions</h2>
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
            Live
          </span>
        </div>
        <div className="mt-5 divide-y divide-zinc-800/80">
          {[
            { event: "Neon Nights — Arena Drop", bid: "₹12,000", rank: 38, winning: true },
            { event: "Midnight Circuit — GA", bid: "₹12,500", rank: 142, winning: false },
          ].map((pos) => (
            <div key={pos.event} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-white">{pos.event}</p>
                <p className="text-sm text-zinc-500">
                  Your bid <span className="text-zinc-300">{pos.bid}</span> · Rank #{pos.rank}
                </p>
              </div>
              {pos.winning ? (
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                  In the winning zone
                </span>
              ) : (
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-500">
                  Below cutoff
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
