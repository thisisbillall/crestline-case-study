import type { ReactNode } from "react";

import { AskAi } from "@/components/ai/ask-ai";
import { Reveal } from "@/components/ui/reveal";

/* ===========================================================================
   The page reads as one document. The sheet below is the paper; everything
   else sits on it quietly, so border, fill and shadow are spent on the one
   object that needs them rather than stamped on every block.
   ========================================================================== */

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mx-auto max-w-[1180px] px-3 sm:px-5 lg:px-7 xl:max-w-[1470px] xl:grid xl:grid-cols-[minmax(0,1fr)_242px] xl:gap-8 ${className}`}
    >
      {children}
    </div>
  );
}

/** The paper. One rounded surface, one shadow, everything inside it. */
export function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 overflow-hidden rounded-[26px] border border-edge bg-card shadow-[var(--shadow-lift)] sm:my-6 sm:rounded-[30px]">
      {children}
    </div>
  );
}

export function Pad({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 sm:px-8 lg:px-14 ${className}`}>{children}</div>;
}

/**
 * ONE BEAT OF THE STORY.
 *
 * The order is the argument: what was wrong, what it is now, then how, then
 * the evidence. A reader who stops after the second block has still been told
 * the result, which is the whole point of putting it second.
 */
export function Beat({
  id,
  problem,
  outcome,
  how,
  children,
}: {
  id?: string;
  problem: ReactNode;
  outcome: ReactNode;
  how: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-hair py-12 sm:py-16 lg:py-20">
      <Pad>
        <Reveal>
          <h2 className="max-w-[20ch] text-[clamp(26px,3.9vw,44px)] font-extrabold leading-[1.1]">
            {problem}
          </h2>
        </Reveal>

        {/*
          THE OUTCOME, AS A PULL QUOTE.

          This was a tinted card with green figures inside it, which is the
          default shape of every callout on the internet and read as cheap
          against the rest of the page. The panel is gone: one hairline rule
          carries the colour, the type does the work, and the figures are
          emphasised by a rule under them rather than by a box around them.
        */}
        <Reveal delay={90}>
          <div className="mt-8 max-w-[58ch] border-l-2 border-accent pl-5 sm:pl-7">
            <p className="text-[clamp(17px,2.05vw,21.5px)] leading-[1.48] text-ink [&_b]:font-display [&_b]:font-extrabold">
              {outcome}
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-9 flex items-baseline gap-3">
            <span className="font-display text-[19px] font-extrabold text-accent">How?</span>
            <span className="h-px flex-1 bg-hair" />
          </div>
          <p className="mt-4 max-w-[66ch] text-[15.5px] leading-[1.7] text-muted [&_b]:font-semibold [&_b]:text-ink">
            {how}
          </p>
        </Reveal>
      </Pad>

      <Reveal delay={100} className="mt-9">
        <Pad>{children}</Pad>
      </Reveal>
    </section>
  );
}

/** A sub-beat inside a chapter: smaller heading, same rhythm. */
export function SubBeat({
  id,
  title,
  lead,
  children,
}: {
  id?: string;
  title: ReactNode;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <div id={id} className="mt-14 scroll-mt-8 sm:mt-18">
      <Pad>
        <Reveal>
          <h3 className="max-w-[26ch] text-[clamp(20px,2.5vw,29px)] font-extrabold leading-[1.18]">
            {title}
          </h3>
          <p className="mt-3.5 max-w-[66ch] text-[15px] leading-[1.7] text-muted [&_b]:font-semibold [&_b]:text-ink">
            {lead}
          </p>
        </Reveal>
      </Pad>
      <Reveal delay={90} className="mt-7">
        <Pad>{children}</Pad>
      </Reveal>
    </div>
  );
}

/** Inside the sheet, a panel is a hairline and a tint. No second shadow. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-inner)] border border-edge bg-ground/60 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHead({
  title,
  sub,
  ai,
  aiAuto,
  children,
}: {
  title: string;
  sub?: string;
  /** The AI script this chart carries. See lib/ai-scripts.ts. */
  ai?: string;
  /** Opens itself the first time the reader reaches this chart. One chart uses it. */
  aiAuto?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3.5 px-4 pb-3.5 pt-4 sm:px-5">
      <h4 className="font-display text-[14.5px] font-bold tracking-[-0.01em]">{title}</h4>
      {sub ? <span className="text-[12px] text-faint">{sub}</span> : null}
      {children || ai ? (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {children}
          {ai ? <AskAi id={ai} label={title} auto={aiAuto} /> : null}
        </div>
      ) : null}
    </div>
  );
}

export function CardFoot({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-hair bg-card px-4 py-3.5 text-[12.5px] leading-[1.6] text-muted sm:px-5">
      {children}
    </div>
  );
}

const TAG_TONES = {
  plain: "text-muted",
  o2c: "text-g1",
  p2p: "text-g2",
  good: "text-accent",
  warn: "text-muted",
  bad: "text-bad",
} as const;

export type TagTone = keyof typeof TAG_TONES;

export function Tag({ tone = "plain", children }: { tone?: TagTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-edge bg-card px-2.5 py-1 text-[11px] font-medium ${TAG_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  note,
  tone,
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  note: string;
  tone: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="relative h-full overflow-hidden rounded-[var(--radius-inner)] border border-edge bg-card px-4 py-4 shadow-soft">
        <div className="text-[11.5px] font-medium tracking-[0.02em] text-faint">{label}</div>
        <div className="mt-1 font-display text-[clamp(21px,2.5vw,27px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
          {value}
        </div>
        <div className="mt-0.5 text-xs leading-[1.4] text-muted">{note}</div>
        <span className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: tone }} />
      </div>
    </Reveal>
  );
}

export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(168px,1fr))]">
      {children}
    </div>
  );
}

const ROW_TONES = {
  good: "[&_em]:decoration-accent",
  warn: "[&_em]:decoration-bad",
  bad: "[&_em]:decoration-bad",
  plain: "[&_em]:decoration-accent",
} as const;

/**
 * A verdict, never a level. "8.2 Cr of receivable" is a level. Against the
 * terms this client signed it is a verdict, and only the second one is worth
 * a row.
 */
export function VerdictRow({
  tone = "plain",
  children,
  tags,
  delay = 0,
}: {
  tone?: keyof typeof ROW_TONES;
  children: ReactNode;
  tags: string[];
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        className={`flex flex-wrap items-start gap-3.5 rounded-[var(--radius-inner)] border border-edge bg-card px-4 py-3.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] ${ROW_TONES[tone]}`}
      >
        <p className="min-w-0 flex-[1_1_330px] text-sm font-medium leading-[1.55] [&_em]:font-bold [&_em]:not-italic [&_em]:text-ink [&_em]:underline [&_em]:decoration-[2.5px] [&_em]:underline-offset-[5px]">
          {children}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function Rows({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-col gap-2.5">{children}</div>;
}
