import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  getActiveAuction,
  getRankedBids,
  getRecentBids,
  formatAmount,
} from "@/lib/auction";
import { BidForm } from "@/components/BidForm";
import { RulesOfArena } from "@/components/RulesOfArena";
import { Marquee } from "@/components/Marquee";

export const dynamic = "force-dynamic";

export default async function BidPage() {
  const user = await getCurrentUser();
  const auction = await getActiveAuction();

  if (!auction) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400">
        There is no active sale right now.
      </div>
    );
  }

  const ranked = await getRankedBids(auction.id, auction.ticketCount);
  const myBid = user ? ranked.find((b) => b.userId === user.id) : undefined;
  const lowestWinning = ranked[auction.ticketCount - 1];

  // Ticker showing the bids happening in THIS auction only.
  const recentBids = await getRecentBids(auction.id);
  const tickerItems = recentBids.map((b, i) => (
    <span key={i}>
      <span className="text-brand-light">💸 @{b.username}</span>
      <span className="ml-2 text-slate-300">bid {formatAmount(b.amount)}</span>
    </span>
  ));

  return (
    <div className="space-y-6">
      {tickerItems.length > 0 && (
        <Marquee items={tickerItems} speedSeconds={25} />
      )}

      <div className="grid gap-6 lg:grid-cols-5">
      {/* Left column (60%) — event details + bid action */}
      <div className="space-y-6 lg:col-span-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{auction.title}</h1>
            {auction.isOpen && (
              <span className="animate-pulse rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                ● Live now
              </span>
            )}
          </div>
          {auction.description && (
            <p className="mt-1 text-slate-400">{auction.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-500">Tickets available</div>
            <div className="text-xl font-semibold">{auction.ticketCount}</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-500">Bidders entered</div>
            <div className="text-xl font-semibold">{ranked.length}</div>
          </div>
        </div>

        <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-400">
          Anyone can enter — there&apos;s no limit on how many people bid. Only
          the top{" "}
          <span className="font-semibold text-white">{auction.ticketCount}</span>{" "}
          bids win a ticket.
        </p>

        {lowestWinning && (
          <p className="text-sm text-slate-400">
            Currently, the lowest winning bid is{" "}
            <span className="font-semibold text-white">
              {formatAmount(lowestWinning.amount)}
            </span>
            . Bid above it to secure a ticket.
          </p>
        )}

        {!user ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-slate-300">You need an account to place a bid.</p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-brand px-4 py-2 font-medium text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:bg-brand-dark hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800"
              >
                Log in
              </Link>
            </div>
          </div>
        ) : myBid ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="font-semibold">Your bid is in</h2>
            <p className="mt-2 text-slate-400">
              You bid{" "}
              <span className="font-semibold text-white">
                {formatAmount(myBid.amount)}
              </span>{" "}
              and are currently ranked{" "}
              <span className="font-semibold text-white">#{myBid.rank}</span>.
            </p>
            <p className="mt-2 text-sm">
              {myBid.isWinning ? (
                <span className="text-emerald-400">
                  You are currently in the winning zone.
                </span>
              ) : (
                <span className="text-amber-400">
                  You are not currently in the winning zone.
                </span>
              )}
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Each person can bid only once, so this bid is final.
            </p>
            <Link
              href="/leaderboard"
              className="mt-4 inline-block text-sm text-brand-light hover:underline"
            >
              See the full leaderboard →
            </Link>
          </div>
        ) : (
          <BidForm />
        )}
      </div>

        {/* Right column (40%) — trust / rules */}
        <div className="lg:col-span-2">
          <RulesOfArena />
        </div>
      </div>
    </div>
  );
}
