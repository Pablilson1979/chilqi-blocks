const FEES = [
  { label: "1 pago", value: "2,2%" },
  { label: "2 a 6 cuotas", value: "2,60% por cuota" },
  { label: "7 a 12 cuotas", value: "2,50% por cuota" },
];

export function BemobiFeesInfo() {
  return <div id="bemobi-installments" className="rounded-b-card border-x-2 border-b-2 border-success bg-success-soft px-4 pb-4 pt-1 sm:px-5">
    <div className="flex flex-col gap-3 border-t border-success/30 pt-3 md:flex-row md:items-center md:gap-5">
      <p className="text-sm font-bold md:w-36 md:shrink-0">Valor de la comisión Bemobi:</p>
      <dl className="grid flex-1 grid-cols-3 divide-x divide-border overflow-hidden rounded-full border border-border bg-surface text-center max-sm:rounded-xl">
        {FEES.map((fee) => <div key={fee.label} className="px-2 py-2"><dt className="text-xs text-muted-foreground">{fee.label}</dt><dd className="text-sm font-bold leading-tight">{fee.value}</dd></div>)}
      </dl>
    </div>
  </div>;
}
