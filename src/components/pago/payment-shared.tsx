import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNT } from "@/lib/pago-data";
import { usePayment } from "./payment-context";
import { cn } from "@/lib/utils";

export function PaymentShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-background font-sans"><SiteHeader /><main className="ch-container w-full flex-1 py-8 sm:py-10"><div className="mx-auto max-w-[1110px]">{children}</div></main><SiteFooter /></div>;
}

export function PaymentHeading({ step }: { step: 1 | 2 }) {
  return <><div className="relative mb-6 flex min-h-12 items-center justify-center"><Button variant="ghost" size="icon" asChild className="absolute left-0 size-12 rounded-full bg-surface text-primary hover:bg-surface"><Link to="/" aria-label="Volver al inicio"><ChevronLeft className="size-6" /></Link></Button><h1 className="px-14 text-center text-2xl font-bold text-foreground sm:text-3xl">Paga tu cuenta</h1></div><ol aria-label="Progreso del pago" className="mb-6 grid grid-cols-2 gap-3">{["Monto", "Medio de pago"].map((name, i) => <li key={name} aria-current={step === i + 1 ? "step" : undefined}><span aria-hidden className={cn("block h-1.5 rounded-full", step >= i + 1 ? "bg-primary" : "bg-border")} /><span className={cn("mt-2 block text-sm font-bold sm:text-base", step >= i + 1 ? "text-foreground" : "text-muted-foreground")}>{i + 1}. {name}</span></li>)}</ol></>;
}

export function AccountSummary() {
  const { identity } = usePayment();
  const customer = identity?.mode === "cliente" ? identity.value : DEMO_ACCOUNT.customer;
  return <section aria-label="Cuenta a pagar" className="mb-7 flex items-center gap-3 rounded-xl bg-surface px-4 py-4 sm:gap-4 sm:px-6"><span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><MapPin className="size-5" /></span><div className="min-w-0"><p className="text-sm text-muted-foreground">Vas a pagar la dirección</p><p className="text-lg font-extrabold text-foreground">{DEMO_ACCOUNT.address}</p><p className="mt-1 text-sm text-muted-foreground">N° de cliente <strong className="font-bold text-foreground">{customer}</strong><span aria-hidden className="mx-2">·</span>Vence <strong className="font-bold text-foreground">{DEMO_ACCOUNT.dueDate}</strong></p>{identity?.mode === "rut" && <p className="text-sm text-muted-foreground">RUT: {identity.value}</p>}</div></section>;
}

export function SelectionMark({ selected }: { selected: boolean }) {
  return <span aria-hidden className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", selected ? "bg-success-tint text-success" : "border-2 border-border bg-surface")}>{selected && <Check className="size-4" strokeWidth={3} />}</span>;
}

export function MissingPayment() {
  return <div className="mx-auto max-w-lg py-16 text-center"><h1 className="text-3xl font-bold">Comienza tu pago desde el inicio</h1><p className="my-6 text-base text-muted-foreground">Ingresa tu N° de cliente o RUT en «Paga tu cuenta aquí» para continuar.</p><Button size="lg" asChild><Link to="/">Ir al inicio</Link></Button></div>;
}