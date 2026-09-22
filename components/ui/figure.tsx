import type { ReactNode } from "react";

/**
 * A FIGURE, UNDERLINED BY ITS OWN SENTIMENT.
 *
 * The emphasis rule under a number is the one piece of colour in running copy,
 * so it has to mean something: green where the figure is a gain and red where
 * it is a cost. A single colour for every figure, or a neutral rule, tells the
 * reader nothing and makes the page look decorated rather than argued.
 *
 * The number itself stays ink. Colour goes under it, never through it.
 */
const BASE =
  "font-display font-extrabold text-ink underline decoration-[3px] underline-offset-[6px]";

/** A gain: days removed, cash released, a gap closed. */
export function Good({ children }: { children: ReactNode }) {
  return <span className={`${BASE} decoration-accent`}>{children}</span>;
}

/** A cost: carry absorbed, days waited, money still trapped. */
export function Bad({ children }: { children: ReactNode }) {
  return <span className={`${BASE} decoration-bad`}>{children}</span>;
}
