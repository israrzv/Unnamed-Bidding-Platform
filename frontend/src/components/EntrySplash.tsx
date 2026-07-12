"use client";

import { useEffect, useState } from "react";
import { VaporizeText } from "@/components/ui/vaporize-text";

type Phase = "guitar" | "morph" | "title" | "sand" | "done";

/** Module guard so the sequence schedules exactly once (survives Strict Mode
 *  double-invoke and client re-renders). */
let entryHasRun = false;

/**
 * App-entry splash. Plays once per browser-tab session, only after a user
 * enters the app (guest / Google / email sign-in all land on an (app) page).
 * Sequence: guitar → morphs into a glowing orb → the orb slides away as
 * "BidFair" slides in → the word disintegrates into sand, then the app shows.
 */
export function EntrySplash() {
  const [phase, setPhase] = useState<Phase>("guitar");

  useEffect(() => {
    if (entryHasRun) {
      setPhase("done");
      return;
    }
    entryHasRun = true;

    try {
      if (sessionStorage.getItem("bidfair:entry-seen-v3")) {
        setPhase("done");
        return;
      }
      sessionStorage.setItem("bidfair:entry-seen-v3", "1");
    } catch {
      /* ignore */
    }

    const timers = [
      setTimeout(() => setPhase("morph"), 1700),
      setTimeout(() => setPhase("title"), 2600),
      setTimeout(() => setPhase("sand"), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      id="entry-splash"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* soft ambient glow */}
      <div className="pointer-events-none absolute h-[40vmin] w-[40vmin] rounded-full bg-emerald-500/10 blur-[120px]" />

      {/* Guitar */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
          phase === "guitar"
            ? "scale-100 opacity-100"
            : "scale-50 opacity-0 blur-sm"
        }`}
      >
        <span
          className="animate-bob select-none text-[9rem] leading-none sm:text-[13rem]"
          style={{ filter: "drop-shadow(0 0 40px rgba(52,211,153,0.35))" }}
        >
          🎸
        </span>
      </div>

      {/* Glowing orb */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
          phase === "morph"
            ? "scale-100 opacity-100"
            : phase === "guitar"
            ? "scale-0 opacity-0"
            : "-translate-x-[80vw] scale-75 opacity-0"
        }`}
      >
        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-emerald-300 via-cyan-400 to-blue-500 shadow-[0_0_80px_rgba(52,211,153,0.6)]" />
      </div>

      {/* BidFair title slides in (hidden once the vapor takes over) */}
      {phase !== "sand" && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-[600ms] ease-out ${
            phase === "title"
              ? "translate-x-0 opacity-100"
              : "translate-x-[80vw] opacity-0"
          }`}
        >
          <span className="text-6xl font-extrabold tracking-tight text-white sm:text-8xl">
            Bid<span className="text-emerald-400">Fair</span>
          </span>
        </div>
      )}

      {/* Fine-particle vaporize: "BidFair" dissolves into tiny granules */}
      {phase === "sand" && (
        <VaporizeText
          segments={[
            { text: "Bid", color: "#ffffff" },
            { text: "Fair", color: "#34d399" },
          ]}
          onComplete={() => setPhase("done")}
        />
      )}
    </div>
  );
}
