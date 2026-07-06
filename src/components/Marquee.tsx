import type { ReactNode } from "react";

/**
 * A full-bleed banner whose contents scroll horizontally forever.
 *
 * The items are rendered as one "track", then the whole track is duplicated.
 * The CSS animation translates the row by exactly -50% (one full track width),
 * so the second copy lands exactly where the first started — a seamless,
 * never-stopping loop with no visible jump or reset.
 */
export function Marquee({
  items,
  speedSeconds = 30,
}: {
  items: ReactNode[];
  speedSeconds?: number;
}) {
  if (items.length === 0) return null;

  // Ensure the track is always wider than the viewport so there is never a
  // visible gap, even when there are only a couple of items.
  const minItems = 8;
  let base = items;
  while (base.length < minItems) {
    base = [...base, ...items];
  }

  const track = [...base, ...base];

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      <div
        className="flex w-max animate-marquee items-center whitespace-nowrap py-2 will-change-transform"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {track.map((item, i) => (
          <span key={i} className="mx-6 flex items-center text-xs font-medium text-slate-300">
            {item}
            <span className="ml-6 text-slate-700">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
