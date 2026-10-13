import { Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLLECTORS, DEMO_ACCOUNT, pesos } from "@/lib/pago-data";
import { usePayment } from "./payment-context";
import { MissingPayment, PaymentShell } from "./payment-shared";

export function PaymentResult() {
  const payment = usePayment();
  const { receipt, identity } = payment;
  if (!receipt || !identity) return <PaymentShell><MissingPayment /></PaymentShell>;
  const collector = COLLECTORS.find((item) => item.id === receipt.collector);
  const rows = [
    ["N° de cliente", identity.mode === "cliente" ? identity.value : DEMO_ACCOUNT.customer],
    ["Dirección", DEMO_ACCOUNT.address],
    ["Recaudador", collector?.name ?? receipt.collector],
    ["Correo electrónico", receipt.email],
    ["Referencia de prueba", receipt.reference],
    ["Fecha", receipt.date],
  ];
  return <PaymentShell><div className="mx-auto max-w-[620px] py-4"><header className="text-center"><span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-success-tint text-success"><Check className="size-8" strokeWidth={3} aria-hidden /></span><h1 className="text-3xl font-bold">Pago simulado exitoso</h1><p className="mt-4 text-base text-muted-foreground">El recorrido de pago se completó correctamente.</p><p className="my-6 text-4xl font-extrabold text-foreground">{pesos(receipt.amount)}</p></header><dl className="divide-y divide-border border-y border-border">{rows.map(([label, value]) => <div key={label} className="grid gap-1 py-4 text-base sm:grid-cols-[190px_1fr]"><dt className="text-muted-foreground">{label}</dt><dd className="break-words font-semibold">{value}</dd></div>)}</dl><p className="mt-5 rounded-lg bg-info-soft p-4 text-base text-foreground"><strong>Prueba QA.</strong> No se ha realizado ningún cobro ni se ha enviado un comprobante por correo.</p><div className="mx-auto mt-7 flex max-w-[360px] flex-col gap-3"><Button size="lg" asChild><Link to="/" onClick={payment.clear}>Volver al inicio<ArrowRight aria-hidden /></Link></Button><Button size="lg" variant="secondary" asChild><Link to="/" onClick={payment.clear}>Realizar otro pago</Link></Button></div></div></PaymentShell>;
}