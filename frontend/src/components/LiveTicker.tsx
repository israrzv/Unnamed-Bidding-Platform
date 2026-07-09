const TICKER_EVENTS = [
  "@rahul secured an allocation in Neon Nights",
  "Squad 'Vipers' entered the Arena",
  "Threshold shifted in Neon Nights",
  "@sara raised their pledge",
  "3 allocations secured in the last hour",
];

/** A quiet single-line status strip above the nav. Static, understated. */
export function LiveTicker() {
  const items = [...TICKER_EVENTS, ...TICKER_EVENTS];

  return (
    <div className="w-full overflow-hidden border-b border-zinc-800/80 bg-zinc-950">
      <div className="flex w-max animate-marquee items-center whitespace-nowrap py-1.5">
        {items.map((event, i) => (
          <span key={i} className="mx-5 flex items-center text-xs text-zinc-500">
            <span className="mr-2 h-1 w-1 rounded-full bg-zinc-600" />
            {event}
          </span>
        ))}
      </div>
    </div>
  );
}
