import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md";

const LEDGER = [
  { label: "Escrow deposit — Neon Nights", amount: "+₹12,000", tone: "cyan" },
  { label: "Winning clearing — Circuit GA", amount: "−₹8,500", tone: "zinc" },
  { label: "Instant refund — cutoff cleared low", amount: "+₹3,500", tone: "violet" },
];

const toneText: Record<string, string> = {
  cyan: "text-cyan-400",
  violet: "text-violet-400",
  zinc: "text-zinc-300",
};

function initialsFrom(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, "").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const displayName = user.username || user.email || "user";
  const initials = initialsFrom(displayName);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-xl font-bold text-white ring-2 ring-violet-500/30">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{displayName}</h1>
            <p className="text-sm text-zinc-400">Identity &amp; Vault</p>
          </div>
        </div>
        <SignOutButton className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-rose-500/40 hover:text-rose-400 disabled:opacity-50" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal profile details */}
        <section className={CARD}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-400">Profile Details</h2>
          <div className="mt-5 space-y-4">
            <Field label="Display name" defaultValue={user.username} />
            <Field label="Email" defaultValue={user.email ?? ""} />
            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-500">Avatar</span>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                  {initials}
                </div>
                <button className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-violet-500/40 hover:text-white">
                  Upload new
                </button>
              </div>
            </div>
            <button className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300 hover:bg-violet-700 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]">
              Save changes
            </button>
          </div>
        </section>

        {/* Financial ledger vault (mock data) */}
        <section className={CARD}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Financial Ledger Vault</h2>
          <div className="mt-5 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.04] p-4">
            <p className="text-xs text-zinc-400">Locked in escrow</p>
            <p className="mt-1 text-3xl font-bold text-cyan-400">₹24,500</p>
          </div>
          <ul className="mt-4 divide-y divide-zinc-800/80">
            {LEDGER.map((row) => (
              <li key={row.label} className="flex items-center justify-between py-3 text-sm">
                <span className="text-zinc-400">{row.label}</span>
                <span className={`font-medium tabular-nums ${toneText[row.tone]}`}>{row.amount}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Secure ticket wallet (empty state) */}
      <section className={CARD}>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-400">Secure Ticket Wallet</h2>
        <p className="mt-1 text-sm text-zinc-400">Won tickets appear here as dynamic QR entry codes.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700/70 bg-zinc-950/40 text-center"
            >
              <span className="text-2xl text-zinc-700">▦</span>
              <span className="text-xs text-zinc-600">No ticket yet</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-zinc-500">{label}</span>
      <input
        defaultValue={defaultValue}
        suppressHydrationWarning
        className="mt-2 w-full rounded-lg border border-zinc-800/80 bg-zinc-950/60 px-3 py-2.5 text-white outline-none focus:border-violet-500/60"
      />
    </label>
  );
}
