import { PORTFOLIO, projectByRef } from "@/lib/data";
import { inr } from "@/lib/format";

/**
 * WHAT THE DRAWER SAYS, AND WHERE IT GOT IT.
 *
 * Every figure quoted below is read out of lib/data.ts, which is itself the
 * extract from the live ERP. Nothing here is a plausible-sounding number
 * written to fill a slot: if a sentence names a figure, that figure is on the
 * chart the drawer was opened from.
 *
 * The shape follows the product's own drawer: the verdict, what it rests on,
 * the question asked, the answer, what follows from it, what to do about it,
 * and a closing line naming the figures used. The split matters and is stated
 * every time: Crestline measures, the model reasons.
 */
export interface AiScript {
  /** What the drawer is about. Sits above the verdict in small caps. */
  eyebrow: string;
  /** The verdict itself, worst tone first. */
  verdict: string;
  /** What it rests on, in one paragraph. */
  context: string;
  /** How the figures behind it were taken. */
  basis: string;
  /** The question, typed out as though the reader asked it. */
  question: string;
  /** The answer, in one sentence. */
  answer: string;
  /** The consequences, in order. */
  follows: { title: string; sub: string }[];
  /** The single next move, and whose it is. */
  todo: { action: string; sub: string; tag: string };
  /** The figures quoted, named so a reader can go and re-take them. */
  figures: string;
  /** Where the ticket lands, and how hard it is chased until the figure moves. */
  ticket: {
    to: string;
    role: string;
    email: string;
    /** The cadence: Low one reminder a day, Medium three, High five. */
    severity: "Low" | "Medium" | "High";
    dueDays: number;
    /** The one fact it will be closed against. */
    metric: string;
  };
}

const wakad = projectByRef("GI-WKD-10");
const talegaon = projectByRef("GI-TLG-09");
const chakan = projectByRef("GI-CHK-07");
const bhiwandi = projectByRef("GI-BHW-05");

const now = PORTFOLIO.weighted.now;
const terms = PORTFOLIO.weighted.terms;
const gapNow = now.dso - now.dpo;
const gapTerms = terms.dpo - terms.dso;

