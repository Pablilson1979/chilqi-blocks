import { LoaderCircle, LockKeyhole, MapPin, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNT, pesos, type CollectorId, COLLECTORS } from "@/lib/pago-data";

import type { PaymentQuote } from "@/lib/payment-quote";

type Props = { quote: PaymentQuote; open: boolean; onOpenChange: (open: boolean) => void; amount: number; collector: CollectorId | null; email: string; customer: string; processing: boolean; onConfirm: () => void; onFail: () => void; onOther: () => void; onEditEmail: () => void };

export function PaymentConfirmation({ quote, open, onOpenChange, collector, email, customer, processing, onConfirm, onFail, onOther, onEditEmail }: Props) {
  const name = COLLECTORS.find((item) => item.id === collector)?.name;
  return <Dialog.Root open={open} onOpenChange={(next) => { if (!processing) onOpenChange(next); }}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/60 motion-safe:animate-in motion-safe:fade-in" />
    <Dialog.Content onEscapeKeyDown={(event) => { if (processing) event.preventDefault(); }} onPointerDownOutside={(event) => { if (processing) event.preventDefault(); }} className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-card bg-surface shadow-modal sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100%-3rem)] sm:max-w-[760px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 pt-5 pb-4 sm:px-8 sm:pt-6"><div><Dialog.Title className="text-xl font-bold sm:text-2xl">¿Es la dirección correcta?</Dialog.Title><Dialog.Description className="mt-1 text-base text-muted-foreground">Revísala con calma: el pago se abona solo a esta dirección.</Dialog.Description></div><Button variant="ghost" size="icon" disabled={processing} aria-label="Cerrar confirmación" onClick={() => onOpenChange(false)} className="-mr-2 shrink-0"><X aria-hidden /></Button></div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="flex items-start gap-3 rounded-lg border-2 border-foreground p-4 sm:gap-4 sm:p-5"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><MapPin aria-hidden /></span><div className="min-w-0"><p className="text-base font-semibold text-muted-foreground">Vas a pagar la luz de</p><p className="mt-1 text-xl font-extrabold">{DEMO_ACCOUNT.address}</p><p className="mt-2 text-base text-muted-foreground">N° de cliente <strong className="text-foreground">{customer}</strong></p></div></div>
          <div className="flex flex-col justify-center rounded-lg bg-muted p-4 sm:p-5"><p className="text-base text-muted-foreground">Monto de tu cuenta</p><p className="text-3xl font-extrabold">{pesos(quote.total)}</p><p className="mt-1 text-base text-muted-foreground">con <strong className="text-foreground">{name}</strong></p></div>
        </div>
        {collector === "bemobi" && <p className="mt-3 rounded-lg bg-info-soft px-3 py-2 text-sm font-bold text-foreground">A este valor Bemobi sumará su comisión según las cuotas que elijas. El total final lo verás en Bemobi.</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 text-base"><p className="min-w-0"><span className="text-muted-foreground">Comprobante a </span><strong className="break-all">{email.trim()}</strong></p><Button variant="tertiary" disabled={processing} onClick={onEditEmail} className="h-auto min-h-11 px-0 text-base underline">Cambiar correo</Button></div>
      </div>
      <div className="border-t border-border px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="grid gap-3 sm:grid-cols-2"><Button size="lg" variant="secondary" disabled={processing} onClick={onOther} className="order-2 whitespace-normal sm:order-1">No, es otra dirección</Button><Button size="lg" disabled={processing} onClick={onConfirm} className="order-1 whitespace-normal sm:order-2">{processing ? <><LoaderCircle className="motion-safe:animate-spin" aria-hidden />Procesando…</> : <><LockKeyhole aria-hidden />Sí, pagar {pesos(quote.total)}</>}</Button></div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 text-center">{!processing && <Button variant="tertiary" onClick={onFail} className="text-sm underline">Probar pago no logrado (QA)</Button>}<p role={processing ? "status" : undefined} className="text-sm text-muted-foreground">{processing ? "Estamos procesando tu pago de prueba. Espera un momento." : "Simulación QA: sin cobros ni correos."}</p></div>
      </div>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
