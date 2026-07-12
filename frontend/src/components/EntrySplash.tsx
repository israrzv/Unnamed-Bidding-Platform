"use client";

import { useEffect, useState } from "react";
import { ParticleText } from "@/components/ParticleText";

type Phase = "guitar" | "morph" | "title" | "sand" | "done";

/** Module guard so the sequence schedules exactly once (survives Strict Mode
 *  double-invoke and client-side re-renders). */
let entryHasRun = false;

/**
 * App-entry splash. Plays once per browser-tab session, only after a user
 * enters the app (guest / Google / email sign-in all land on an (app) page).
 * Sequence: guitar → morphs into a glowing circle → slides into "BidFair" →
 * the word disintegrates into sand and blows off screen, then the app shows.
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
      if (sessionStorage.getItem("bidfair:entry-seen-v2")) {
        setPhase("done");
        return;
      }
      sessionStorage.setItem("bidfair:entry-seen-v2", "1");
    } catch {
      /* ignore */
    }

    const t1 = setTimeout(() => setPhase("morph"), 1500);
    const t2 = setTimeout(() => setPhase("title"), 2300);
    const t3 = setTimeout(() => setPhase("sand"), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      id="entry-splash"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* Guitar */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          phase === "guitar"
            ? "scale-100 opacity-100"
            : "scale-0 rotate-[220deg] opacity-0"
        }`}
      >
        <div className="animate-bob">
          <Guitar />
        </div>
      </div>

      {/* Glowing circle */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          phase === "morph"
            ? "scale-100 opacity-100"
            : phase === "guitar"
            ? "scale-0 opacity-0"
            : "-translate-x-[70vw] opacity-0"
        }`}
      >
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_60px_rgba(52,211,153,0.5)]" />
      </div>

      {/* BidFair title slides in */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          phase === "title"
            ? "translate-x-0 opacity-100"
            : phase === "sand"
            ? "opacity-0"
            : "translate-x-[70vw] opacity-0"
        }`}
      >
        <span className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
          Bid<span className="text-emerald-400">Fair</span>
        </span>
      </div>

      {/* Sand disintegration */}
      {phase === "sand" && (
        <ParticleText text="BidFair" onComplete={() => setPhase("done")} />
      )}
    </div>
  );
}

/** Clean electric-guitar silhouette (no figure), amber body with soundhole. */
function Guitar() {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* neck */}
      <line
        x1="118"
        y1="128"
        x2="196"
        y2="52"
        stroke="#f59e0b"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* headstock */}
      <path d="M194 46 l16 -11 l5 9 l-15 11 z" fill="#f59e0b" />
      {/* body (double-cutaway) */}
      <path
        d="M92 96 C60 96 46 124 58 152 C67 173 92 182 112 172 C127 165 129 150 141 140 C154 129 163 121 158 104 C153 88 132 86 118 94 C110 98 106 92 92 96 Z"
        fill="#f59e0b"
      />
      {/* soundhole */}
      <circle cx="86" cy="140" r="10" fill="#171613" />
      {/* bridge */}
      <rect
        x="120"
        y="118"
        width="20"
        height="6"
        rx="2"
        fill="#171613"
        transform="rotate(-38 130 121)"
      />
      {/* strings */}
      <line x1="88" y1="140" x2="196" y2="52" stroke="#fde68a" strokeWidth="1.4" />
      <line x1="92" y1="146" x2="198" y2="56" stroke="#fde68a" strokeWidth="1.4" />

      {/* music notes */}
      <text
        x="176"
        y="104"
        fill="#34d399"
        fontSize="22"
        className="animate-note-float"
        style={{ animationDelay: "0.1s" }}
      >
        ♪
      </text>
      <text
        x="198"
        y="88"
        fill="#22d3ee"
        fontSize="16"
        className="animate-note-float"
        style={{ animationDelay: "0.55s" }}
      >
        ♫
      </text>
    </svg>
  );
}
