"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead, Rows, VerdictRow } from "@/components/ui/primitives";
import { PROJECTS, projectByRef } from "@/lib/data";
import { inr } from "@/lib/format";
import { AXIS_LABEL, C, DISPLAY, FONT, NO_LINE, SPLIT_LINE, TOOLTIP, grad, cb, asOption, fill } from "@/lib/chart-theme";

/**
 * WHO FUNDS WHOM.
 *
 * The vendor idiom: a hollow dot for the day vendors are paid, a solid dot for
 * the day the client pays, and a band between whose DIRECTION is the reading.
 * Two bars side by side would hide the difference; a diverging bar would destroy
 * the absolute position. Draw both ends and let the gap be the gap.
 */
export function WhoFundsWhom() {
  const rows = useMemo(() => [...PROJECTS].sort((a, b) => a.lead - b.lead), []);

  const option = useMemo(() => asOption({
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { left: 8, right: 108, top: 14, bottom: 30, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: unknown) => {
          const ps = params as { dataIndex: number }[];
          const p = rows[ps[0].dataIndex];
          return [
            `<b style="font-family:${DISPLAY}">${p.short}</b>`,
            `Vendors paid &nbsp; <b>day ${p.vendorPays.toFixed(0)}</b>`,
            `Client pays &nbsp; <b>day ${p.clientPays.toFixed(0)}</b>`,
            `Financed by us &nbsp; <b>${p.lead.toFixed(1)} days</b>`,
            `Carry a year &nbsp; <b>${inr(p.leadCost)}</b>`,
            `Spend paid first &nbsp; <b>${p.shareBefore.toFixed(0)}%</b>`,
          ].join("<br>");
        },
      },
      xAxis: {
        type: "value",
        max: 122,
        axisLabel: { ...AXIS_LABEL, formatter: "{value}d" },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: rows.map((p) => p.short),
        axisLine: NO_LINE,
        axisTick: { show: false },
        axisLabel: { fontSize: 12.5, color: C.ink, fontWeight: 600, fontFamily: FONT },
      },
      series: [
        {
          type: "bar",
          stack: "gap",
          barWidth: 16,
          silent: true,
          itemStyle: { color: "transparent" },
          data: rows.map((p) => p.vendorPays),
        },
        {
          type: "bar",
          stack: "gap",
          barWidth: 16,
          itemStyle: {
            color: fill(C.peach, true),
            borderRadius: 8,
            shadowBlur: 12,
            shadowColor: "rgba(215,107,120,.20)",
            shadowOffsetY: 3,
          },
          data: rows.map((p) => Number((p.clientPays - p.vendorPays).toFixed(1))),
          label: {
            show: true,
            position: "right",
            distance: 14,
            color: C.roseInk,
            fontWeight: 700,
            fontSize: 12,
            fontFamily: FONT,
            formatter: (p: unknown) =>
              `${rows[cb(p).dataIndex].lead.toFixed(0)}d · ${inr(rows[cb(p).dataIndex].leadCost)}`,
          },
        },
        {
          type: "scatter",
          symbolSize: 14,
          z: 10,
          itemStyle: { color: "#fff", borderColor: C.peachInk, borderWidth: 3 },
          data: rows.map((p, i) => [p.vendorPays, i]),
        },
        {
          type: "scatter",
          symbolSize: 14,
          z: 10,
          itemStyle: {
            color: C.skyInk,
            borderColor: "#fff",
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: "rgba(74,134,196,.4)",
          },
          data: rows.map((p, i) => [p.clientPays, i]),
        },
      ],
    }),
    [rows],
  );

  const wakad = projectByRef("GI-WKD-10");
  const bhiwandi = projectByRef("GI-BHW-05");

  return (
    <>
      <Card>
        <CardHead
          title="Vendor paid → client pays"
          sub="Measured off the order log, spend weighted, never inferred from terms"
        />
        <div className="flex flex-wrap gap-4 px-5 text-[12.5px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <i className="block size-[11px] rounded-full bg-card shadow-[inset_0_0_0_2.5px_var(--color-peach-ink)]" />
            Vendor paid
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="block size-[11px] rounded-full bg-sky-ink" />
            Client pays
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="block size-[11px] rounded bg-rose" />
            Financed by Grey Infra
          </span>
        </div>
        <div className="px-3 pb-4">
          <EChart option={option} height={360} ariaLabel="Vendor payment day against client payment day" />
        </div>
        <CardFoot>
          <b className="font-semibold text-ink">₹1.49 Cr a year</b> of carry on the gap, at 9.25%. Lead days
          run from 10 on Bhiwandi to 65 on Wakad.
        </CardFoot>
      </Card>

      <Rows>
        <VerdictRow tone="bad" tags={["100% of measured spend", "P2P"]}>
          <em>Wakad</em> pays its vendors 64.7 days before the client pays, costing{" "}<em>{inr(wakad.leadCost)} a year</em> in carry on that one project
        </VerdictRow>
        <VerdictRow tone="bad" tags={["Vendor terms 36.1 days", "P2P"]}>
          <em>Talegaon</em> runs the same gap at 57.5 days while its own DPO is only 27.2. The credit
          is agreed and not taken
        </VerdictRow>
        <VerdictRow tone="good" tags={["Same client as Talegaon", "The difference is the process"]}>
          <em>Bhiwandi</em> proves it is fixable: 10.4 days of lead, 81% of spend paid first,{" "}
          <em>{inr(bhiwandi.leadCost)} a year</em>
        </VerdictRow>
      </Rows>
    </>
  );
}
