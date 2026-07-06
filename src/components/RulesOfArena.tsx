export function RulesOfArena() {
  const rules = [
    {
      icon: "⚖️",
      title: "Uniform-price auction",
      body: "You only pay the lowest winning bid price — not your max bid.",
    },
    {
      icon: "💸",
      title: "Instant refunds",
      body: "If the 100th spot clears lower than your bid, you are instantly refunded the difference.",
    },
    {
      icon: "🔒",
      title: "One bid, sealed",
      body: "Everyone bids once, privately. No sniping, no bidding wars, no scalpers.",
    },
    {
      icon: "🏆",
      title: "Top bids win",
      body: "When the sale closes, the highest bidders claim the tickets. Simple and fair.",
    },
  ];

  return (
    <aside className="rounded-xl border border-brand/30 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6">
      <div className="flex items-center gap-2">
        <span className="text-lg">🛡️</span>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-light">
          Rules of the Arena
        </h2>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        A fair, escrow-based model built to keep scalpers out.
      </p>

      <ul className="mt-5 space-y-4">
        {rules.map((rule) => (
          <li key={rule.title} className="flex gap-3">
            <span className="mt-0.5 text-base">{rule.icon}</span>
            <div>
              <p className="text-sm font-medium text-white">{rule.title}</p>
              <p className="text-sm text-slate-400">{rule.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-300/90">
        Funds are held in escrow and only captured if you win. Losing bids are
        never charged.
      </div>
    </aside>
  );
}
