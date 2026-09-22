"use client";

import { useMemo, useState } from "react";

import { Card, CardFoot, CardHead, Tag } from "@/components/ui/primitives";
import { Segmented } from "@/components/ui/pills";
import { BOTTLENECKS, projectByRef } from "@/lib/data";
import { inr } from "@/lib/format";

type Filter = "all" | "ours" | "theirs";

/**
 * BOTTLENECKS RANK BY MONEY, NOT DURATION.
 *
 * A four-day wait on ₹40 Cr beats a three week wait on ₹40 L. `ours` splits
 * what the business can fix from what needs the counterparty — and that split
 * is what makes it an action list rather than a report.
 */
export function BottleneckTable() {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(
    () =>
      BOTTLENECKS.filter((b) => (filter === "all" ? true : filter === "ours" ? b.ours : !b.ours)).sort(
        (a, b) => b.carry - a.carry,
      ),
    [filter],
  );

  const totalCarry = rows.reduce((total, b) => total + b.carry, 0);

  return (
    <Card>
      <CardHead title="Every discovered bottleneck, priced" ai="bottlenecks">
        <Segmented<Filter>
          label="Ownership"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "ours", label: "Ours to fix" },
            { value: "theirs", label: "Needs the client" },
          ]}
        />
      </CardHead>

      <div className="overflow-x-auto px-3 pb-5">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              {["Step or handoff", "Stream", "Project", "Median", "Cases", "Cash behind it", "Carry a year", "Owner"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap px-3 pb-3 text-[11px] font-semibold tracking-[0.04em] text-faint ${
                      i === 0 ? "pl-2 text-left" : "text-right"
                    }`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 14).map((b, i) => (
              <tr key={`${b.ref}-${b.step}-${i}`} className="transition-colors hover:bg-ground">
                <td className="border-t border-hair px-3 py-3 pl-2 text-left font-semibold">{b.step}</td>
                <td className="border-t border-hair px-3 py-3 text-right">
                  <Tag tone={b.stream === "O2C" ? "o2c" : "p2p"}>{b.stream}</Tag>
                </td>
                <td className="border-t border-hair px-3 py-3 text-left text-[11.5px] text-faint">
                  {projectByRef(b.ref).short}
                </td>
                <td className="border-t border-hair px-3 py-3 text-right">{b.medianDays.toFixed(1)}d</td>
                <td className="border-t border-hair px-3 py-3 text-right">{b.cases}</td>
                <td className="border-t border-hair px-3 py-3 text-right">{inr(b.cash)}</td>
                <td
                  className={`border-t border-hair px-3 py-3 text-right font-bold ${
                    b.carry > 1_000_000 ? "text-bad" : "text-warn"
                  }`}
                >
                  {inr(b.carry)}
                </td>
                <td className="border-t border-hair px-3 py-3 pr-2 text-right">
                  <Tag tone={b.ours ? "good" : "warn"}>
                    {b.ours ? "Ours" : "Client"} · {b.owner}
                  </Tag>
                </td>
              </tr>
            ))}
            <tr className="bg-accent-wash font-bold">
              <td className="rounded-l-xl px-3 py-3 pl-2 text-left">
                {rows.length} ranked by money, not duration
              </td>
              <td colSpan={5} />
              <td className="px-3 py-3 text-right text-bad">{inr(totalCarry)}</td>
              <td className="rounded-r-xl px-3 py-3 pr-2" />
            </tr>
          </tbody>
        </table>
      </div>

      <CardFoot>
        {filter === "ours" ? (
          <>
            <b className="font-semibold text-ink">Internally controllable.</b> Nothing outside the business has
            to change for any of these to improve.
          </>
        ) : filter === "theirs" ? (
          <>
            <b className="font-semibold text-ink">Needs the counterparty.</b> These are chased, never
            &ldquo;fixed&rdquo;. Client delay is never counted as ours.
          </>
        ) : (
          <>
            Ranked by <b className="font-semibold text-ink">rupee days</b>, never by case count. A four day
            wait on ₹40 Cr beats a three week wait on ₹40 L.
          </>
        )}
      </CardFoot>
    </Card>
  );
}
