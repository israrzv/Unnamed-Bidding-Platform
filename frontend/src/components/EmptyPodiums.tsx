import Link from "next/link";

function Podium({
  rank,
  heightClass,
}: {
  rank: number;
  heightClass: string;
}) {
  return (
    <div className="flex w-full max-w-[9rem] flex-col items-center">
      <span className="mb-2 text-xs font-semibold text-slate-500">
        #{rank}
      </span>
      <div
        className={`flex w-full items-center justify-center rounded-t-xl border border-dashed border-slate-700 bg-slate-900/40 ${heightClass}`}
      >
        <svg
          className="h-7 w-7 text-slate-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
    </div>
  );
}

export function EmptyPodiums() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8">
      <p className="text-center text-slate-400">
        No bids yet — the podium is wide open. Claim a spot.
      </p>

      <div className="mx-auto mt-8 flex max-w-md items-end justify-center gap-3 sm:gap-5">
        <Podium rank={2} heightClass="h-24" />
        <Podium rank={1} heightClass="h-36" />
        <Podium rank={3} heightClass="h-20" />
      </div>

      {/* Rank 100 cutoff divider */}
      <div className="mt-10 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/40" />
        <span className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-red-400/80">
          Rank 100 Cutoff
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/40" />
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/bid"
          className="rounded-lg bg-brand px-5 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:bg-brand-dark hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]"
        >
          Claim the first spot
        </Link>
      </div>
    </div>
  );
}
