import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BuscarVisita } from "@/components/visita/buscar";
import { EstadoVisita } from "@/components/visita/estado-visita";
import { buscarCaso, type Caso } from "@/components/visita/content";

const TITLE = "Seguimiento de mi corte | Chilquinta";
const DESCRIPTION =
  "Consulta en línea el seguimiento de tu corte de suministro: etapa actual, ubicación del móvil y tiempo estimado de reposición.";

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
        {/* Encabezado: botón volver a la izquierda, título centrado con línea roja debajo */}
        <div className="relative flex items-center">
          {caso ? (
            <button
              type="button"
              onClick={() => setCaso(null)}
              aria-label="Consultar otra orden"
              className="ch-touch absolute left-0 inline-flex items-center text-primary transition-colors hover:text-primary-hover"
            >
              <ChevronLeft className="size-7" aria-hidden />
            </button>
          ) : (
            <Link
              to="/"
              aria-label="Volver al sitio"
              className="ch-touch absolute left-0 inline-flex items-center text-primary transition-colors hover:text-primary-hover"
            >
              <ChevronLeft className="size-7" aria-hidden />
            </Link>
          )}

          <div className="mx-auto flex flex-col items-center gap-ch-sm">
            <h1 className="text-3xl font-bold leading-tight text-foreground lg:text-4xl">
              Estado de interrupción
            </h1>
            <span aria-hidden className="h-1 w-16 rounded-full bg-primary" />
          </div>
        </div>

        {caso ? <EstadoVisita caso={caso} onVolver={() => setCaso(null)} /> : <BuscarVisita onBuscar={buscar} error={error} />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
