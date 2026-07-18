"use client";

import { useState } from "react";
import { User, Wallet, Ticket } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TiltCard } from "@/components/TiltCard";
import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
  Visual3,
} from "@/components/ui/animated-card-chart";

const CARD = "rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md";

const TABS = [
  { id: "identity", label: "Identity", icon: User },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "allocations", label: "Allocations", icon: Ticket },
] as const;

type TabId = (typeof TABS)[number]["id"];

const REFUNDS = [
  { label: "Escrow deposit — Neon Nights", amount: "+₹12,000" },
  { label: "Threshold cleared low — refund", amount: "+₹3,500" },
  { label: "Allocation secured — Circuit", amount: "−₹8,500" },
];

export function ProfileTabs({
  username,
  email,
}: {
  username: string;
  email: string;
}) {
  const [tab, setTab] = useState<TabId>("identity");
  const [name, setName] = useState(username);
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function saveIdentity() {
    setSaveState("saving");
    const { error } = await createClient().auth.updateUser({
      data: { user_name: name, phone },
    });
    if (error) {
      setSaveState("error");
      return;
    }
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2500);
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-zinc-800/80">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
                active
                  ? "border-zinc-100 text-white"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "identity" && (
          <div className={`${CARD} max-w-lg p-6`}>
            <Field label="Name" value={name} onChange={setName} />
            <div className="mt-4">
              <Field label="Phone" value={phone} onChange={setPhone} />
            </div>
            <div className="mt-4">
              <Field label="Email" value={email} readOnly />
            </div>
            {saveState === "error" && (
              <p className="mt-3 text-sm text-rose-400">Couldn&apos;t save. Please try again.</p>
            )}
            <button
              onClick={saveIdentity}
              disabled={saveState === "saving"}
              className="mt-5 rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white disabled:opacity-60"
            >
              {saveState === "saving"
                ? "Saving…"
                : saveState === "saved"
                ? "Saved ✓"
                : "Save changes"}
            </button>
          </div>
        )}

        {tab === "wallet" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <TiltCard className="flex-1">
                <div className={`${CARD} h-full p-6`}>
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                    Escrow balance
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-white">₹24,500</p>
                  <p className="mt-1 text-sm text-zinc-500">Held across your active pledges</p>
                </div>
              </TiltCard>
              <TiltCard className="w-full sm:w-[356px]">
                <AnimatedCard>
                  <CardVisual>
                    <Visual3 mainColor="#10b981" secondaryColor="#22d3ee" />
                  </CardVisual>
                  <CardBody>
                    <CardTitle>Saved from scalpers</CardTitle>
                    <CardDescription>What you kept by paying the fair clearing price.</CardDescription>
                  </CardBody>
                </AnimatedCard>
              </TiltCard>
            </div>
            <TiltCard>
              <div className={`${CARD} p-6`}>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Instant refund log
                </p>
                <ul className="mt-4 divide-y divide-zinc-800/80">
                  {REFUNDS.map((r) => (
                    <li key={r.label} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-zinc-400">{r.label}</span>
                      <span className="font-medium tabular-nums text-white">{r.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </div>
        )}

        {tab === "allocations" && (
          <TiltCard>
            <div className={`${CARD} p-6`}>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Secured entry codes
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800 text-center transition-colors hover:border-emerald-500/40"
                  >
                    <Ticket className="h-5 w-5 text-zinc-700" />
                    <span className="text-xs text-zinc-600">No allocation yet</span>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-zinc-500">{label}</span>
      <input
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        suppressHydrationWarning
        className={`mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-white outline-none focus:border-zinc-600 ${
          readOnly ? "cursor-not-allowed text-zinc-400" : ""
        }`}
      />
    </label>
  );
}
