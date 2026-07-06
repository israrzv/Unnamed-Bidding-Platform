import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getActiveAuction, getRankedBids, formatAmount } from "@/lib/auction";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const auction = await getActiveAuction();
  const ranked = auction
    ? await getRankedBids(auction.id, auction.ticketCount)
    : [];
  const myBid = ranked.find((b) => b.userId === user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Username</dt>
              <dd className="text-lg font-semibold">{user.username}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="text-lg font-semibold">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Member since</dt>
              <dd className="text-lg font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Your bid</h2>
        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          {!auction ? (
            <p className="text-slate-400">No active sale right now.</p>
          ) : myBid ? (
            <div className="space-y-2">
              <p className="text-slate-400">
                Sale: <span className="text-white">{auction.title}</span>
              </p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-sm text-slate-500">Your bid</div>
                  <div className="text-2xl font-bold">{formatAmount(myBid.amount)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Rank</div>
                  <div className="text-2xl font-bold">#{myBid.rank}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Status</div>
                  <div className="text-2xl font-bold">
                    {myBid.isWinning ? (
                      <span className="text-emerald-400">Winning</span>
                    ) : (
                      <span className="text-amber-400">Outbid</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-400">You haven&apos;t placed a bid yet.</p>
              <Link
                href="/bid"
                className="inline-block rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark"
              >
                Place a bid
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
