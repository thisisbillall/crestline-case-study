"use client";

import { useState } from "react";

import { Card, CardHead } from "@/components/ui/primitives";

/**
 * THE ONE RULE THAT MAKES TICKETS AN AUDIT RATHER THAN A TO-DO LIST.
 *
 * A ticket closes because the figure it named was re-measured from the source
 * and had actually moved. There is deliberately no status a human can set to
 * "done".
 */
const STEPS = [
  {
    title: "The chart states a verdict",
    hint: "Not a level. A comparison.",
    body: (
      <>
        <p>
          <b>&ldquo;₹8.2 Cr of receivable&rdquo; is a level. Against the terms this client signed it is a
          verdict.</b>{" "}
          Every chart on every screen carries a row underneath it, and a row is only written where there are
          two things to compare: the figure, and what this contract actually allows. Judged against its own
          terms, never a peer average. A 45 day certification on a 60 day window beats 20 days on a
          10 day one.
        </p>
        <p className="text-[12.5px] text-faint">
          Measured rows are derived in TypeScript and lead the list. The model&rsquo;s rows follow, labelled,
          and their figures are still ours.
        </p>
      </>
    ),
  },
  {
    title: "It names a desk, not a count",
    hint: "“1 vendor is late” needs a second screen.",
    body: (
      <>
        <p>
          <b>&ldquo;Suraj Hardware &amp; Fasteners is being paid late&rdquo; is an instruction.</b> The owner
          is matched on what the person actually does in the event log and on the org unit they cover,
          never on a job title, because this source publishes grades where a reader expects functions, and a
          title match addresses every order to nobody. Ties break towards the smaller authority: the person
          who does the work, not their boss.
        </p>
        <p className="text-[12.5px] text-faint">
          An event the source did not attribute to a person is named by its department, never by an invented
          person called &ldquo;Unassigned&rdquo;.
        </p>
      </>
    ),
  },
  {
    title: "It becomes a commitment",
    hint: "With a target, a deadline and steps.",
    body: (
      <>
        <p>
          <b>A row with no figure we can measure again raises nothing, and says why.</b> A ticket that cannot be closed on evidence is just a task. Where there is a fact, the ticket carries the baseline, the
          target, the numbered steps naming the invoices, bills and vendors that have to move,
          and the direction of improvement, fixed the moment it is raised so it can never follow the result.
        </p>
        <p className="text-[12.5px] text-faint">
          Raised from a measured row it is recorded as provider <code className="rounded bg-ground px-1.5 py-0.5 text-xs">crestline</code>,
          model <code className="rounded bg-ground px-1.5 py-0.5 text-xs">measured</code>: the audit trail
          never claims a model said what a derivation said.
        </p>
      </>
    ),
  },
  {
    title: "Severity is a chasing cadence",
    hint: "Not a label somebody picks.",
    body: (
      <>
        <p>
          <b>Low is one reminder a day. Medium is three. High is five, until the figure moves or the ticket is
          cancelled.</b>{" "}
          Severity is the only thing deciding how hard the system pushes, which makes it an honest choice
          rather than a mood. Marking something high means the owner hears about it five times a day,
          so a CFO thinks before doing it.
        </p>
        <p className="text-[12.5px] text-faint">
          One definition read by the composer, the cron and the mail log alike, so the badge on a card and the
          mails actually sent cannot drift apart.
        </p>
      </>
    ),
  },
  {
    title: "The auditor re measures",
    hint: "Nobody is asked whether it is done.",
    body: (
      <>
        <p>
          <b>The metric is rebuilt from the source exactly as the screen builds it, and compared with the
          baseline recorded when the ticket was raised.</b> A ticket can close as <i>closed, no change</i>, meaning the work was done, or was not, and the number still did not move. That is a real outcome, recorded
          without blame: sometimes the finding was structural and no effort at that desk was ever going to
          shift it.
        </p>
        <p className="text-[12.5px] text-faint">
          The scheduled pass skips a ticket entirely when no sync has finished since the last reading. It
          records news, not heartbeats.
        </p>
      </>
    ),
  },
];

export function OperatingLoop() {
  const [step, setStep] = useState(0);

  return (
    <Card>
      <CardHead title="Finding → commitment → chase → verdict" sub="Pick a step" />
      <div className="grid gap-2.5 px-5 pb-1 sm:px-6 [grid-template-columns:repeat(auto-fit,minmax(178px,1fr))]">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-pressed={step === i}
            onClick={() => setStep(i)}
            className={[
              "rounded-[var(--radius-inner)] border px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
              step === i
                ? "border-g3 bg-linear-160 from-accent-wash to-accent-wash shadow-[var(--shadow-card)]"
                : "border-edge bg-card",
            ].join(" ")}
          >
            <span
              className={[
                "mb-2.5 grid size-[26px] place-items-center rounded-[9px] text-[11.5px] font-bold",
                step === i ? "bg-accent text-white" : "bg-ground text-muted",
              ].join(" ")}
            >
              {i + 1}
            </span>
            <span className="block font-display text-[13.5px] font-bold leading-[1.3] tracking-[-0.01em]">
              {s.title}
            </span>
            <span className="mt-1 block text-[11.5px] leading-[1.4] text-muted">{s.hint}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 px-5 pb-6 pt-5 text-[14.5px] leading-[1.65] text-muted sm:px-6 [&_b]:font-semibold [&_b]:text-ink">
        {STEPS[step].body}
      </div>
    </Card>
  );
}
