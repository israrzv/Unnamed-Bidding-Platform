import Link from "next/link";
import {
  getActiveAuction,
  getOpenAuctionsWithCounts,
} from "@/lib/auction";
import { Marquee } from "@/components/Marquee";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const auction = await getActiveAuction();
  const openAuctions = await getOpenAuctionsWithCounts();
  const bidCount = auction
    ? openAuctions.find((a) => a.id === auction.id)?.liveCount ?? 0
    : 0;
  const tickerItems = openAuctions.map((a) => (
    <span key={a.id}>
      <span className="text-brand-light">🔴 {a.title}</span>
      <span className="ml-2 text-slate-400">
        — {a.liveCount} {a.liveCount === 1 ? "person" : "people"} live
      </span>
    </span>
  ));

  return (
    <div className="space-y-10">
      {tickerItems.length > 0 && <Marquee items={tickerItems} />}

      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Fair tickets. <span className="text-brand">No scalpers.</span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-400">
          Everyone places a single sealed bid. When the sale closes, the top
          bidders win the tickets. One bid per person, ranked transparently on
          the leaderboard.
        </p>
        <div className="flex gap-3">
          <Link
            href="/bid"
            className="rounded-lg bg-brand px-5 py-3 font-medium text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:bg-brand-dark hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]"
          >
            Place your bid
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-200 hover:bg-slate-800"
          >
            View leaderboard
          </Link>
        </div>
      </section>

      {auction ? (
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-brand-light">
              Current sale
            </h2>
            {auction.isOpen ? (
              <span className="animate-pulse rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                ● Live now
              </span>
            ) : (
              <span className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-400">
                Closed
              </span>
            )}
          </div>
          <p className="mt-1 text-2xl font-semibold">{auction.title}</p>
          {auction.description && (
            <p className="mt-2 text-slate-400">{auction.description}</p>
          )}
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat label="Tickets available" value={auction.ticketCount.toString()} />
            <Stat label="Bids placed" value={bidCount.toString()} />
            <Stat label="Status" value={auction.isOpen ? "Open" : "Closed"} />
          </dl>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400">
          No active sale right now. Check back soon.
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <HowItWorks step="1" title="Sign up" body="Create an account to place a bid tied to your identity." />
        <HowItWorks step="2" title="Bid once" body="Submit a single sealed bid. You can't bid twice." />
        <HowItWorks step="3" title="Top bids win" body="When the sale closes, the highest N bids get tickets." />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-xl font-semibold text-white">{value}</dd>
    </div>
  );
}

function HowItWorks({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
        {step}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </div>
  );
}
