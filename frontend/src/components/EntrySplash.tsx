"use client";

import { useEffect, useState } from "react";
import { VaporizeText } from "@/components/ui/vaporize-text";

type Phase = "vapor" | "done";

/** Module guard so the splash schedules exactly once per load. */
let entryHasRun = false;

/**
 * App-entry splash. Plays once per browser-tab session, only after a user
 * enters the app (guest / Google / email sign-in all land on an (app) page).
 * Shows "BidFair" and dissolves it into fine particles, then reveals the app.
 */
export function EntrySplash() {
  const [phase, setPhase] = useState<Phase>("vapor");

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
  }, []);

  if (phase === "done") return null;

  return (
    <div
      id="entry-splash"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      <VaporizeText
        segments={[
          { text: "Bid", color: "#ffffff" },
          { text: "Fair", color: "#34d399" },
        ]}
        onComplete={() => setPhase("done")}
      />
    </div>
  );
}