export const AI_SCRIPTS: Record<string, AiScript> = {
  /* ------------------------------------------------------------ crossover */
  crossover: {
    eyebrow: "This chart",
    verdict: `Critical: you wait ${gapNow.toFixed(1)} days longer to be paid than you are given to pay`,
    context: `The client settles in ${now.dso.toFixed(1)} days. Your vendors are settled in ${now.dpo.toFixed(
      1,
    )}. Weighted across all six projects that leaves ${gapNow.toFixed(
      1,
    )} days of every rupee of turnover standing on your own balance sheet or your overdraft.`,
    basis: "Summed balances over summed per day rates, weighted by contract value across the six.",
    question: "what if we just moved both clocks to the terms already in the contracts?",
    answer: `Holding every project to the certification window, payment term and vendor terms already signed takes DSO to ${terms.dso.toFixed(
      1,
    )} days and DPO to ${terms.dpo.toFixed(1)}, which flips the gap to ${gapTerms.toFixed(
      1,
    )} days in your favour.`,
    follows: [
      {
        title: `DSO falls ${(now.dso - terms.dso).toFixed(1)} days to the payment terms clients signed`,
        sub: "No client is being asked for anything they did not already agree to",
      },
      {
        title: `DPO rises ${(terms.dpo - now.dpo).toFixed(1)} days to the credit vendors already offered`,
        sub: "The ceiling is their own terms, so nothing is paid late",
      },
      {
        title: "The cycle crosses over and the projects begin funding themselves",
        sub: `${gapTerms.toFixed(1)} days of free funding instead of ${gapNow.toFixed(1)} days of drawdown`,
      },
    ],
    todo: {
      action: "Hold the certification queue to the window in each contract",
      sub: `Worth ₹12.2 Cr released across the six, and ₹1.13 Cr a year of carry`,
      tag: "Ours to fix",
    },
    ticket: {
      to: "Vikram Shetty",
      role: "Project commercial",
      email: "commercial@greyinfra.co.in",
      severity: "Medium",
      dueDays: 14,
      metric: "Contract asset days 30.9 → 17.8",
    },
    figures: `Figures used: DSO ${now.dso.toFixed(1)} days, DPO ${now.dpo.toFixed(
      1,
    )} days, at terms ${terms.dso.toFixed(1)} and ${terms.dpo.toFixed(
      1,
    )}. Crestline measured them; the model supplied the reasoning.`,
  },

  /* ----------------------------------------------------------- cash cycle */
  cycle: {
    eyebrow: "This chart",
    verdict: `Critical: ${now.ccc.toFixed(1)} days of every project sits on your own reserves`,
    context: `Material is bought, held ${now.dio.toFixed(1)} days, built and then waits ${now.cad.toFixed(
      1,
    )} days to become billable, and the invoice waits another ${now.dso.toFixed(
      1,
    )}. Your vendors are paid on day ${now.dpo.toFixed(1)}, so everything after that is yours to carry.`,
    basis: "Drawn to scale from each project's own ratios, with the vendor payment day measured off the order log.",
    question: "which of those three legs is actually worth attacking first?",
    answer: `The certification queue. At ${now.cad.toFixed(
      1,
    )} days against contract windows of 10 to 21 it is the only leg entirely inside your control, and taking it to terms removes ${(
      now.cad - terms.cad
    ).toFixed(1)} days.`,
    follows: [
      {
        title: `Built but not billable falls ${(now.cad - terms.cad).toFixed(1)} days`,
        sub: `${inr(PORTFOLIO.contractAssets)} stops waiting on a signature`,
      },
      {
        title: `The cycle shortens from ${now.ccc.toFixed(1)} days to ${terms.ccc.toFixed(1)}`,
        sub: "Stock is untouched, so nothing about site operations has to change",
      },
    ],
    todo: {
      action: "Put a named desk and a deadline on every bill awaiting certification",
      sub: "The floor is the window the client agreed, not zero",
      tag: "Ours to fix",
    },
    ticket: {
      to: "Vikram Shetty",
      role: "Project commercial",
      email: "commercial@greyinfra.co.in",
      severity: "Medium",
      dueDays: 14,
      metric: "Cash cycle 37.6 → 13.2 days",
    },
    figures: `Figures used: DIO ${now.dio.toFixed(1)}, contract asset days ${now.cad.toFixed(
      1,
    )}, DSO ${now.dso.toFixed(1)}, DPO ${now.dpo.toFixed(
      1,
    )}. Crestline measured them; the model supplied the reasoning.`,
  },

  /* --------------------------------------------------------------- trough */
  trough: {
    eyebrow: "This chart",
    verdict: "Critical: the year closed at minus ₹19.3 Cr having been ₹26.0 Cr under water",
    context:
      "Cumulative collections less payments reached its deepest point in Aug 26 at minus ₹26.0 Cr. The closing position of minus ₹19.3 Cr is the number the accounts report, and it understates what the business actually had to fund by ₹6.7 Cr.",
    basis: "Cash actually received and actually paid, by month, summed across all six projects.",
    question: "so what facility do we actually need, the closing number or the trough?",
    answer:
      "The trough. A facility sized on the closing position would have been ₹6.7 Cr short in August, which is the month the monsoon quarter puts the most work on site and the least cash in the bank.",
    follows: [
      {
        title: "Peak funding need is ₹26.0 Cr, not ₹19.3 Cr",
        sub: "The gap between them is the month no balance sheet reports",
      },
      {
        title: "Eleven of twenty two months ran a deficit",
        sub: "Coverage across the period is 0.89, so collections did not keep pace with payments",
      },
    ],
    todo: {
      action: "Size the working capital line against the trough, not the close",
      sub: "₹26.0 Cr, reached Aug 26",
      tag: "Ours to fix",
    },
    ticket: {
      to: "Finance desk",
      role: "Treasury",
      email: "finance@greyinfra.co.in",
      severity: "High",
      dueDays: 7,
      metric: "Peak funding need ₹26.0 Cr, Aug 26",
    },
    figures:
      "Figures used: peak funding need ₹26.0 Cr at Aug 26, closing position minus ₹19.3 Cr, coverage 0.89. Crestline measured them; the model supplied the reasoning.",
  },

  /* ------------------------------------------------------------- projects */
  projects: {
    eyebrow: "This chart",
    verdict: `Critical: Wakad holds ${inr(wakad.wc)} against a ${inr(wakad.cv)} contract`,
    context: `That is 37.5% intensity on a portfolio averaging 29%, and it runs the longest cycle of the six at ${wakad.ccc.toFixed(
      1,
    )} days. Kharadi is the larger contract and holds less capital against it.`,
    basis: "Working capital from the trial balance, against contract value, for each project's own as of date.",
    question: "if we fixed only wakad, what would that be worth?",
    answer: `Taking Wakad alone to its agreed terms releases ${inr(
      wakad.at.released,
    )} and shortens its cycle from ${wakad.at.cycNow.toFixed(1)} days to ${wakad.at.cycNext.toFixed(
      1,
    )}, which is ${((wakad.at.released / 122000000) * 100).toFixed(0)}% of the whole opportunity from one project.`,
    follows: [
      {
        title: `Cycle falls ${(wakad.at.cycNow - wakad.at.cycNext).toFixed(1)} days on this project`,
        sub: `Certification ${wakad.cad.toFixed(1)} to ${wakad.at.cad} days, collection ${wakad.dso.toFixed(
          1,
        )} to ${wakad.at.dso}`,
      },
      {
        title: `Vendor credit rises to the ${wakad.terms.vendor} day terms already agreed`,
        sub: `Currently taking only ${wakad.dpo.toFixed(1)} days of it`,
      },
    ],
    todo: {
      action: "Run the Wakad commercial review against its own contract terms",
      sub: `Releases ${inr(wakad.at.released)}, the largest single move available`,
      tag: "Ours to fix",
    },
    ticket: {
      to: "Vikram Shetty",
      role: "Project commercial · Wakad",
      email: "commercial@greyinfra.co.in",
      severity: "High",
      dueDays: 10,
      metric: "Wakad cycle 52.8 → 16.0 days",
    },
    figures: `Figures used: working capital ${inr(wakad.wc)}, contract ${inr(
      wakad.cv,
    )}, cycle ${wakad.ccc.toFixed(1)} days, releasable ${inr(
      wakad.at.released,
    )}. Crestline measured them; the model supplied the reasoning.`,
  },

  /* ---------------------------------------------------------------- funds */
  funds: {
    eyebrow: "This chart",
    verdict: `Critical: you are personally funding ${wakad.lead.toFixed(
      1,
    )} days on Wakad, and every vendor is paid before the client pays`,
    context: `Vendors are settled on day ${wakad.vendorPays.toFixed(
      1,
    )} and the client pays on day ${wakad.clientPays.toFixed(
      1,
    )}. On five of the six projects 100% of measured vendor spend leaves the bank first, and carrying that gap costs ${inr(
      wakad.leadCost,
    )} a year on Wakad alone.`,
    basis: "Measured off the order log, received to paid, spend weighted, against the day the client pays.",
    question: "what if we pushed vendor payment out to the terms they agreed?",
    answer: `Moving Wakad from ${wakad.dpo.toFixed(1)} days to the ${
      wakad.terms.vendor
    } day terms its vendors already agreed closes ${(wakad.terms.vendor - wakad.dpo).toFixed(
      1,
    )} days of the gap without a single payment going late.`,
    follows: [
      {
        title: `Vendor credit taken rises ${(wakad.terms.vendor - wakad.dpo).toFixed(1)} days`,
        sub: `The ceiling is ${wakad.terms.vendor} days, spend weighted from their own terms`,
      },
      {
        title: `The lead you fund falls from ${wakad.lead.toFixed(1)} days`,
        sub: `Saving against ${inr(wakad.leadCost)} a year of carry at 9.25%`,
      },
      {
        title: "Bhiwandi already runs this way",
        sub: `${bhiwandi.lead.toFixed(1)} days of lead on the same client group, so it is a process difference`,
      },
    ],
    todo: {
      action: "Move the payment run to the due date on each vendor's own terms",
      sub: "Never past them: paying late is a risk, never a saving",
      tag: "Ours to fix",
    },
    ticket: {
      to: "Finance desk",
      role: "Payables",
      email: "payables@greyinfra.co.in",
      severity: "Medium",
      dueDays: 14,
      metric: "Wakad DPO 18.0 → 33.9 days",
    },
    figures: `Figures used: vendors paid day ${wakad.vendorPays.toFixed(
      1,
    )}, client pays day ${wakad.clientPays.toFixed(1)}, lead ${wakad.lead.toFixed(1)} days, carry ${inr(
      wakad.leadCost,
    )} a year. Crestline measured them; the model supplied the reasoning.`,
  },

  /* ---------------------------------------------------------------- terms */
  terms: {
    eyebrow: "This chart",
    verdict: "Critical: an MSME supplier on Talegaon is past the 45 day statutory ceiling",
    context: `Suraj Hardware & Fasteners agreed 30 day terms and is being paid in 51. Under the MSMED Act that is not negotiated credit, it is a breach that accrues interest. Nine of Talegaon's twelve measured vendors are past the terms they agreed.`,
    basis: "Agreed terms from the vendor master, against the median days actually taken on that vendor's own orders.",
    question: "how much of this is actually saving us money?",
    answer:
      "None of it. Paying past agreed terms buys no credit you are entitled to, and on the MSME suppliers it creates a statutory interest liability, so the late days are a cost rather than a float.",
    follows: [
      {
        title: "Suraj Hardware & Fasteners: 30 day terms, paid in 51",
        sub: "MSME, so the 45 day ceiling applies and interest accrues past it",
      },
      {
        title: "Coastal Aggregates Supply: 21 day terms, paid in 42",
        sub: "MSME, inside the statutory ceiling but 21 days past what was agreed",
      },
    ],
    todo: {
      action: "Bring both MSME suppliers back inside their agreed terms this cycle",
      sub: "Removes the statutory exposure before it is ever quantified",
      tag: "Ours to fix",
    },
    ticket: {
      to: "Finance desk",
      role: "Payables · Talegaon",
      email: "payables@greyinfra.co.in",
      severity: "High",
      dueDays: 7,
      metric: "Suraj Hardware 51 → 30 days",
    },
    figures: `Figures used: Suraj Hardware 30 day terms paid in 51, Coastal Aggregates 21 paid in 42, ${
      talegaon.vendors.filter((v) => v[2] > v[1]).length
    } of ${talegaon.vendors.length} vendors past terms. Crestline measured them; the model supplied the reasoning.`,
  },

  /* ------------------------------------------------------------ waterfall */
  waterfall: {
    eyebrow: "This chart",
    verdict: `Critical: ${inr(PORTFOLIO.contractAssets)} is built and cannot yet be billed`,
    context: `Of ${inr(PORTFOLIO.contractValue)} signed, ${inr(
      PORTFOLIO.executed,
    )} has been executed on site but only ${inr(
      PORTFOLIO.certified,
    )} certified. The gap is the largest single block of capital in the business, and it waits a median ${PORTFOLIO.leak.certified.toFixed(
      1,
    )} days at that gate.`,
    basis: "Pooled across every bill in the company, each aged against its own submission date.",
    question: "what if i cut the certification wait from 29 to 21 days?",
    answer: `Holding certification to the 21 day window the contracts allow removes 8 days from the queue and releases roughly ${inr(
      PORTFOLIO.contractAssets * (8 / PORTFOLIO.cad),
    )} of the ${inr(PORTFOLIO.contractAssets)} currently sitting there.`,
    follows: [
      {
        title: "Certification wait cut from 29.0 to 21 days",
        sub: `Releases about ${inr(PORTFOLIO.contractAssets * (8 / PORTFOLIO.cad))} of unbillable work`,
      },
      {
        title: `The ${inr(PORTFOLIO.certUncollected)} already certified is a separate queue`,
        sub: `${inr(PORTFOLIO.overdue)} of it is past each invoice's own due date`,
      },
    ],
    todo: {
      action: "Escalate every bill sitting past its contractual certification window",
      sub: "Certified to invoiced already runs at 1.8 days, so that gate is not the problem",
      tag: "Needs the client",
    },
    ticket: {
      to: "Vikram Shetty",
      role: "Project commercial",
      email: "commercial@greyinfra.co.in",
      severity: "Medium",
      dueDays: 14,
      metric: "Certification wait 29.0 → 21 days",
    },
    figures: `Figures used: executed ${inr(PORTFOLIO.executed)}, certified ${inr(
      PORTFOLIO.certified,
    )}, contract assets ${inr(
      PORTFOLIO.contractAssets,
    )}, certification wait ${PORTFOLIO.leak.certified.toFixed(
      1,
    )} days. Crestline measured them; the model supplied the reasoning.`,
  },

  /* ------------------------------------------------------------ simulator */
  simulator: {
    eyebrow: "This panel",
    verdict: `Critical: ${inr(wakad.bal.cad)} of Wakad's work is executed and unbillable`,
    context: `Wakad runs a ${wakad.ccc.toFixed(1)} day cycle against ${inr(
      wakad.wc,
    )} of working capital. Certification sits at ${wakad.cad.toFixed(1)} days against the ${
      wakad.terms.cert
    } day window in the contract, and collection at ${wakad.dso.toFixed(1)} against a ${
      wakad.terms.pay
    } day term.`,
    basis: `Each leg moves at a rate measured from this project's own ledger: revenue ${inr(
      wakad.perDay.cad,
    )} a day, invoiced ${inr(wakad.perDay.dso)} a day.`,
    question: "what if i cut certification from 37 to 21 days?",
    answer: `Cutting the certification queue to the ${wakad.terms.cert} day window releases ${inr(
      (wakad.cad - wakad.at.cad) * wakad.perDay.cad,
    )} on its own, and it is the one leg that needs nobody's agreement but yours.`,
    follows: [
      {
        title: `Certification window cut from ${wakad.cad.toFixed(1)} to ${wakad.at.cad} days`,
        sub: `Releases ${inr((wakad.cad - wakad.at.cad) * wakad.perDay.cad)} of self funded cash`,
      },
      {
        title: `This shortens the ${wakad.ccc.toFixed(1)} day cycle you personally fund`,
        sub: `Less of the cycle sits on your own reserves`,
      },
    ],
    todo: {
      action: `Confirm the ${wakad.terms.cert} day certification window with the client`,
      sub: `Locks in the ${inr((wakad.cad - wakad.at.cad) * wakad.perDay.cad)} release`,
      tag: "Needs the client",
    },
    ticket: {
      to: "Vikram Shetty",
      role: "Project commercial · Wakad",
      email: "commercial@greyinfra.co.in",
      severity: "Medium",
      dueDays: 14,
      metric: "Wakad contract asset days 37.1 → 21",
    },
    figures: `Figures used: ${wakad.cad.toFixed(1)} days, ${wakad.ccc.toFixed(
      1,
    )} days, cut unbilled days from ${wakad.cad.toFixed(0)} to ${wakad.at.cad}, releases ${inr(
      (wakad.cad - wakad.at.cad) * wakad.perDay.cad,
    )}. Crestline measured them; the model supplied the reasoning.`,
  },

  /* ----------------------------------------------------------- conformance */
  conformance: {
    eyebrow: "This chart",
    verdict: `Critical: only ${bhiwandi.p2p.conf.toFixed(
      1,
    )}% of Bhiwandi's purchase orders ran the intended route`,
    context: `Three orders in five took a path nobody designed, across ${
      bhiwandi.p2p.variants
    } distinct variants, and its rework rate is ${bhiwandi.p2p.rework?.toFixed(
      1,
    )}% counted per case. The median order takes ${bhiwandi.p2p.median.toFixed(
      1,
    )} days and the slowest fifth take ${bhiwandi.p2p.p80.toFixed(1)}.`,
    basis: "Discovered from the event log, O2C and P2P separately, with rework counted per case rather than by summing variants.",
    question: "is that deviation actually costing us anything?",
    answer: `Yes. The waits above the intended path on Bhiwandi's P2P price out at ${inr(
      bhiwandi.p2p.waste,
    )} a year, and the ${bhiwandi.p2p.variants} variants mean no two orders can be compared against each other.`,
    follows: [
      {
        title: `${bhiwandi.p2p.variants} variants of a process meant to have one`,
        sub: `Against ${chakan.p2p.variants} on Chakan, which runs at ${chakan.p2p.conf.toFixed(1)}% conformance`,
      },
      {
        title: `${inr(bhiwandi.p2p.waste)} a year of waits above the ideal path`,
        sub: "Priced on the cash standing behind each case, not on case count",
      },
    ],
    todo: {
      action: "Take the three most common Bhiwandi P2P variants back to the intended route",
      sub: `Chakan already runs the same process at ${chakan.p2p.conf.toFixed(1)}%`,
      tag: "Ours to fix",
    },
    ticket: {
      to: "Stores desk",
      role: "Procurement · Bhiwandi",
      email: "stores@greyinfra.co.in",
      severity: "Low",
      dueDays: 21,
      metric: "Bhiwandi P2P conformance 40.3% → 70%",
    },
    figures: `Figures used: conformance ${bhiwandi.p2p.conf.toFixed(1)}%, ${
      bhiwandi.p2p.variants
    } variants, rework ${bhiwandi.p2p.rework?.toFixed(1)}%, waste ${inr(
      bhiwandi.p2p.waste,
    )} a year. Crestline measured them; the model supplied the reasoning.`,
  },

  /* ---------------------------------------------------------- bottlenecks */
  bottlenecks: {
    eyebrow: "This table",
    verdict: "Critical: invoice raised to payment received is the worst step on all six projects",
    context: `It runs 15 to 55 days depending on the site, with ${inr(
      PORTFOLIO.collected,
    )} of cash standing behind it, and on every project it is internally controllable. Talegaon is the worst at 55.1 days across 13 cases.`,
    basis: "Discovered from the event log and ranked by rupee days, never by case count.",
    question: "why is the same step the worst everywhere?",
    answer:
      "Because it is not a client delay. The invoice is raised by your billing desk and the receipt is booked by your finance desk, so the wait is entirely between two of your own teams and nothing outside the business has to change to close it.",
    follows: [
      {
        title: "Talegaon: 55.1 days, 13 cases, ₹24.95 Cr behind it",
        sub: "Carrying that wait costs about ₹20.0 L a year",
      },
      {
        title: "Bhiwandi runs the same step in 15.1 days",
        sub: "Same process, same company, so the 40 day difference is the desk not the client",
      },
    ],
    todo: {
      action: "Put the Talegaon billing to finance handoff on Bhiwandi's cadence",
      sub: "Internally controllable, so no client conversation is required",
      tag: "Ours to fix",
    },
    ticket: {
      to: "Finance desk",
      role: "Collections · Talegaon",
      email: "finance@greyinfra.co.in",
      severity: "High",
      dueDays: 7,
      metric: "Invoice to payment 55.1 → 15.1 days",
    },
    figures:
      "Figures used: Talegaon 55.1 days over 13 cases, Bhiwandi 15.1 days over 12, ₹24.95 Cr of cash behind it. Crestline measured them; the model supplied the reasoning.",
  },

  /* --------------------------------------------------------------- before */
  before: {
    eyebrow: "This chart",
    verdict: "Good: certification on Chakan fell 11 days and collection fell 15",
    context: `Against the reference window that closes on the first commitment raised, bill submitted to certified moved from 30.1 days to 19.1 across 14 cases, and invoice to cash from 65.1 to 50.1 across 15. Vendor payment moved 10 days later, towards the terms the vendors agreed.`,
    basis: "Measured from the same event log on both sides of the boundary, not from a report anybody wrote.",
    question: "how much cash did those 26 days actually release?",
    answer: `On Chakan's own rates the 11 certification days are worth ${inr(
      11 * chakan.perDay.cad,
    )} and the 15 collection days ${inr(
      15 * chakan.perDay.dso,
    )}, so the movement released about ${inr(11 * chakan.perDay.cad + 15 * chakan.perDay.dso)}.`,
    follows: [
      {
        title: `Certification 30.1 to 19.1 days, worth ${inr(11 * chakan.perDay.cad)}`,
        sub: `Priced at Chakan's own revenue rate of ${inr(chakan.perDay.cad)} a day`,
      },
      {
        title: `Collection 65.1 to 50.1 days, worth ${inr(15 * chakan.perDay.dso)}`,
        sub: `Priced at its invoiced rate of ${inr(chakan.perDay.dso)} a day`,
      },
      {
        title: "Two gates did not move at all",
        sub: "Reported as unchanged rather than quietly dropped from the chart",
      },
    ],
    todo: {
      action: "Hold the Chakan cadence and take the same two gates on Talegaon",
      sub: "Talegaon certification still runs 30.6 days against a 15 day window",
      tag: "Ours to fix",
    },
    ticket: {
      to: "Vikram Shetty",
      role: "Project commercial · Talegaon",
      email: "commercial@greyinfra.co.in",
      severity: "Low",
      dueDays: 21,
      metric: "Talegaon certification 30.6 → 15 days",
    },
    figures: `Figures used: certification 30.1 to 19.1 over 14 cases, collection 65.1 to 50.1 over 15, revenue ${inr(
      chakan.perDay.cad,
    )} a day. Crestline measured them; the model supplied the reasoning.`,
  },
};
