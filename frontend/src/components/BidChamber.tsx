"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const INCREMENTS = [50, 100, 500];

export function BidChamber() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const bump = (delta: number) => setAmount((a) => Math.max(0, a + delta));

  async function lockBid() {
    setError(null);
    setSuccess(null);
    if (amount <= 0) return;

    setLoading(true);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    try {
      const res = await fetch(`${apiUrl}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);

      if (!res.ok) {
        setError(data.error ?? "Could not lock your bid.");
        return;
      }
      setSuccess("Your sealed bid is locked in. Good luck in the arena.");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Network error — is the API running?");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Bid Action Chamber</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Enter a single sealed max bid. You bid once — make it count.
        </p>
      </div>

      <div>
        <label htmlFor="bid" className="text-xs uppercase tracking-widest text-zinc-500">
          Your sealed max bid
        </label>
        <div className="mt-2 flex items-center rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-4 focus-within:border-violet-500/60">
          <span className="text-lg text-zinc-500">₹</span>
          <input
            id="bid"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={amount || ""}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            suppressHydrationWarning
            className="w-full bg-transparent px-3 py-4 text-2xl font-semibold text-white tabular-nums outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {INCREMENTS.map((inc) => (
          <button
            key={inc}
            type="button"
            onClick={() => bump(inc)}
            className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-violet-500/40 hover:text-white"
          >
            +₹{inc}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAmount(0)}
          className="ml-auto rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-rose-400"
        >
          Reset
        </button>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}
      {success && <p className="text-sm text-cyan-400">{success}</p>}

      <button
        type="button"
        onClick={lockBid}
        className="w-full rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300 hover:bg-violet-700 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:shadow-none"
        disabled={amount <= 0 || loading}
      >
        {loading ? "Locking…" : `Lock Sealed Bid · ₹${amount.toLocaleString("en-IN")}`}
      </button>

      <div className="rounded-xl border border-dashed border-cyan-500/20 bg-cyan-500/[0.03] p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-cyan-400">
            +5 / −5 Real-Time Radar
          </span>
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
            Stream slot
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Live view of the 5 bids just above and below the current cutoff will
          stream here.
        </p>
      </div>
    </div>
  );
}
