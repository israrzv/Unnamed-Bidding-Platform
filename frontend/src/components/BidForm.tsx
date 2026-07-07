"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function BidForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    setLoading(true);

    // Get the current Supabase access token to authenticate with the Go API.
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      setError("Your session expired. Please log in again.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
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
      setError(data.error ?? "Could not place bid");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="font-semibold">Place your bid</h2>
      <p className="mt-1 text-sm text-slate-400">
        You can bid only once, so make it count.
      </p>

      <label className="mt-4 block">
        <span className="text-sm text-slate-300">Your bid (USD)</span>
        <div className="mt-1 flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3 focus-within:border-brand">
          <span className="text-slate-500">$</span>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            placeholder="0.00"
            className="w-full bg-transparent px-2 py-2 text-white outline-none"
          />
        </div>
      </label>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:bg-brand-dark hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] disabled:opacity-50 disabled:shadow-none"
      >
        {loading ? "Submitting…" : "Submit final bid"}
      </button>
    </form>
  );
}
