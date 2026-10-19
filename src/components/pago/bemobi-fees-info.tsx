import { Info } from "lucide-react";

const FEES = [
  { label: "1 pago", value: "2,2%" },
  { label: "2 a 6 cuotas", value: "2,60% por cuota" },
  { label: "7 a 12 cuotas", value: "2,50% por cuota" },
];

export function BemobiFeesInfo() {
  return <div id="bemobi-installments" className="border-x-2 border-b-2 border-success rounded-b-card bg-surface px-4 py-3 sm:px-5">
    <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <p className="mb-1.5 flex items-center gap-2 text-sm font-bold"><Info aria-hidden className="size-4 shrink-0 text-info" />Bemobi cobra comisión por servicio</p>
        <dl className="divide-y divide-border rounded-lg border border-border bg-surface text-sm">
          {FEES.map((fee) => <div key={fee.label} className="flex items-baseline justify-between gap-3 px-3 py-1"><dt className="text-muted-foreground">{fee.label}</dt><dd className="whitespace-nowrap font-bold">{fee.value}</dd></div>)}
        </dl>
      </div>
      <p className="rounded-lg bg-info-soft px-3 py-2 text-sm font-bold text-foreground">El monto a pagar no incluye la comisión. Bemobi la sumará según las cuotas que elijas allí.</p>
    </div>
  </div>;
}
