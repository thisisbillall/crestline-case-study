import { BeforeSince } from "@/components/charts/before-since";
import { CapitalEfficiency } from "@/components/charts/capital-efficiency";
import { CashCycle } from "@/components/charts/cash-cycle";
import { Conformance } from "@/components/charts/conformance";
import { Crossover } from "@/components/charts/crossover";
import { PeakFunding } from "@/components/charts/peak-funding";
import { Simulator } from "@/components/charts/simulator";
import { VendorTerms } from "@/components/charts/vendor-terms";
import { Waterfall } from "@/components/charts/waterfall";
import { WhoFundsWhom } from "@/components/charts/who-funds-whom";
import { BottleneckTable } from "@/components/sections/bottleneck-table";
import { OperatingLoop } from "@/components/sections/operating-loop";
import { ProjectTable } from "@/components/sections/project-table";
import { ValueTable } from "@/components/sections/value-table";
import { CountUp } from "@/components/ui/count-up";
import {
  Beat,
  Pad,
  Sheet,
  StatCard,
  StatRow,
  SubBeat,
  Wrap,
} from "@/components/ui/primitives";
import { Bad, Good } from "@/components/ui/figure";
import { Grey } from "@/components/ui/grey";
import { Reveal } from "@/components/ui/reveal";
import { Masthead } from "@/components/shell/logo";
import { OutlineRail } from "@/components/shell/outline-rail";

