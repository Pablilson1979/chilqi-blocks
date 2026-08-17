import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Inicio } from "@/components/quiero-luz/inicio";
import { Orientacion, pasoCompleto } from "@/components/quiero-luz/orientacion";
import { Resultado } from "@/components/quiero-luz/resultado";
import { Seguimiento } from "@/components/quiero-luz/seguimiento";
import { PASOS } from "@/components/quiero-luz/steps-nav";
import {
  ORIENTACION_INICIAL,
  type Necesidad,
  type Orientacion as Datos,
} from "@/components/quiero-luz/content";

const TITLE = "Quiero Luz | Orientación de conexión eléctrica | Chilquinta";
const DESCRIPTION =
  "Descubre en 4 pasos qué conexión eléctrica podrías necesitar, revisa los requisitos y continúa tu solicitud en Tu Conexión.";

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

type Vista = "inicio" | "orientacion" | "resultado" | "seguimiento";

function QuieroLuzPage() {
  const [vista, setVista] = React.useState<Vista>("inicio");
  const [step, setStep] = React.useState(0);
  const [datos, setDatos] = React.useState<Datos>(ORIENTACION_INICIAL);

  const onChange = (patch: Partial<Datos>) =>
    setDatos((prev: Datos) => ({ ...prev, ...patch }));

  function comenzar(necesidad?: Necesidad) {
    setDatos({ ...ORIENTACION_INICIAL, necesidad: necesidad ?? null });
    setStep(necesidad ? 1 : 0);
    setVista("orientacion");
  }

  function siguiente() {
    if (!pasoCompleto(step, datos)) return;
    if (step === PASOS.length - 1) setVista("resultado");
    else setStep(step + 1);
  }

  function anterior() {
    if (step === 0) setVista("inicio");
    else setStep(step - 1);
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-ch-xl lg:py-ch-2xl">
        <div className="ch-container flex flex-col gap-ch-lg">
          <div className="flex items-center justify-between gap-4">
            {vista === "inicio" ? (
              <Link
                to="/"
                className="ch-touch inline-flex items-center gap-1 text-base font-bold text-primary hover:text-primary-hover"
              >
                <ChevronLeft className="size-5" aria-hidden />
                Volver al sitio
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setVista("inicio")}
                className="ch-touch inline-flex items-center gap-1 text-base font-bold text-primary hover:text-primary-hover"
              >
                <ChevronLeft className="size-5" aria-hidden />
                Volver al inicio
              </button>
            )}
            <span className="rounded-pill bg-info-soft px-3 py-1 text-sm font-bold text-info">
              Orientación referencial
            </span>
          </div>

          {vista === "inicio" ? (
            <Inicio onComenzar={comenzar} onSeguimiento={() => setVista("seguimiento")} />
          ) : null}

          {vista === "orientacion" ? (
            <Orientacion
              step={step}
              datos={datos}
              onChange={onChange}
              onBack={anterior}
              onNext={siguiente}
            />
          ) : null}

          {vista === "resultado" ? (
            <Resultado
              datos={datos}
              onEditar={() => {
                setStep(0);
                setVista("orientacion");
              }}
            />
          ) : null}

          {vista === "seguimiento" ? <Seguimiento /> : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
