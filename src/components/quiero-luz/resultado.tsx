import { Check, ChevronRight, ExternalLink, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ETAPAS, TU_CONEXION_URL, calcularOrientacion, type Orientacion } from "./content";

export function Resultado({ datos, onEditar }: { datos: Orientacion; onEditar: () => void }) {
  const r = calcularOrientacion(datos);

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-col gap-ch-lg">
      {/* PRIORIDAD 1: resultado + acción */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-info" aria-hidden />
        <div className="grid gap-ch-lg p-6 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:p-8">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-success uppercase">
              <Check className="size-4" strokeWidth={3} aria-hidden />
              Según tus respuestas, podrías necesitar
            </p>
            <h1 className="text-3xl font-bold text-foreground lg:text-4xl">{r.titulo}</h1>
            <p className="text-muted-foreground">{r.detalle}</p>
            <ul className="flex flex-wrap gap-2 pt-1">
              {r.chips.map((c) => (
                <li
                  key={c}
                  className="rounded-pill bg-info-soft px-3 py-1 text-sm font-bold text-info"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 rounded-card bg-muted/30 p-4">
            <p className="text-base font-bold text-foreground">Tu próximo paso</p>
            <p className="text-sm text-muted-foreground">
              Inicia la solicitud de factibilidad en Tu Conexión.
            </p>
            <Button asChild size="lg" className="mt-1">
              <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
                Continuar en Tu Conexión
                <ExternalLink />
              </a>
            </Button>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button variant="tertiary" size="sm" onClick={() => window.print()}>
                Guardar como PDF
              </Button>
              <Button variant="tertiary" size="sm" onClick={onEditar}>
                Editar respuestas
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* PRIORIDAD 2: detalle secundario, compacto */}
      <div className="grid items-start gap-ch-md lg:grid-cols-2">
        <Accordion type="single" collapsible className="flex flex-col gap-ch-md">
          <AccordionItem value="resumen" className="rounded-card border bg-card px-4">
            <AccordionTrigger className="py-3 text-left hover:no-underline">
              <span className="text-sm font-bold text-foreground">Resumen de tu orientación</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <dl className="grid gap-x-6 sm:grid-cols-2">
                {r.resumen.map((item) => (
                  <div key={item.label} className="border-t py-2">
                    <dt className="text-xs text-muted-foreground">{item.label}</dt>
                    <dd className="text-sm font-bold text-foreground">{item.valor}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="proceso" className="rounded-card border bg-card px-4">
            <AccordionTrigger className="py-3 text-left hover:no-underline">
              <span className="text-sm font-bold text-foreground">
                Cómo continúa el proceso en Tu Conexión
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3 pb-4">
              {ETAPAS.map((etapa) => (
                <div key={etapa.numero} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-info-soft text-xs font-bold text-info">
                    {etapa.numero}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{etapa.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {etapa.descripcion} · {etapa.plazo}
                    </p>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col gap-ch-md">
          {r.avisos.length > 0 ? (
            <div className="rounded-card border bg-card p-4">
              <p className="text-sm font-bold text-foreground">Ten en cuenta</p>
              <ul className="mt-2 flex flex-col gap-2">
                {r.avisos.map((a) => (
                  <li key={a} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex items-start gap-2 rounded-card bg-info-soft p-3">
            <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
            <p className="text-xs text-muted-foreground">
              Esta orientación es referencial: no garantiza la aprobación ni reemplaza a un
              instalador autorizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
