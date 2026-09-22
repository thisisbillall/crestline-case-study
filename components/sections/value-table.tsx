import { Card, CardFoot, Tag } from "@/components/ui/primitives";

/**
 * WHAT IT IS WORTH.
 *
 * Measured and target are labelled separately and never summed together. The
 * ₹12.2 Cr release is the product's own simulator run at terms already in the
 * contracts — a target, and the target each commitment is closed against.
 */
const ROWS: [string, string, string, string, "Measured" | "Target"][] = [
  [
    "Cash released at signed terms",
    "₹12.2 Cr",
    "one-off",
    "Cycle simulator at each contract's certification window, payment term and spend-weighted vendor terms",
    "Target",
  ],
  [
    "Carry on that cash",
    "₹1.13 Cr",
    "a year",
    "Released capital × 9.25%, Grey Infra's own stated cost of funds",
    "Target",
  ],
  [
    "Vendor credit being financed",
    "₹1.49 Cr",
    "a year",
    "Spend-weighted days between paying vendors and being paid, priced at 9.25%",
    "Measured",
  ],
  [
    "Process waste, O2C",
    "₹1.38 Cr",
    "a year",
    "Discovered waits above the ideal path, priced on the cash standing behind each case",
    "Measured",
  ],
  [
    "Process waste, P2P",
    "₹0.63 Cr",
    "a year",
    "Same method, discovered separately, since an RA bill and a PO share nothing but the company",
    "Measured",
  ],
  [
    "Overdue receivables surfaced",
    "₹12.9 Cr",
    "outstanding",
    "Aged against each invoice's own due date, never a house average",
    "Measured",
  ],
  [
    "Certified and uncollected",
    "₹24.4 Cr",
    "outstanding",
    "Signed off by the client, cash not received",
    "Measured",
  ],
];

export function ValueTable() {
  return (
    <Card>
      <div className="overflow-x-auto px-3 pb-5 pt-4">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              {["What Crestline found", "Amount", "Basis", "How it was measured", "Kind"].map((h, i) => (
                <th
                  key={h}
                  className={`whitespace-nowrap px-3 pb-3 text-[11px] font-semibold tracking-[0.04em] text-faint ${
                    i === 0 ? "pl-2 text-left" : i === 3 ? "text-left" : "text-right"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([what, amount, basis, method, kind]) => (
              <tr key={what} className="transition-colors hover:bg-ground">
                <td className="border-t border-hair px-3 py-3 pl-2 text-left font-semibold">{what}</td>
                <td className="border-t border-hair px-3 py-3 text-right text-[14.5px] font-bold">{amount}</td>
                <td className="border-t border-hair px-3 py-3 text-right text-[11.5px] text-faint">{basis}</td>
                <td className="border-t border-hair px-3 py-3 text-left text-[11.5px] text-faint">{method}</td>
                <td className="border-t border-hair px-3 py-3 pr-2 text-right">
                  <Tag tone={kind === "Measured" ? "good" : "warn"}>{kind}</Tag>
                </td>
              </tr>
            ))}
            <tr className="bg-lav-wash font-bold">
              <td className="rounded-l-xl px-3 py-3 pl-2 text-left">Recurring, a year</td>
              <td className="px-3 py-3 text-right text-[15px]">₹4.63 Cr</td>
              <td className="px-3 py-3 text-right text-[11.5px]">a year</td>
              <td className="px-3 py-3 text-left text-[11.5px] font-normal text-faint">
                Carry saved plus vendor credit financed plus process waste
              </td>
              <td className="rounded-r-xl px-3 py-3 pr-2" />
            </tr>
          </tbody>
        </table>
      </div>
      <CardFoot>
        Carry at 9.25%, Grey Infra&rsquo;s own stated cost of funds. The one-off release is capital returned to
        the balance sheet; the annual figures recur while the behaviour holds.
      </CardFoot>
    </Card>
  );
}
