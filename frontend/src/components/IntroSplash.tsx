"use client";

import { useEffect, useState } from "react";

type Phase = "playing" | "morph" | "title" | "splash" | "done";

// Module-level guard: survives React Strict Mode's double-invoke in dev so the
// sequence is scheduled exactly once (and its timers are never cancelled).
let introHasRun = false;

export function IntroSplash() {
  // Rendered by default (SSR) so a first visit has no site flash. Returning
  // sessions are hidden pre-paint by the inline script + `.intro-seen` CSS.
  const [phase, setPhase] = useState<Phase>("playing");

  useEffect(() => {
    if (introHasRun) return;
    introHasRun = true;

    if (sessionStorage.getItem("bidfair:intro-seen")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("bidfair:intro-seen", "1");
    setTimeout(() => setPhase("morph"), 1700);
    setTimeout(() => setPhase("title"), 2500);
    setTimeout(() => setPhase("splash"), 3500);
    setTimeout(() => setPhase("done"), 4300);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      id="intro-splash"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-zinc-950 transition-opacity duration-700 ${
        phase === "splash" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          phase === "playing" ? "scale-100 opacity-100" : "scale-0 rotate-[220deg] opacity-0"
        }`}
      >
        <div className="animate-bob">
          <Guitarist />
        </div>
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          phase === "morph"
            ? "scale-100 opacity-100"
            : phase === "playing"
            ? "scale-0 opacity-0"
            : "-translate-x-[70vw] opacity-0"
        }`}
      >
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_60px_rgba(52,211,153,0.5)]" />
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          phase === "title"
            ? "translate-x-0 opacity-100"
            : phase === "splash"
            ? "scale-[6] opacity-0"
            : "translate-x-[70vw] opacity-0"
        }`}
      >
        <span className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          Bid<span className="text-emerald-400">Fair</span>
        </span>
      </div>
    </div>
  );
}

/** Bold silhouette of a musician mid-riff with an electric guitar. */
function Guitarist() {
  return (
    <svg width="260" height="260" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Electric guitar — neck */}
      <line x1="126" y1="120" x2="205" y2="52" stroke="#f59e0b" strokeWidth="9" strokeLinecap="round" />
      <path d="M203 46 l14 -10 l4 8 l-13 10 z" fill="#f59e0b" />
      {/* Guitar body (double-cutaway silhouette) */}
      <path
        d="M96 96 C70 96 58 118 66 140 C72 158 92 166 108 158 C120 152 122 140 132 132 C142 124 150 118 146 106 C142 94 124 92 112 98 C106 100 104 96 96 96 Z"
        fill="#f59e0b"
      />
      <circle cx="92" cy="132" r="7" fill="#171613" />
      <rect x="112" y="112" width="16" height="5" rx="2" fill="#171613" transform="rotate(-38 120 114)" />

      {/* Musician silhouette (bold rounded limbs) */}
      {/* head */}
      <circle cx="96" cy="40" r="17" fill="#fafafa" />
      {/* torso */}
      <path d="M96 57 L100 118" stroke="#fafafa" strokeWidth="20" strokeLinecap="round" />
      {/* legs — dynamic stance */}
      <path d="M100 116 L74 186" stroke="#fafafa" strokeWidth="17" strokeLinecap="round" />
      <path d="M100 116 L128 176" stroke="#fafafa" strokeWidth="17" strokeLinecap="round" />
      {/* fretting arm reaching up the neck */}
      <path d="M98 72 L165 60" stroke="#fafafa" strokeWidth="14" strokeLinecap="round" />
      {/* strumming arm (animated) */}
      <g style={{ transformBox: "fill-box", transformOrigin: "top center" }} className="animate-strum">
        <path d="M98 84 L110 120" stroke="#fafafa" strokeWidth="14" strokeLinecap="round" />
      </g>

      {/* music notes */}
      <text x="170" y="100" fill="#34d399" fontSize="20" className="animate-note-float" style={{ animationDelay: "0.1s" }}>♪</text>
      <text x="190" y="86" fill="#22d3ee" fontSize="15" className="animate-note-float" style={{ animationDelay: "0.55s" }}>♫</text>
    </svg>
  );
}
