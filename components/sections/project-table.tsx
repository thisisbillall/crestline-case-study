import { Card, CardHead } from "@/components/ui/primitives";
import { PORTFOLIO, PROJECTS } from "@/lib/data";
import { inr } from "@/lib/format";

const HEAD = [
  "Project", "Client", "Contract", "WC held", "DIO", "CAD", "DSO", "DPO", "Cycle", "At terms", "Releases",
];

/** Server component: the six projects, side by side. No interaction needed. */
export function ProjectTable() {
  return (
    <Card>
      <CardHead
        title="The six, side by side"
        sub="Every figure derived through the same code the product's own screens render"
      />
      <div className="overflow-x-auto px-3 pb-5">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              {HEAD.map((h, i) => (
                <th
                  key={h}
                  className={`whitespace-nowrap px-3 pb-3 text-[11px] font-semibold tracking-[0.04em] text-faint ${
                    i === 0 ? "pl-2 text-left" : "text-right"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p) => (
              <tr key={p.ref} className="transition-colors hover:bg-ground">
                <td className="border-t border-hair px-3 py-3 pl-2 text-left">
                  <b className="font-semibold">{p.short}</b>
                  <span className="block text-[11.5px] font-normal text-faint">
                    {p.ref} · {p.health}
                  </span>
                </td>
                <td className="border-t border-hair px-3 py-3 text-left text-[11.5px] text-faint">
                  {p.client}
                </td>
                <td className="border-t border-hair px-3 py-3 text-right">{inr(p.cv)}</td>
                <td className="border-t border-hair px-3 py-3 text-right">{inr(p.wc)}</td>
                <td className="border-t border-hair px-3 py-3 text-right">{p.dio.toFixed(1)}</td>
                <td className="border-t border-hair px-3 py-3 text-right">{p.cad.toFixed(1)}</td>
                <td className="border-t border-hair px-3 py-3 text-right">{p.dso.toFixed(1)}</td>
                <td className="border-t border-hair px-3 py-3 text-right">{p.dpo.toFixed(1)}</td>
                <td className="border-t border-hair px-3 py-3 text-right">{p.ccc.toFixed(1)}</td>
                <td className="border-t border-hair px-3 py-3 text-right font-bold text-good">
                  {p.at.cycNext.toFixed(1)}
                </td>
                <td className="border-t border-hair px-3 py-3 pr-2 text-right font-bold text-good">
                  {inr(p.at.released)}
                </td>
              </tr>
            ))}
            <tr className="bg-accent-wash font-bold">
              <td className="rounded-l-xl px-3 py-3 pl-2 text-left">Six projects</td>
              <td className="px-3 py-3 text-left">4 clients</td>
              <td className="px-3 py-3 text-right">{inr(PORTFOLIO.contractValue)}</td>
              <td className="px-3 py-3 text-right">{inr(PORTFOLIO.workingCapital)}</td>
              <td className="px-3 py-3 text-right">{PORTFOLIO.dio.toFixed(1)}</td>
              <td className="px-3 py-3 text-right">{PORTFOLIO.cad.toFixed(1)}</td>
              <td className="px-3 py-3 text-right">{PORTFOLIO.dso.toFixed(1)}</td>
              <td className="px-3 py-3 text-right">{PORTFOLIO.dpo.toFixed(1)}</td>
              <td className="px-3 py-3 text-right">{PORTFOLIO.ccc.toFixed(1)}</td>
              <td className="px-3 py-3 text-right text-good">13.2</td>
              <td className="rounded-r-xl px-3 py-3 pr-2 text-right text-good">₹12.2 Cr</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
