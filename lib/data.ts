/**
 * GREY INFRA — THE FIGURES.
 *
 * Every number here was extracted from Grey Infra's live Postgres through
 * Crestline's own repository → derive → view-model layer, so each one is a
 * figure the product itself prints. Nothing is authored, rounded for effect or
 * back-solved to a target.
 *
 * Verified: `simulate()` in lib/simulate.ts reproduces the product's own cycle
 * simulator on all six projects to within rounding.
 */

export interface Project {
  ref: string;
  short: string;
  full: string;
  client: string;
  health: "Healthy" | "Watch" | "Strained";
  /** Contract value, working capital, certified and collected — in rupees. */
  cv: number;
  wc: number;
  cert: number;
  coll: number;
  /** The four ratios plus contract-asset days, as the WC tab reports them. */
  dio: number;
  cad: number;
  dso: number;
  dpo: number;
  ccc: number;
  /** The rate each leg's balance moves at, per day. The simulator's currency. */
  perDay: Legs;
  /** Today's balance behind each leg. */
  bal: Legs;
  /** What this contract and these vendors actually agreed. */
  terms: { cert: number; pay: number; vendor: number };
  /** Honest slider bounds: the evidence stops here. */
  bounds: Record<LeverKey, [number, number]>;
  /** The product's own answer at agreed terms. */
  at: Legs & { released: number; carry: number; cycNow: number; cycNext: number };
  /** Spend-weighted days between paying vendors and being paid, and its carry. */
  lead: number;
  leadCost: number;
  clientPays: number;
  vendorPays: number;
  /** Share of vendor spend paid before the client pays. */
  shareBefore: number;
  peak: number;
  peakAt: string;
  events: number;
  cases: number;
  o2c: Stream;
  p2p: Stream;
  /** name, agreed terms, days actually taken, spend, MSME. */
  vendors: [string, number, number, number, boolean][];
}

export type LeverKey = "dio" | "cad" | "dso" | "dpo";
export type Legs = Record<LeverKey, number>;

export interface Stream {
  cases: number;
  median: number;
  p80: number;
  conf: number;
  waste: number;
  steps: number;
  variants: number;
  rework?: number;
}

/** Grey Infra's own stated cost of funds. Every carry figure is priced at it. */
export const RATE = 9.25;

