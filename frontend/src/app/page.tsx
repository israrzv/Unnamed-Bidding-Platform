import Link from "next/link";
import { Wallet, Music2, Disc3, Tent, Mic2, Trophy, Drama } from "lucide-react";
import { ActiveArenas } from "@/components/ActiveArenas";

const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md";

const CATEGORIES = [
  { name: "Concerts", count: "4 live", Icon: Music2, from: "from-violet-600/40", to: "to-fuchsia-600/20" },
  { name: "Club Nights", count: "2 live", Icon: Disc3, from: "from-cyan-500/40", to: "to-blue-600/20" },
  { name: "Festivals", count: "1 upcoming", Icon: Tent, from: "from-emerald-500/40", to: "to-teal-600/20" },
  { name: "Comedy", count: "3 upcoming", Icon: Mic2, from: "from-amber-500/40", to: "to-orange-600/20" },
  { name: "Sports", count: "1 live", Icon: Trophy, from: "from-rose-500/40", to: "to-red-600/20" },
  { name: "Theatre", count: "2 upcoming", Icon: Drama, from: "from-indigo-500/40", to: "to-purple-600/20" },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Command Center</h1>
        <p className="mt-1 text-zinc-400">Your allocations, your escrow, at a glance.</p>
      </section>

      <ActiveArenas />

      {/* Categories with imagery */}
      <section>
        <h2 className="border-b border-zinc-800/80 pb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Browse by category
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map(({ name, count, Icon, from, to }) => (
            <Link
              key={name}
              href="/events"
              className="group overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 transition-colors hover:border-zinc-700"
            >
              <div
                className={`relative flex h-24 items-center justify-center bg-gradient-to-br ${from} ${to}`}
              >
                <div className="absolute inset-0 bg-zinc-950/20" />
                <Icon className="relative h-8 w-8 text-white/90" />
              </div>
              <div className="p-4">
                <p className="font-medium text-white">{name}</p>
                <p className="mt-0.5 text-sm text-zinc-500">{count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Escrow */}
      <section>
        <div className={`${CARD} p-6`}>
          <div className="flex items-center gap-2 text-zinc-400">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-widest">Escrow Vault Balance</span>
          </div>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-white">₹24,500</p>
          <p className="mt-1 text-sm text-zinc-500">Held securely across your active pledges</p>
        </div>
      </section>
    </div>
  );
}
