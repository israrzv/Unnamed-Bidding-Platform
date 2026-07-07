/**
 * Data access for auctions/bids — thin client over the Go backend API.
 *
 * Auth stays on the frontend via Supabase: the browser gets a Supabase JWT and
 * sends it to Go as `Authorization: Bearer <token>` for writes (see BidForm).
 * These read functions run server-side and hit the public Go endpoints.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type Auction = {
  id: string;
  title: string;
  description: string | null;
  ticketCount: number;
  isOpen: boolean;
  createdAt: string;
};

export type RankedBid = {
  rank: number;
  bidId: string;
  userId: string;
  username: string;
  amount: number;
  isWinning: boolean;
};

async function getJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    const text = await res.text();
    if (!text) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/** The single active auction, or null if none is open. */
export async function getActiveAuction(): Promise<Auction | null> {
  return getJSON<Auction | null>("/auctions/active", null);
}

/** Open auctions with live participant counts. Drives the home ticker. */
export async function getOpenAuctionsWithCounts(): Promise<
  { id: string; title: string; ticketCount: number; liveCount: number }[]
> {
  return getJSON("/auctions", []);
}

/** Ranked bids for an auction; the top `ticketCount` are flagged winning. */
export async function getRankedBids(
  auctionId: string,
  _ticketCount: number
): Promise<RankedBid[]> {
  return getJSON<RankedBid[]>(`/auctions/${auctionId}/bids`, []);
}

/** Recent bids for the in-auction ticker (reuses the ranked list). */
export async function getRecentBids(
  auctionId: string,
  take = 20
): Promise<{ username: string; amount: number }[]> {
  const bids = await getJSON<RankedBid[]>(`/auctions/${auctionId}/bids`, []);
  return bids.slice(0, take).map((b) => ({ username: b.username, amount: b.amount }));
}

/** Formats an integer amount (cents) into a currency string. */
export function formatAmount(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
