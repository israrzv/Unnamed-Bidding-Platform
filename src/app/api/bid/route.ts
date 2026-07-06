import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getActiveAuction } from "@/lib/auction";

const schema = z.object({
  // amount in dollars from the client; converted to integer cents server-side
  amount: z.number().positive().max(1_000_000),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to bid" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid bid amount" }, { status: 400 });
  }

  const auction = await getActiveAuction();
  if (!auction || !auction.isOpen) {
    return NextResponse.json({ error: "There is no open sale to bid on" }, { status: 400 });
  }

  const amountCents = Math.round(parsed.data.amount * 100);
  if (amountCents <= 0) {
    return NextResponse.json({ error: "Bid must be greater than zero" }, { status: 400 });
  }

  const { error } = await supabase.from("bids").insert({
    amount: amountCents,
    user_id: user.id,
    auction_id: auction.id,
  });

  if (error) {
    // 23505 = unique_violation -> user already has a bid on this auction.
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You have already placed your bid. Each person can bid only once." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Could not place your bid. Please try again." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
