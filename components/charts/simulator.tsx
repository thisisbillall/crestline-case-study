"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "@/components/charts/echart";
import { Card, CardFoot, CardHead } from "@/components/ui/primitives";
import { Pill, PillGroup } from "@/components/ui/pills";
import { PROJECTS, RATE, projectByRef, type Legs, type LeverKey } from "@/lib/data";
import { d1, inr } from "@/lib/format";
import { LEVERS, atTerms, opening, simulate, targetFor, targetLabel } from "@/lib/simulate";
import { C, DISPLAY, FONT, NO_LINE, TOOLTIP, grad, cb, asOption, fill } from "@/lib/chart-theme";

/**
 * THE CYCLE SIMULATOR.
 *
 * The diagram says where the money sits; this says what happens if a leg moves.
 * Every lever is a real balance at a measured rate, and the sliders stop where
 * the evidence stops — certification cannot go below the contract's window,
 * collection below the term the client signed, and vendor credit cannot exceed
 * what the vendors themselves agreed.
 */
export function Simulator() {
  const [ref, setRef] = useState("GI-WKD-10");
  const project = projectByRef(ref);
  const [legs, setLegs] = useState<Legs>(() => opening(projectByRef("GI-WKD-10")));

  const pick = (nextRef: string) => {
    setRef(nextRef);
    setLegs(opening(projectByRef(nextRef)));
  };

  const result = useMemo(() => simulate(project, legs), [project, legs]);
  const moved = result.legs.filter((leg) => Math.abs(leg.cash) > 1000);

  const option = useMemo(() => asOption({
      animationDuration: 420,
      animationEasing: "cubicOut",
      animationDurationUpdate: 320,
      grid: { left: 4, right: 82, top: 24, bottom: 4, containLabel: true },
      title: {
        text: moved.length ? "Where the cash comes from" : "Move a slider to release cash",
        left: 0,
        top: 0,
        textStyle: { color: C.muted, fontSize: 12, fontWeight: 500, fontFamily: FONT },
      },
      tooltip: {
        ...TOOLTIP,
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: unknown) => {
          const ps = params as { dataIndex: number }[];
          const leg = moved[ps[0].dataIndex];
          return `<b style="font-family:${DISPLAY}">${leg.label}</b><br>${d1(leg.now)} → ${d1(
            leg.next,
          )} days<br><b>${inr(leg.cash)}</b>`;
        },
      },
      xAxis: {
        type: "value",
        axisLabel: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: moved.map((leg) => leg.label.split(",")[0].split(" waiting")[0]),
        axisLine: NO_LINE,
        axisTick: { show: false },
        axisLabel: { fontSize: 11.5, color: C.muted, fontFamily: FONT, width: 104, overflow: "truncate" },
      },
      series: [
        {
          type: "bar",
          barWidth: 15,
          data: moved.map((leg) => ({
            value: Math.round(leg.cash),
            itemStyle: {
              color: leg.cash >= 0 ? fill(C.mint, true) : fill(C.rose, true),
              borderRadius: 7,
            },
          })),
          label: {
            show: true,
            position: "right",
            distance: 10,
            fontSize: 11.5,
            fontWeight: 700,
            fontFamily: FONT,
            color: C.ink,
            formatter: (p: unknown) => inr(cb(p).value),
          },
        },
      ],
    }),
    [moved],
  );

  return (
    <Card>
      <CardHead title="Cycle simulator">
        <PillGroup label="Project">
          {PROJECTS.map((p) => (
            <Pill key={p.ref} active={ref === p.ref} onClick={() => pick(p.ref)}>
              {p.short}
            </Pill>
          ))}
        </PillGroup>
        <Pill accent onClick={() => setLegs(atTerms(project))}>
          Set every leg to agreed terms
        </Pill>
        <Pill onClick={() => setLegs(opening(project))}>Reset</Pill>
      </CardHead>

      <div className="grid lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)]">
        <div className="px-5 pb-5 sm:px-6">
          {LEVERS.map((lever) => {
            const [min, max] = project.bounds[lever.key];
            const target = targetFor(project, lever.key);
            const delta = legs[lever.key] - project[lever.key];
            const goodWay = lever.key === "dpo" ? delta > 0 : delta < 0;

            return (
              <div key={lever.key} className="border-b border-hair py-4 last:border-b-0">
                <div className="mb-2.5 flex flex-wrap items-baseline gap-2.5">
                  <span className="font-display text-sm font-bold tracking-[-0.01em]">{lever.label}</span>
                  <span className="rounded-full bg-ground px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-faint">
                    {lever.side === "ours" ? "Ours to move" : "Counterparty’s"}
                  </span>
                  <span className="ml-auto text-[15px] font-bold">
                    {legs[lever.key].toFixed(1)} days
                    {Math.abs(delta) > 0.05 ? (
                      <span className={`ml-1.5 text-[12.5px] ${goodWay ? "text-good" : "text-bad"}`}>
                        {delta > 0 ? "+" : "−"}
                        {Math.abs(delta).toFixed(1)}
                      </span>
                    ) : null}
                  </span>
                </div>

                <input
                  id={`lever-${lever.key}`}
                  type="range"
                  min={min}
                  max={max}
                  step={0.1}
                  value={legs[lever.key]}
                  aria-label={lever.label}
                  onChange={(event) =>
                    setLegs((prev) => ({ ...prev, [lever.key as LeverKey]: Number(event.target.value) }))
                  }
                />

                <div className="mt-0.5 flex justify-between text-[11px] text-faint">
                  <span>{min.toFixed(0)}d</span>
                  {target === null ? (
                    <span className="text-faint">no agreed line</span>
                  ) : (
                    <span className="font-bold text-mint-ink">terms {target.toFixed(0)}d</span>
                  )}
                  <span>{max.toFixed(0)}d</span>
                </div>

                <p className="mt-2 text-xs leading-[1.5] text-muted">
                  {lever.note}{" "}
                  <b className="font-semibold text-ink">The line: {targetLabel(project, lever.key)}.</b>{" "}
                  Balance {inr(project.bal[lever.key])}, moving at {inr(project.perDay[lever.key])} a day.
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-hair bg-linear-170 from-lav-wash to-ground px-5 py-5 sm:px-6 lg:border-l lg:border-t-0">
          <div className="rounded-[var(--radius-inner)] border border-mint/70 bg-card px-5 py-4 shadow-[0_10px_26px_-12px_rgb(47_158_120/0.4)]">
            <div className="text-xs font-medium text-muted">Cash released, one-off</div>
            <div
              className={`mt-1 font-display text-[clamp(30px,4.4vw,42px)] font-extrabold leading-[1.05] tracking-[-0.035em] ${
                result.released >= 0 ? "text-good" : "text-bad"
              }`}
            >
              {inr(result.released)}
            </div>
            <div className="mt-1.5 text-[12.5px] text-muted">
              {inr(result.carry)} a year of carry at {RATE}%
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <Mini label="Cash cycle" value={result.cycleNext} was={result.cycleNow} />
            <Mini label="Money out → money in" value={result.gapNext} was={result.gapNow} />
          </div>

          <div className="mt-3 rounded-[11px] border border-dashed border-lav-ink/45 bg-card px-4 py-3.5 text-[12.5px] leading-[1.55] text-muted">
            <b className="font-bold text-ink">Make this the plan.</b> Raising this writes{" "}
            {result.cycleNext.toFixed(1)} days into the ticket as the target, on the same fact the auditor
            re-measures. It names the documents: {inr(project.bal.dso)} of invoices,{" "}
            {inr(project.bal.cad)} of unbilled work, {inr(project.bal.dpo)} of vendor bills.
          </div>

          <EChart option={option} height={190} replace ariaLabel="Cash released by leg" />
        </div>
      </div>

      <CardFoot>
        <b className="font-semibold text-ink">{project.full}</b> · rates measured from this project&rsquo;s own
        ledger: stock {inr(project.perDay.dio)}/day, revenue {inr(project.perDay.cad)}/day, invoiced{" "}
        {inr(project.perDay.dso)}/day, payable cost {inr(project.perDay.dpo)}/day. A leg whose rate the source
        never supplied is not drawn.
      </CardFoot>
    </Card>
  );
}

function Mini({ label, value, was }: { label: string; value: number; was: number }) {
  return (
    <div className="rounded-[11px] border border-edge bg-card px-3.5 py-3">
      <div className="text-[11px] font-medium text-faint">{label}</div>
      <div className="mt-0.5 font-display text-xl font-bold tracking-[-0.025em]">
        {value.toFixed(1)}
        <span className="text-xs font-medium text-faint"> d</span>
      </div>
      <div className="text-[11.5px] text-faint">was {was.toFixed(1)} d</div>
    </div>
  );
}
