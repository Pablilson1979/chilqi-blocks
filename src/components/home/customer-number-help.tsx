import { ArrowDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CustomerNumberHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="tertiary" className="min-h-0 shrink-0 rounded-input bg-pay-warning px-3 py-1.5 text-xs text-primary-foreground hover:bg-pay-warning hover:text-primary-foreground" aria-label="Ayuda para encontrar tu número de cliente">
          Ayuda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[560px] gap-5 overflow-y-auto rounded-card bg-card p-6 sm:p-8 [&>button:last-child]:flex [&>button:last-child]:size-8 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-input [&>button:last-child]:bg-muted [&>button:last-child]:text-foreground">
        <DialogTitle className="pr-8 text-xl font-bold leading-snug text-foreground">¿Dónde está mi número de cliente?</DialogTitle>
        <DialogDescription className="text-base leading-relaxed text-foreground">Busca el campo <strong>“N° CLIENTE”</strong> en la parte superior de tu boleta. No lo confundas con el número de boleta.</DialogDescription>

        <figure className="m-0">
          <figcaption className="mb-3 text-sm font-medium text-muted-foreground">Ejemplo ilustrativo de tu boleta</figcaption>
          <div className="overflow-hidden rounded-input border border-border bg-surface">
            <div className="flex items-center justify-between gap-4 border-b border-border p-4">
              <img src="/Logo_Chilquinta.svg" alt="Chilquinta" className="w-28" />
              <div className="text-right text-xs leading-relaxed text-muted-foreground">BOLETA ELECTRÓNICA<br />N° 11527595</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 bg-success-soft p-4">
              <span className="text-base font-bold text-foreground">N° CLIENTE</span>
              <span className="flex items-center gap-2 text-2xl text-foreground">
                <span className="rounded-input border-2 border-success bg-surface px-2 py-1 font-bold">123456</span>
                <span className="text-lg text-muted-foreground">-7</span>
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-3 text-base leading-relaxed text-foreground">
            <ArrowDown className="mt-1 size-5 shrink-0 text-success" aria-hidden />
            <p>Ingresa solo <strong>123456</strong>. No incluyas el guión ni el dígito que aparece después.</p>
          </div>
        </figure>

        <div className="flex items-center gap-3 border-t border-border pt-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success-soft text-success"><Check className="size-5" strokeWidth={3} aria-hidden /></span>
          <p className="text-base leading-relaxed text-foreground">Tu número de cliente tiene <strong>6 o 7 números</strong>, sin puntos ni guión.</p>
        </div>
        <DialogClose asChild><Button type="button" size="lg" className="w-full">Entendido</Button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}