/** Smooth diagonal gradient (deep navy → violet/magenta) that slowly drifts
 *  through the spectrum. Calm and classy — no harsh bands. */
export function StripesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 animate-hue-slow bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-700 opacity-70" />
      <div className="absolute inset-0 bg-zinc-950/40" />
    </div>
  );
}
