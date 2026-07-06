import { createClient } from "@/lib/supabase/server";

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

function mapAuction(row: any): Auction {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ticketCount: row.ticket_count,
    isOpen: row.is_open,
    createdAt: row.created_at,
  };
}

/** The single active auction (one at a time for now). */
export async function getActiveAuction(): Promise<Auction | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("auctions")
    .select("*")
    .eq("is_open", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ? mapAuction(data) : null;
}

/** All open auctions with a live participant count. Drives the home ticker. */
export async function getOpenAuctionsWithCounts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("auctions")
    .select("id, title, ticket_count, bids(count)")
    .eq("is_open", true)
    .order("created_at", { ascending: false });

  return (data ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    ticketCount: a.ticket_count,
    liveCount: a.bids?.[0]?.count ?? 0,
  }));
}

/**
 * Ranks every bid in an auction. Highest amount wins; ties broken by who bid
 * first. The top `ticketCount` bids are flagged as winning.
 */
export async function getRankedBids(
  auctionId: string,
  ticketCount: number
): Promise<RankedBid[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bids")
    .select("id, user_id, amount, created_at, profiles(username)")
    .eq("auction_id", auctionId)
    .order("amount", { ascending: false })
    .order("created_at", { ascending: true });

  return (data ?? []).map((bid: any, index: number) => ({
    rank: index + 1,
    bidId: bid.id,
    userId: bid.user_id,
    username: bid.profiles?.username ?? "unknown",
    amount: bid.amount,
    isWinning: index < ticketCount,
  }));
}

/** Recent bids for a single auction, newest first. Drives the in-auction ticker. */
export async function getRecentBids(auctionId: string, take = 20) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bids")
    .select("amount, profiles(username)")
    .eq("auction_id", auctionId)
    .order("created_at", { ascending: false })
    .limit(take);

  return (data ?? []).map((b: any) => ({
    username: b.profiles?.username ?? "unknown",
    amount: b.amount,
  }));
}

/** Formats an integer amount (cents) into a currency string. */
export function formatAmount(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
