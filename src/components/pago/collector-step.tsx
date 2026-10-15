import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, ChevronLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { canPay, COLLECTORS, DEMO_ACCOUNT, eligibleCollector, pesos, validEmail, type CollectorId } from "@/lib/pago-data";
import { cn } from "@/lib/utils";
import bemobi from "@/assets/pago/BEMOBI.svg.asset.json";
import bancoestado from "@/assets/pago/bancoestado.svg.asset.json";
import mach from "@/assets/pago/machv2.svg.asset.json";
import servipag from "@/assets/pago/servipag.svg.asset.json";
import unired from "@/assets/pago/unired.svg.asset.json";
import { SelectionMark } from "./payment-shared";
import { PaymentConfirmation } from "./payment-confirmation";
import type { PaymentOutcome } from "./payment-context";

const LOGOS: Record<CollectorId, string> = { bemobi: bemobi.url, bancoestado: bancoestado.url, mach: mach.url, servipag: servipag.url, unired: unired.url };
type Props = { amount: number; customer: string; collector: CollectorId | null; setCollector: (value: CollectorId | null) => void; email: string; setEmail: (value: string) => void; processing: boolean; onBack: () => void; onOther: () => void; onSubmit: (outcome: PaymentOutcome) => void };

export function CollectorStep({ amount, customer, collector, setCollector, email, setEmail, processing, onBack, onOther, onSubmit }: Props) {
  const [others, setOthers] = useState(collector === "unired");
  const [touched, setTouched] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [outcome, setOutcome] = useState<PaymentOutcome>("success");
  const emailRef = useRef<HTMLInputElement>(null);
  const ready = canPay(amount, collector, email);
  const selected = COLLECTORS.find((item) => item.id === collector);
  const emailError = (touched || email.length > 0) && !validEmail(email);

  function collectorCard(item: typeof COLLECTORS[number]) {
    const active = item.id === collector;
    const eligible = eligibleCollector(item.id, amount);
    return <div key={item.id}><Button variant="ghost" role="radio" aria-label={item.name} aria-checked={active} aria-describedby={!eligible ? `limit-${item.id}` : undefined} disabled={!eligible || processing} onClick={() => setCollector(item.id)} className={cn("grid min-h-[100px] w-full grid-cols-[28px_minmax(0,1fr)_auto] gap-x-3 gap-y-2 whitespace-normal rounded-xl! border-2 px-4 py-4 text-left hover:bg-surface sm:min-h-[92px] sm:grid-cols-[28px_160px_minmax(0,1fr)_auto] sm:gap-x-4", active ? "border-success bg-success-soft hover:bg-success-soft" : "border-border bg-surface")}>
      <span className="row-span-2 sm:row-span-1"><SelectionMark selected={active} /></span>
      <img src={LOGOS[item.id]} alt="" className="h-10 w-full max-w-[180px] object-contain object-left" />
      <span className="col-start-2 row-start-2 text-sm leading-snug text-muted-foreground sm:col-start-3 sm:row-start-1">Permite pagos hasta:<br className="hidden sm:block" /> <strong className="font-semibold">{pesos(item.limit)}</strong>{item.installments && <span className="block">Hasta {item.installments} cuotas</span>}</span>
      <span className={cn("col-start-3 row-start-1 self-start rounded px-2 py-1 text-xs font-semibold sm:col-start-4 sm:self-center", item.type === "Crédito" ? "bg-info-soft text-info" : "bg-primary-soft text-primary")}>{item.type}</span>
      <span className="sr-only">{item.name}</span>
    </Button>{!eligible && <p id={`limit-${item.id}`} className="mt-2 text-sm font-semibold text-destructive">Tu monto supera el límite de {pesos(item.limit)}.</p>}</div>;
  }

  const payAction = <Button size="lg" disabled={!ready || processing} onClick={() => { if (ready) setConfirm(true); }} className="w-full px-4 whitespace-normal">Continuar y pagar {pesos(amount)}<ArrowRight aria-hidden /></Button>;
  return <section aria-labelledby="collector-heading" className="pb-28 lg:pb-0">
    <h2 id="collector-heading" className="mb-5 text-xl font-bold sm:text-2xl">¿Cómo quieres pagar?</h2>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
        <div role="radiogroup" aria-label="Recaudador" className="space-y-3">{COLLECTORS.filter((item) => item.tab === "express").map(collectorCard)}
          <Button variant="ghost" aria-expanded={others} aria-controls="other-collectors" disabled={processing} onClick={() => setOthers(!others)} className="justify-start px-1 text-base font-bold">Ver otros portales de pago<ChevronDown aria-hidden className={cn("transition-transform", others && "rotate-180")} /></Button>
          {others && <div id="other-collectors" className="space-y-3">{COLLECTORS.filter((item) => item.tab === "otros").map(collectorCard)}</div>}
        </div>
        {selected?.id === "bemobi" && <p className="mt-2 text-sm text-muted-foreground">Bemobi aplica una comisión por servicio, informada por el recaudador antes del cobro.</p>}
        <div className="mt-5 rounded-card bg-surface p-5 sm:p-6"><label htmlFor="payment-email" className="mb-3 block text-base font-bold">Ingresa tu correo para recibir el comprobante</label><div className="relative"><Mail aria-hidden className="absolute left-3 top-3.5 size-5 text-muted-foreground" /><Input ref={emailRef} id="payment-email" type="email" required autoComplete="email" placeholder="Ej: mail@mimail.cl" value={email} disabled={processing} onChange={(event) => setEmail(event.target.value)} onBlur={() => setTouched(true)} aria-invalid={emailError || undefined} aria-describedby={emailError ? "email-error" : undefined} className={cn("h-12 bg-surface pl-11 pr-10 text-base", emailError ? "border-destructive" : validEmail(email) && "border-success")} />{validEmail(email) && <Check aria-hidden className="absolute right-3 top-3.5 size-5 text-success" />}</div>{emailError && <p id="email-error" role="status" className="mt-2 text-sm font-semibold text-destructive">Ingresa un correo electrónico válido.</p>}</div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><Button variant="tertiary" onClick={onBack} disabled={processing} className="text-base"><ChevronLeft aria-hidden />Volver al monto</Button><Button variant="tertiary" asChild disabled={processing} className="whitespace-normal text-base"><Link to="/" onClick={onOther}>Pagar otro N° de cliente</Link></Button></div>
        <details className="mt-5 text-sm text-muted-foreground"><summary className="w-fit cursor-pointer py-2">Escenario de prueba QA</summary><fieldset className="mt-2 flex flex-wrap gap-2" disabled={processing}><legend className="sr-only">Resultado simulado</legend>{([{ value: "success", label: "Pago exitoso" }, { value: "error", label: "Pago no realizado" }] as const).map((item) => <Button key={item.value} variant="ghost" role="radio" aria-checked={outcome === item.value} onClick={() => setOutcome(item.value)} className={cn("border", outcome === item.value ? "border-success bg-success-soft" : "border-border bg-surface")}>{outcome === item.value && <Check aria-hidden />}{item.label}</Button>)}</fieldset></details>
      </div>
      <aside aria-label="Resumen del pago" className="hidden rounded-card bg-surface p-6 lg:sticky lg:top-6 lg:block"><h3 className="mb-4 text-base font-bold">Resumen</h3><dl className="text-base"><div className="flex justify-between gap-3 border-b border-border pb-3"><dt className="text-muted-foreground">Número de cliente</dt><dd className="font-semibold">{customer}</dd></div><div className="flex justify-between gap-3 border-b border-border py-3"><dt className="text-muted-foreground">Dirección</dt><dd className="text-right font-semibold">{DEMO_ACCOUNT.address}</dd></div><div className="flex justify-between gap-3 py-3"><dt className="text-muted-foreground">Medio de pago</dt><dd className="text-right font-semibold">{selected?.name ?? "Por seleccionar"}</dd></div>{selected?.id === "bemobi" && <p className="pb-3 text-sm text-muted-foreground">Comisión informada por Bemobi.</p>}<div className="flex items-baseline justify-between gap-3 border-t border-border py-4"><dt className="font-bold">Total a pagar</dt><dd className="text-2xl font-extrabold">{pesos(amount)}</dd></div></dl>{payAction}{!ready && <p className="mt-3 text-sm text-muted-foreground">{!collector ? "Selecciona un recaudador e ingresa un correo válido para continuar." : "Ingresa un correo válido para continuar."}</p>}</aside>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-card-hover lg:hidden"><div className="mx-auto max-w-[600px]">{payAction}</div></div>
    <PaymentConfirmation open={confirm} onOpenChange={setConfirm} amount={amount} collector={collector} email={email} customer={customer} processing={processing} onConfirm={() => onSubmit(outcome)} onOther={onOther} onEditEmail={() => { setConfirm(false); window.setTimeout(() => emailRef.current?.focus(), 100); }} />
  </section>;
}