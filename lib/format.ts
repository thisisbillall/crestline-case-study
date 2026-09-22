/**
 * Indian money and day formatting.
 *
 * Crore and lakh, never millions — a CFO reading an EPC contract does not think
 * in millions. A null reads NA, never zero: zero is a claim that the balance is
 * empty, NA an admission that we were not told.
 */

const CRORE = 1e7;
const LAKH = 1e5;

export function inr(value: number | null | undefined, decimals?: number): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "NA";
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= CRORE) {
    const cr = abs / CRORE;
    const dp = decimals ?? (cr >= 100 ? 0 : cr >= 10 ? 1 : 2);
    return `${sign}₹${cr.toFixed(dp)} Cr`;
  }
  if (abs >= LAKH) {
    const l = abs / LAKH;
    return `${sign}₹${l.toFixed(l >= 10 ? 0 : 1)} L`;
  }
  return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
}

/** One decimal, with a real minus sign rather than a hyphen. */
export const d1 = (value: number): string =>
  `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}`;

export const days = (value: number | null, decimals = 1): string =>
  value === null ? "NA" : `${d1(Number(value.toFixed(decimals)))} days`;

export const pct = (value: number, decimals = 1): string => `${value.toFixed(decimals)}%`;
