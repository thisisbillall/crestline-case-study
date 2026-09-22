"use client";

import { useEffect, useRef, useState } from "react";

import { MailView } from "@/components/ai/mail-view";
import { Sparkle } from "@/components/ai/spark";
import type { AiScript } from "@/lib/ai-scripts";

/**
 * THE DRAWER, PLAYED BACK.
 *
 * This is the product's own panel with the conversation replayed rather than
 * live: the question types itself, the model thinks, and the answer arrives in
 * stages. Nothing here is a plausible-sounding number written to fill a slot.
 * Every figure quoted comes from lib/ai-scripts.ts, which reads them out of the
 * same extract the chart above was drawn from.
 *
 * The stages are deliberate. A reader who sees the whole thing at once reads a
 * screenshot; a reader who watches it arrive understands that a measurement
 * happened first and the reasoning came second.
 *
 * The panel sizes itself to its content and caps at the viewport, with the
 * thread taking the scroll. A fixed height left a short script floating in
 * dead space and a long one running off the bottom of the screen.
 */
type Stage = "idle" | "typing" | "thinking" | "answer" | "follows" | "todo" | "done";

const STAGES: Stage[] = ["idle", "typing", "thinking", "answer", "follows", "todo", "done"];
const TYPE_MS = 32;

export function AiDrawer({
  script,
  open,
  onClose,
}: {
  script: AiScript;
  open: boolean;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  /** Once raised, the panel shows the mail rather than the reasoning. */
  const [sent, setSent] = useState(false);
  const [typed, setTyped] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Escape closes, and the page behind must not scroll under the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  // The replay. Reduced motion skips straight to the finished panel.
  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    if (!open) {
      clear();
      setStage("idle");
      setTyped("");
      setSent(false);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(script.question);
      setStage("done");
      return;
    }

    const at = (ms: number, run: () => void) => timers.current.push(setTimeout(run, ms));

    setStage("typing");
    setTyped("");
    const letters = [...script.question];
    letters.forEach((_, i) => {
      at(380 + i * TYPE_MS, () => setTyped(script.question.slice(0, i + 1)));
    });

    const typedBy = 380 + letters.length * TYPE_MS;
    at(typedBy + 240, () => setStage("thinking"));
    at(typedBy + 1150, () => setStage("answer"));
    at(typedBy + 1800, () => setStage("follows"));
    at(typedBy + 2400, () => setStage("todo"));
    at(typedBy + 2900, () => setStage("done"));

    return clear;
  }, [open, script]);

  // Keep the newest block in view as the answer builds.
  useEffect(() => {
    if (stage === "idle" || !thread.current) return;
    thread.current.scrollTo({ top: thread.current.scrollHeight, behavior: "smooth" });
  }, [stage]);

  if (!open) return null;

  const at = (s: Stage) => STAGES.indexOf(stage) >= STAGES.indexOf(s);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/25 p-3 backdrop-blur-[3px] sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Ask Crestline"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88dvh] w-full max-w-[800px] flex-col overflow-hidden rounded-[20px] border border-edge bg-card shadow-[0_40px_90px_-30px_rgb(26_29_38/0.45)] outline-none"
        style={{ animation: "drawerIn .32s cubic-bezier(.22,1,.36,1) both" }}
      >
        {/* ------------------------------------------------------- verdict */}
        <div className="relative shrink-0 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid size-7 place-items-center rounded-full text-faint transition-colors hover:bg-ground hover:text-ink sm:right-5 sm:top-5"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-accent">
              <Sparkle className="size-[12px]" />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
              {script.eyebrow}
            </p>
          </div>

          <h3 className="mt-1.5 max-w-[58ch] pr-8 font-display text-[clamp(16px,1.9vw,19.5px)] font-extrabold leading-[1.26]">
            {script.verdict}
          </h3>
          <p className="mt-2 max-w-[78ch] text-[13.5px] leading-[1.55] text-muted">{script.context}</p>
          <p className="mt-2 text-[12px] leading-[1.5] text-faint">{script.basis}</p>
        </div>

        {/* ---------------------------------------------------- the thread */}
        <div
          ref={thread}
          className="flex-1 overflow-y-auto border-t border-hair px-5 py-5 sm:px-7"
        >
          {sent ? (
            <MailView script={script} onBack={() => setSent(false)} />
          ) : (
            <>
            <div className="flex justify-end">
              <p className="max-w-[80%] rounded-[16px] rounded-br-[5px] bg-ground px-3.5 py-2 text-[13.5px] leading-[1.5] text-ink">
                {typed}
                {stage === "typing" ? (
                  <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-pulse bg-ink/60" />
                ) : null}
              </p>
            </div>

            {stage === "thinking" ? (
              <div className="mt-4 flex items-center gap-2 text-[12.5px] text-faint">
                <span className="text-accent">
                  <Sparkle className="size-[12px]" />
                </span>
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-[5px] rounded-full bg-g3"
                      style={{ animation: `blink 1.1s ${i * 0.16}s infinite` }}
                    />
                  ))}
                </span>
                Re measuring from the event log
              </div>
            ) : null}

            {at("answer") ? (
              <p className="fade-up mt-4 max-w-[82ch] text-[14px] leading-[1.58] text-ink">
                {script.answer}
              </p>
            ) : null}

            {at("follows") ? (
              <div className="fade-up mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                  What follows
                </p>
                <ol className="mt-2.5 flex flex-col gap-2.5">
                  {script.follows.map((item, i) => (
                    <li key={item.title} className="flex gap-2.5">
                      <span className="mt-[2px] grid size-[17px] shrink-0 place-items-center rounded-md bg-ground text-[10px] font-bold text-muted">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block text-[13px] font-semibold leading-snug text-ink">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-muted">
                          {item.sub}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {at("todo") ? (
              <div className="fade-up mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                  What to do
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3 rounded-[13px] border border-edge bg-card px-3.5 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold leading-snug text-ink">
                      {script.todo.action}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-muted">{script.todo.sub}</span>
                  </span>
                  <span className="whitespace-nowrap rounded-full border border-edge bg-ground px-2.5 py-1 text-[11px] font-medium text-muted">
                    {script.todo.tag}
                  </span>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSent(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_-10px_rgb(26_29_38/0.6)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Raise a ticket from this
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[12.5px] font-medium text-faint transition-colors hover:text-ink"
                  >
                    Close
                  </button>
                </div>

                <p className="mt-3.5 text-[11px] leading-[1.5] text-faint">{script.figures}</p>
              </div>
            ) : null}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes drawerIn { from { opacity: 0; transform: translateY(12px) scale(.985) } to { opacity: 1; transform: none } }
        @keyframes blink { 0%, 100% { opacity: .25 } 50% { opacity: 1 } }
        .fade-up { animation: fadeUp .42s cubic-bezier(.22,1,.36,1) both }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) { .fade-up, [role="dialog"] { animation: none } }
      `}</style>
    </div>
  );
}
