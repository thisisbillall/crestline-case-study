"use client";

/** A four point sparkle. Two stars, the second small and offset, so the mark
 *  reads as "intelligence" rather than as a generic star rating. */
export function Sparkle({ className = "size-[13px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M11 3.2c.3 3.6 1.8 5.2 5.2 5.6-3.4.4-4.9 2-5.2 5.6-.3-3.6-1.8-5.2-5.2-5.6 3.4-.4 4.9-2 5.2-5.6Z"
        fill="currentColor"
      />
      <path
        d="M17.6 14.4c.16 1.9.95 2.75 2.75 2.95-1.8.2-2.59 1.05-2.75 2.95-.16-1.9-.95-2.75-2.75-2.95 1.8-.2 2.59-1.05 2.75-2.95Z"
        fill="currentColor"
        opacity=".62"
      />
    </svg>
  );
}

/**
 * THE TRIGGER, ON EVERY CHART.
 *
 * Quiet until it is wanted: a hairline pill that warms to the accent on hover.
 * An opinion that appears unbidden reads as decoration, one the reader asked
 * for reads as work, so the drawer never opens on its own.
 */
export function SparkButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ask Crestline about ${label}`}
      className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-edge bg-card px-3 py-1.5 text-[12px] font-semibold text-muted transition-all duration-200 hover:-translate-y-px hover:border-accent hover:text-accent"
    >
      <span className="text-accent transition-transform duration-300 group-hover:rotate-[18deg] group-hover:scale-110">
        <Sparkle />
      </span>
      Ask Crestline
    </button>
  );
}
