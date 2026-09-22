"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead } from "@/components/ui/primitives";
import { PROJECTS } from "@/lib/data";
import { inr } from "@/lib/format";
import { AXIS_LABEL, C, DISPLAY, FONT, LEGEND, NO_LINE, SPLIT_LINE, TOOLTIP, grad, cb, asOption, fill } from "@/lib/chart-theme";

/**
 * O2C AND P2P, DISCOVERED SEPARATELY.
 *
 * An RA bill and a purchase order share nothing but the company; merging them
 * yields two disconnected islands and a meaningless median. They meet on the
 * balance sheet, not the canvas.
 */
export function Conformance() {
  const option = useMemo(() => asOption({
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { left: 8, right: 118, top: 40, bottom: 30, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: unknown) => {
          const ps = params as { dataIndex: number }[];
          const p = PROJECTS[ps[0].dataIndex];
          return [
            `<b style="font-family:${DISPLAY}">${p.short}</b>`,
            `<span style="color:${C.g1}">●</span> O2C &nbsp; ${p.o2c.median.toFixed(
              1,
            )}d median · P80 ${p.o2c.p80.toFixed(1)}d · ${p.o2c.conf.toFixed(0)}% conform · ${
              p.o2c.cases
            } cases`,
            `<span style="color:${C.g2}">●</span> P2P &nbsp; ${p.p2p.median.toFixed(
              1,
            )}d median · P80 ${p.p2p.p80.toFixed(1)}d · ${p.p2p.conf.toFixed(0)}% conform · ${
              p.p2p.cases
            } cases`,
            `<span style="color:${C.muted}">waste ${inr(p.o2c.waste + p.p2p.waste)} a year</span>`,
          ].join("<br>");
        },
      },
      legend: {
        ...LEGEND,
        data: ["O2C · bill to bank", "P2P · order to settlement"],
      },
      xAxis: {
        type: "value",
        max: 128,
        axisLabel: { ...AXIS_LABEL, formatter: "{value}d" },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: PROJECTS.map((p) => p.short),
        axisLine: NO_LINE,
        axisTick: { show: false },
        axisLabel: { fontSize: 12.5, color: C.ink, fontWeight: 600, fontFamily: FONT },
      },
      series: [
        {
          name: "O2C · bill to bank",
          type: "bar",
          barWidth: 13,
          barGap: "36%",
          itemStyle: { color: fill(C.g1, true), borderRadius: 7 },
          data: PROJECTS.map((p) => p.o2c.median),
          label: {
            show: true,
            position: "right",
            distance: 8,
            fontSize: 11,
            color: C.g1,
            fontWeight: 700,
            fontFamily: FONT,
            formatter: (p: unknown) => `${cb(p).value.toFixed(0)}d`,
          },
        },
        {
          name: "P2P · order to settlement",
          type: "bar",
          barWidth: 13,
          itemStyle: { color: fill(C.g3, true), borderRadius: 7 },
          data: PROJECTS.map((p) => p.p2p.median),
          label: {
            show: true,
            position: "right",
            distance: 8,
            fontSize: 11,
            color: C.g2,
            fontWeight: 700,
            fontFamily: FONT,
            formatter: (p: unknown) => `${cb(p).value.toFixed(0)}d`,
          },
        },
        {
          name: "P80 · O2C",
          type: "scatter",
          symbol: "rect",
          symbolSize: [3, 26],
          z: 8,
          silent: true,
          itemStyle: { color: C.faint },
          data: PROJECTS.map((p, i) => [p.o2c.p80, i]),
        },
        {
          name: "P80 · P2P",
          type: "scatter",
          symbol: "rect",
          symbolSize: [3, 26],
          z: 8,
          silent: true,
          itemStyle: { color: C.faint },
          data: PROJECTS.map((p, i) => [p.p2p.p80, i]),
        },
      ],
    }),
    [],
  );

  return (
    <Card>
      <CardHead
        title="Median case duration and conformance, per stream"
        sub="Grey marker is the P80, a behavioural measure rather than an accounting ratio"
        ai="conformance"
      />
      <div className="px-3 pb-2">
        <EChart option={option} height={420} ariaLabel="Case duration and conformance by project and stream" />
      </div>

      <div className="grid gap-2 px-5 pb-4 sm:grid-cols-3 sm:px-6">
        {PROJECTS.map((p) => {
          const avg = (p.o2c.conf + p.p2p.conf) / 2;
          return (
            <div
              key={p.ref}
              className="flex items-center justify-between rounded-[11px] border border-edge bg-card px-3 py-2"
            >
              <span className="text-[12.5px] font-semibold">{p.short}</span>
              <span
                className={`text-[12.5px] font-bold ${avg >= 65 ? "text-good" : "text-warn"}`}
                title="O2C / P2P conformance"
              >
                {p.o2c.conf.toFixed(0)}% / {p.p2p.conf.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>

      <CardFoot>
        Percentages are conformance, O2C / P2P.{" "}
        <b className="font-semibold text-ink">Bhiwandi&rsquo;s P2P conformance is 40.3%</b>. Three cases
        in five took a route nobody designed, across 18 distinct variants. Its rework rate, counted per case
        and never by summing variants, is 11.1%.
      </CardFoot>
    </Card>
  );
}
