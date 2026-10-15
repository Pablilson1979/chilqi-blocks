import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pesos } from "@/lib/pago-data";
import type { PaymentQuote } from "@/lib/payment-quote";

export function BemobiInstallments({ quote, onChange, disabled }: { quote: PaymentQuote; onChange: (count: number) => void; disabled: boolean }) {
  return <div id="bemobi-installments" className="border-x-2 border-b-2 border-success rounded-b-card bg-surface px-4 py-5 sm:px-5">
    <label id="installments-label" className="mb-2 block text-base font-bold">¿En cuántas cuotas?</label>
    <Select value={String(quote.installments)} onValueChange={(value) => onChange(Number(value))} disabled={disabled}>
      <SelectTrigger aria-labelledby="installments-label" className="h-12 bg-surface text-base"><SelectValue /></SelectTrigger>
      <SelectContent>{Array.from({ length: 12 }, (_, index) => index + 1).map((count) => <SelectItem key={count} value={String(count)} className="min-h-11 text-base">{count === 1 ? "1 pago" : `${count} cuotas`}</SelectItem>)}</SelectContent>
    </Select>
    <div aria-live="polite" aria-atomic="true" className="mt-4 space-y-1 text-base">
      <p className="font-bold">{quote.installments === 1 ? `1 pago de ${pesos(quote.total)}` : `${quote.installments} cuotas de ${pesos(quote.installmentAmount)} aprox.`}</p>
      <p className="text-muted-foreground">Incluye {pesos(quote.commission)} de comisión Bemobi.</p>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Simulación referencial. Confirma el monto final y las condiciones en Bemobi antes de pagar.</p>
  </div>;
}