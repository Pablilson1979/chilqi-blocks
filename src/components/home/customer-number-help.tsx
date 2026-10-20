import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import billAsset from "@/assets/numero-de-cliente.svg.asset.json";
import { SuccessTick } from "@/components/chilquinta/success-tick";
import { cn } from "@/lib/utils";

export function CustomerNumberHelp({ variant = "warning", className, includeRequestHelp = false }: { variant?: "warning" | "icon" | "text"; className?: string; includeRequestHelp?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant={variant === "icon" ? "ghost" : "tertiary"} size={variant === "icon" ? "icon" : "default"} className={cn(variant === "warning" ? "min-h-0 shrink-0 rounded-input bg-pay-warning px-3 py-1.5 text-xs text-primary-foreground hover:bg-pay-warning hover:text-primary-foreground" : variant === "icon" ? "shrink-0 rounded-full bg-info-soft text-info hover:bg-info-soft" : "justify-start whitespace-normal px-0 text-left text-base", className)} aria-label="¿Dónde encuentro mi N° de cliente?" title="¿Dónde encuentro mi N° de cliente?">
          {variant !== "warning" && <HelpCircle aria-hidden />}
          {variant === "warning" ? "Ayuda" : variant === "text" ? "¿Dónde encuentro mi N° de cliente?" : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[560px] flex-col gap-0 overflow-hidden rounded-card bg-card p-0 shadow-modal [&>button:last-child]:size-8 [&>button:last-child]:rounded-input [&>button:last-child]:bg-muted [&>button:last-child]:text-foreground [&>button:last-child]:opacity-100">
        <div className="shrink-0 px-5 pb-4 pt-6 sm:px-8">
          <DialogTitle className="pr-8 text-xl font-bold leading-snug text-foreground">¿Dónde encuentro mi N° de cliente?</DialogTitle>
        </div>
        <div className="min-h-0 overflow-y-auto px-5 sm:px-8">
          <DialogDescription className="text-base leading-relaxed text-foreground">En la parte superior de tu boleta, busca la franja roja que dice <strong>“N° CLIENTE”</strong>.</DialogDescription>
          <figure className="my-5">
            <img src={billAsset.url} alt="Ejemplo de boleta Chilquinta: número de boleta 11527595 y N° CLIENTE 123456-7 en la franja roja inferior." className="mx-auto h-auto w-full max-w-[400px]" />
            <figcaption className="mt-3 text-center text-base text-muted-foreground">No uses el número de boleta que aparece arriba.</figcaption>
          </figure>
          <div className="flex items-start gap-3 rounded-input bg-success-soft p-4 text-base leading-relaxed text-foreground">
            <span className="mt-0.5 shrink-0"><SuccessTick /></span>
            <p>Ingresa solo los números <strong>antes del guion</strong>.<br />En este ejemplo: <strong className="font-extrabold">123456</strong>, sin el <strong>-7</strong>.</p>
          </div>
          {includeRequestHelp && <p className="mt-4 text-base leading-relaxed text-muted-foreground">Si usas tu <strong className="text-foreground">N° de solicitud</strong>, lo encontrarás en el mensaje que recibiste al reportar el corte.</p>}
        </div>
        <div className="shrink-0 px-5 py-5 sm:px-8"><DialogClose asChild><Button type="button" size="lg" className="w-full">Entendido</Button></DialogClose></div>
      </DialogContent>
    </Dialog>
  );
}