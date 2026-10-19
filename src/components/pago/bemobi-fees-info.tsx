const FEES = [
  { label: "1 pago", value: "2,2%" },
  { label: "2 a 6 cuotas", value: "2,60% por cuota" },
  { label: "7 a 12 cuotas", value: "2,50% por cuota" },
];

export function BemobiFeesInfo() {
  return <div id="bemobi-installments" className="rounded-b-xl border-x-2 border-b-2 border-success bg-surface px-4 py-4 sm:px-5 sm:pl-[60px]">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
      <p className="text-base font-bold text-foreground md:shrink-0">Valor de la comisión Bemobi:</p>
      <dl className="grid flex-1 grid-cols-3 divide-x divide-border rounded-xl border border-border bg-surface py-2 text-center">
        {FEES.map((fee) => <div key={fee.label} className="px-2"><dt className="text-xs text-muted-foreground">{fee.label}</dt><dd className="text-sm font-bold leading-tight">{fee.value}</dd></div>)}
      </dl>
    </div>
  </div>;
}
