import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureRow } from "@/components/ui/FeatureRow";
import { CATEGORIES } from "@/lib/categories";

export default function CategoriesPage() {
  return (
    <div className="space-y-12">
      <Reveal>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Categories</h1>
          <p className="mt-1 text-zinc-400">Browse every kind of event on BidFair.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map(({ name, count, img, Icon, blurb }, i) => (
          <Reveal key={name} delay={i * 60}>
            <TiltCard>
              <Link
                href="/events"
                className="group block overflow-hidden rounded-2xl border border-zinc-800/80 bg-black transition-colors hover:border-emerald-500/40"
              >
                <div className="relative h-52 w-full overflow-hidden">
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
                <div className="px-5 py-4">
                  <p className="text-sm text-zinc-400">{blurb}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-zinc-500">{count}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-colors group-hover:border-emerald-500/50 group-hover:text-emerald-400">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <FeatureRow />
      </Reveal>
    </div>
  );
}
