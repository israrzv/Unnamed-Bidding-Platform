"use client";

import { useEffect, useState } from "react";
import { VaporizeText } from "@/components/ui/vaporize-text";

type Phase = "vapor" | "reveal" | "done";

/**
 * Module guard: set true after the splash has played for this page load. It
 * survives client-side navigation (the SPA never reloads the module) but resets
 * on a real page load / reload — so the intro plays every time you ENTER the
 * site, but not when moving between pages inside the app.
 */
let entryHasRun = false;

/**
 * App-entry splash: shows "BidFair" and dissolves it into fine particles, then
 * slides away to reveal the app. Plays on every fresh entry into the app
 * (first paint of a full page load), whether the user just logged in or is
 * already signed in and re-opening the site.
 */
export function EntrySplash() {
  // Decided synchronously so client-side navigations (entryHasRun already true)
  // render nothing — no overlay flash between app pages. On a full page load
  // entryHasRun is false, so SSR + first paint show the splash (no app flash).
  const [phase, setPhase] = useState<Phase>(() => (entryHasRun ? "done" : "vapor"));

  useEffect(() => {
    entryHasRun = true;
  }, []);

  if (phase === "done") return null;

  return (
    <div
      id="entry-splash"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-zinc-950 transition-all duration-700 ease-in-out ${
        phase === "reveal" ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <VaporizeText
        segments={[
          { text: "Bid", color: "#ffffff" },
          { text: "Fair", color: "#34d399" },
        ]}
        onComplete={() => {
          setPhase("reveal");
          setTimeout(() => setPhase("done"), 700);
        }}
      />
    </div>
  );
}
