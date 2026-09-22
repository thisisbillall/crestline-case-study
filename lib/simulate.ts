import { RATE, type Legs, type LeverKey, type Project } from "@/lib/data";

/**
 * THE CYCLE SIMULATOR — the same arithmetic as the product's own
 * lib/finance/cycle-simulation.ts, and verified against it on all six projects.
 *
 * PURE: no clock, no I/O. Every lever is a real balance moving at a MEASURED
 * rate — the four rates the ratios already divide by — so a day removed here is
 * worth exactly what the same day is worth on the cards above. No elasticities.
 *
 * DPO is the one leg where higher is better, and only up to the ceiling of what
 * the vendors themselves agreed. Cash can never be released by paying late.
 */

export interface Lever {
  key: LeverKey;
  label: string;
  /** Ours to move, or the counterparty's. Different kinds of promise. */
  side: "ours" | "theirs";
  note: string;
}

export const LEVERS: Lever[] = [
  {
    key: "dio",
    label: "Stock on site",
    side: "ours",
    note: "Material paid for and standing at site. Every day removed is a day the company is not funding stock.",
  },
  {
    key: "cad",
    label: "Built, waiting to be certified",
    side: "ours",
    note: "Work executed and not yet billable. The floor is the window the client agreed to certify within, not zero.",
  },
  {
    key: "dso",
    label: "Invoiced, waiting to be paid",
    side: "theirs",
    note: "The floor is the term the client agreed. Asking for faster is not a decision this business can take alone.",
  },
  {
    key: "dpo",
    label: "Vendor credit taken",
    side: "theirs",
    note: "Credit the vendors already agreed to give. The ceiling is those terms: paying later is a risk, never a saving.",
  },
];

export interface LegResult {
  key: LeverKey;
  label: string;
  now: number;
  next: number;
  /** Cash released (positive) or consumed (negative) by this leg's move. */
  cash: number;
}

export interface SimResult {
  legs: LegResult[];
  /** One-off cash released across every leg. */
  released: number;
  /** Annual carry on that cash, at this company's own financing rate. */
  carry: number;
  /** DIO + DSO − DPO, the accounting cycle the cards report. */
  cycleNow: number;
  cycleNext: number;
  /** Money out to money in, including the certification queue. */
  gapNow: number;
  gapNext: number;
  workingCapitalNext: number;
}

export function opening(project: Project): Legs {
  return { dio: project.dio, cad: project.cad, dso: project.dso, dpo: project.dpo };
}

export function atTerms(project: Project): Legs {
  return { dio: project.at.dio, cad: project.at.cad, dso: project.at.dso, dpo: project.at.dpo };
}

export function simulate(project: Project, next: Legs): SimResult {
  let released = 0;
  const legs = LEVERS.map<LegResult>((lever) => {
    const from = project[lever.key];
    const to = next[lever.key];
    // Lower is better on every leg except DPO, where terms are the ceiling.
    const cash = (lever.key === "dpo" ? to - from : from - to) * project.perDay[lever.key];
    released += cash;
    return { key: lever.key, label: lever.label, now: from, next: to, cash };
  });

  return {
    legs,
    released,
    carry: (released * RATE) / 100,
    cycleNow: project.dio + project.dso - project.dpo,
    cycleNext: next.dio + next.dso - next.dpo,
    gapNow: project.dio + project.cad + project.dso - project.dpo,
    gapNext: next.dio + next.cad + next.dso - next.dpo,
    workingCapitalNext: project.wc - released,
  };
}

/** The contractual line each leg moves towards, where one exists. */
export function targetFor(project: Project, key: LeverKey): number | null {
  if (key === "dio") return null;
  if (key === "cad") return project.terms.cert;
  if (key === "dso") return project.terms.pay;
  return project.terms.vendor;
}

export function targetLabel(project: Project, key: LeverKey): string {
  if (key === "cad") return `${project.terms.cert}-day certification window in the contract`;
  if (key === "dso") return `${project.terms.pay}-day payment term this client signed`;
  if (key === "dpo") return `${project.terms.vendor}-day terms these vendors agreed, spend-weighted`;
  return "no agreed line — the source states no stock policy";
}
