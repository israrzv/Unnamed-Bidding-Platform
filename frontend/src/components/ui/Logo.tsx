/** BidFair wordmark with a small green swirl mark. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M16 3c7.18 0 13 5.82 13 13 0 5.4-4.9 8.5-9 8.5-3.6 0-6-2.2-6-5 0-2.3 1.7-4 4-4 1.9 0 3 1.1 3 2.6"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="20" r="3" fill="#34d399" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-white">
        Bid<span className="text-emerald-400">Fair</span>
      </span>
    </span>
  );
}
