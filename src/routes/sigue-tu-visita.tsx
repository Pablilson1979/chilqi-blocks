import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BuscarVisita } from "@/components/visita/buscar";
import { EstadoVisita } from "@/components/visita/estado-visita";
import { buscarCaso, type Caso } from "@/components/visita/content";

const TITLE = "Sigue tu visita técnica | Estado de tu corte | Chilquinta";
const DESCRIPTION =
  "Consulta en línea el estado de tu visita técnica: etapa actual, ubicación del móvil y tiempo estimado para reponer tu suministro.";

export const Route = createFileRoute("/sigue-tu-visita")({
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
  component: SigueTuVisitaPage,
});

function SigueTuVisitaPage() {
  const [caso, setCaso] = React.useState<Caso | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function buscar(valor: string) {
    const encontrado = buscarCaso(valor);
    if (!encontrado) {
      setError("No encontramos una visita activa con ese número. Revísalo e intenta de nuevo.");
      return;
    }
    setError(null);
    setCaso(encontrado);
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-ch-xl lg:py-ch-2xl">
        <div className="ch-container flex flex-col gap-ch-lg">
          {caso ? (
            <button
              type="button"
              onClick={() => setCaso(null)}
              className="ch-touch inline-flex w-fit items-center gap-1 text-base font-bold text-primary hover:text-primary-hover"
            >
              <ChevronLeft className="size-5" aria-hidden />
              Consultar otra orden
            </button>
          ) : (
            <Link
              to="/"
              className="ch-touch inline-flex w-fit items-center gap-1 text-base font-bold text-primary hover:text-primary-hover"
            >
              <ChevronLeft className="size-5" aria-hidden />
              Volver al sitio
            </Link>
          )}

          {caso ? (
            <EstadoVisita caso={caso} onVolver={() => setCaso(null)} />
          ) : (
            <>
              <div className="mx-auto max-w-[640px] text-center">
                <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                  Sigue tu visita técnica
                </h1>
                <p className="mt-ch-md text-base leading-relaxed text-muted-foreground">
                  Ingresa tu número de orden o de cliente y revisa en qué etapa está la
                  reparación de tu corte.
                </p>
              </div>
              <BuscarVisita onBuscar={buscar} error={error} />
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
