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
    const drop = stages.map(([, value], i) => (i === 0 ? 0 : stages[i - 1][1] - value));

    return asOption({
      animationDuration: 950,
      animationEasing: "cubicOut",
      grid: { left: 8, right: 12, top: 30, bottom: 46, containLabel: true },
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
            lines.push(`Lost at this gate &nbsp; <b style="color:${C.risk}">−${inr(drop[i])}</b>`);
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
          name: "Still moving",
          type: "bar",
          stack: "gate",
          barWidth: "56%",
          itemStyle: {
            color: (p: unknown) =>
              cb(p).dataIndex === stages.length - 1 ? fill(C.green) : fill(C.g1),
            borderRadius: [0, 0, 4, 4],
          },
          label: {
            show: true,
            position: "insideTop",
            distance: 9,
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 12.5,
            fontFamily: DISPLAY,
            formatter: (p: unknown) => inr(cb(p).value),
          },
          labelLayout: { hideOverlap: true },
          data: stages.map(([, value]) => value),
        },
        {
          name: "Lost at this gate",
          type: "bar",
          stack: "gate",
          barWidth: "56%",
          itemStyle: {
            color: C.riskWash,
            borderRadius: [4, 4, 0, 0],
            borderColor: C.riskSoft,
            borderWidth: 1,
            borderType: "dashed",
          },
          label: {
            show: true,
            position: "inside",
            color: C.risk,
            fontWeight: 700,
            fontSize: 11,
            fontFamily: FONT,
            formatter: (p: unknown) =>
              cb(p).value > PORTFOLIO.contractValue * 0.035 ? `−${inr(cb(p).value)}` : "",
          },
          labelLayout: { hideOverlap: true },
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
          ai="waterfall"
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