export const PROJECTS: Project[] = [
  {
    ref: "GI-BHW-05",
    short: "Bhiwandi",
    full: "Bhiwandi Logistics Park — Warehouse Block A",
    client: "Northgate Logistics Parks",
    health: "Healthy",
    cv: 120_000_000, wc: 42_364_000, cert: 84_830_000, coll: 65_930_000,
    dio: 19.7, cad: 19.1, dso: 16.1, dpo: 55.2, ccc: -19.5,
    perDay: { dio: 171_490, cad: 214_217, dso: 214_217, dpo: 195_960 },
    bal: { dio: 0, cad: 18_470_000, dso: 12_744_000, dpo: 12_400_000 },
    terms: { cert: 10, pay: 15, vendor: 39.3 },
    bounds: { dio: [0, 34.7], cad: [10, 39.1], dso: [15, 46.1], dpo: [0, 55.2] },
    at: { dio: 19.7, cad: 10, dso: 15, dpo: 55.2, released: 2_180_447, carry: 201_691, cycNow: -19.5, cycNext: -20.6 },
    lead: 10.4, leadCost: 203_934, clientPays: 54.8, vendorPays: 44.5, shareBefore: 81.4,
    peak: 22_115_000, peakAt: "Jul 27", events: 1590, cases: 100,
    o2c: { cases: 16, median: 43.3, p80: 52.9, conf: 56.3, waste: 391_240, steps: 16, variants: 6 },
    p2p: { cases: 72, median: 67.1, p80: 87.1, conf: 40.3, rework: 11.1, waste: 463_516, steps: 24, variants: 18 },
    vendors: [
      ["Kalinga Structural Steel", 45, 51, 24_700_000, false],
      ["Sanghvi Steel & Rebar", 30, 36, 9_100_000, false],
      ["Nova HVAC Systems", 45, 66, 7_400_000, false],
      ["Volt Electricals", 45, 66, 7_000_000, false],
      ["Suraj Hardware & Fasteners", 30, 36, 6_100_000, true],
      ["Coastal Aggregates Supply", 21, 42, 5_200_000, true],
    ],
  },
  {
    ref: "GI-PKC-06",
    short: "Veronika Society",
    full: "Veronika Society — Residential Towers, PK Chowk",
    client: "Sanskriti Developers",
    health: "Watch",
    cv: 500_000_000, wc: 108_895_000, cert: 191_000_000, coll: 191_000_000,
    dio: 26.9, cad: 33.0, dso: 42.2, dpo: 60.7, ccc: 8.4,
    perDay: { dio: 400_458, cad: 437_071, dso: 437_071, dpo: 457_666 },
    bal: { dio: 15_000_000, cad: 69_000_000, dso: 0, dpo: 45_000_000 },
    terms: { cert: 21, pay: 30, vendor: 34.0 },
    bounds: { dio: [0, 41.9], cad: [21, 53.0], dso: [30, 72.2], dpo: [0, 60.7] },
    at: { dio: 26.9, cad: 21, dso: 30, dpo: 60.7, released: 10_605_788, carry: 981_035, cycNow: 8.4, cycNext: -3.8 },
    lead: 38.5, leadCost: 1_658_118, clientPays: 102.1, vendorPays: 63.7, shareBefore: 100,
    peak: 78_900_000, peakAt: "Jul 26", events: 264, cases: 23,
    o2c: { cases: 6, median: 87.4, p80: 106.9, conf: 50.0, waste: 1_667_640, steps: 15, variants: 4 },
    p2p: { cases: 10, median: 93.7, p80: 116.2, conf: 60.0, rework: 0, waste: 2_055_570, steps: 20, variants: 4 },
    vendors: [
      ["Sanghvi Steel & Rebar", 30, 61, 40_000_000, false],
      ["Deccan Ready-Mix Concrete", 30, 56, 30_000_000, false],
      ["Nova HVAC Systems", 45, 96, 30_000_000, false],
      ["UltraBind Cement Distributors", 30, 36, 25_000_000, false],
      ["Suraj Hardware & Fasteners", 30, 51, 20_000_000, true],
      ["Coastal Aggregates Supply", 21, 47, 18_000_000, true],
    ],
  },
  {
    ref: "GI-CHK-07",
    short: "Chakan MIDC",
    full: "Chakan MIDC — Automotive Component Plant",
    client: "Nexa Auto Components",
    health: "Healthy",
    cv: 850_000_000, wc: 193_120_714, cert: 410_505_000, coll: 363_755_000,
    dio: 19.9, cad: 24.4, dso: 49.3, dpo: 23.3, ccc: 45.9,
    perDay: { dio: 291_542, cad: 711_447, dso: 711_447, dpo: 578_510 },
    bal: { dio: 0, cad: 74_795_000, dso: 55_165_000, dpo: 10_900_000 },
    terms: { cert: 21, pay: 45, vendor: 38.7 },
    bounds: { dio: [0, 34.9], cad: [21, 44.4], dso: [45, 79.3], dpo: [0, 38.7] },
    at: { dio: 19.9, cad: 21, dso: 45, dpo: 38.7, released: 14_367_399, carry: 1_328_984, cycNow: 45.9, cycNext: 26.2 },
    lead: 51.2, leadCost: 2_722_391, clientPays: 93.5, vendorPays: 42.3, shareBefore: 100,
    peak: 58_900_500, peakAt: "Aug 26", events: 1267, cases: 88,
    o2c: { cases: 22, median: 80.9, p80: 98.8, conf: 77.3, waste: 2_712_449, steps: 16, variants: 6 },
    p2p: { cases: 54, median: 77.1, p80: 87.1, conf: 64.8, rework: 5.6, waste: 605_383, steps: 24, variants: 9 },
    vendors: [
      ["Apex Formwork Systems", 45, 51, 23_300_000, false],
      ["UltraBind Cement Distributors", 30, 36, 23_300_000, false],
      ["Nova HVAC Systems", 45, 51, 22_800_000, false],
      ["Sanghvi Steel & Rebar", 30, 36, 22_100_000, false],
      ["Volt Electricals", 45, 51, 21_900_000, false],
      ["Deccan Ready-Mix Concrete", 30, 36, 20_100_000, false],
    ],
  },
  {
    ref: "GI-KHR-08",
    short: "Kharadi",
    full: "Kharadi — IT Office Tower, Core & Shell",
    client: "Panorama Realty Ventures",
    health: "Watch",
    cv: 1_200_000_000, wc: 333_645_714, cert: 536_000_000, coll: 468_000_000,
    dio: 19.9, cad: 27.0, dso: 37.1, dpo: 24.0, ccc: 33.0,
    perDay: { dio: 446_780, cad: 928_943, dso: 928_943, dpo: 791_161 },
    bal: { dio: 0, cad: 144_000_000, dso: 80_240_000, dpo: 1_000_000 },
    terms: { cert: 14, pay: 30, vendor: 37.8 },
    bounds: { dio: [0, 34.9], cad: [14, 47.0], dso: [30, 67.1], dpo: [0, 37.8] },
    at: { dio: 19.9, cad: 14, dso: 30, dpo: 37.8, released: 29_580_192, carry: 2_736_168, cycNow: 33.0, cycNext: 12.1 },
    lead: 41.3, leadCost: 3_016_289, clientPays: 84.0, vendorPays: 42.7, shareBefore: 100,
    peak: 54_821_000, peakAt: "Nov 26", events: 1244, cases: 85,
    o2c: { cases: 19, median: 56.9, p80: 89.9, conf: 68.4, waste: 3_325_713, steps: 15, variants: 5 },
    p2p: { cases: 54, median: 77.1, p80: 87.1, conf: 70.4, rework: 5.6, waste: 1_308_125, steps: 24, variants: 8 },
    vendors: [
      ["Nova HVAC Systems", 45, 51, 62_300_000, false],
      ["Apex Formwork Systems", 45, 51, 32_100_000, false],
      ["Sanghvi Steel & Rebar", 30, 36, 31_300_000, false],
      ["Volt Electricals", 45, 51, 30_900_000, false],
      ["Suraj Hardware & Fasteners", 30, 36, 28_000_000, true],
      ["Coastal Aggregates Supply", 21, 27, 24_000_000, true],
    ],
  },
  {
    ref: "GI-TLG-09",
    short: "Talegaon",
    full: "Talegaon Logistics Park — Blocks A to D",
    client: "Northgate Logistics Parks",
    health: "Strained",
    cv: 650_000_000, wc: 192_505_714, cert: 303_500_000, coll: 249_500_000,
    dio: 19.9, cad: 37.8, dso: 53.2, dpo: 27.2, ccc: 45.9,
    perDay: { dio: 324_437, cad: 525_997, dso: 525_997, dpo: 619_064 },
    bal: { dio: 0, cad: 56_500_000, dso: 63_720_000, dpo: 22_100_000 },
    terms: { cert: 15, pay: 30, vendor: 36.1 },
    bounds: { dio: [0, 34.9], cad: [15, 57.8], dso: [30, 83.2], dpo: [0, 36.1] },
    at: { dio: 19.9, cad: 15, dso: 30, dpo: 36.1, released: 29_749_102, carry: 2_751_792, cycNow: 45.9, cycNext: 13.7 },
    lead: 57.5, leadCost: 3_361_146, clientPays: 110.9, vendorPays: 53.4, shareBefore: 100,
    peak: 66_191_000, peakAt: "Jul 27", events: 1230, cases: 84,
    o2c: { cases: 18, median: 71.4, p80: 105.9, conf: 61.1, waste: 2_769_493, steps: 13, variants: 5 },
    p2p: { cases: 54, median: 87.1, p80: 87.1, conf: 64.8, rework: 5.6, waste: 809_050, steps: 24, variants: 8 },
    vendors: [
      ["Apex Formwork Systems", 45, 66, 25_900_000, false],
      ["Suraj Hardware & Fasteners", 30, 51, 25_200_000, true],
      ["Sanghvi Steel & Rebar", 30, 51, 25_000_000, false],
      ["Coastal Aggregates Supply", 21, 42, 24_800_000, true],
      ["Nova HVAC Systems", 45, 66, 22_000_000, false],
      ["Volt Electricals", 45, 66, 20_100_000, false],
    ],
  },
  {
    ref: "GI-WKD-10",
    short: "Wakad",
    full: "Wakad — Residential Towers, Phase 1",
    client: "Sanskriti Developers",
    health: "Strained",
    cv: 950_000_000, wc: 356_725_714, cert: 341_000_000, coll: 285_000_000,
    dio: 19.9, cad: 37.1, dso: 51.0, dpo: 18.0, ccc: 52.8,
    perDay: { dio: 368_485, cad: 590_988, dso: 590_988, dpo: 856_499 },
    bal: { dio: 0, cad: 159_000_000, dso: 74_340_000, dpo: 12_300_000 },
    terms: { cert: 21, pay: 30, vendor: 33.9 },
    bounds: { dio: [0, 34.9], cad: [21, 57.1], dso: [30, 81.0], dpo: [0, 33.9] },
    at: { dio: 19.9, cad: 21, dso: 30, dpo: 33.9, released: 35_486_062, carry: 3_282_461, cycNow: 52.8, cycNext: 16.0 },
    lead: 64.7, leadCost: 3_920_234, clientPays: 107.9, vendorPays: 43.3, shareBefore: 100,
    peak: 170_211_000, peakAt: "Sep 27", events: 1242, cases: 85,
    o2c: { cases: 19, median: 70.9, p80: 120.9, conf: 57.9, waste: 2_961_354, steps: 15, variants: 5 },
    p2p: { cases: 54, median: 75.1, p80: 87.1, conf: 70.4, rework: 5.6, waste: 1_079_558, steps: 24, variants: 7 },
    vendors: [
      ["Suraj Hardware & Fasteners", 30, 36, 46_000_000, true],
      ["Apex Formwork Systems", 45, 66, 26_700_000, false],
      ["Sanghvi Steel & Rebar", 30, 36, 26_200_000, false],
      ["Volt Electricals", 45, 51, 25_800_000, false],
      ["Nova HVAC Systems", 45, 66, 25_600_000, false],
      ["Coastal Aggregates Supply", 21, 42, 23_000_000, true],
    ],
  },
];

