import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, ChevronLeft, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/chilquinta/field";
import { StatusMessage } from "@/components/chilquinta/status-message";
import { CustomerNumberHelp } from "@/components/home/customer-number-help";
import { customerNumberSchema } from "@/lib/pay-express-validation";
import { COLLECTORS, pesos, validEmail, type CollectorId } from "@/lib/pago-data";
import { ADVANCE_DEBT_CUSTOMERS, ADVANCE_DEMO, ADVANCE_MIN, validAdvanceAmount } from "@/lib/pago-adelantado";
import { PaymentShell, SelectionMark } from "./payment-shared";
import { cn } from "@/lib/utils";

type Stage = "cliente" | "monto" | "exito" | "error";

export function AdvancePayment() {
  const [stage, setStage] = useState<Stage>("cliente");
  const [customer, setCustomer] = useState("");
  const [touched, setTouched] = useState(false);
  const [debt, setDebt] = useState(false);
  const [amountText, setAmountText] = useState("");
  const [collector, setCollector] = useState<CollectorId | null>(null);
  const [email, setEmail] = useState("");
  const [tried, setTried] = useState(false);
  const [date, setDate] = useState("");

  const parsed = customerNumberSchema.safeParse(customer);
  const amount = Number(amountText || 0);
  const amountOk = validAdvanceAmount(amount);
  const emailOk = validEmail(email);
  const ready = amountOk && collector && emailOk;
  const collectors = COLLECTORS.filter((c) => c.tab === "express");

  function submitCustomer(e: React.FormEvent) {
    e.preventDefault(); setTouched(true);
    if (!parsed.success) return;
    if (ADVANCE_DEBT_CUSTOMERS.includes(customer.trim())) { setDebt(true); return; }
    setDebt(false); setStage("monto");
  }
  function pay(outcome: "exito" | "error") {
    setTried(true);
    if (!ready) { document.getElementById("adv-amount")?.focus(); return; }
    setDate(new Date().toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" }));
    setStage(outcome); window.scrollTo({ top: 0 });
  }
  function reset() { setStage("cliente"); setCustomer(""); setTouched(false); setAmountText(""); setCollector(null); setEmail(""); setTried(false); }

  const heading = (back: () => void) => <div className="relative mb-6 flex min-h-12 items-center justify-center">
    <Button variant="ghost" size="icon" onClick={back} aria-label="Volver" className="absolute left-0 size-12 rounded-full bg-surface text-primary hover:bg-surface"><ChevronLeft className="size-6" /></Button>
    <h1 className="px-14 text-center text-2xl font-bold sm:text-3xl">Paga por adelantado</h1></div>;

  if (stage === "exito" || stage === "error") {
    const ok = stage === "exito";
    const rows = [["N° de cliente", customer], ["Dirección", ADVANCE_DEMO.address], ["Tipo de pago", "Pago adelantado"], ["Recaudador", COLLECTORS.find((c) => c.id === collector)?.name ?? ""], ["Correo electrónico", email], ["Fecha y hora", `${date} hrs`]];
    return <PaymentShell><div className="mx-auto max-w-[680px] py-4">
      <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">{ok ? "Pago adelantado exitoso" : "No se pudo realizar el pago"}</h1>
      <StatusMessage tone={ok ? "success" : "error"} title={ok ? "Tu pago adelantado se completó" : "Intenta nuevamente"} description={ok ? "El monto quedará abonado a tu próxima boleta." : "El pago no se completó. Conservamos tus datos para que puedas reintentarlo."} className="[&_p]:text-base" />
      <div className="mt-6 rounded-card bg-surface p-5 sm:p-8"><p className="text-center text-base text-muted-foreground">{ok ? "Monto abonado" : "Monto pendiente"}</p><p className="mb-6 mt-2 text-center text-4xl font-extrabold">{pesos(amount)}</p>
        <dl className="divide-y divide-border border-y border-border">{rows.map(([l, v]) => <div key={l} className="grid gap-1 py-3 text-base sm:grid-cols-[190px_minmax(0,1fr)]"><dt className="text-muted-foreground">{l}</dt><dd className="min-w-0 break-words font-semibold">{v}</dd></div>)}</dl></div>
      <div className="mx-auto mt-7 flex max-w-[360px] flex-col gap-3">
        {!ok && <Button size="lg" onClick={() => setStage("monto")}><RotateCcw aria-hidden />Intentar nuevamente</Button>}
        <Button size="lg" variant={ok ? "primary" : "secondary"} asChild><Link to="/">Volver al inicio<ArrowRight aria-hidden /></Link></Button>
        {ok && <Button size="lg" variant="tertiary" onClick={reset}>Pagar otro número de cliente</Button>}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">Prueba QA · No se realizó ningún cobro.</p>
    </div></PaymentShell>;
  }

  if (stage === "cliente") {
    const state = touched ? (parsed.success ? "success" : "error") : parsed.success ? "success" : "default";
    return <PaymentShell><div className="mx-auto max-w-[560px]">{heading(() => history.back())}
      <form onSubmit={submitCustomer} noValidate className="rounded-card bg-surface p-5 shadow-card sm:p-8">
        <p className="mb-6 text-base text-muted-foreground">Si tu cuenta está al día, puedes abonar un monto que se descontará de tu próxima boleta.</p>
        <div className="mb-2 flex items-center justify-end"><CustomerNumberHelp variant="text" /></div>
        <Field id="adv-customer" label="N° de cliente" inputMode="numeric" placeholder="Ej: 3377982" value={customer} maxLength={7}
          onChange={(e) => { setCustomer(e.target.value.replace(/\D/g, "")); setDebt(false); }} onBlur={() => setTouched(true)}
          state={state} {...(state === "error" ? { message: parsed.error?.issues[0]?.message ?? "Revisa tu número" } : {})} />
        {debt && <StatusMessage tone="warning" className="mt-5" title="Tienes una cuenta pendiente" description="El pago adelantado es solo para clientes al día. Primero paga tu cuenta y luego podrás abonar." />}
        {debt ? <Button size="lg" className="mt-6 w-full" asChild><Link to="/">Ir a Paga tu cuenta aquí<ArrowRight aria-hidden /></Link></Button>
          : <Button type="submit" size="lg" className="mt-6 w-full">Continuar<ArrowRight aria-hidden /></Button>}
        <p className="mt-4 text-center text-sm text-muted-foreground">Prueba: 110095 (al día) · 123123 (con deuda)</p>
      </form></div></PaymentShell>;
  }

  const amountError = tried || amountText ? (!amountOk ? `Monto mínimo de ${pesos(ADVANCE_MIN)}` : undefined) : undefined;
  return <PaymentShell><div className="pb-28 lg:pb-0">{heading(() => setStage("cliente"))}
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <section className="flex items-center gap-3 rounded-xl bg-surface px-4 py-4 sm:px-6"><span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><MapPin className="size-5" /></span>
          <div className="min-w-0"><p className="text-lg font-extrabold">{ADVANCE_DEMO.address}</p><p className="text-sm text-muted-foreground">N° de cliente <strong className="text-foreground">{customer}</strong> · <span className="text-success font-bold">Cuenta al día</span></p></div></section>
        <section className="rounded-card bg-surface p-5 sm:p-6">
          <h2 className="text-base font-bold">Tu última boleta, como referencia</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-input bg-muted p-4"><dt className="text-sm text-muted-foreground">Total pagado · {ADVANCE_DEMO.lastDate}</dt><dd className="mt-1 text-xl font-extrabold">{pesos(ADVANCE_DEMO.lastPaid)}</dd></div>
            <div className="rounded-input bg-muted p-4"><dt className="text-sm text-muted-foreground">Consumo</dt><dd className="mt-1 text-xl font-extrabold">{ADVANCE_DEMO.lastKwh.toLocaleString("es-CL")} kWh</dd></div>
          </dl>
          <div className="mt-6"><Field id="adv-amount" label="Monto a pagar por adelantado" inputMode="numeric" placeholder="Ej: $20.000" value={amountText ? pesos(amount) : ""}
            onChange={(e) => setAmountText(e.target.value.replace(/\D/g, "").slice(0, 7))} state={amountError ? "error" : amountOk ? "success" : "default"} message={amountError ?? `Monto mínimo de ${pesos(ADVANCE_MIN)}`} /></div>
          <div className="mt-3 flex flex-wrap gap-2">{[ADVANCE_DEMO.lastPaid, 30000, 50000].map((v) => <button key={v} type="button" onClick={() => setAmountText(String(v))} className={cn("rounded-pill border-2 px-4 py-2 text-sm font-bold transition-colors", amount === v ? "border-success bg-success-soft text-foreground" : "border-border text-foreground hover:border-primary")}>{pesos(v)}</button>)}</div>
        </section>
        <section className="rounded-card bg-surface p-5 sm:p-6">
          <h2 className="mb-4 text-base font-bold">Elige dónde pagar</h2>
          <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">{collectors.map((c) => { const sel = collector === c.id; return <button key={c.id} type="button" role="radio" aria-checked={sel} onClick={() => setCollector(c.id)} className={cn("flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors", sel ? "border-success bg-success-soft" : "border-border hover:border-primary")}><SelectionMark selected={sel} /><span><span className="block font-bold">{c.name}</span><span className="text-sm text-muted-foreground">{c.type}{c.id === "bemobi" ? " · con comisión por servicio" : ""}</span></span></button>; })}</div>
          {tried && !collector && <p className="mt-3 flex items-center gap-1.5 text-sm text-destructive"><AlertCircle className="size-4" />Selecciona un recaudador</p>}
          <div className="mt-6"><Field id="adv-email" type="email" label="Correo para tu comprobante" placeholder="nombre@correo.cl" value={email} onChange={(e) => setEmail(e.target.value)}
            state={emailOk ? "success" : tried && !emailOk ? "error" : "default"} {...(tried && !emailOk ? { message: "Ingresa un correo válido" } : {})} /></div>
        </section>
      </div>
      <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface p-4 shadow-modal lg:static lg:self-start lg:rounded-card lg:border-0 lg:p-6 lg:shadow-card">
        <div className="mx-auto max-w-[560px]"><p className="hidden text-base font-bold lg:block">Resumen</p>
          <div className="flex items-baseline justify-between lg:mt-4"><span className="text-sm text-muted-foreground">Total a abonar</span><span className="text-2xl font-extrabold">{pesos(amountOk ? amount : 0)}</span></div>
          <Button size="lg" className={cn("mt-3 w-full", !ready && "opacity-60")} aria-disabled={!ready} onClick={() => pay("exito")}>Pagar {amountOk ? pesos(amount) : ""}<ArrowRight aria-hidden /></Button>
          <button type="button" onClick={() => pay("error")} className="mt-2 w-full text-center text-sm font-semibold text-muted-foreground underline">Simular pago no logrado (QA)</button>
        </div>
      </aside>
    </div></div></PaymentShell>;
}
