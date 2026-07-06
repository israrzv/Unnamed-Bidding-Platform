import { getCurrentUser } from "@/lib/auth";
import { getActiveAuction, getRankedBids, formatAmount } from "@/lib/auction";
import { EmptyPodiums } from "@/components/EmptyPodiums";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-slate-400">
          {auction.title} — top {auction.ticketCount} bids win. {ranked.length}{" "}
          {ranked.length === 1 ? "bid" : "bids"} placed.
        </p>
      </div>

      {ranked.length === 0 ? (
        <EmptyPodiums />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Bidder</th>
                <th className="px-4 py-3 font-medium text-right">Bid</th>
                <th className="px-4 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ranked.map((bid) => {
                const isMe = user?.id === bid.userId;
                return (
                  <tr
                    key={bid.bidId}
                    className={isMe ? "bg-brand/10" : "bg-slate-950/40"}
                  >
                    <td className="px-4 py-3 font-mono text-slate-400">#{bid.rank}</td>
                    <td className="px-4 py-3 font-medium">
                      {bid.username}
                      {isMe && <span className="ml-2 text-xs text-brand">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatAmount(bid.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {bid.isWinning ? (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-400">
                          Winning
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-700/40 px-2 py-1 text-xs font-medium text-slate-400">
                          Outbid
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
