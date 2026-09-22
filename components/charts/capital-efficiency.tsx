"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead } from "@/components/ui/primitives";
import { PORTFOLIO, PROJECTS } from "@/lib/data";
import { d1, inr } from "@/lib/format";
import { AXIS_LABEL, C, DISPLAY, FONT, SPLIT_LINE, TOOLTIP, grad, cb, asOption, fill } from "@/lib/chart-theme";

/**
 * WHICH PROJECTS DRIVE THE CAPITAL LOAD.
 *
 * Working capital against contract value, so a ₹12 Cr job and a ₹120 Cr one can
 * be compared at all. The dashed line is the portfolio's own intensity — the
 * comparison is against this company, never an industry average.
 */
export function CapitalEfficiency() {
  const intensity = PORTFOLIO.workingCapital / PORTFOLIO.contractValue;

  /** Above the portfolio's own intensity line: this project eats capital. */
  const hungry = (p: unknown) => {
    const [cv, wc] = cb(p).data as number[];
    return wc / cv > intensity;
  };

  const option = useMemo(() => asOption({
      animationDuration: 1000,
      animationEasing: "elasticOut",
      grid: { left: 8, right: 26, top: 26, bottom: 36, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        formatter: (p: unknown) => {
          const [cv, wc, ccc, name, released] = (cb(p).data as (string|number)[]) as [number, number, number, string, number];
          return [
            `<b style="font-family:${DISPLAY}">${name}</b>`,
            `Contract &nbsp; <b>${inr(cv)}</b>`,
            `Working capital &nbsp; <b>${inr(wc)}</b>`,
            `Intensity &nbsp; <b>${((wc / cv) * 100).toFixed(1)}%</b>`,
            `Cash cycle &nbsp; <b>${d1(ccc)} days</b>`,
            `Releasable &nbsp; <b>${inr(released)}</b>`,
          ].join("<br>");
        },
      },
      xAxis: {
        type: "value",
        max: 1_320_000_000,
        name: "Contract value",
        nameLocation: "middle",
        nameGap: 32,
        nameTextStyle: { color: C.faint, fontSize: 12, fontFamily: FONT },
        axisLabel: { ...AXIS_LABEL, formatter: (v: unknown) => inr(v as number, 0) },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        max: 400_000_000,
        name: "Working capital held",
        nameLocation: "middle",
        nameGap: 58,
        nameTextStyle: { color: C.faint, fontSize: 12, fontFamily: FONT },
        axisLabel: { ...AXIS_LABEL, formatter: (v: unknown) => inr(v as number, 0) },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "line",
          symbol: "none",
          silent: true,
          z: 1,
          lineStyle: { color: C.faint, type: "dashed", width: 1.5 },
          data: [
            [0, 0],
            [1_320_000_000, 1_320_000_000 * intensity],
          ],
        },
        {
          type: "scatter",
          z: 5,
          // Bubble area carries the cash cycle: a longer cycle is a bigger circle.
          symbolSize: (p: unknown) => 22 + Math.max(0, (p as number[])[2]) * 0.72,
          itemStyle: {
            color: (p: unknown) => (hungry(p) ? fill(C.rose) : fill(C.mint)),
            borderColor: (p: unknown) => (hungry(p) ? C.roseInk : C.mintInk),
            borderWidth: 2,
            shadowBlur: 16,
            shadowColor: "rgba(26,29,38,.14)",
            shadowOffsetY: 5,
          },
          label: {
            show: true,
            position: "top",
            distance: 9,
            color: C.ink,
            fontWeight: 700,
            fontSize: 12,
            fontFamily: DISPLAY,
            formatter: (p: unknown) => String((cb(p).data as (string|number)[])[3]),
          },
          data: PROJECTS.map((p) => [p.cv, p.wc, p.ccc, p.short, p.at.released]),
        },
      ],
    }),
    [intensity],
  );

  const wakad = PROJECTS.find((p) => p.ref === "GI-WKD-10")!;

  return (
    <Card>
      <CardHead title="Working capital against contract value" sub="Bubble size = cash cycle in days" />
      <div className="px-3 pb-4">
        <EChart option={option} height={360} ariaLabel="Working capital against contract value by project" />
      </div>
      <CardFoot>
        Above the dashed line a project eats capital, below it releases capital.{" "}
        <b className="font-semibold text-ink">Wakad</b> holds {inr(wakad.wc)} on a {inr(wakad.cv)} contract
        at 37.5% intensity, with a 52.8 day cycle, the worst of the six.
      </CardFoot>
    </Card>
  );
}
