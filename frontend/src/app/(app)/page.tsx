import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ActiveArenas } from "@/components/ActiveArenas";
import { TiltCard } from "@/components/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureRow } from "@/components/ui/FeatureRow";
import { CATEGORIES } from "@/lib/categories";
import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
  Visual3,
} from "@/components/ui/animated-card-chart";

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Immersive hero */}
      <Reveal>
        <section className="relative overflow-hidden rounded-2xl border border-zinc-800/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/categories/concerts.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/30" />

          <div className="relative grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                Scalpers pocket the markup.
                <br />
                <span className="text-emerald-400">BidFair hands it back to you.</span>
              </h1>
              <p className="mt-4 max-w-md text-zinc-300/90">
                One sealed pledge, a single fair clearing price for everyone. No resale
                gouging, no bots — just the value scalpers would have skimmed, kept in
                your pocket.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
                >
                  Browse events <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/40 px-5 py-2.5 text-sm font-medium text-zinc-200 backdrop-blur-sm transition-colors hover:border-zinc-500 hover:text-white"
                >
                  <Play className="h-3.5 w-3.5" /> How it works
                </Link>
              </div>
            </div>

            {/* Stats / chart card (our chart, no fabricated figures) */}
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
          </div>
        </section>
      </Reveal>

      <ActiveArenas />

      {/* Categories */}
      <Reveal>
        <section>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-lg font-semibold tracking-tight text-white">Browse by category</h2>
            <Link
              href="/categories"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              View all categories →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(({ name, count, img, Icon }, i) => (
              <Reveal key={name} delay={i * 60}>
                <TiltCard>
                  <Link
                    href="/events"
                    className="group block overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 transition-colors hover:border-emerald-500/40"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                      <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950/70 text-emerald-400 backdrop-blur-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="absolute bottom-3 left-4 text-xl font-semibold text-white drop-shadow">
                        {name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4">
                      <span className="text-sm text-zinc-500">{count}</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-colors group-hover:border-emerald-500/50 group-hover:text-emerald-400">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <FeatureRow />
      </Reveal>
    </div>
  );
}
