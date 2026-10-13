import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, FileText, LoaderCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChilquintaModal } from "@/components/chilquinta/modal";
import { canPay, COLLECTORS, DEMO_ACCOUNT, eligibleCollector, firstEligible, pesos, validAmount, validEmail, type CollectorId, type PaymentTab } from "@/lib/pago-data";
import { cn } from "@/lib/utils";
import bemobi from "@/assets/pago/BEMOBI.svg.asset.json";
import bancoestado from "@/assets/pago/bancoestado.svg.asset.json";
import mach from "@/assets/pago/machv2.svg.asset.json";
import servipag from "@/assets/pago/servipag.svg.asset.json";
import unired from "@/assets/pago/unired.svg.asset.json";
import { AccountSummary, MissingPayment, PaymentHeading, PaymentShell, SelectionMark } from "./payment-shared";
import { usePayment } from "./payment-context";

const LOGOS: Record<CollectorId, string> = { bemobi: bemobi.url, bancoestado: bancoestado.url, mach: mach.url, servipag: servipag.url, unired: unired.url };
type AmountChoice = "total" | "previous" | "custom";

export function PaymentFlow() {
  const payment = usePayment();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [choice, setChoice] = useState<AmountChoice>("total");
  const [custom, setCustom] = useState("");
  const [detail, setDetail] = useState(false);
  const [tab, setTab] = useState<PaymentTab>("express");
  const [collector, setCollector] = useState<CollectorId | null>("bemobi");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [processing, setProcessing] = useState(false);
  const submitting = useRef(false);
  const amount = choice === "total" ? DEMO_ACCOUNT.total : choice === "previous" ? DEMO_ACCOUNT.previous : Number(custom);
  const valid = validAmount(amount);
  const customError = choice === "custom" && custom.length > 0 && !valid;
  const selected = COLLECTORS.find((item) => item.id === collector);
  const ready = canPay(amount, collector, email);

  function changeStep(next: 1 | 2) {
    if (next === 2 && !valid) return;
    if (next === 2 && (!collector || !eligibleCollector(collector, amount))) setCollector(firstEligible(tab, amount));
    setStep(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  async function submitPayment() {
    if (!ready || !collector || !payment.identity || submitting.current) return;
    submitting.current = true;
    setProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    payment.complete({ amount, collector, email: email.trim(), reference: `QA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, date: new Date().toLocaleString("es-CL") });
    await navigate({ to: "/pago-resultado" });
  }

  return <PaymentShell>{!payment.identity ? <MissingPayment /> : <>
    <PaymentHeading step={step} />
    <AccountSummary />
    {step === 1 ? <section aria-labelledby="amount-heading">
      <h2 id="amount-heading" className="mb-5 text-xl font-bold">Selecciona el monto del pago</h2>
      <div role="radiogroup" aria-label="Monto del pago" className="space-y-3">
        {([{ id: "total", title: "Saldo total", value: DEMO_ACCOUNT.total }, { id: "previous", title: "Saldo anterior", value: DEMO_ACCOUNT.previous }] as const).map((item) => <Button key={item.id} variant="ghost" role="radio" aria-checked={choice === item.id} onClick={() => setChoice(item.id)} className={cn("min-h-[92px] w-full justify-start gap-4 whitespace-normal rounded-lg border-2 px-4 py-5 text-left hover:bg-surface sm:px-6", choice === item.id ? "border-success bg-success-soft hover:bg-success-soft" : "border-transparent bg-surface")}>
          <SelectionMark selected={choice === item.id} />
          <span className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span><span className="block text-base font-bold">{item.title}</span>{item.id === "total" && <span className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm font-normal text-muted-foreground"><span>Saldo actual: {pesos(DEMO_ACCOUNT.current)}</span><span>Saldo anterior: {pesos(DEMO_ACCOUNT.previous)}</span></span>}</span><span className="text-base font-normal">Total a pagar: <strong className="text-xl font-bold">{pesos(item.value)}</strong></span></span>
        </Button>)}
        <div className={cn("grid gap-4 rounded-lg border-2 px-4 py-5 sm:grid-cols-[1fr_300px] sm:items-center sm:px-6", choice === "custom" ? "border-success bg-success-soft" : "border-transparent bg-surface")}>
          <Button variant="ghost" role="radio" aria-checked={choice === "custom"} onClick={() => setChoice("custom")} className="justify-start gap-4 whitespace-normal p-0 text-left hover:bg-transparent"><SelectionMark selected={choice === "custom"} /><span className="text-base font-bold">Paga lo que puedas<span className="mt-1 block text-sm font-normal text-muted-foreground">Por ejemplo: $1.000</span></span></Button>
          <div><label className="sr-only" htmlFor="custom-amount">Ingresa el monto que puedes pagar</label><Input id="custom-amount" inputMode="numeric" autoComplete="off" placeholder="Ingresa el monto que puedes pagar" value={custom ? new Intl.NumberFormat("es-CL").format(Number(custom)) : ""} onFocus={() => setChoice("custom")} onChange={(event) => { setChoice("custom"); setCustom(event.target.value.replace(/\D/g, "").slice(0, 12)); }} aria-invalid={customError || undefined} aria-describedby="amount-help" className={cn("h-12 bg-surface text-base", customError && "border-pay-warning focus-visible:ring-pay-warning")} /><p id="amount-help" className={cn("mt-2 text-sm", customError ? "font-semibold text-destructive" : "text-muted-foreground")} role={customError ? "status" : undefined}>{customError ? "El monto mínimo permitido es de $100." : "Monto mínimo: $100"}</p></div>
        </div>
      </div>
      <div className="mx-auto mt-7 flex max-w-[360px] flex-col gap-3"><Button size="lg" disabled={!valid} onClick={() => changeStep(2)} className="w-full">Continuar y pagar {pesos(amount)}<ArrowRight aria-hidden /></Button><Button size="lg" variant="secondary" onClick={() => setDetail(true)}><FileText aria-hidden />Ver detalle boleta</Button><Button variant="tertiary" asChild className="whitespace-normal text-base"><Link to="/" onClick={payment.clear}>Pagar otro RUT o N° de cliente</Link></Button></div>
    </section> : <section aria-labelledby="collector-heading">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 id="collector-heading" className="text-xl font-bold">Selecciona recaudador</h2><p className="text-base text-muted-foreground">Monto a pagar: <strong className="text-xl text-foreground">{pesos(amount)}</strong></p></div>
      <div role="tablist" aria-label="Portales de pago" className="mb-5 grid grid-cols-2 rounded-lg bg-tab-track p-1">{([{ id: "express", label: "Pago Express" }, { id: "otros", label: "Otros portales de pago" }] as const).map((item) => <Button key={item.id} variant={tab === item.id ? "primary" : "ghost"} role="tab" id={`tab-${item.id}`} aria-selected={tab === item.id} aria-controls="collector-panel" disabled={processing} onClick={() => { setTab(item.id); setCollector(firstEligible(item.id, amount)); }} className="min-h-12 whitespace-normal rounded-md px-3 text-sm sm:text-base">{item.label}</Button>)}</div>
      <div role="tabpanel" id="collector-panel" aria-labelledby={`tab-${tab}`}><div role="radiogroup" aria-label="Recaudador" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{COLLECTORS.filter((item) => item.tab === tab).map((item) => {
        const eligible = eligibleCollector(item.id, amount);
        const active = collector === item.id;
        return <div key={item.id}><Button variant="ghost" role="radio" aria-label={item.name} aria-checked={active} disabled={!eligible || processing} onClick={() => setCollector(item.id)} className={cn("relative min-h-[190px] w-full flex-col justify-center gap-3 whitespace-normal rounded-lg border-2 p-5 hover:bg-surface", active ? "border-success bg-success-soft hover:bg-success-soft" : "border-transparent bg-surface")}>
          <span className="absolute left-4 top-4"><SelectionMark selected={active} /></span><span className="absolute right-3 top-3 rounded-full bg-info-soft px-2 py-0.5 text-xs font-bold text-foreground">{item.type}</span><img src={LOGOS[item.id]} alt={item.name} className={cn("mt-6 h-10 w-full max-w-[180px] object-contain", item.id === "bemobi" && "h-12 max-w-[210px]")} /><span className="text-sm font-medium text-muted-foreground">Permite pagos hasta: <strong>{pesos(item.limit)}</strong></span>{item.installments && <span className="text-sm font-semibold text-success">Hasta {item.installments} cuotas<br /><span className="font-normal text-muted-foreground">Aplica comisión por servicio</span></span>}
        </Button>{!eligible && <p className="mt-2 text-sm text-destructive">Tu monto supera el límite de {pesos(item.limit)}.</p>}</div>;
      })}</div></div>
      <div className="mt-7 max-w-[480px]"><label htmlFor="payment-email" className="mb-2 block text-base font-bold">Correo electrónico</label><p className="mb-3 text-base text-muted-foreground">Para recibir el comprobante de tu pago.</p><div className="relative"><Mail aria-hidden className="absolute left-3 top-3.5 size-5 text-muted-foreground" /><Input id="payment-email" type="email" autoComplete="email" placeholder="Ej: mail@mimail.cl" value={email} disabled={processing} onChange={(event) => setEmail(event.target.value)} onBlur={() => setEmailTouched(true)} aria-invalid={emailTouched && !validEmail(email) || undefined} aria-describedby="email-error" className="h-12 bg-surface pl-11 text-base" /></div>{emailTouched && !validEmail(email) && <p id="email-error" role="status" className="mt-2 text-sm font-semibold text-destructive">Ingresa un correo electrónico válido.</p>}</div>
      <div className="mx-auto mt-8 flex max-w-[360px] flex-col gap-3 text-center"><p className="text-base text-muted-foreground">{selected ? <>Pagarás <strong className="text-foreground">{pesos(amount)}</strong> con <strong className="text-foreground">{selected.name}</strong></> : "Selecciona un recaudador disponible."}</p><Button size="lg" disabled={!ready || processing} onClick={() => void submitPayment()}>{processing ? <><LoaderCircle className="motion-safe:animate-spin" aria-hidden />Procesando pago…</> : <>Pagar {pesos(amount)}<ArrowRight aria-hidden /></>}</Button><Button size="lg" variant="secondary" disabled={processing} onClick={() => changeStep(1)}><ChevronLeft aria-hidden />Volver</Button><Button variant="tertiary" disabled={processing} asChild className="whitespace-normal text-base"><Link to="/" onClick={(event) => { if (processing) { event.preventDefault(); return; } payment.clear(); }}>Pagar otro RUT o N° de cliente</Link></Button></div>
    </section>}
    <p className="mt-6 text-center text-sm text-muted-foreground">Prueba QA · No se realizarán cobros ni se enviarán correos.</p>
    <ChilquintaModal title="Detalle de tu boleta" open={detail} onOpenChange={setDetail} cancelLabel="Cerrar" confirmLabel="Volver al pago" onConfirm={() => setDetail(false)}><div className="space-y-3 text-base"><p>Boleta de prueba N° {DEMO_ACCOUNT.billNumber}</p><p>{DEMO_ACCOUNT.address}</p><dl className="space-y-3"><div className="flex justify-between gap-4"><dt>Saldo actual</dt><dd>{pesos(DEMO_ACCOUNT.current)}</dd></div><div className="flex justify-between gap-4"><dt>Saldo anterior</dt><dd>{pesos(DEMO_ACCOUNT.previous)}</dd></div><div className="flex justify-between gap-4 border-t border-border pt-3 font-bold"><dt>Saldo total</dt><dd>{pesos(DEMO_ACCOUNT.total)}</dd></div></dl><p>Vencimiento: {DEMO_ACCOUNT.dueDate}</p></div></ChilquintaModal>
  </>}</PaymentShell>;
}