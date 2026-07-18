import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActiveArenas } from "@/components/ActiveArenas";
import { TiltCard } from "@/components/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureRow } from "@/components/ui/FeatureRow";
import { Newsletter } from "@/components/ui/Newsletter";
import { HomeFeatures } from "@/components/HomeFeatures";
import { CATEGORIES } from "@/lib/categories";

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Feature showcase hero — inside a solid black panel */}
      <Reveal>
        <section className="rounded-2xl border border-zinc-800/80 bg-black p-6 sm:p-10">
          <HomeFeatures />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              Browse events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/arena"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
            >
              My arenas
            </Link>
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
                    className="group block overflow-hidden rounded-2xl border border-zinc-800/80 bg-black transition-colors hover:border-emerald-500/40"
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

      <Reveal>
        <Newsletter />
      </Reveal>
    </div>
  );
}
