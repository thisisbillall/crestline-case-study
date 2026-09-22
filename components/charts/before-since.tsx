"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead, Rows, VerdictRow } from "@/components/ui/primitives";
import { GATES } from "@/lib/data";
import { AXIS_LABEL, C, DISPLAY, FONT, LEGEND, NO_LINE, SPLIT_LINE, TOOLTIP, grad, cb, asOption, fill } from "@/lib/chart-theme";

/**
 * WHAT WAS HAPPENING BEFORE, AND WHAT HAS HAPPENED SINCE.
 *
 * The reference window closes on the first commitment raised on the project.
 * Everything after it is measured against that boundary from the same event
 * log. Two gates did not move, and they are drawn as not moving: a null is
 * never a zero, and an unchanged figure is reported rather than dropped.
 */
export function BeforeSince() {
  const option = useMemo(() => asOption({
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { left: 8, right: 130, top: 40, bottom: 30, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: unknown) => {
          const ps = params as { dataIndex: number }[];
          const [label, before, since, cases] = GATES[ps[0].dataIndex];
          const moved = before - since;
          const lines = [
            `<b style="font-family:${DISPLAY}">${label}</b>`,
            `Before &nbsp; <b>${before.toFixed(1)} days</b>`,
            `Since &nbsp; <b>${since.toFixed(1)} days</b>`,
          ];
          if (moved === 0) {
            lines.push(`<span style="color:${C.muted}">no change</span>`);
          } else {
            lines.push(
              `Change &nbsp; <b style="color:${moved > 0 ? C.good : C.roseInk}">${
                moved > 0 ? "−" : "+"
              }${Math.abs(moved).toFixed(1)} days</b>`,
              `Case-days returned &nbsp; <b>${(moved * cases).toFixed(0)}</b>`,
            );
          }
          return lines.join("<br>");
        },
      },
      legend: LEGEND,
      xAxis: {
        type: "value",
        max: 74,
        axisLabel: { ...AXIS_LABEL, formatter: "{value}d" },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: GATES.map(([label]) => label),
        axisLine: NO_LINE,
        axisTick: { show: false },
        axisLabel: { fontSize: 12, color: C.ink, fontWeight: 500, fontFamily: FONT },
      },
      series: [
        {
          name: "Before Crestline",
          type: "bar",
          barWidth: 12,
          barGap: "32%",
          itemStyle: { color: fill(C.slate, true), borderRadius: 6 },
          data: GATES.map(([, before]) => before),
        },
        {
          name: "Since",
          type: "bar",
          barWidth: 12,
          itemStyle: {
            color: (p: unknown) =>
              GATES[cb(p).dataIndex][1] > GATES[cb(p).dataIndex][2]
                ? fill(C.mint, true)
                : fill(C.slate, true),
            borderRadius: 6,
          },
          data: GATES.map(([, , since]) => since),
          label: {
            show: true,
            position: "right",
            distance: 12,
            fontSize: 11.5,
            fontWeight: 700,
            fontFamily: FONT,
            color: (p: unknown) =>
              GATES[cb(p).dataIndex][1] > GATES[cb(p).dataIndex][2] ? C.good : C.faint,
            formatter: (p: unknown) => {
              const [, before, since, cases] = GATES[cb(p).dataIndex];
              const moved = before - since;
              return moved > 0
                ? `−${moved.toFixed(1)}d · ${(moved * cases).toFixed(0)} case-days`
                : "no change";
            },
          },
        },
      ],
    }),
    [],
  );

  return (
    <>
      <Card>
        <CardHead
          title="Median days per gate, before against since"
          sub="Chakan MIDC · 7 months before, 13 months since"
        />
        <div className="px-3 pb-4">
          <EChart option={option} height={420} ariaLabel="Gate medians before and since Crestline" />
        </div>
        <CardFoot>
          <b className="font-semibold text-ink">Certification 30.1 &rarr; 19.1 days</b> across 14 cases ·{" "}
          <b className="font-semibold text-ink">collection 65.1 &rarr; 50.1 days</b> across 15 ·{" "}
          <b className="font-semibold text-ink">vendor payment 41.9 &rarr; 31.9 days</b> across 32. 699
          case-days returned to the cycle.
        </CardFoot>
      </Card>

      <Rows>
        <VerdictRow tone="good" tags={["Measured from the event log", "O2C"]}>
          Certification fell <em>11 days</em> across 14 cases once the queue had an owner and a deadline
          attached to it
        </VerdictRow>
        <VerdictRow tone="good" tags={["15 cases", "O2C"]}>
          Collection fell <em>15 days</em>. That is ₹3.04 Cr of invoiced value arriving a fortnight earlier,
          every cycle
        </VerdictRow>
        <VerdictRow tone="good" tags={["32 cases", "P2P"]}>
          Vendor payment moved <em>10 days later</em>, towards the terms vendors agreed. Credit taken,
          not stretched
        </VerdictRow>
        <VerdictRow tone="warn" tags={["A null is not a zero"]}>
          Two gates did not move at all, and Crestline reports that plainly rather than quietly dropping them
        </VerdictRow>
      </Rows>
    </>
  );
}
