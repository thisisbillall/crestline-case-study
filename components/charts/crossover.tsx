"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead, Rows, VerdictRow } from "@/components/ui/primitives";
import { PORTFOLIO } from "@/lib/data";
import { d1 } from "@/lib/format";
import {
  AXIS_LABEL,
  C,
  DISPLAY,
  FONT,
  NO_LINE,
  SPLIT_LINE,
  TOOLTIP,
  WASH,
  asOption,
  cb,
  fill,
} from "@/lib/chart-theme";

/**
 * THE THESIS CHART.
 *
 * Every day DSO sits above DPO is a day the business bridges out of its own
 * capital. At the terms already signed the two cross over — which is the whole
 * argument, drawn once.
 */
export function Crossover() {
  const [basis, setBasis] = useState<"now" | "terms">("now");
  const d = PORTFOLIO.weighted[basis];
  const gap = d.dso - d.dpo;
  const funded = gap > 0;

  const option = useMemo(() => asOption({
      animationDuration: 900,
      animationEasing: "elasticOut",
      animationDurationUpdate: 700,
      animationEasingUpdate: "cubicInOut",
      grid: { left: 6, right: 58, top: 40, bottom: 22, containLabel: true },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      xAxis: {
        type: "value",
        max: 56,
        axisLabel: { ...AXIS_LABEL, formatter: "{value}d" },
        splitLine: SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: ["We pay vendors in", "Client pays us in"],
        axisLine: NO_LINE,
        axisTick: { show: false },
        axisLabel: { fontSize: 13, color: C.ink, fontWeight: 600, fontFamily: FONT },
      },
      series: [
        {
          type: "bar",
          barWidth: 38,
          z: 3,
          data: [
            {
              value: d.dpo,
              itemStyle: {
                color: fill(C.g3, true),
                borderRadius: [0, 23, 23, 0],
                shadowBlur: 18,
                shadowColor: "rgba(212,134,74,.22)",
                shadowOffsetY: 5,
              },
            },
            {
              value: d.dso,
              itemStyle: {
                color: fill(C.g1, true),
                borderRadius: [0, 23, 23, 0],
                shadowBlur: 18,
                shadowColor: "rgba(74,134,196,.22)",
                shadowOffsetY: 5,
              },
            },
          ],
          label: {
            show: true,
            position: "right",
            distance: 12,
            fontSize: 17,
            fontWeight: 800,
            fontFamily: DISPLAY,
            color: C.ink,
            formatter: (p: unknown) => `${d1(cb(p).value)}d`,
          },
          markArea: {
            silent: true,
            itemStyle: { color: funded ? WASH[C.riskSoft] : WASH[C.greenSoft] },
            label: {
              show: true,
              position: "insideTop",
              distance: -26,
              color: funded ? C.risk : C.green,
              fontWeight: 700,
              fontSize: 12.5,
              fontFamily: FONT,
              formatter: `${funded ? "−" : "+"}${Math.abs(gap).toFixed(1)} days ${
                funded ? "funded by Grey Infra" : "of free funding"
              }`,
            },
            labelLayout: { hideOverlap: true },
            data: [[{ xAxis: Math.min(d.dso, d.dpo) }, { xAxis: Math.max(d.dso, d.dpo) }]],
          },
        },
      ],
    }),
    [d.dpo, d.dso, funded, gap],
  );

  const gapNow = PORTFOLIO.weighted.now.dso - PORTFOLIO.weighted.now.dpo;
  const gapTerms = PORTFOLIO.weighted.terms.dso - PORTFOLIO.weighted.terms.dpo;

  return (
    <>
      <Card>
        <CardHead title="DSO against DPO" sub="Weighted by contract value across the six" ai="crossover" aiAuto>
          <div
            role="group"
            aria-label="Basis"
            className="inline-flex rounded-full border border-edge bg-ground p-0.5"
          >
            {(["now", "terms"] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={basis === key}
                onClick={() => setBasis(key)}
                className={[
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200",
                  basis === key
                    ? "-translate-y-px bg-card text-ink shadow-soft"
                    : "text-muted hover:text-ink",
                ].join(" ")}
              >
                {key === "now" ? "As found" : "At agreed terms"}
              </button>
            ))}
          </div>
        </CardHead>
        <div className="px-3 pb-4">
          <EChart option={option} height={300} ariaLabel="DSO against DPO, weighted by contract value" />
        </div>
        <CardFoot>
          {basis === "now" ? (
            <>
              As found, DSO runs <b className="font-semibold text-ink">{gapNow.toFixed(1)} days above DPO</b>. Every
              one of those days is bridged by Grey Infra&rsquo;s own capital or its overdraft.
            </>
          ) : (
            <>
              At terms already signed, DPO runs{" "}
              <b className="font-semibold text-ink">{Math.abs(gapTerms).toFixed(1)} days above DSO</b>. The
              client&rsquo;s money arrives before the vendors&rsquo; falls due, so the projects fund themselves.
            </>
          )}
        </CardFoot>
      </Card>

      <Rows>
        <VerdictRow
          tone={basis === "now" ? "bad" : "good"}
          tags={["Weighted by contract value", "₹427 Cr · 6 projects"]}
        >
          {basis === "now" ? (
            <>
              The company is <em>{gapNow.toFixed(1)} days short</em> on every rupee of turnover
            </>
          ) : (
            <>
              The cycle crosses over: <em>{Math.abs(gapTerms).toFixed(1)} days of free funding</em>, at terms
              nobody has to renegotiate
            </>
          )}
        </VerdictRow>
        <VerdictRow tone="warn" tags={["₹52.2 Cr of contract assets", "Ours to fix"]}>
          Certification is the biggest leg: <em>30.9 days</em> of work built and not yet billable, against
          contract windows of 10 to 21 days
        </VerdictRow>
        <VerdictRow tone="good" tags={["Ceiling is the vendors' own terms", "Never paying late"]}>
          Vendor credit is the cheapest lever left: <em>11.8 days</em> of credit already agreed and not being
          taken
        </VerdictRow>
      </Rows>
    </>
  );
}
