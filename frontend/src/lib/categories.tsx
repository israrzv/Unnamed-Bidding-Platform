import {
  Music,
  Disc3,
  PartyPopper,
  Mic,
  Trophy,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  name: string;
  count: string;
  img: string;
  Icon: LucideIcon;
  blurb: string;
};

export const CATEGORIES: Category[] = [
  { name: "Concerts", count: "---- live events", img: "/categories/concerts.jpg", Icon: Music, blurb: "Arena tours and headline live shows." },
  { name: "Club Nights", count: "---- live events", img: "/categories/clubnights.jpg", Icon: Disc3, blurb: "Late-night sets and underground lineups." },
  { name: "Festivals", count: "---- upcoming", img: "/categories/festivals.jpg", Icon: PartyPopper, blurb: "Multi-day, multi-stage experiences." },
  { name: "Comedy", count: "---- upcoming", img: "/categories/comedy.jpg", Icon: Mic, blurb: "Stand-up specials and comedy nights." },
  { name: "Sports", count: "---- live event", img: "/categories/sports.jpg", Icon: Trophy, blurb: "Finals, derbies and marquee fixtures." },
  { name: "Theatre", count: "---- upcoming", img: "/categories/theatre.jpg", Icon: Clapperboard, blurb: "Plays, musicals and stage productions." },
];
