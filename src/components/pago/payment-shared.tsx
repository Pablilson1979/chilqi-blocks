import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNT } from "@/lib/pago-data";
import { usePayment } from "./payment-context";
import { cn } from "@/lib/utils";

export function PaymentShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-background font-sans"><SiteHeader /><main className="ch-container w-full flex-1 py-8 sm:py-10"><div className="mx-auto max-w-[960px]">{children}</div></main><SiteFooter /></div>;
}

export function PaymentHeading({ step }: { step: 1 | 2 }) {
  return <><div className="relative mb-7 flex flex-col items-center gap-3 text-center"><Button variant="tertiary" size="icon" asChild className="absolute left-0 top-0"><Link to="/" aria-label="Volver al inicio"><ChevronLeft /></Link></Button><h1 className="px-12 text-3xl font-bold text-foreground">Pago en línea</h1><span className="h-1 w-16 rounded-full bg-primary" /></div><ol aria-label="Progreso del pago" className="relative mx-auto mb-8 grid max-w-[480px] grid-cols-2 gap-2"><span aria-hidden className="absolute left-1/4 right-1/4 top-4 h-0.5 bg-border" />{["Seleccionar monto", "Seleccionar recaudador"].map((name, i) => <li key={name} aria-current={step === i + 1 ? "step" : undefined} className="relative flex flex-col items-center gap-2 text-center"><span className={cn("flex size-8 items-center justify-center rounded-full text-base font-bold", step > i + 1 ? "bg-success text-success-foreground" : step === i + 1 ? "bg-pay-warning text-primary-foreground" : "bg-border text-muted-foreground")}>{step > i + 1 ? <Check className="size-4" aria-hidden /> : i + 1}</span><span className={cn("text-sm font-semibold sm:text-base", step === i + 1 ? "text-foreground" : "text-muted-foreground")}>{name}</span></li>)}</ol></>;
}

export function AccountSummary() {
  const { identity } = usePayment();
  const customer = identity?.mode === "cliente" ? identity.value : DEMO_ACCOUNT.customer;
  return <section aria-label="Cuenta a pagar" className="mb-7 border-y border-border py-5"><dl className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-[1.3fr_1fr_1fr]"><div className="col-span-2 sm:col-span-1"><dt className="mb-1 text-sm text-muted-foreground">Vas a pagar la dirección</dt><dd className="text-base font-bold">{DEMO_ACCOUNT.address}</dd></div><div><dt className="mb-1 text-sm text-muted-foreground">N° de cliente</dt><dd className="text-base font-semibold">{customer}</dd>{identity?.mode === "rut" && <p className="mt-1 text-sm text-muted-foreground">RUT: {identity.value}</p>}</div><div><dt className="mb-1 text-sm text-muted-foreground">Vencimiento de boleta</dt><dd className="text-base font-semibold">{DEMO_ACCOUNT.dueDate}</dd></div></dl></section>;
}

export function SelectionMark({ selected }: { selected: boolean }) {
  return <span aria-hidden className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", selected ? "bg-success-tint text-success" : "border-2 border-border bg-surface")}>{selected && <Check className="size-4" strokeWidth={3} />}</span>;
}

export function MissingPayment() {
  return <div className="mx-auto max-w-lg py-16 text-center"><h1 className="text-3xl font-bold">Comienza tu pago desde el inicio</h1><p className="my-6 text-base text-muted-foreground">Ingresa tu N° de cliente o RUT en «Paga tu cuenta aquí» para continuar.</p><Button size="lg" asChild><Link to="/">Ir al inicio</Link></Button></div>;
}