"use client";

import { useState } from "react";
import { ParticleText } from "@/components/ParticleText";

/** Guard so the splash only ever plays once per full page load, not on
 *  client-side navigations within the app. */
let entryHasRun = false;

/**
 * App-entry splash: plays the "BidFair" disintegrate once per browser session
 * (any auth method lands here). Uses sessionStorage so reloads within the same
 * session skip it; an inline script in the layout hides #entry-splash before
 * first paint for already-seen sessions to avoid a flash.
 */
export function EntrySplash() {
  const [phase, setPhase] = useState<"playing" | "reveal" | "done">(() => {
    if (typeof window === "undefined") return "playing";
    if (entryHasRun) return "done";
    try {
      if (sessionStorage.getItem("bidfair:entry-seen")) {
        entryHasRun = true;
        return "done";
      }
      sessionStorage.setItem("bidfair:entry-seen", "1");
    } catch {
      /* ignore */
    }
    entryHasRun = true;
    return "playing";
  });

  if (phase === "done") return null;

  return (
    <div
      id="entry-splash"
      className={`fixed inset-0 z-[100] bg-zinc-950 transition-opacity duration-500 ${
        phase === "reveal" ? "opacity-0" : "opacity-100"
      }`}
    >
      <ParticleText
        onComplete={() => {
          setPhase("reveal");
          setTimeout(() => setPhase("done"), 600);
        }}
      />
    </div>
  );
}
