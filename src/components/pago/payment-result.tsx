import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLLECTORS, DEMO_ACCOUNT, pesos } from "@/lib/pago-data";
import { usePayment } from "./payment-context";
import { MissingPayment, PaymentShell } from "./payment-shared";
import { StatusMessage } from "@/components/chilquinta/status-message";

export function PaymentResult() {
  const payment = usePayment();
  const { receipt, identity } = payment;
  if (!receipt || !identity) return <PaymentShell><MissingPayment /></PaymentShell>;
  const collector = COLLECTORS.find((item) => item.id === receipt.collector);
  const success = receipt.outcome === "success";
  const coupon = `CP-${DEMO_ACCOUNT.billNumber}`;
  const rows = [
    ["N° de cliente", identity.mode === "cliente" ? identity.value : DEMO_ACCOUNT.customer],
    ["Dirección", DEMO_ACCOUNT.address],
    ["Recaudador", collector?.name ?? receipt.collector],
    ["N° de cupón", coupon],
    ["Correo electrónico", receipt.email],
    ["Fecha y hora", `${receipt.date} hrs`],
  ];
  function download() {
    const text = ["Comprobante de pago Chilquinta (prueba QA)", `Monto: ${pesos(receipt!.quote.total)}`, ...rows.map(([l, v]) => `${l}: ${v}`)].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `comprobante-${receipt!.reference}.txt`; a.click();
    URL.revokeObjectURL(url);
  }
  return <PaymentShell><div className="mx-auto max-w-[680px] py-4">
    <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">{success ? "Pago simulado exitoso" : "No se pudo realizar el pago"}</h1>
    <StatusMessage tone={success ? "success" : "error"} title={success ? "Tu pago de prueba se completó" : "Intenta nuevamente"} description={success ? "Puedes revisar el resumen de tu operación a continuación." : "El pago no se completó. Conservamos tu monto, recaudador y correo para que puedas volver a intentarlo."} className="[&_p]:text-base" />
    <div className="mt-6 rounded-card bg-surface p-5 sm:p-8"><p className="text-center text-base text-muted-foreground">{success ? "Monto pagado en la simulación" : "Monto del pago pendiente"}</p><p className="mb-6 mt-2 text-center text-4xl font-extrabold">{pesos(receipt.quote.total)}</p><dl className="divide-y divide-border border-y border-border">{rows.map(([label, value]) => <div key={label} className="grid gap-1 py-3 text-base sm:grid-cols-[190px_minmax(0,1fr)]"><dt className="text-muted-foreground">{label}</dt><dd className="min-w-0 break-words font-semibold [overflow-wrap:anywhere]">{value}</dd></div>)}</dl></div>
    <div className="mx-auto mt-7 flex max-w-[360px] flex-col gap-3">{!success && <Button size="lg" asChild><Link to="/pago-en-linea" onClick={payment.retry}><RotateCcw aria-hidden />Intentar nuevamente</Link></Button>}<Button size="lg" variant={success ? "primary" : "secondary"} asChild><Link to="/" onClick={payment.clear}>Volver al inicio<ArrowRight aria-hidden /></Link></Button>{success && <Button size="lg" variant="secondary" onClick={download}><Download aria-hidden />Descargar comprobante</Button>}{success && <Button size="lg" variant="tertiary" asChild><Link to="/" onClick={payment.clear}>Realizar otro pago</Link></Button>}</div>
    <p className="mt-6 text-center text-sm text-muted-foreground">Prueba QA · No se realizó ningún cobro ni se envió un comprobante por correo; la descarga es un archivo de prueba.</p>
  </div></PaymentShell>;
}