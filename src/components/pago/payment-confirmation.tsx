import { LoaderCircle, LockKeyhole, MapPin, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNT, pesos, type CollectorId, COLLECTORS } from "@/lib/pago-data";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; amount: number; collector: CollectorId | null; email: string; customer: string; processing: boolean; onConfirm: () => void; onOther: () => void; onEditEmail: () => void };

export function PaymentConfirmation({ open, onOpenChange, amount, collector, email, customer, processing, onConfirm, onOther, onEditEmail }: Props) {
  const name = COLLECTORS.find((item) => item.id === collector)?.name;
  return <Dialog.Root open={open} onOpenChange={(next) => { if (!processing) onOpenChange(next); }}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/60 motion-safe:animate-in motion-safe:fade-in" />
    <Dialog.Content onEscapeKeyDown={(event) => { if (processing) event.preventDefault(); }} onPointerDownOutside={(event) => { if (processing) event.preventDefault(); }} className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card bg-surface p-5 shadow-modal sm:p-8">
      <div className="flex items-start justify-between gap-3"><Dialog.Title className="text-xl font-bold sm:text-2xl">¿Es la dirección correcta?</Dialog.Title><Button variant="ghost" size="icon" disabled={processing} aria-label="Cerrar confirmación" onClick={() => onOpenChange(false)} className="-mr-2 -mt-2 shrink-0"><X aria-hidden /></Button></div>
      <Dialog.Description className="mt-3 text-base leading-relaxed text-muted-foreground">Revísala con calma: el pago se abona solo a esta dirección.</Dialog.Description>
      <div className="mt-5 flex items-start gap-3 rounded-lg border-2 border-foreground p-4 sm:gap-4 sm:p-5"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><MapPin aria-hidden /></span><div className="min-w-0"><p className="text-base font-semibold text-muted-foreground">Vas a pagar la luz de</p><p className="mt-1 text-xl font-extrabold sm:text-2xl">{DEMO_ACCOUNT.address}</p><p className="mt-3 text-base text-muted-foreground">N° de cliente <strong className="text-foreground">{customer}</strong></p></div></div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted p-4 sm:p-5"><div><p className="text-base text-muted-foreground">Monto</p><p className="text-3xl font-extrabold">{pesos(amount)}</p></div><p className="text-base text-muted-foreground">con <strong className="text-foreground">{name}</strong></p></div>
      <div className="my-5 grid gap-1 text-base sm:grid-cols-[auto_1fr]"><p className="text-muted-foreground">Comprobante a</p><div className="min-w-0 sm:text-right"><p className="break-all font-bold">{email.trim()}</p><Button variant="tertiary" disabled={processing} onClick={onEditEmail} className="h-auto min-h-11 px-0 text-base underline">Cambiar correo</Button></div></div>
      <div className="grid gap-3 sm:grid-cols-2"><Button size="lg" variant="secondary" disabled={processing} onClick={onOther} className="order-2 whitespace-normal sm:order-1">No, es otra dirección</Button><Button size="lg" disabled={processing} onClick={onConfirm} className="order-1 whitespace-normal sm:order-2">{processing ? <><LoaderCircle className="motion-safe:animate-spin" aria-hidden />Procesando…</> : <><LockKeyhole aria-hidden />Sí, pagar {pesos(amount)}</>}</Button></div>
      <p role={processing ? "status" : undefined} className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">{processing ? "Estamos procesando tu pago de prueba. Espera un momento." : "Simulación QA: no irás al sitio del recaudador, no se harán cobros ni se enviarán correos."}</p>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}