import Link from "next/link";
import { ActiveArenas } from "@/components/ActiveArenas";
import { TiltCard } from "@/components/TiltCard";
import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
  Visual3,
} from "@/components/ui/animated-card-chart";

const CATEGORIES = [
  { name: "Concerts", count: "4 live", img: "/categories/concerts.jpg" },
  { name: "Club Nights", count: "2 live", img: "/categories/clubnights.jpg" },
  { name: "Festivals", count: "1 upcoming", img: "/categories/festivals.jpg" },
  { name: "Comedy", count: "3 upcoming", img: "/categories/comedy.jpg" },
  { name: "Sports", count: "1 live", img: "/categories/sports.jpg" },
  { name: "Theatre", count: "2 upcoming", img: "/categories/theatre.jpg" },
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      {/* Hero with animated chart */}
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Anti-scalper pricing
          </span>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Scalpers pocket the markup. <br className="hidden sm:block" />
            BidFair hands it back to you.
          </h1>
          <p className="mt-4 max-w-md text-zinc-400">
            One sealed pledge, a single fair clearing price for everyone. No resale
            gouging, no bots — just the value scalpers would have skimmed, kept in
            your pocket.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link
              href="/events"
              className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white"
            >
              Browse events
            </Link>
            <Link href="/arena" className="text-sm text-zinc-400 transition-colors hover:text-white">
              My arenas →
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <TiltCard>
            <AnimatedCard>
              <CardVisual>
                <Visual3 mainColor="#10b981" secondaryColor="#22d3ee" />
              </CardVisual>
              <CardBody>
                <CardTitle>Saved from scalpers</CardTitle>
                <CardDescription>
                  What buyers kept this month by paying the fair clearing price.
                </CardDescription>
              </CardBody>
            </AnimatedCard>
          </TiltCard>
        </div>
      </section>

      <ActiveArenas />

      {/* Categories with imagery */}
      <section>
        <h2 className="border-b border-zinc-800/80 pb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Browse by category
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map(({ name, count, img }) => (
            <TiltCard key={name}>
              <Link
                href="/events"
                className="group block overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 transition-colors hover:border-zinc-700"
              >
                <div className="relative h-28 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <p className="absolute bottom-2 left-3 text-lg font-semibold text-white drop-shadow">
                    {name}
                  </p>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-zinc-400">{count}</span>
                  <span className="text-xs text-zinc-500 transition-colors group-hover:text-zinc-300">
                    Browse →
                  </span>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>
    </div>
  );
}