/**
 * The portfolio, from repository.portfolio.summary() and buildPortfolioOverview().
 *
 * `weighted` is contract-value weighted across the six, which is how the
 * before/after comparison is stated — the headline ratios themselves are summed
 * balances over summed per-day rates, never averaged across projects.
 */
export const PORTFOLIO = {
  contractValue: 4_270_000_000,
  certified: 1_866_805_000,
  collected: 1_623_155_000,
  workingCapital: 1_227_310_000,
  receivables: 286_170_000,
  payables: 103_700_000,
  contractAssets: 521_800_000,
  retention: 144_000_000,
  executed: 2_365_200_000,
  due: 1_752_500_000,
  ownCapital: 595_100_000,
  certUncollected: 243_600_000,
  overdue: 129_300_000,
  dio: 21.3, dso: 43.9, dpo: 29.5, ccc: 35.6, cad: 30.1,
  events: 6837,
  /** Median days between the gates, pooled over every bill in the company. */
  leak: { certified: 29.0, invoiced: 1.8, due: 29.8, collected: 10.3 },
  weighted: {
    now: { dio: 20.7, cad: 30.9, dso: 45.1, dpo: 28.2, ccc: 37.6 },
    terms: { dio: 20.7, cad: 17.8, dso: 32.6, dpo: 40.0, ccc: 13.2 },
  },
} as const;

