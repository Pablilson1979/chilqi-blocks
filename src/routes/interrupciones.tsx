import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, HelpCircle } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import ModoCliente from "@/components/interrupciones/ModoCliente";
import ModoOperativo from "@/components/interrupciones/ModoOperativo";
import Tour from "@/components/interrupciones/Tour";
import { Button } from "@/components/ui/button";

const TITLE = "Cortes de suministro | Chilquinta";
const DESCRIPTION =
  "Consulta el estado de tu suministro y revisa los cortes en curso en la región de Valparaíso.";

export const Route = createFileRoute("/interrupciones")({
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
  component: InterrupcionesPage,
});

type Vista = "cliente" | "operativa";

function InterrupcionesPage() {
  const [vista, setVista] = useState<Vista>("cliente");
  const [manualOverride, setManualOverride] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    const applyViewportDefault = () => {
      setVista(window.innerWidth < 1024 ? "cliente" : "operativa");
    };
    applyViewportDefault();
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      setManualOverride(false);
      applyViewportDefault();
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!manualOverride) return;
    const url = new URL(window.location.href);
    url.searchParams.set("vista", vista);
    window.history.replaceState({}, "", url);
  }, [manualOverride, vista]);

  const cambiarVista = (next: Vista) => {
    setManualOverride(true);
    setVista(next);
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-ch-xl pt-ch-lg lg:pt-ch-xl">
        <div className="ch-container">
          <div className="relative flex min-h-14 items-center justify-center">
            <Button asChild variant="tertiary" size="icon" className="absolute left-0">
              <Link to="/" aria-label="Volver al inicio">
                <ChevronLeft className="size-7" aria-hidden />
              </Link>
            </Button>
            <div className="flex flex-col items-center gap-ch-sm px-14 text-center">
              <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                {vista === "cliente" ? "Mi suministro" : "Mapa de cortes"}
              </h1>
              <span aria-hidden className="h-1 w-16 rounded-pill bg-primary" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cómo usar esta funcionalidad"
              className="absolute right-0 hidden lg:inline-flex"
              onClick={() => setTourOpen(true)}
            >
              <HelpCircle aria-hidden />
            </Button>
          </div>

          <div className="mt-ch-lg flex justify-center lg:justify-end" data-tour="toggle">
            <ViewToggle vista={vista} onChange={cambiarVista} />
          </div>
        </div>

        {vista === "cliente" ? (
          <ModoCliente onIrOperativo={() => cambiarVista("operativa")} />
        ) : (
          <ModoOperativo onVolver={() => cambiarVista("cliente")} />
        )}
      </main>
      <SiteFooter />
      {tourOpen ? (
        <Tour
          vistaActual={vista}
          onClose={() => setTourOpen(false)}
          onVistaChange={cambiarVista}
        />
      ) : null}
    </div>
  );
}

function ViewToggle({ vista, onChange }: { vista: Vista; onChange: (vista: Vista) => void }) {
  return (
    <div className="inline-flex rounded-pill bg-muted p-1" role="tablist" aria-label="Vista de cortes">
      <Button
        type="button"
        size="sm"
        variant={vista === "cliente" ? "primary" : "ghost"}
        role="tab"
        aria-selected={vista === "cliente"}
        onClick={() => onChange("cliente")}
      >
        Mi suministro
      </Button>
      <Button
        type="button"
        size="sm"
        variant={vista === "operativa" ? "primary" : "ghost"}
        role="tab"
        aria-selected={vista === "operativa"}
        onClick={() => onChange("operativa")}
      >
        Mapa de cortes
      </Button>
    </div>
  );
}