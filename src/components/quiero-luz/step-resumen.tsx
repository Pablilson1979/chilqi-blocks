import * as React from "react";
import { CalendarClock, CheckCircle2, ExternalLink, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/chilquinta/field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DOCUMENTOS_BASE,
  MACRO_STAGES,
  TRABAJOS_PREVIOS,
  TU_CONEXION_URL,
  calcularResultado,
  type SimuladorState,
} from "./data";

/** Paso 4 — Resumen referencial del empalme y pasos a seguir. */
export function StepResumen({ value }: { value: SimuladorState }) {
  const resultado = calcularResultado(value);
  const [email, setEmail] = React.useState("");
  const [enviado, setEnviado] = React.useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const documentos = React.useMemo(
    () =>
      value.solicitante === "tercero"
        ? [...DOCUMENTOS_BASE, "Autorización notarial del propietario"]
        : DOCUMENTOS_BASE,
    [value.solicitante],
  );

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col items-center gap-2 border-success bg-success-soft p-8 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden />
        <p className="text-sm font-semibold text-foreground">La conexión que necesitas es:</p>
        <p className="text-2xl font-bold text-foreground lg:text-3xl">
          {resultado ? resultado.titulo : "Completa los pasos anteriores"}
        </p>
        {resultado ? (
          <>
            <p className="text-base font-semibold text-foreground/80">{resultado.fases}</p>
            <p className="text-sm text-muted-foreground">{resultado.nota}</p>
          </>
        ) : null}
        <p className="mt-2 max-w-xl text-xs text-muted-foreground">
          Este resultado es una orientación referencial: no constituye una cotización ni garantiza
          la factibilidad de la conexión.
        </p>
      </Card>

      <Accordion type="single" collapsible className="rounded-card border bg-card px-6 shadow-card">
        <AccordionItem value="pasos">
          <AccordionTrigger className="text-base font-bold">Pasos a seguir</AccordionTrigger>
          <AccordionContent>
            <ol className="flex flex-col gap-4">
              {MACRO_STAGES.map((stage) => (
                <li key={stage.id} className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-primary">
                    {stage.numero} {stage.titulo}
                  </p>
                  <ul className="ml-4 list-disc text-sm text-foreground/80">
                    {stage.subetapas.map((sub) => (
                      <li key={sub.titulo}>
                        {sub.titulo}
                        {sub.plazo ? ` — ${sub.plazo}` : ""}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="documentos">
          <AccordionTrigger className="text-base font-bold">
            Documentos que debes presentar
          </AccordionTrigger>
          <AccordionContent>
            <ul className="ml-4 flex list-disc flex-col gap-1 text-sm text-foreground/80">
              {documentos.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="trabajos">
          <AccordionTrigger className="text-base font-bold">
            Trabajos previos en tu propiedad
          </AccordionTrigger>
          <AccordionContent>
            <ul className="ml-4 flex list-disc flex-col gap-1 text-sm text-foreground/80">
              {TRABAJOS_PREVIOS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="video" className="border-b-0">
          <AccordionTrigger className="text-base font-bold">
            ¿Tienes dudas? Agenda una Video Atención
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-foreground/80">
              Un ejecutivo puede revisar contigo los antecedentes de tu propiedad antes de ingresar
              la solicitud.
            </p>
            <Button variant="secondary" className="mt-3" asChild>
              <a href="https://www.chilquinta.cl/videoatencion" target="_blank" rel="noreferrer">
                <CalendarClock />
                Agendar Video Atención
              </a>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="flex flex-col gap-4 p-6">
        <h3 className="text-base font-bold text-foreground">Enviar esta simulación a mi email</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field
            id="ql-email"
            label="Correo electrónico"
            type="email"
            placeholder="nombre@correo.cl"
            className="flex-1"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEnviado(false);
            }}
            state={enviado ? "success" : "default"}
            {...(enviado
              ? { message: "Enviamos el resumen de tu simulación a tu correo." }
              : {})}
          />
          <Button disabled={!emailValido} onClick={() => setEnviado(true)}>
            <Mail />
            Enviar
          </Button>
        </div>
      </Card>

      <Button size="lg" asChild>
        <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
          Continuar en Tu Conexión
          <ExternalLink />
        </a>
      </Button>
    </div>
  );
}
