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
    <div className="flex flex-col gap-ch-xl">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
          <Check className="size-6" strokeWidth={3} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
            Tu orientación está lista
          </p>
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
            Esta es una alternativa referencial
          </h1>
          <p className="text-muted-foreground">
            La solución definitiva será validada durante la solicitud de factibilidad.
          </p>
        </div>
      </div>

      <div className="grid items-start gap-ch-lg lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-ch-lg">
          <Card className="overflow-hidden">
            <div className="h-1 bg-info" aria-hidden />
            <div className="flex flex-col gap-3 p-6 lg:p-8">
              <p className="text-sm font-semibold text-muted-foreground">
                Según tus respuestas, podrías necesitar
              </p>
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl">{r.titulo}</h2>
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
          </Card>

          <Card className="overflow-hidden">
            <Accordion type="single" collapsible defaultValue="resumen">
              <AccordionItem value="resumen" className="border-0">
                <AccordionTrigger className="px-6 py-5 hover:no-underline lg:px-8 lg:py-6">
                  <div className="flex w-full items-center justify-between gap-4 pr-4">
                    <div className="text-left">
                      <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
                        Qué consideramos
                      </p>
                      <h3 className="text-2xl font-bold text-foreground">Resumen de tu orientación</h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 lg:px-8 lg:pb-8">
                  <dl className="grid gap-x-8 sm:grid-cols-2">
                    {r.resumen.map((item) => (
                      <div key={item.label} className="border-t py-3">
                        <dt className="text-sm text-muted-foreground">{item.label}</dt>
                        <dd className="text-base font-bold text-foreground">{item.valor}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Card className="flex flex-col gap-4 p-6 lg:p-8">
            <div>
              <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
                Prepárate para solicitar
              </p>
              <h3 className="text-2xl font-bold text-foreground">El proceso continúa en Tu Conexión</h3>
            </div>
            <Accordion type="multiple" defaultValue={["etapa-1"]} className="flex flex-col gap-3">
              {ETAPAS.map((etapa) => (
                <AccordionItem
                  key={etapa.numero}
                  value={`etapa-${etapa.numero}`}
                  className="rounded-card border px-4"
                >
                  <AccordionTrigger className="gap-3 py-4 text-left hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-info-soft text-sm font-bold text-info">
                        {etapa.numero}
                      </span>
                      <span className="text-base font-bold text-foreground">{etapa.titulo}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-4">
                    <p className="text-base text-muted-foreground">{etapa.descripcion}</p>
                    <p className="rounded-input bg-info-soft p-3 text-sm text-foreground">
                      {etapa.nota} · {etapa.plazo}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        <div className="flex flex-col gap-ch-lg lg:sticky lg:top-6">
          <Card className="flex flex-col gap-4 p-6">
            <span className="flex size-10 items-center justify-center rounded-card bg-info-soft text-info">
              <ChevronRight className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Tu próximo paso</h3>
              <p className="text-muted-foreground">
                Inicia la solicitud de factibilidad en la plataforma Tu Conexión.
              </p>
            </div>
            <Button asChild>
              <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
                Continuar en Tu Conexión
                <ExternalLink />
              </a>
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              Imprimir o guardar como PDF
            </Button>
          </Card>

          <div className="flex items-start gap-3 rounded-card bg-info-soft p-4">
            <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
            <div className="text-sm">
              <p className="font-bold text-foreground">Recuerda</p>
              <p className="text-muted-foreground">
                Esta orientación no garantiza la aprobación ni reemplaza a un instalador autorizado.
              </p>
            </div>
          </div>

          {r.avisos.length > 0 ? (
            <Card className="flex flex-col gap-3 p-6">
              <h4 className="text-base font-bold text-foreground">Ten en cuenta</h4>
              <ul className="flex flex-col gap-3">
                {r.avisos.map((a) => (
                  <li key={a} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}