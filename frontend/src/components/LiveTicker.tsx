const TICKER_EVENTS = [
  "🔥 Gladiator @Yug_P just reinforced their stance",
  "⚔️ Squad 'Vipers' entered the Arena",
  "💠 @midnight_raven locked a spot in the Vault",
  "⚡ Clearing price ticked up in 'Neon Nights'",
  "🏟️ 3 new challengers joined the Pit",
  "🛡️ @sara.k defended Rank 42",
];

/**
 * A thin, full-bleed marquee pinned above the navbar. The event list is
 * rendered twice and the track is translated by exactly -50%, so the loop is
 * seamless and never stops or jumps.
 */
export function LiveTicker() {
  const items = [...TICKER_EVENTS, ...TICKER_EVENTS];

  return (
    <div className="w-full overflow-hidden border-b border-zinc-800/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="flex w-max animate-marquee items-center whitespace-nowrap py-1.5">
        {items.map((event, i) => (
          <span key={i} className="mx-6 flex items-center text-[11px] font-medium tracking-wide text-zinc-400">
            <span className="text-cyan-400/90">{event}</span>
            <span className="ml-6 text-zinc-700">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
