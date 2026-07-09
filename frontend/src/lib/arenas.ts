export type ArenaMeta = {
  id: string;
  name: string;
  venue: string;
  spots: number;
};

export const ARENA_CATALOG: ArenaMeta[] = [
  { id: "neon-nights", name: "Neon Nights — Arena Drop", venue: "NSCI Dome, Mumbai", spots: 100 },
  { id: "desert-mirage", name: "Desert Mirage — Day 1", venue: "Jaipur", spots: 150 },
  { id: "midnight-circuit", name: "Midnight Circuit — Finals", venue: "Delhi", spots: 60 },
  { id: "rooftop-3", name: "Rooftop Sessions Vol. 3", venue: "Delhi", spots: 80 },
];

export function getArena(id: string): ArenaMeta {
  return (
    ARENA_CATALOG.find((a) => a.id === id) ?? {
      id,
      name: id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      venue: "—",
      spots: 100,
    }
  );
}
