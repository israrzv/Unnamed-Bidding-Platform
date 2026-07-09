export type Zone = "blue" | "green" | "yellow" | "red";

export const YELLOW_ENTRY = 550;
export const GREEN_ENTRY = 900;
export const BLUE_ENTRY = 1700;

export function zoneFor(pledge: number): Zone {
  if (pledge >= BLUE_ENTRY) return "blue";
  if (pledge >= GREEN_ENTRY) return "green";
  if (pledge >= YELLOW_ENTRY) return "yellow";
  return "red";
}

/** Guidance to climb to the next zone — no clearing/threshold price revealed. */
export function nextZoneHint(pledge: number): string {
  if (pledge < YELLOW_ENTRY) return `Raise to ₹${YELLOW_ENTRY} to secure an allocation.`;
  if (pledge < GREEN_ENTRY) return `Raise to ₹${GREEN_ENTRY} to reach the Green (Safe) Zone.`;
  if (pledge < BLUE_ENTRY)
    return `Raise to ₹${BLUE_ENTRY.toLocaleString("en-IN")} to reach the Blue (Vanguard) Zone.`;
  return "You hold a Vanguard position at the front of the arena.";
}

export const ZONE: Record<
  Zone,
  { border: string; text: string; badge: string; dot: string; label: string; status: string }
> = {
  blue: {
    border: "border-blue-500/30",
    text: "text-cyan-400",
    badge: "bg-blue-500/10 text-cyan-400 border-blue-500/20",
    dot: "bg-cyan-400",
    label: "Blue Zone — The Vanguard",
    status: "Vanguard Position — Front of the Arena",
  },
  green: {
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
    label: "Green Zone — Safe",
    status: "Allocation Secured — Within Safe Threshold",
  },
  yellow: {
    border: "border-amber-500/40",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
    label: "Yellow Zone — Warning",
    status: "Warning — Near the Edge",
  },
  red: {
    border: "border-rose-500/50",
    text: "text-rose-400",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    dot: "bg-rose-500",
    label: "Red Zone — Below Threshold",
    status: "Below Threshold — Allocation at Risk",
  },
};

export const ZONE_BG: Record<Zone, string> = {
  blue: "bg-[radial-gradient(circle_at_center,_#1e58a8_0%,_#0e2647_55%,_#0a1526_100%)]",
  green: "bg-[radial-gradient(circle_at_center,_#12764f_0%,_#0c3b28_55%,_#08160f_100%)]",
  yellow: "bg-[radial-gradient(circle_at_center,_#8a6a12_0%,_#4a3a0c_55%,_#1c1606_100%)]",
  red: "bg-[radial-gradient(circle_at_center,_#9a2338_0%,_#4f1420_55%,_#1f0a10_100%)]",
};