/** Collections and payments by month, all six projects, in rupees. */
export const FLOW: [string, number, number][] = [
  ["Dec 25", 0, 0], ["Jan 26", 0, 0], ["Feb 26", 0, 0], ["Mar 26", 38_000_000, 10_000_000],
  ["Apr 26", 0, 133_000_000], ["May 26", 43_000_000, 96_000_000], ["Jun 26", 45_000_000, 54_000_000],
  ["Jul 26", 77_000_000, 147_000_000], ["Aug 26", 121_000_000, 143_000_000], ["Sep 26", 47_000_000, 45_000_000],
  ["Oct 26", 167_000_000, 49_000_000], ["Nov 26", 73_000_000, 157_000_000], ["Dec 26", 130_000_000, 101_000_000],
  ["Jan 27", 67_000_000, 93_000_000], ["Feb 27", 157_000_000, 62_000_000], ["Mar 27", 180_000_000, 164_000_000],
  ["Apr 27", 109_000_000, 63_000_000], ["May 27", 92_000_000, 100_000_000], ["Jun 27", 98_000_000, 93_000_000],
  ["Jul 27", 102_000_000, 123_000_000], ["Aug 27", 57_000_000, 104_000_000], ["Sep 27", 21_000_000, 79_000_000],
];

export interface Bottleneck {
  ref: string;
  stream: "O2C" | "P2P";
  step: string;
  medianDays: number;
  cases: number;
  cash: number;
  carry: number;
  /** True when nothing outside the business has to change for this to improve. */
  ours: boolean;
  owner: string;
}

