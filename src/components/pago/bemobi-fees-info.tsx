import { Info } from "lucide-react";

const FEES = [
  { label: "1 pago", value: "2,2%" },
  { label: "2 a 6 cuotas", value: "2,60% por cuota" },
  { label: "7 a 12 cuotas", value: "2,50% por cuota" },
];

export function BemobiFeesInfo() {
  return <div id="bemobi-installments" className="border-x-2 border-b-2 border-success rounded-b-card bg-surface px-4 py-3 sm:px-5">
    <p className="mb-2 flex items-center gap-2 text-sm font-bold"><Info aria-hidden className="size-5 text-info" />Bemobi cobra comisión por servicio</p>
    <dl className="divide-y divide-border rounded-lg border border-border text-sm">
      {FEES.map((fee) => <div key={fee.label} className="flex justify-between gap-3 px-3 py-1.5"><dt className="text-muted-foreground">{fee.label}</dt><dd className="font-bold">{fee.value}</dd></div>)}
    </dl>
    <p className="mt-2 rounded-md bg-info-soft px-3 py-2 text-sm font-bold text-foreground">El total estimado considera 1 pago. Las cuotas se eligen en Bemobi.</p>
  </div>;
}
