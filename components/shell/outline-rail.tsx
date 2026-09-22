"use client";

import { useEffect, useState } from "react";

import { ClientMark } from "@/components/shell/grey-logo";
import { ANCHORS, OUTLINE } from "@/lib/outline";

/**
 * THE OUTLINE RAIL.
 *
 * A document outline that follows the reader instead of a navbar that sits on
 * top of the page. Chapters are always listed; the one being read opens to show
 * its sections, so the list tells you where you are and what is still ahead
 * without ever being thirteen items long.
 *
 * Position is read from the DOM rather than from an IntersectionObserver: where
 * a long section ends and a short one begins, observers flicker between the
 * two, and a rail that flickers is worse than no rail.
 */
export function OutlineRail() {
  const [active, setActive] = useState<string>("found");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const read = () => {
      ticking = false;
      const line = window.innerHeight * 0.34;
      let current = ANCHORS[0];
      for (const id of ANCHORS) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (id: string) => {
    const node = document.getElementById(id);
    if (!node) return;
    window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY - 28, behavior: "smooth" });
  };

  const openChapter =
    OUTLINE.find((chapter) => chapter.id === active || chapter.sections.some((s) => s.id === active))
      ?.id ?? "found";

  return (
    <>
      {/* Narrow screens lose the rail, so the progress line moves to the top. */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent xl:hidden"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-r-full bg-linear-90 from-accent via-g3 to-accent-soft transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <aside className="sticky top-7 hidden h-fit py-8 xl:block" aria-label="Document outline">
        <p className="mb-4 pl-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
          The story
        </p>

        <nav className="relative">
          <span className="absolute left-[7px] top-1 bottom-1 w-px bg-edge" aria-hidden="true" />
          <span
            className="absolute left-[7px] top-1 w-px rounded-full bg-linear-180 from-accent to-accent-soft transition-[height] duration-200 ease-out"
            style={{ height: `calc(${progress * 100}% - 8px)` }}
            aria-hidden="true"
          />

          <ul className="flex flex-col gap-1">
            {OUTLINE.map((chapter) => {
              const open = openChapter === chapter.id;
              const on = active === chapter.id;
              return (
                <li key={chapter.id}>
                  <button
                    type="button"
                    onClick={() => go(chapter.id)}
                    aria-current={on ? "true" : undefined}
                    className={[
                      "group relative flex w-full items-start gap-3 rounded-lg py-1.5 pl-4 pr-2 text-left transition-colors duration-200",
                      open ? "text-ink" : "text-muted hover:text-ink",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "absolute left-[3px] top-[11px] size-[9px] rounded-full border-2 transition-all duration-300",
                        open
                          ? "border-accent bg-accent scale-110"
                          : "border-edge bg-card group-hover:border-g3",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span
                        className={[
                          "block text-[10px] font-semibold tracking-[0.1em]",
                          open ? "text-accent" : "text-faint",
                        ].join(" ")}
                      >
                        {chapter.n}
                      </span>
                      <span className="mt-0.5 block text-[13.5px] font-semibold leading-snug">
                        {chapter.label}
                      </span>
                    </span>
                  </button>

                  <div
                    className="grid transition-[grid-template-rows,opacity] duration-400 ease-out"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    <ul className="overflow-hidden">
                      {chapter.sections.map((section) => {
                        const here = active === section.id;
                        return (
                          <li key={section.id}>
                            <button
                              type="button"
                              onClick={() => go(section.id)}
                              aria-current={here ? "true" : undefined}
                              className={[
                                "w-full rounded-md py-[5px] pl-9 pr-2 text-left text-[12.5px] leading-snug transition-colors duration-200",
                                here
                                  ? "font-semibold text-accent"
                                  : "text-faint hover:text-muted",
                              ].join(" ")}
                            >
                              {section.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-6 ml-4 text-[11.5px] font-medium text-faint transition-colors hover:text-ink"
        >
          Back to the top
        </button>

        <ClientMark />
      </aside>
    </>
  );
}
