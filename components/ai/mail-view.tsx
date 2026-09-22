"use client";

import type { AiScript } from "@/lib/ai-scripts";

/**
 * THE MAIL, AS THE PERSON WHO HAS TO ACT ON IT SEES IT.
 *
 * A confirmation that a ticket was raised proves nothing. What matters is what
 * landed on somebody's desk, so this is the message itself, opened in their
 * inbox: who it came from, what it asks, the numbered steps behind it, the one
 * figure it will be judged on, and the date it is due.
 *
 * Severity is the only thing that decides how hard this gets chased, and it is
 * stated in the footer in plain words rather than as a coloured badge nobody
 * can translate.
 */
const CADENCE: Record<AiScript["ticket"]["severity"], string> = {
  Low: "once a day",
  Medium: "three times a day",
  High: "five times a day",
};

/** The as of date the whole case study is struck at. */
const SENT = "20 Sep 2027, 09:14";

function dueDate(days: number): string {
  const from = new Date(Date.UTC(2027, 8, 20));
  from.setUTCDate(from.getUTCDate() + days);
  return from.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function MailView({ script, onBack }: { script: AiScript; onBack: () => void }) {
  const { ticket } = script;
  const subject = script.todo.action;

  return (
    <div className="fade-up">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-wash px-2.5 py-1 text-[11px] font-semibold text-accent">
          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Delivered
        </span>
        <span className="text-[12px] text-faint">
          Ticket raised and sent. This is what landed in their inbox.
        </span>
      </div>

      {/* ------------------------------------------------ the message itself */}
      <div className="overflow-hidden rounded-[14px] border border-edge bg-card">
        <div className="flex flex-wrap items-start gap-3 border-b border-hair px-4 py-3.5">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-full bg-linear-145 from-[#c6bffa] to-accent-soft text-[13px] font-bold text-white"
            aria-hidden="true"
          >
            C
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-ink">
              Crestline Alerts{" "}
              <span className="font-normal text-faint">&lt;alerts@crestlineintelligence.com&gt;</span>
            </p>
            <p className="mt-0.5 text-[12.5px] text-muted">
              to <span className="font-medium text-ink">{ticket.to}</span>
              <span className="text-faint"> · {ticket.role} · {ticket.email}</span>
            </p>
          </div>
          <span className="whitespace-nowrap text-[11.5px] text-faint">{SENT}</span>
        </div>

        <div className="px-4 py-4">
          <p className="font-display text-[15px] font-extrabold leading-snug text-ink">{subject}</p>

          <p className="mt-3 text-[13.5px] leading-[1.6] text-muted">
            {ticket.to.split(" ")[0]}, Crestline measured this on {script.eyebrow.toLowerCase()} and it
            needs your desk. {script.answer}
          </p>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
            What to do
          </p>
          <ol className="mt-2 flex flex-col gap-2">
            {script.follows.map((item, i) => (
              <li key={item.title} className="flex gap-2.5">
                <span className="mt-[2px] grid size-[17px] shrink-0 place-items-center rounded-md bg-ground text-[10px] font-bold text-muted">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[13px] font-semibold leading-snug text-ink">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-muted">{item.sub}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-4 grid gap-2.5 rounded-[11px] border border-edge bg-ground/60 px-3.5 py-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
                Closed against
              </p>
              <p className="mt-1 text-[13px] font-semibold text-ink">{ticket.metric}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">Due</p>
              <p className="mt-1 text-[13px] font-semibold text-ink">
                {dueDate(ticket.dueDays)}
                <span className="font-normal text-faint"> · {ticket.dueDays} days</span>
              </p>
            </div>
          </div>

          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12.5px] font-bold text-white">
            Open this in Crestline
          </span>

          <p className="mt-4 border-t border-hair pt-3 text-[11px] leading-[1.55] text-faint">
            {script.figures}
          </p>
        </div>
      </div>

      <p className="mt-3.5 text-[12px] leading-[1.6] text-muted">
        Severity is <span className="font-semibold text-ink">{ticket.severity}</span>, so this is chased{" "}
        <span className="font-semibold text-ink">{CADENCE[ticket.severity]}</span> until the figure moves
        or the ticket is cancelled. It cannot be closed by replying that the work is done: Crestline
        re measures {ticket.metric.split(" ").slice(0, -3).join(" ") || "the figure"} from the source and
        the number decides.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-[12.5px] font-medium text-faint transition-colors hover:text-ink"
      >
        Back to the answer
      </button>
    </div>
  );
}
