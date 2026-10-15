import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_ACCOUNT, MIN_PAYMENT, pesos } from "@/lib/pago-data";
import { cn } from "@/lib/utils";
import { SelectionMark } from "./payment-shared";

export type AmountChoice = "total" | "previous" | "cutoff" | "custom";

export function amountFor(choice: AmountChoice, custom: string) {
  if (choice === "total") return DEMO_ACCOUNT.total;
  if (choice === "previous") return DEMO_ACCOUNT.previous;
  if (choice === "cutoff") return DEMO_ACCOUNT.cutoff;
  return Number(custom);
}

/** Pantalla de espera de 3 s antes de mostrar saldos (prototipo). */
export function BalanceLoader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 3000);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-6 rounded-xl bg-surface px-6 py-16 text-center">
      <div>
        <p className="text-xl font-bold text-foreground">Cargando saldos</p>
        <p className="mt-2 text-base text-muted-foreground">Consultando el estado de tu cuenta…</p>
      </div>
      <div className="h-2 w-64 overflow-hidden rounded-full bg-muted" aria-hidden>
        <span className="block h-full rounded-full bg-primary [animation:pago-load_3s_linear_forwards]" />
      </div>
    </div>
  );
}

type Props = {
  choice: AmountChoice;
  setChoice: (c: AmountChoice) => void;
  custom: string;
  setCustom: (v: string) => void;
  amount: number;
  valid: boolean;
  onContinue: () => void;
  onDetail: () => void;
  onOther: () => void;
  customer: string;
};

const OPTIONS = [
  { id: "total", title: "Pagar todo y quedar al día", hint: `Incluye boleta actual y boletas anteriores. Vence ${DEMO_ACCOUNT.dueDate}`, value: DEMO_ACCOUNT.total },
  { id: "previous", title: "Pagar boleta del mes anterior", hint: "Dejas pendiente solo la boleta más reciente", value: DEMO_ACCOUNT.previous },
  { id: "cutoff", title: "Pagar para evitar corte", hint: `Paga antes del ${DEMO_ACCOUNT.cutoffDate}`, value: DEMO_ACCOUNT.cutoff, urgent: true },
] as const;

export function AmountStep({ choice, setChoice, custom, setCustom, amount, valid, onContinue, onDetail, onOther, customer }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);
  const customError = choice === "custom" && (custom.length > 0 || touched) && !valid;
  const label = valid ? `Continuar y pagar ${pesos(amount)}` : "Ingresa un monto válido";

  function pickCustom() {
    setChoice("custom");
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <section aria-labelledby="amount-heading" className="pb-28 lg:pb-0">
      <h2 id="amount-heading" className="mb-4 text-xl font-bold text-foreground sm:text-2xl">¿Cuánto quieres pagar?</h2>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div role="radiogroup" aria-label="Monto del pago" className="space-y-3">
          {OPTIONS.map((o) => {
            const active = choice === o.id;
            return (
              <button key={o.id} type="button" role="radio" aria-checked={active} onClick={() => setChoice(o.id)}
                className={cn("flex w-full items-center gap-3 rounded-xl border-2 bg-surface px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-4 sm:px-5",
                  active ? "border-success bg-success-soft" : "border-border hover:border-muted-foreground/40")}>
                <SelectionMark selected={active} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-foreground">{o.title}</span>
                    {"urgent" in o && <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">Urgente</span>}
                  </span>
                  <span className={cn("mt-1 block text-sm", "urgent" in o ? "font-semibold text-destructive" : "text-muted-foreground")}>{o.hint}</span>
                </span>
                <span className="shrink-0 text-lg font-extrabold text-foreground sm:text-xl">{pesos(o.value)}</span>
              </button>
            );
          })}
          <div className={cn("flex flex-wrap items-center gap-3 rounded-xl border-2 bg-surface px-4 py-4 transition-colors sm:gap-4 sm:px-5", choice === "custom" ? "border-success bg-success-soft" : "border-border hover:border-muted-foreground/40")}>
            <button type="button" role="radio" aria-checked={choice === "custom"} onClick={pickCustom}
              className="flex min-w-[180px] flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-4">
              <SelectionMark selected={choice === "custom"} />
              <span className="flex-1">
                <span className="block text-base font-bold text-foreground">Paga lo que puedas</span>
                <span id="amount-help" role={customError ? "alert" : undefined} className={cn("mt-1 block text-sm", customError ? "font-semibold text-destructive" : "text-muted-foreground")}>
                  {customError ? `El monto mínimo es de ${pesos(MIN_PAYMENT)}.` : `Desde ${pesos(MIN_PAYMENT)}`}
                </span>
              </span>
            </button>
            {choice === "custom" && (
              <div className="relative ml-auto w-[150px] shrink-0 motion-safe:animate-in motion-safe:fade-in">
                <label htmlFor="custom-amount" className="sr-only">Monto a pagar</label>
                <span aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-foreground">$</span>
                <Input ref={inputRef} id="custom-amount" inputMode="numeric" autoComplete="off" placeholder="0"
                  value={custom ? new Intl.NumberFormat("es-CL").format(Number(custom)) : ""}
                  onChange={(e) => setCustom(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  onBlur={() => setTouched(true)}
                  aria-invalid={customError || undefined} aria-describedby="amount-help"
                  className={cn("h-12 bg-surface pl-8 text-right text-lg font-bold", customError && "border-destructive")} />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <Button variant="tertiary" onClick={onDetail} className="h-auto min-h-11 px-0 text-base"><FileText aria-hidden />Ver detalle boleta</Button>
            <Button variant="tertiary" asChild className="h-auto min-h-11 whitespace-normal px-0 text-right text-base"><Link to="/" onClick={onOther}>Pagar otro N° de cliente</Link></Button>
          </div>
        </div>

        {/* Resumen desktop */}
        <aside aria-label="Resumen" className="hidden rounded-xl bg-surface p-6 lg:sticky lg:top-6 lg:block">
          <h3 className="mb-4 text-base font-bold text-foreground">Resumen</h3>
          <dl className="text-base">
            <div className="flex items-baseline justify-between gap-4"><dt className="font-bold">Total a pagar</dt><dd className="text-2xl font-extrabold">{valid ? pesos(amount) : "—"}</dd></div>
          </dl>
          <Button size="lg" disabled={!valid} onClick={onContinue} className="mt-6 w-full">{label}<ArrowRight aria-hidden /></Button>
        </aside>
      </div>

      {/* Barra fija mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_color-mix(in_oklab,var(--foreground)_30%,transparent)] lg:hidden">
        <Button size="lg" disabled={!valid} onClick={onContinue} className="mx-auto flex w-full max-w-[600px]">{label}<ArrowRight aria-hidden /></Button>
      </div>
    </section>
  );
}
