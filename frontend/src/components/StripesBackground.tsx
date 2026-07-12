/** Slanted bands of colour that slowly drift through the spectrum. */
export function StripesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-950">
      <div
        className="absolute inset-0 animate-hue-slow"
        style={{
          opacity: 0.22,
          backgroundImage:
            "repeating-linear-gradient(45deg, #34d399 0px, #34d399 26px, #22d3ee 26px, #22d3ee 52px, #60a5fa 52px, #60a5fa 78px, #a78bfa 78px, #a78bfa 104px, #f472b6 104px, #f472b6 130px)",
        }}
      />
      <div className="absolute inset-0 bg-zinc-950/50" />
    </div>
  );
}
