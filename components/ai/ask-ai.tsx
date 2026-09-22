"use client";

import { useEffect, useRef, useState } from "react";

import { AiDrawer } from "@/components/ai/ai-drawer";
import { SparkButton } from "@/components/ai/spark";
import { AI_SCRIPTS } from "@/lib/ai-scripts";

/** Remembered per tab, so a reload during the same visit does not nag. */
const SEEN = "crestline.ai.autoshown";

/**
 * The trigger and its drawer, kept together so a chart only has to name which
 * script it carries. Mounted per chart rather than once at the root because
 * each drawer is about one chart's own figures and nothing else.
 */
export function AskAi({
  id,
  label,
  auto = false,
}: {
  id: string;
  label: string;
  /** Opens itself the first time this chart is reached. One chart uses it. */
  auto?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);

  /*
    THE ONE TIME IT OPENS BY ITSELF.

    A panel that appears unbidden is usually an interruption, so this one is
    fenced in: it fires on the first chart only, once per tab, and only after
    the reader has actually scrolled, so it reads as an answer to their arrival
    rather than as a pop-up. It waits until the chart is nearly all on screen,
    pauses long enough to be read as deliberate, and stands down the moment the
    reader scrolls past or opens it themselves.
  */
  useEffect(() => {
    if (!auto) return;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN) === "1";
    } catch {
      // Private windows and blocked storage: fall through and allow it once.
    }
    if (seen) return;

    const node = anchor.current;
    if (!node) return;

    let scrolled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      scrolled = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const stand_down = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !scrolled) {
          stand_down();
          return;
        }
        if (timer) return;
        timer = setTimeout(() => {
          try {
            window.sessionStorage.setItem(SEEN, "1");
          } catch {
            // Nothing to do: it simply will not be remembered.
          }
          observer.disconnect();
          setOpen(true);
        }, 750);
      },
      { threshold: 0.85 },
    );
    observer.observe(node);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      stand_down();
    };
  }, [auto]);

  const script = AI_SCRIPTS[id];
  if (!script) return null;

  return (
    <>
      <span ref={anchor}>
        <SparkButton
          label={label}
          onClick={() => {
            // Opening it by hand also settles the automatic one.
            try {
              window.sessionStorage.setItem(SEEN, "1");
            } catch {
              /* not remembered, no harm */
            }
            setOpen(true);
          }}
        />
      </span>
      <AiDrawer script={script} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
