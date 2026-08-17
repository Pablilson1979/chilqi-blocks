import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink, Wand2 } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { QuieroLuzHeader } from "@/components/quiero-luz/page-header";
import { ProcessGuide } from "@/components/quiero-luz/process-guide";
import { Stepper } from "@/components/quiero-luz/stepper";
import { StepDatos } from "@/components/quiero-luz/step-datos";
import { StepPropiedad } from "@/components/quiero-luz/step-propiedad";
import { StepConexion } from "@/components/quiero-luz/step-conexion";
import { StepResumen } from "@/components/quiero-luz/step-resumen";
import { Seguimiento } from "@/components/quiero-luz/seguimiento";
import {
  ESTADO_INICIAL,
  TU_CONEXION_URL,
  conexionCompleta,
  datosCompletos,
  propiedadCompleta,
  type SimuladorState,
} from "@/components/quiero-luz/data";

const TITLE = "Quiero luz en mi propiedad | Chilquinta Energía";
const DESCRIPTION =
  "Orientación para solicitar un nuevo empalme o aumento de potencia: simula el empalme que necesitas y conoce las etapas, documentos y plazos del proceso.";

export const Route = createFileRoute("/quiero-luz")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuieroLuzPage,
});

const STEPS = [
  "Ingresar datos",
  "Detalles de la propiedad",
  "Detalles de la conexión",
  "Resultado de tu simulación",
];

function QuieroLuzPage() {
  const [modo, setModo] = React.useState<"guia" | "simulador">("guia");
  const [step, setStep] = React.useState(0);
  const [value, setValue] = React.useState<SimuladorState>(ESTADO_INICIAL);

  const onChange = (patch: Partial<SimuladorState>) =>
    setValue((prev) => ({ ...prev, ...patch }));

  const puedeAvanzar =
    (step === 0 && datosCompletos(value)) ||
    (step === 1 && propiedadCompleta(value)) ||
    (step === 2 && conexionCompleta(value));

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-16">
        <QuieroLuzHeader />

        <div className="ch-container flex max-w-4xl flex-col gap-10">
          {modo === "guia" ? (
            <>
              <ProcessGuide />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => {
                    setModo("simulador");
                    setStep(0);
                  }}
                >
                  <Wand2 />
                  Simular mi empalme
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
                    Ya sé lo que necesito, ir a Tu Conexión
                    <ExternalLink />
                  </a>
                </Button>
              </div>
              <Seguimiento />
            </>
          ) : (
            <>
              <Stepper steps={STEPS} current={step} />

              {step === 0 ? <StepDatos value={value} onChange={onChange} /> : null}
              {step === 1 ? <StepPropiedad value={value} onChange={onChange} /> : null}
              {step === 2 ? <StepConexion value={value} onChange={onChange} /> : null}
              {step === 3 ? <StepResumen value={value} /> : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  variant="secondary"
                  onClick={() => (step === 0 ? setModo("guia") : setStep(step - 1))}
                >
                  <ArrowLeft />
                  {step === 0 ? "Volver a la guía" : "Anterior"}
                </Button>
                {step < 3 ? (
                  <Button disabled={!puedeAvanzar} onClick={() => setStep(step + 1)}>
                    Continuar
                    <ArrowRight />
                  </Button>
                ) : (
                  <Button
                    variant="tertiary"
                    onClick={() => {
                      setValue(ESTADO_INICIAL);
                      setStep(0);
                    }}
                  >
                    Simular de nuevo
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
