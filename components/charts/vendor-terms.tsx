"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead } from "@/components/ui/primitives";
import { Pill, PillGroup } from "@/components/ui/pills";
import { PROJECTS, projectByRef } from "@/lib/data";
import { inr } from "@/lib/format";
import { AXIS_LABEL, C, DISPLAY, FONT, NO_LINE, SPLIT_LINE, TOOLTIP, grad, cb, asOption, fill } from "@/lib/chart-theme";

/**
 * TERMS AGAINST WHAT ACTUALLY HAPPENED.
 *
 * Paying inside terms is lending borrowed cash at zero. Paying past them is a
 * risk — and on an MSME supplier it is a statutory breach that accrues interest.
 * Both are drawn; neither is called an improvement.
 */
export function VendorTerms() {
  const [ref, setRef] = useState("GI-TLG-09");
  const project = projectByRef(ref);

  const vendors = useMemo(
    () => [...project.vendors].sort((a, b) => a[2] - a[1] - (b[2] - b[1])),
    [project],
  );

  const option = useMemo(() => {
    const max = Math.max(72, Math.max(...vendors.map((v) => v[2])) * 1.16);
    return asOption({
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { left: 8, right: 96, top: 14, bottom: 30, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: unknown) => {
          const ps = params as { dataIndex: number }[];
          const [name, terms, paid, spend, msme] = vendors[ps[0].dataIndex];
          const late = paid > terms;
          return [
            `<b style="font-family:${DISPLAY}">${name}</b>${
              msme ? ` <span style="color:${C.risk};font-weight:700">MSME</span>` : ""
            }`,
            `Terms agreed &nbsp; <b>${terms} days</b>`,
            `Actually paid in &nbsp; <b>${paid} days</b>`,
            `${late ? "Past terms by" : "Inside terms by"} &nbsp; <b>${Math.abs(paid - terms)} days</b>`,
            `Spend &nbsp; <b>${inr(spend)}</b>`,
          ].join("<br>");
        },
      },
      xAxis: {
        type: "value",
        max: Math.ceil(max),
        axisLabel: { ...AXIS_LABEL, formatter: "{value}d" },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: vendors.map(([name, , , , msme]) => (msme ? `${name}  • MSME` : name)),
        axisLine: NO_LINE,
        axisTick: { show: false },
        axisLabel: { fontSize: 12, color: C.ink, fontWeight: 500, fontFamily: FONT },
      },
      series: [
        {
          type: "bar",
          stack: "gap",
          barWidth: 14,
          silent: true,
          itemStyle: { color: "transparent" },
          data: vendors.map(([, terms, paid]) => Math.min(terms, paid)),
        },
        {
          type: "bar",
          stack: "gap",
          barWidth: 14,
          data: vendors.map(([, terms, paid]) => ({
            value: Math.max(0.4, Math.abs(paid - terms)),
            itemStyle: {
              color: paid > terms ? fill(C.riskSoft, true) : fill(C.greenSoft, true),
              borderRadius: 7,
            },
          })),
          label: {
            show: true,
            position: "right",
            distance: 14,
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: FONT,
            color: (p: unknown) =>
              vendors[cb(p).dataIndex][2] > vendors[cb(p).dataIndex][1] ? C.risk : C.green,
            formatter: (p: unknown) => {
              const [, terms, paid, spend] = vendors[cb(p).dataIndex];
              return `${paid > terms ? "+" : "−"}${Math.abs(paid - terms)}d · ${inr(spend)}`;
            },
          },
        },
        {
          type: "scatter",
          symbolSize: 13,
          z: 10,
          itemStyle: { color: "#fff", borderColor: C.faint, borderWidth: 3 },
          data: vendors.map(([, terms], i) => [terms, i]),
        },
        {
          type: "scatter",
          symbolSize: 13,
          z: 10,
          itemStyle: {
            color: (p: unknown) =>
              vendors[cb(p).dataIndex][2] > vendors[cb(p).dataIndex][1] ? C.risk : C.g2,
            borderColor: "#fff",
            borderWidth: 2,
          },
          labelLayout: { hideOverlap: true },
          data: vendors.map(([, , paid], i) => [paid, i]),
        },
      ],
    });
  }, [vendors]);

  const late = vendors.filter(([, terms, paid]) => paid > terms);
  const msmeLate = vendors.filter(([, , paid, , msme]) => msme && paid > 45);

  return (
    <Card>
      <CardHead title="Agreed terms against days actually taken" ai="terms">
        <PillGroup label="Project">
          {PROJECTS.map((p) => (
            <Pill key={p.ref} active={ref === p.ref} onClick={() => setRef(p.ref)}>
              {p.short}
            </Pill>
          ))}
        </PillGroup>
      </CardHead>
      <div className="flex flex-wrap gap-4 px-5 text-[12.5px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <i className="block size-[11px] rounded-full bg-card shadow-[inset_0_0_0_2.5px_var(--color-faint)]" />
          Terms agreed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="block size-[11px] rounded-full bg-g1" />
          Days taken
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="block size-[11px] rounded bg-bad" />
          Past terms
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="block size-[11px] rounded bg-accent-soft" />
          Inside terms
        </span>
      </div>
      <div className="px-3 pb-4">
        <EChart
          option={option}
          height={420}
          replace
          ariaLabel="Vendor terms against days actually taken"
        />
      </div>
      <CardFoot>
        <b className="font-semibold text-ink">{project.short}:</b> {late.length} of {vendors.length} top
        vendors paid past the terms they agreed
        {msmeLate.length ? (
          <>
            , and{" "}
            <b className="font-semibold text-ink">
              {msmeLate.length} MSME supplier{msmeLate.length > 1 ? "s are" : " is"} past the 45-day statutory
              ceiling
            </b>{" "}
            . That is not negotiated credit, it is a breach that accrues interest.
          </>
        ) : (
          ". No MSME supplier is past the statutory 45 days."
        )}
      </CardFoot>
    </Card>
  );
}
