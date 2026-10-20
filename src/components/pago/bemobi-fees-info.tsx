import medios from "@/assets/pago/bemobi-medios.svg.asset.json";

const FEES = [
  { label: "1 pago", value: "2,2%" },
  { label: "2 a 6 cuotas", value: "2,60% por cuota" },
  { label: "7 a 12 cuotas", value: "2,50% por cuota" },
];

export function BemobiFeesInfo() {
  return <div id="bemobi-installments" className="rounded-b-xl border-x-2 border-b-2 border-success bg-surface px-4 py-4 sm:px-5">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
      <div className="min-w-0 lg:max-w-[420px] lg:flex-1">
        <p className="mb-2 text-sm font-bold text-foreground sm:text-base">Comisión Bemobi</p>
        <dl className="divide-y divide-border sm:grid sm:grid-cols-[auto_1fr_1fr] sm:divide-x sm:divide-y-0 sm:rounded-xl sm:border sm:border-border sm:py-2">
          {FEES.map((fee) => <div key={fee.label} className="flex items-baseline justify-between gap-3 py-2 sm:block sm:px-3 sm:py-0"><dt className="text-sm text-muted-foreground sm:text-xs">{fee.label}</dt><dd className="text-sm font-bold leading-tight">{fee.value}</dd></div>)}
        </dl>
      </div>
      <img src={medios.url} alt="Acepta tarjetas, Mastercard, Visa, American Express, Google Pay y Apple Pay" className="hidden h-9 w-auto max-w-full object-contain object-left sm:block lg:self-center" />
    </div>
  </div>;
}
