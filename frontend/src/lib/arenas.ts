export type ArenaMeta = {
  id: string;
  name: string;
  venue: string;
  spots: number;
  day: string; // e.g. "12"
  month: string; // e.g. "JUL"
  time: string; // e.g. "7:30 PM"
  img: string;
};

export const ARENA_CATALOG: ArenaMeta[] = [
  {
    id: "neon-nights",
    name: "Neon Nights — Arena Drop",
    venue: "NSCI Dome, Mumbai",
    spots: 100,
    day: "12",
    month: "JUL",
    time: "7:30 PM",
    img: "/categories/concerts.jpg",
  },
  {
    id: "desert-mirage",
    name: "Desert Mirage — Day 1",
    venue: "Jaipur",
    spots: 150,
    day: "18",
    month: "JUL",
    time: "7:30 PM",
    img: "/categories/festivals.jpg",
  },
  {
    id: "midnight-circuit",
    name: "Midnight Circuit — Finals",
    venue: "Delhi",
    spots: 60,
    day: "22",
    month: "JUL",
    time: "9:00 PM",
    img: "/categories/clubnights.jpg",
  },
  {
    id: "rooftop-3",
    name: "Rooftop Sessions Vol. 3",
    venue: "Delhi",
    spots: 80,
    day: "25",
    month: "JUL",
    time: "8:00 PM",
    img: "/categories/comedy.jpg",
  },
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
      day: "--",
      month: "",
      time: "--",
      img: "/categories/concerts.jpg",
    }
  );
}
