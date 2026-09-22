"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead } from "@/components/ui/primitives";
import { Pill, PillGroup } from "@/components/ui/pills";
import { PORTFOLIO, PROJECTS, type Legs } from "@/lib/data";
import { d1, inr } from "@/lib/format";
import { AXIS_LABEL, C, FONT, NO_LINE, SPLIT_LINE, TOOLTIP, asOption, cb, fill } from "@/lib/chart-theme";

/**
 * THE CASH CYCLE, DRAWN TO SCALE.
 *
 * Not a trend line — the cycle itself, from the day material is bought to the
 * day the client pays, with the vendor-payment day marked. Markers land where
 * the data puts them rather than in a canonical order: on most of these
 * projects the work finishes before the material is paid for, and the diagram
 * should surface that rather than assume it away.
 */
export function CashCycle() {
  const [ref, setRef] = useState<string>("ALL");

  const data = useMemo(() => {
    if (ref === "ALL") {
      return {
        short: "All six projects",
        now: PORTFOLIO.weighted.now as unknown as Legs,
        terms: PORTFOLIO.weighted.terms as unknown as Legs,
        project: null,
      };
    }
    const p = PROJECTS.find((q) => q.ref === ref)!;
    return {
      short: p.short,
      now: { dio: p.dio, cad: p.cad, dso: p.dso, dpo: p.dpo },
      terms: { dio: p.at.dio, cad: p.at.cad, dso: p.at.dso, dpo: p.at.dpo },
      project: p,
    };
  }, [ref]);

  const rows = [
    { label: "At agreed terms", legs: data.terms },
    { label: "As found", legs: data.now },
  ];

  const option = useMemo(() => {
    const leg = (
      key: "dio" | "cad" | "dso",
      name: string,
      pastel: string,
      radius: number | number[],
    ) => ({
      name,
      type: "bar" as const,
      stack: "cycle",
      barWidth: 40,
      itemStyle: {
        color: fill(pastel, true),
        borderRadius: radius,
        shadowBlur: 14,
        shadowColor: "rgba(26,29,38,.10)",
        shadowOffsetY: 4,
      },
      label: {
        show: true,
        position: "inside" as const,
        color: "#fff",
        fontWeight: 700,
        fontSize: 12,
        fontFamily: FONT,
        formatter: (p: unknown) => (cb(p).value >= 9 ? `${cb(p).value.toFixed(0)}d` : ""),
      },
      data: rows.map((r) => Number(r.legs[key].toFixed(1))),
    });

    return asOption({
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { left: 6, right: 22, top: 34, bottom: 26, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        top: 0,
        left: 0,
        icon: "roundRect",
        itemWidth: 11,
        itemHeight: 11,
        itemGap: 18,
        textStyle: { color: C.muted, fontSize: 12, fontFamily: FONT },
      },
      xAxis: {
        type: "value",
        axisLabel: { ...AXIS_LABEL, formatter: "{value}d" },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: rows.map((r) => r.label),
        axisLine: NO_LINE,
        axisTick: { show: false },
        axisLabel: { fontSize: 12.5, color: C.ink, fontWeight: 600, fontFamily: FONT },
      },
      series: [
        leg("dio", "Stock on site", C.lav, [20, 0, 0, 20]),
        leg("cad", "Built, not billable", C.butter, 0),
        leg("dso", "Invoiced, unpaid", C.sky, [0, 20, 20, 0]),
        {
          name: "Vendor paid",
          type: "scatter",
          symbolSize: 15,
          z: 10,
          itemStyle: {
            color: "#fff",
            borderColor: C.peachInk,
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: "rgba(212,134,74,.4)",
          },
          data: rows.map((r, i) => [Number(r.legs.dpo.toFixed(1)), i]),
          tooltip: {
            formatter: (p: unknown) =>
              `Vendors paid on day <b>${(cb(p).value as unknown as number[])[0].toFixed(0)}</b>`,
          },
        },
      ],
    });
  }, [rows]);

  const now = data.now.dio + data.now.dso - data.now.dpo;
  const next = data.terms.dio + data.terms.dso - data.terms.dpo;

  return (
    <Card>
      <CardHead title="Material bought → client pays" sub={`${data.short} · drawn to scale`}>
        <PillGroup label="Project">
          <Pill active={ref === "ALL"} onClick={() => setRef("ALL")}>
            All six
          </Pill>
          {PROJECTS.map((p) => (
            <Pill key={p.ref} active={ref === p.ref} onClick={() => setRef(p.ref)}>
              {p.short}
            </Pill>
          ))}
        </PillGroup>
      </CardHead>
      <div className="px-3 pb-4">
        <EChart option={option} height={300} ariaLabel="The cash cycle drawn to scale" />
      </div>
      <CardFoot>
        Cash cycle <b className="font-semibold text-ink">{d1(now)} days</b> today,{" "}
        <b className="font-semibold text-ink">{d1(next)} days</b> at the contract&rsquo;s own certification
        window, the client&rsquo;s signed payment term and the vendors&rsquo; spend-weighted terms.{" "}
        {data.project ? (
          <>
            Releases <b className="font-semibold text-ink">{inr(data.project.at.released)}</b> on this project
            alone.
          </>
        ) : (
          <>
            Releases <b className="font-semibold text-ink">₹12.2 Cr</b> across the six.
          </>
        )}
      </CardFoot>
    </Card>
  );
}