export const BOTTLENECKS: Bottleneck[] = ([
  ["GI-CHK-07", "O2C", "Tax invoice raised → payment received", 50.1, 18, 363_755_000, 2_712_449, true, "Finance"],
  ["GI-WKD-10", "O2C", "Tax invoice raised → payment received", 45.1, 14, 285_000_000, 2_118_836, true, "Finance"],
  ["GI-KHR-08", "O2C", "Tax invoice raised → payment received", 30.1, 15, 468_000_000, 2_500_000, true, "Finance"],
  ["GI-TLG-09", "O2C", "Tax invoice raised → payment received", 55.1, 13, 249_500_000, 2_000_000, true, "Finance"],
  ["GI-PKC-06", "O2C", "Tax invoice raised → payment received", 35.1, 4, 191_000_000, 1_400_000, true, "Finance"],
  ["GI-BHW-05", "O2C", "Tax invoice raised → payment received", 15.1, 12, 65_900_000, 200_000, true, "Finance"],
  ["GI-WKD-10", "O2C", "Client acknowledged → certified", 28.0, 14, 287_000_000, 842_518, false, "Client"],
  ["GI-TLG-09", "O2C", "Client acknowledged → certified", 23.0, 14, 270_000_000, 800_000, false, "Client"],
  ["GI-PKC-06", "O2C", "Client acknowledged → certified", 18.1, 3, 135_000_000, 300_000, false, "Client"],
  ["GI-KHR-08", "O2C", "Client acknowledged → certified", 14.0, 15, 480_000_000, 800_000, false, "Client"],
  ["GI-BHW-05", "O2C", "Client acknowledged → certified", 12.0, 11, 72_200_000, 100_000, false, "Client"],
  ["GI-KHR-08", "P2P", "Material issued → payment executed", 31.1, 39, 243_100_000, 900_000, true, "Finance"],
  ["GI-TLG-09", "P2P", "Material issued → payment executed", 31.1, 36, 181_400_000, 700_000, true, "Finance"],
  ["GI-WKD-10", "P2P", "Material issued → payment executed", 31.1, 39, 200_500_000, 709_608, true, "Finance"],
  ["GI-PKC-06", "P2P", "Material issued → payment executed", 36.2, 6, 145_000_000, 1_100_000, true, "Finance"],
  ["GI-CHK-07", "P2P", "Material issued → payment executed", 21.1, 36, 163_000_000, 473_093, true, "Finance"],
  ["GI-BHW-05", "P2P", "Material issued → payment executed", 31.1, 32, 40_200_000, 200_000, true, "Finance"],
  ["GI-KHR-08", "P2P", "PO released → material received", 14.0, 49, 302_500_000, 400_000, true, "Stores"],
  ["GI-WKD-10", "P2P", "PO released → material received", 14.0, 49, 249_700_000, 335_963, true, "Stores"],
  ["GI-PKC-06", "P2P", "PO released → material received", 13.0, 9, 190_000_000, 600_000, true, "Stores"],
  ["GI-BHW-05", "P2P", "PO released → material received", 14.0, 59, 54_200_000, 100_000, true, "Stores"],
  ["GI-CHK-07", "P2P", "Payment scheduled → payment executed", 41.1, 7, 20_200_000, 102_912, true, "Finance"],
  ["GI-TLG-09", "P2P", "Payment scheduled → payment executed", 41.1, 7, 21_100_000, 100_000, true, "Finance"],
  ["GI-BHW-05", "P2P", "Payment scheduled → material issued", 9.9, 45, 49_700_000, 100_000, true, "Stores"],
  ["GI-PKC-06", "P2P", "Payment scheduled → material issued", 14.9, 8, 175_000_000, 300_000, true, "Stores"],
] as const).map(([ref, stream, step, medianDays, cases, cash, carry, ours, owner]) => ({
  ref, stream, step, medianDays, cases, cash, carry, ours, owner,
}));

/** Chakan's gates: the reference window against since. label, before, since, cases. */
export const GATES: [string, number, number, number][] = [
  ["Work done → measured", 1.8, 1.8, 12],
  ["Measured → bill submitted", 5.0, 5.0, 12],
  ["Bill submitted → certified", 30.1, 19.1, 14],
  ["Certified → tax invoice", 1.8, 1.8, 14],
  ["Invoice → cash received", 65.1, 50.1, 15],
  ["Vendor invoice → approved", 3.1, 3.1, 32],
  ["Approved → vendor paid", 41.9, 31.9, 32],
];

export const projectByRef = (ref: string): Project =>
  PROJECTS.find((p) => p.ref === ref) ?? PROJECTS[0];
