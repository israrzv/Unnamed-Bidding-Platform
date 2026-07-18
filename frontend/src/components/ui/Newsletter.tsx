"use client";

import { Mail } from "lucide-react";

/** "Stay in the loop" newsletter strip with a hover-reactive mail icon.
 *  UI only — not wired to a backend. */
export function Newsletter() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md sm:flex-row sm:items-center">
      <div className="group flex cursor-default items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-6 group-hover:border-emerald-400/60 group-hover:bg-emerald-500/20">
          <Mail className="h-5 w-5" />
        </div>
        <div className="transition-transform duration-300 group-hover:translate-x-1">
          <p className="text-sm font-semibold text-white">Stay in the loop</p>
          <p className="text-sm text-zinc-500">Get early access to drops and exclusive updates.</p>
        </div>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex w-full items-center gap-2 sm:w-auto"
      >
        <input
          type="email"
          placeholder="Enter your email"
          suppressHydrationWarning
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 sm:w-64"
        />
        <button className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400">
          Subscribe
        </button>
      </form>
    </div>
  );
}
