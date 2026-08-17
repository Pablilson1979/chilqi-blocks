import { ArrowRight, Clock, Info } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MACRO_STAGES } from "./data";

/**
 * Guía informativa: aviso de orientación + las 3 macroetapas de la norma
 * con sus subetapas y plazos, en coherencia con la plataforma Tu Conexión.
 */
export function ProcessGuide() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="flex gap-4 p-6">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-input bg-info-soft text-info [&_svg]:size-6"
        >
          <Info />
        </span>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
          <p>
            Esta guía te mostrará los pasos para saber cómo solicitar tu empalme. Es una{" "}
            <strong className="text-foreground">orientación</strong> y{" "}
            <strong className="text-foreground">no garantiza la obtención inmediata</strong> ni el
            valor final del servicio.
          </p>
          <p>
            Antes de comenzar es necesario que conozcas{" "}
            <strong className="text-foreground">
              todas las etapas y plazos estimativos del proceso
            </strong>
            .
          </p>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-bold text-foreground">Proceso de venta de nuevo medidor</h2>
        <p className="text-sm text-muted-foreground">
          El proceso se organiza en tres etapas definidas por la Norma Técnica. Haz click en cada
          etapa para ver sus pasos.
        </p>

        <ol className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          {MACRO_STAGES.map((stage, i) => (
            <li key={stage.id} className="flex items-center gap-2">
              <span className="rounded-pill bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                {stage.numero} {stage.titulo}
              </span>
              {i < MACRO_STAGES.length - 1 ? (
                <ArrowRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-4">
          {MACRO_STAGES.map((stage) => (
            <Card key={stage.id} className="p-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-foreground">
                  <span className="text-primary">{stage.numero}</span> {stage.titulo}
                </h3>
                <p className="text-sm text-muted-foreground">{stage.resumen}</p>
                {stage.plazo ? (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-info">
                    <Clock className="size-4" aria-hidden />
                    {stage.plazo}
                  </p>
                ) : null}
              </div>

              <Accordion type="single" collapsible className="mt-4">
                {stage.subetapas.map((sub, i) => (
                  <AccordionItem key={sub.titulo} value={`${stage.id}-${i}`}>
                    <AccordionTrigger className="text-base font-bold text-primary hover:no-underline">
                      <span>
                        <span className="mr-1 tabular-nums">
                          {stage.numero}.{i + 1}
                        </span>
                        {sub.titulo}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {sub.descripcion}
                      </p>
                      {sub.plazo ? (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-info">
                          <Clock className="size-4" aria-hidden />
                          {sub.plazo}
                        </p>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
