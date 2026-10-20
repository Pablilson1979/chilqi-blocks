import medios from "@/assets/pago/bemobi-medios.svg.asset.json";

const FEES = [
  { label: "1 pago", value: "2,2%" },
  { label: "2 a 6 cuotas", value: "2,60% por cuota" },
  { label: "7 a 12 cuotas", value: "2,50% por cuota" },
];

export function BemobiFeesInfo() {
  return <div id="bemobi-installments" className="rounded-b-xl border-x-2 border-b-2 border-success bg-surface px-4 py-4 sm:px-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
      <div className="min-w-0 lg:max-w-[420px] lg:flex-1">
        <p className="mb-2 text-base font-bold text-foreground">Valor de la comisión Bemobi:</p>
        <dl className="grid grid-cols-[auto_1fr_1fr] divide-x divide-border rounded-xl border border-border bg-surface py-2">
          {FEES.map((fee) => <div key={fee.label} className="px-3"><dt className="text-xs text-muted-foreground">{fee.label}</dt><dd className="text-sm font-bold leading-tight">{fee.value}</dd></div>)}
        </dl>
      </div>
      <img src={medios.url} alt="Acepta tarjetas, Mastercard, Visa, American Express, Google Pay y Apple Pay" className="h-8 w-auto max-w-full self-start object-contain object-left lg:h-9 lg:self-center" />
    </div>
  </div>;
}
