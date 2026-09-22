"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead } from "@/components/ui/primitives";
import { FLOW } from "@/lib/data";
import { inr } from "@/lib/format";
import { AXIS_LABEL, C, DISPLAY, FONT, LEGEND, SPLIT_LINE, TOOLTIP, grad, asOption, fill } from "@/lib/chart-theme";

/**
 * PEAK FUNDING NEED.
 *
 * A closing balance says the year funded itself. The trough says what the
 * business actually had to borrow. Report the trough, never the close — it is
 * the one figure no balance sheet carries and the one a CFO sizing a facility
 * needs.
 */
export function PeakFunding() {
  const { option, trough, troughLabel } = useMemo(() => {
    let running = 0;
    const cumulative = FLOW.map(([, collected, paid]) => {
      running += collected - paid;
      return Math.round(running);
    });
    const labels = FLOW.map(([label]) => label);

    let ti = 0;
    cumulative.forEach((v, i) => {
      if (v < cumulative[ti]) ti = i;
    });

    const opt = asOption({
      animationDuration: 1000,
      animationEasing: "cubicOut",
      grid: { left: 8, right: 8, top: 42, bottom: 28, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: C.lav, width: 2 } },
        valueFormatter: (v: unknown) => inr(v as number),
      },
      legend: LEGEND,
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { ...AXIS_LABEL, interval: 2 },
        axisLine: { lineStyle: { color: C.line } },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          axisLabel: { ...AXIS_LABEL, formatter: (v: unknown) => inr(v as number, 0) },
          splitLine: SPLIT_LINE,
          axisLine: { show: false },
          axisTick: { show: false },
        },
        {
          type: "value",
          axisLabel: { show: false },
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
        },
      ],
      series: [
        {
          name: "Collected",
          type: "bar",
          barGap: "12%",
          barWidth: "32%",
          itemStyle: { color: fill(C.mint), borderRadius: [8, 8, 0, 0] },
          data: FLOW.map(([, collected]) => collected),
        },
        {
          name: "Paid out",
          type: "bar",
          barWidth: "32%",
          itemStyle: { color: fill(C.rose), borderRadius: [8, 8, 0, 0] },
          data: FLOW.map(([, , paid]) => paid),
        },
        {
          name: "Running position",
          type: "line",
          yAxisIndex: 1,
          smooth: 0.42,
          symbol: "none",
          z: 6,
          lineStyle: {
            width: 3,
            color: C.lavInk,
            shadowBlur: 12,
            shadowColor: "rgba(107,95,199,.35)",
            shadowOffsetY: 4,
          },
          areaStyle: { color: grad("rgba(184,176,238,.38)", "rgba(184,176,238,0)") },
          data: cumulative,
          markPoint: {
            symbol: "circle",
            symbolSize: 14,
            z: 20,
            itemStyle: {
              color: C.roseInk,
              borderColor: "#fff",
              borderWidth: 3,
              shadowBlur: 12,
              shadowColor: "rgba(215,107,120,.55)",
            },
            label: {
              show: true,
              position: "bottom",
              distance: 12,
              color: C.roseInk,
              fontWeight: 700,
              fontSize: 12.5,
              fontFamily: FONT,
              backgroundColor: "#fff",
              borderColor: C.rose,
              borderWidth: 1,
              borderRadius: 10,
              padding: [6, 10],
              formatter: `Peak funding need  ${inr(cumulative[ti])} · ${labels[ti]}`,
            },
            data: [{ coord: [labels[ti], cumulative[ti]] }],
          },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: C.faint, type: "dashed", width: 1.5 },
            label: { show: false },
            data: [{ yAxis: 0 }],
          },
        },
      ],
    });

    return { option: opt, trough: cumulative[ti], troughLabel: labels[ti] };
  }, []);

  return (
    <Card>
      <CardHead
        title="Collections against payments, and the running position"
        sub="22 months · all six projects"
      />
      <div className="px-3 pb-4">
        <EChart
          option={option}
          height={420}
          ariaLabel="Monthly collections and payments with the cumulative cash position"
        />
      </div>
      <CardFoot>
        <b className="font-semibold text-ink">Peak funding need {inr(Math.abs(trough))}</b>, reached{" "}
        {troughLabel}, against a closing position of &minus;₹19.3 Cr. Report the trough, never the close.
      </CardFoot>
    </Card>
  );
}
