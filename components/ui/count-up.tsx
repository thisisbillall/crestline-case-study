"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up the first time it is scrolled into view.
 *
 * The point is not decoration: a number that climbs makes the reader watch the
 * number, which is the one thing on the card that matters. It settles on the
 * real value and stops — it never loops, and it never runs twice.
 */
export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1200,
  className = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || done) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      setDone(true);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // Ease-out cubic: fast at first, settling into the real figure.
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(to * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
          else setDone(true);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration, done]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