export default function CaseStudy() {
  return (
    <main>
      <Wrap>
        <Sheet>
          {/* ---------------------------------------------------------- open */}
          <Pad className="pt-8 sm:pt-10">
            <Masthead />
          </Pad>

          <Pad className="pb-12 pt-9 sm:pb-16 sm:pt-12">
            <Reveal>
              <p className="text-[13px] font-semibold tracking-[0.02em] text-accent">
                Grey Infra, six live projects, 427 crore of contract value
              </p>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="mt-4 max-w-[19ch] text-[clamp(34px,6.2vw,62px)] font-extrabold leading-[1.02]">
                We found 12.2 crore sitting inside {<Grey s />} own ERP.
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-[58ch] text-[clamp(16px,1.7vw,19px)] leading-[1.6] text-muted">
                Nobody had to renegotiate a contract or chase a client harder. The money was already
                {" "}{<Grey s />}. It was trapped between the day {<Grey />} paid its vendors and the day its
                clients paid {<Grey />} back, and no report in the business could see that gap.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-faint">
                We read 6,837 events straight out of {<Grey s />} SAP instance, rebuilt 398 cases from them,
                and priced every wait. Here is what we found, and what we did about it.
              </p>
            </Reveal>

            <div className="mt-11">
              <StatRow>
                <StatCard
                  label="We released"
                  value={<CountUp to={12.2} decimals={1} prefix="₹" suffix=" Cr" />}
                  note="one off, at terms they had already signed"
                  tone="var(--color-accent)"
                />
                <StatCard
                  label="We cut the cash cycle"
                  value={
                    <>
                      <CountUp to={37.6} decimals={1} /> <span className="text-faint">to</span>{" "}
                      <CountUp to={13.2} decimals={1} />
                    </>
                  }
                  note="days from paying out to being paid"
                  tone="var(--color-g4)"
                  delay={60}
                />
                <StatCard
                  label="We stopped funding vendors"
                  value={<CountUp to={1.49} decimals={2} prefix="₹" suffix=" Cr" />}
                  note="a year of carry they were absorbing"
                  tone="var(--color-g4)"
                  delay={120}
                />
                <StatCard
                  label="We priced the process"
                  value={<CountUp to={2.01} decimals={2} prefix="₹" suffix=" Cr" />}
                  note="a year burning in waits nobody owned"
                  tone="var(--color-g4)"
                  delay={180}
                />
              </StatRow>
            </div>
          </Pad>

          {/* ------------------------------------------------- 01 what we found */}
          <Beat
            id="found"
            problem={<>The client pays in 45 days. The vendors are paid in 28.</>}
            outcome={
              <>
                We brought collection down to <Good>32.6 days</Good> and lifted vendor credit to{" "}
                <Good>40 days</Good>. The gap flipped from <Bad>17 days short</Bad> to{" "}
                <Good>7 days of free funding</Good>, without renegotiating a single contract.
              </>
            }
            how={
              <>
                Every day DSO sits above DPO is a day {<Grey />} bridges out of its own balance sheet.
                We did not ask {<Grey s />} clients to pay faster or its vendors to wait longer. We moved
                both clocks to the terms <b>already written into the contracts</b>, which nobody in
                the business had ever measured against. Certification had a 21 day window and was
                running at 31. Vendors had agreed 40 day terms and were being paid in 28.
              </>
            }
          >
            <Crossover />
          </Beat>

          <SubBeat
            id="cycle"
            title={
              <>
                {<Grey s />} cash cycle ran 37.6 days. We drew it to scale and it became obvious.
              </>
            }
            lead={
              <>
                Not a trend line, the cycle itself, from the day material is bought to the day the
                client pays. The vendor payment day is marked on the same axis, so the stretch {<Grey />}
                funds out of its own capital is the distance between two dots rather than a
                claim in a slide. Switch to agreed terms and watch the bar shorten.
              </>
            }
          >
            <CashCycle />
          </SubBeat>

          <SubBeat
            id="trough"
            title={
              <>
                {<Grey s />} year closed at minus 19.3 crore. In August it was 26 crore under water.
              </>
            }
            lead={
              <>
                A closing balance says the year funded itself. The trough says what the business
                actually had to borrow to get through the monsoon quarter, and no balance sheet in the
                company reported it. This is the number that sizes an overdraft, and we put it on the
                first screen {<Grey s />} CFO opens.
              </>
            }
          >
            <PeakFunding />
          </SubBeat>

          <SubBeat
            id="projects"
            title={<>Two of {<Grey s />} six projects carried more than half the capital.</>}
            lead={
              <>
                Working capital against contract value, so a 12 crore job and a 120 crore one can be
                compared at all. Wakad alone held 35.7 crore on a 95 crore contract and ran the
                longest cycle of the six. Once that was on one chart, the conversation stopped being
                about the portfolio and started being about Wakad.
              </>
            }
          >
            <CapitalEfficiency />
            <div className="mt-3.5">
              <ProjectTable />
            </div>
          </SubBeat>

          {/* ------------------------------------------------ 02 where it leaked */}
          <Beat
            id="leaked"
            problem={<>Every vendor was paid before the client paid. All of them.</>}
            outcome={
              <>
                We priced that habit at <Bad>₹1.49 crore a year</Bad> and showed them which 11
                vendors on which sites were doing it. On Wakad alone the money left{" "}
                <Bad>64.7 days</Bad> before it came back in.
              </>
            }
            how={
              <>
                On five of {<Grey s />} six projects, <b>100% of vendor spend</b> left the bank before a
                rupee of the matching client money arrived. Nobody had decided this. It was the
                residue of a payment run that went out on a fixed day and a collection that arrived
                whenever it arrived. We measured it off the order log, vendor by vendor, spend
                weighted, and put a rupee figure on the gap so it stopped being a feeling.
              </>
            }
          >
            <WhoFundsWhom />
          </Beat>

          <SubBeat
            id="terms"
            title={<>{<Grey />} was paying for credit its vendors had already given it.</>}
            lead={
              <>
                Terms against what actually happened, supplier by supplier. Paying inside terms is
                lending borrowed cash at zero. Paying past them is a risk, and on an MSME supplier it
                is a statutory breach that accrues interest. We showed both, and we called neither one
                an improvement. Talegaon had two MSME suppliers past the 45 day ceiling and nobody in
                the business knew.
              </>
            }
          >
            <VendorTerms />
          </SubBeat>

          <SubBeat
            id="waterfall"
            title={<>427 crore signed. 162 crore in the bank. We found where it stops.</>}
            lead={
              <>
                Contract value does not become cash in one step, it passes six gates, and it waits at
                every one. The largest single block of capital in the business was <b>52.2 crore of
                work they had built and could not yet bill</b>, sitting an average of 30 days against
                certification windows of 10 to 21.
              </>
            }
          >
            <Waterfall />
          </SubBeat>

          <SubBeat
            id="simulator"
            title={<>Then we let {<Grey s />} CFO move the levers.</>}
            lead={
              <>
                Every lever below is a real balance moving at a rate we measured from {<Grey s />} own
                ledger, the same four rates its ratios divide by. So a day removed here is worth
                exactly what the same day is worth on the cards above. The sliders stop where the
                evidence stops: certification cannot go below the window in the contract, collection
                cannot go below the term the client signed, and vendor credit cannot exceed what the
                vendors themselves agreed. <b>Cash can never be released by paying late.</b>
              </>
            }
          >
            <Simulator />
          </SubBeat>

          {/* ---------------------------------------------- 03 what we changed */}
          <Beat
            id="changed"
            problem={<>{<Grey s />} ERP knew what happened. It did not know how long anything took.</>}
            outcome={
              <>
                We rebuilt both processes from the event log: <Good>398 cases</Good>, 40 distinct
                steps, 67 routes nobody had designed. Then we ranked every wait by money instead of
                duration, and handed them a list of <Bad>25 bottlenecks</Bad> with a desk against
                each one.
              </>
            }
            how={
              <>
                Conformance came back at <b>61.8%</b>, meaning two cases in five took a route nobody
                intended and nobody could name which. We discovered order to cash and procure to pay
                separately, because an RA bill and a purchase order share nothing but the company.
                Bhiwandi turned out to be running 18 distinct variants of a process that was supposed
                to have one.
              </>
            }
          >
            <Conformance />
          </Beat>

          <SubBeat
            id="bottlenecks"
            title={<>The same handoff was the worst step on all six projects.</>}
            lead={
              <>
                Tax invoice raised to payment received. Between 15 and 55 days, with 162 crore of cash
                standing behind it, and it was <b>internally controllable</b>. Nothing outside the
                business had to change. That split, what is ours against what needs the client, is the
                difference between a report and an action list, and it is why this one got fixed
                first.
              </>
            }
          >
            <BottleneckTable />
          </SubBeat>

          <SubBeat
            id="before"
            title={<>On Chakan, three of the four gates moved.</>}
            lead={
              <>
                Certification fell from <b>30.1 days to 19.1</b> across 14 cases. Collection fell from{" "}
                <b>65.1 to 50.1</b> across 15. Vendor payment moved <b>ten days later</b>, towards the
                terms the vendors had agreed rather than past them. That is 699 case days returned to
                the cycle, measured from the same event log, not from a report anybody wrote. Two
                gates did not move at all, and we show those too.
              </>
            }
          >
            <BeforeSince />
          </SubBeat>

          <SubBeat
            id="loop"
            title={<>A ticket here does not close because somebody says the work is done.</>}
            lead={
              <>
                It closes because the figure it named was re measured from the source and had actually
                moved. There is deliberately no status a person can set to done. That single rule is
                the difference between this and every task tracker {<Grey s />} finance team had
                already abandoned, and it is why the numbers above are evidence rather than a claim.
              </>
            }
          >
            <OperatingLoop />
          </SubBeat>

          <SubBeat
            id="worth"
            title={<>12.2 crore released once. 4.63 crore a year, every year after.</>}
            lead={
              <>
                Every line below is measured from {<Grey s />} own records and priced at {<Grey s />} own
                cost of funds, 9.25%. Nothing here is an industry benchmark and nothing is a
                model&rsquo;s estimate. Where a figure is a target rather than a receipt, we say so on
                the row.
              </>
            }
          >
            <ValueTable />
          </SubBeat>

          {/* ------------------------------------------------------------- cta */}
          <section className="border-t border-hair">
            <Pad className="py-14 sm:py-20">
              <Reveal>
                <div className="flex flex-wrap items-center gap-8 rounded-[var(--radius-card)] border border-g3/50 bg-linear-140 from-[#efedfc] via-[#e9f7f1] to-[#fdf3ec] p-7 sm:p-10 lg:p-12">
                  <div className="flex-[1_1_320px]">
                    <h2 className="max-w-[19ch] text-[clamp(23px,3.1vw,34px)] font-extrabold leading-[1.14]">
                      Your event log already knows where your money is.
                    </h2>
                    <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.65] text-muted">
                      We sit above SAP, Oracle, Tally or Excel. Nothing is migrated, nothing is re
                      keyed, and no figure on any screen was authored by a person. Give us read access
                      and we will show you your own version of this page.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://crestlineintelligence.com"
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14.5px] font-bold text-white shadow-[0_10px_24px_-10px_rgb(26_29_38/0.6)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      Book a working capital review
                    </a>
                    <a
                      href="https://crestlineintelligence.com"
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-edge bg-card px-6 py-3.5 text-[14.5px] font-bold text-ink shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      crestlineintelligence.com
                    </a>
                  </div>
                </div>
              </Reveal>
            </Pad>
          </section>

          <footer className="border-t border-hair bg-ground/60">
            <Pad className="flex flex-wrap items-center justify-between gap-4 py-8 text-[12.5px] text-faint">
              <p>© Crestline. Working capital intelligence for EPC.</p>
              <p>Published with {<Grey s />} consent.</p>
            </Pad>
          </footer>
        </Sheet>

        <OutlineRail />
      </Wrap>
    </main>
  );
}
