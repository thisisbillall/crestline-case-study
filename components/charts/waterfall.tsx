"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead, Rows, VerdictRow } from "@/components/ui/primitives";
import { PORTFOLIO } from "@/lib/data";
import { inr } from "@/lib/format";
import { AXIS_LABEL, C, DISPLAY, FONT, SPLIT_LINE, TOOLTIP, grad, cb, asOption, fill } from "@/lib/chart-theme";

/** Where contract value stops becoming cash, and how long it waits at each gate. */
export function Waterfall() {
  const stages = useMemo(
    () =>
      [
        ["Contract\nsigned", PORTFOLIO.contractValue, null],
        ["Executed\non site", PORTFOLIO.executed, null],
        ["Certified", PORTFOLIO.certified, PORTFOLIO.leak.certified],
        ["Invoiced", PORTFOLIO.certified, PORTFOLIO.leak.invoiced],
        ["Fallen\ndue", PORTFOLIO.due, PORTFOLIO.leak.due],
        ["Collected", PORTFOLIO.collected, PORTFOLIO.leak.collected],
      ] as [string, number, number | null][],
    [],
  );

  const option = useMemo(() => {
    const base = stages.map(([, value], i) => (i === 0 ? 0 : value));
    const drop = stages.map(([, value], i) => (i === 0 ? 0 : stages[i - 1][1] - value));

    return asOption({
      animationDuration: 950,
      animationEasing: "cubicOut",
      grid: { left: 8, right: 12, top: 26, bottom: 46, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: unknown) => {
          const ps = params as { dataIndex: number }[];
          const i = ps[0].dataIndex;
          const [label, value, wait] = stages[i];
          const lines = [
            `<b style="font-family:${DISPLAY}">${label.replace("\n", " ")}</b>`,
            `Value &nbsp; <b>${inr(value)}</b>`,
            `Share of contract &nbsp; <b>${((value / PORTFOLIO.contractValue) * 100).toFixed(1)}%</b>`,
          ];
          if (drop[i] > 0) {
            lines.push(`Lost at this gate &nbsp; <b style="color:${C.roseInk}">−${inr(drop[i])}</b>`);
          }
          if (wait !== null) lines.push(`Median wait &nbsp; <b>${wait.toFixed(1)} days</b>`);
          return lines.join("<br>");
        },
      },
      xAxis: {
        type: "category",
        data: stages.map(([label, , wait]) => (wait !== null ? `${label}\n${wait.toFixed(1)}d wait` : label)),
        axisLabel: {
          interval: 0,
          lineHeight: 15,
          fontSize: 11.5,
          color: C.ink,
          fontWeight: 600,
          fontFamily: FONT,
        },
        axisLine: { lineStyle: { color: C.line } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { ...AXIS_LABEL, formatter: (v: unknown) => inr(v as number, 0) },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          barWidth: "54%",
          itemStyle: {
            color: (p: unknown) =>
              cb(p).dataIndex === stages.length - 1 ? fill(C.mint) : fill(C.sky),
            borderRadius: [10, 10, 0, 0],
            shadowBlur: 16,
            shadowColor: "rgba(26,29,38,.10)",
            shadowOffsetY: 5,
          },
          label: {
            show: true,
            position: "top",
            distance: 8,
            color: C.ink,
            fontWeight: 800,
            fontSize: 13,
            fontFamily: DISPLAY,
            formatter: (p: unknown) => inr(cb(p).value),
          },
          data: stages.map(([, value]) => value),
        },
        {
          type: "bar",
          stack: "loss",
          barWidth: "54%",
          barGap: "-100%",
          silent: true,
          itemStyle: { color: "transparent" },
          data: base,
        },
        {
          type: "bar",
          stack: "loss",
          barWidth: "54%",
          itemStyle: {
            color: "rgba(247,184,189,.38)",
            borderRadius: [7, 7, 0, 0],
            borderColor: C.rose,
            borderWidth: 1,
            borderType: "dashed",
          },
          label: {
            show: true,
            position: "inside",
            color: C.roseInk,
            fontWeight: 700,
            fontSize: 11.5,
            fontFamily: FONT,
            formatter: (p: unknown) =>
              cb(p).value > PORTFOLIO.contractValue * 0.02 ? `−${inr(cb(p).value)}` : "",
          },
          data: drop,
        },
      ],
    });
  }, [stages]);

  return (
    <>
      <Card>
        <CardHead
          title="Contract → executed → certified → invoiced → due → collected"
          sub="Pooled across every bill in the company"
        />
        <div className="px-3 pb-4">
          <EChart option={option} height={380} ariaLabel="Contract value to cash, stage by stage" />
        </div>
        <CardFoot>
          <b className="font-semibold text-ink">Median waits:</b> submitted&rarr;certified 29.0 days ·
          certified&rarr;invoiced 1.8 days · invoiced&rarr;due 29.8 days · due&rarr;collected 10.3 days.
        </CardFoot>
      </Card>

      <Rows>
        <VerdictRow tone="bad" tags={["Ours to fix", "O2C"]}>
          <em>₹52.2 Cr</em> is executed and not yet certified. That is 30.1 days of revenue, against contract
          windows of 10 to 21 days
        </VerdictRow>
        <VerdictRow tone="warn" tags={["Aged on its own due date, never a house average"]}>
          <em>₹24.4 Cr</em> is certified and uncollected, and <em>₹12.9 Cr</em> of that is past each
          invoice&rsquo;s own due date
        </VerdictRow>
        <VerdictRow tone="good" tags={["A verdict needs a comparison"]}>
          Certified &rarr; invoiced runs at <em>1.8 days</em>. That gate is not the problem, and Crestline says
          so rather than listing it
        </VerdictRow>
      </Rows>
    </>
  );
}
