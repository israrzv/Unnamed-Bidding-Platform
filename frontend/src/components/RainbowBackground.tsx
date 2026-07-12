/** A calm gradient backdrop whose colours drift slowly through a rainbow. */
export function RainbowBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 animate-hue-slow bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-600 opacity-60" />
      <div className="absolute inset-0 bg-zinc-950/55" />
    </div>
  );
}
