/**
 * Data access for auctions/bids.
 *
 * ⚠️ BACKEND MOVED TO GO ⚠️
 * The previous Supabase queries were removed. These functions are now thin
 * clients that will call the Go backend API. They currently return empty data
 * so the frontend keeps building; wire each one to the Go endpoint as it lands.
 *
 * Auth stays on the frontend via Supabase — the browser gets a Supabase JWT and
 * sends it to Go as `Authorization: Bearer <token>`; Go verifies it.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""; // e.g. http://localhost:8080

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

/** GET {API_URL}/auctions/active — the single active auction. */
export async function getActiveAuction(): Promise<Auction | null> {
  // TODO(go): fetch(`${API_URL}/auctions/active`)
  return null;
}

/** GET {API_URL}/auctions?open=true — open auctions with live participant counts. */
export async function getOpenAuctionsWithCounts(): Promise<
  { id: string; title: string; ticketCount: number; liveCount: number }[]
> {
  // TODO(go): fetch(`${API_URL}/auctions?open=true`)
  return [];
}

/** GET {API_URL}/auctions/{id}/bids?ranked=true — ranked bids for an auction. */
export async function getRankedBids(
  _auctionId: string,
  _ticketCount: number
): Promise<RankedBid[]> {
  // TODO(go): fetch(`${API_URL}/auctions/${_auctionId}/bids?ranked=true`)
  return [];
}

/** GET {API_URL}/auctions/{id}/bids?recent=true — recent bids for the live ticker. */
export async function getRecentBids(
  _auctionId: string,
  _take = 20
): Promise<{ username: string; amount: number }[]> {
  // TODO(go): fetch(`${API_URL}/auctions/${_auctionId}/bids?recent=true`)
  return [];
}

/** Formats an integer amount (cents) into a currency string. */
export function formatAmount(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
