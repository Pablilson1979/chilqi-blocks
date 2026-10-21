import { Check, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function CustomerNumberHelp({ variant = "warning", className, includeRequestHelp = false }: { variant?: "warning" | "icon" | "text"; className?: string; includeRequestHelp?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant={variant === "icon" ? "ghost" : "tertiary"} size={variant === "icon" ? "icon" : "default"} className={cn(variant === "warning" ? "min-h-0 shrink-0 rounded-input bg-pay-warning px-3 py-1.5 text-xs text-primary-foreground hover:bg-pay-warning hover:text-primary-foreground" : variant === "icon" ? "shrink-0 rounded-full bg-info-soft text-info hover:bg-info-soft" : "justify-start whitespace-normal px-0 text-left text-base", className)} aria-label="¿Dónde está mi N° de cliente?" title="¿Dónde está mi N° de cliente?">
          {variant !== "warning" && <HelpCircle aria-hidden />}
          {variant === "warning" ? "Ayuda" : variant === "text" ? "¿Dónde encuentro mi N° de cliente?" : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[464px] flex-col gap-0 overflow-hidden rounded-card bg-card p-0 shadow-modal [&>button:last-child]:right-5 [&>button:last-child]:top-5 [&>button:last-child]:flex [&>button:last-child]:size-8 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-input [&>button:last-child]:bg-muted [&>button:last-child]:text-muted-foreground [&>button:last-child]:opacity-100">
        <div className="shrink-0 px-5 pt-5 sm:px-6 sm:pt-6">
          <DialogTitle className="pr-10 text-lg font-bold leading-snug text-foreground">¿Dónde está mi N° de cliente?</DialogTitle>
        </div>
        <div className="flex min-h-0 flex-col gap-3.5 overflow-y-auto px-5 pt-4 sm:px-6">
          <DialogDescription className="text-sm font-semibold text-muted-foreground">Así se ve tu boleta física:</DialogDescription>

          <div className="flex flex-col gap-1.5 rounded-[10px] bg-muted p-3.5 pb-4" aria-hidden>
            <div className="rounded-md border-[1.5px] border-border px-3 py-2 text-center text-[11px] font-bold leading-relaxed text-muted-foreground opacity-40">
              R.U.T.: 96.813.520-1<br />BOLETA ELECTRÓNICA<br />N° 115275795
            </div>
            <p className="mb-3 text-center text-[9px] font-bold tracking-wider text-muted-foreground opacity-40">S.I.I. - VALPARAÍSO</p>

            <div className="relative">
              <span className="absolute -top-3 right-2 inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                <Check className="size-3" strokeWidth={3} /> Tu número está aquí
              </span>
              <div className="flex overflow-hidden rounded-[7px] border-[2.5px] border-success shadow-[0_0_0_3px_var(--success-soft)]">
                <span className="flex items-center whitespace-nowrap bg-primary px-3.5 py-3.5 text-xs font-bold tracking-wide text-primary-foreground">N° CLIENTE:</span>
                <span className="flex flex-1 items-center bg-card px-3.5 text-2xl font-bold tracking-wide text-foreground">
                  123456<span className="text-border">-7</span>
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-start gap-2.5 rounded-input bg-card p-3.5 text-sm leading-relaxed text-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-info" />
              <p>Usa solo los números <strong>antes del guión</strong>: <strong>123456</strong> — sin el <strong>-7</strong></p>
            </div>
          </div>

          {includeRequestHelp && <p className="text-sm leading-relaxed text-muted-foreground">Si usas tu <strong className="text-foreground">N° de solicitud</strong>, lo encontrarás en el mensaje que recibiste al reportar el corte.</p>}

          <div className="mt-1 flex items-center gap-3 text-sm font-semibold text-muted-foreground">
            <span className="h-px flex-1 bg-border" aria-hidden />También puedes<span className="h-px flex-1 bg-border" aria-hidden />
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2.5 px-5 pb-5 pt-3.5 sm:px-6 sm:pb-6">
          <Button asChild size="lg" className="w-full">
            <a href="https://www.chilquinta.cl" target="_blank" rel="noreferrer">Buscar mi número de cliente</a>
          </Button>
          <DialogClose asChild><Button type="button" variant="secondary" size="lg" className="w-full">Entendido</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
