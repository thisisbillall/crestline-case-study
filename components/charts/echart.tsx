"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

/**
 * ONE ECHARTS MOUNT POINT.
 *
 * Every chart on the site goes through here so disposal, resizing and the
 * animation settings are defined once rather than nine times. `option` is
 * re-applied on change without `notMerge`, which is what lets a bar morph
 * smoothly between two bases instead of being torn down and redrawn.
 */
export function EChart({
  option,
  height = 360,
  className = "",
  ariaLabel,
  /** True where the option replaces series wholesale (category count changes). */
  replace = false,
}: {
  option: echarts.EChartsOption;
  height?: number;
  className?: string;
  ariaLabel?: string;
  replace?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!host.current) return;
    chart.current = echarts.init(host.current, null, { renderer: "canvas" });

    const observer = new ResizeObserver(() => chart.current?.resize());
    observer.observe(host.current);

    return () => {
      observer.disconnect();
      chart.current?.dispose();
      chart.current = null;
    };
  }, []);

  /*
    THE CHART DRAWS ITSELF WHEN THE READER ARRIVES.

    ECharts plays its entrance animation on the first setOption, so holding
    that call until the canvas is on screen is what turns a static picture into
    something that happens. Once it has drawn, later option changes (a toggle,
    a slider) apply immediately.
  */
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = host.current;
    if (!node || seen) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [seen]);

  useEffect(() => {
    if (!seen) return;
    chart.current?.setOption(option, replace);
  }, [option, replace, seen]);

  return (
    <div
      ref={host}
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ width: "100%", height }}
    />
  );
}
